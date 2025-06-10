import { AfterContentInit, ContentChildren, Directive, EventEmitter, forwardRef, Input, OnChanges, OnDestroy, Output, QueryList, SimpleChange } from '@angular/core';
import { Observable, ReplaySubject, Subscription } from 'rxjs';
import { FitBoundsAccessor, FitBoundsDetails } from '../services/fit-bounds';
import { MarkerManager } from '../services/managers/marker-manager';
import { AgmInfoWindow } from './info-window';

let markerId = 0;

/**
 * AgmMarker renders a map marker inside a {@link AgmMap}.
 *
 * ### Example
 * ```typescript
 * import { Component } from '@angular/core';
 *
 * @Component({
 *  selector: 'my-map-cmp',
 *  styles: [`
 *    .agm-map-container {
 *      height: 300px;
 *    }
 * `],
 *  template: `
 *    <agm-map [latitude]="lat" [longitude]="lng" [zoom]="zoom">
 *      <agm-marker [latitude]="lat" [longitude]="lng" [label]="'M'">
 *      </agm-marker>
 *    </agm-map>
 *  `
 * })
 * ```
 */
@Directive({
  selector: 'agm-marker',
  standalone: true,
  providers: [
    { provide: FitBoundsAccessor, useExisting: forwardRef(() => AgmMarker) },
  ],
})
export class AgmMarker implements OnDestroy, OnChanges, AfterContentInit, FitBoundsAccessor {
  /**
   * The latitude position of the marker.
   */
  @Input() latitude: number = 0;

  /**
   * The longitude position of the marker.
   */
  @Input() longitude: number = 0;

  /**
   * The title of the marker.
   */
  @Input() title: string = '';

  /**
   * The label (a single uppercase character) for the marker.
   */
  @Input() label: string | google.maps.MarkerLabel = '';

  /**
   * If true, the marker can be dragged. Default value is false.
   */
  @Input() draggable: boolean = false;

  /**
   * Icon (the URL of the image) for the foreground.
   */
  @Input() iconUrl: string = '';

  /**
   * If true, the marker is visible
   */
  @Input() visible: boolean = true;

  /**
   * Whether to automatically open the child info window when the marker is clicked.
   */
  @Input() openInfoWindow = true;

  /**
   * The marker's opacity between 0.0 and 1.0.
   */
  @Input() opacity: number = 1;

  /**
   * All markers are displayed on the map in order of their zIndex, with higher values displaying in
   * front of markers with lower values. By default, markers are displayed according to their
   * vertical position on screen, with lower markers appearing in front of markers further up the
   * screen.
   */
  @Input() zIndex: number = 0;

  /**
   * If true, the marker can be clicked. Default value is true.
   */
  @Input() clickable: boolean = true;

  /**
   * Which animation to play when marker is added to a map.
   * This can be 'BOUNCE' or 'DROP'
   */
  @Input() animation: keyof typeof google.maps.Animation | null = null;

  /**
   * This event is fired when the marker's animation property changes.
   */
  @Output() animationChange = new EventEmitter<keyof typeof google.maps.Animation>();

  /**
   * This event emitter gets emitted when the user clicks on the marker.
   */
  @Output() markerClick = new EventEmitter<AgmMarker>();

  /**
   * This event emitter gets emitted when the user clicks twice on the marker.
   */
  @Output() markerDblClick = new EventEmitter<AgmMarker>();

  /**
   * This event is fired when the user rightclicks on the marker.
   */
  @Output() markerRightClick = new EventEmitter<void>();

  /**
   * This event is fired when the user starts dragging the marker.
   */
  @Output() dragStart = new EventEmitter<google.maps.MapMouseEvent>();

  /**
   * This event is repeatedly fired while the user drags the marker.
   */
  @Output() drag = new EventEmitter<google.maps.MapMouseEvent>();

  /**
   * This event is fired when the user stops dragging the marker.
   */
  @Output() dragEnd = new EventEmitter<google.maps.MapMouseEvent>();

  /**
   * This event is fired when the user mouses over the marker.
   */
  @Output() mouseOver = new EventEmitter<google.maps.MapMouseEvent>();

  /**
   * This event is fired when the user mouses outside the marker.
   */
  @Output() mouseOut = new EventEmitter<google.maps.MapMouseEvent>();

  /**
   * This event is fired when the marker's position changes.
   */
  @Output() positionChange = new EventEmitter<google.maps.LatLngLiteral>();

  /** @internal */
  @ContentChildren(AgmInfoWindow) infoWindow: QueryList<AgmInfoWindow> = new QueryList<AgmInfoWindow>();

  private _markerAddedToManger = false;
  private _id: string;
  private _eventSubscriptions: Subscription[] = [];

  protected readonly _fitBoundsDetails$: ReplaySubject<FitBoundsDetails> = new ReplaySubject<FitBoundsDetails>(1);

  constructor(private _markerManager: MarkerManager) { this._id = (markerId++).toString(); }

  /* @internal */
  ngAfterContentInit() {
    this.handleInfoWindowUpdate();
    this.infoWindow.changes.subscribe(() => this.handleInfoWindowUpdate());
  }

  private handleInfoWindowUpdate() {
    if (this.infoWindow.length > 1) {
      throw new Error('Expected no more than one info window.');
    }
    this.infoWindow.forEach(marker => {
      marker.hostMarker = this;
    });
  }

  /** @internal */
  ngOnChanges(changes: { [key: string]: SimpleChange }) {
    if (typeof this.latitude === 'string') {
      this.latitude = Number(this.latitude);
    }
    if (typeof this.longitude === 'string') {
      this.longitude = Number(this.longitude);
    }
    if (typeof this.latitude !== 'number' || typeof this.longitude !== 'number') {
      return;
    }
    if (!this._markerAddedToManger) {
      this._markerManager.addMarker(this);
      this._updateFitBoundsDetails();
      this._markerAddedToManger = true;
      this._addEventListeners();
      return;
    }
    if (changes['latitude'] || changes['longitude']) {
      this._markerManager.updateMarkerPosition(this);
      this._updateFitBoundsDetails();
      this.positionChange.emit({ lat: this.latitude, lng: this.longitude });
    }
    if (changes['title']) {
      this._markerManager.updateTitle(this);
    }
    if (changes['label']) {
      this._markerManager.updateLabel(this);
    }
    if (changes['draggable']) {
      this._markerManager.updateDraggable(this);
    }
    if (changes['iconUrl']) {
      this._markerManager.updateIcon(this);
    }
    if (changes['opacity']) {
      this._markerManager.updateOpacity(this);
    }
    if (changes['visible']) {
      this._markerManager.updateVisible(this);
    }
    if (changes['zIndex']) {
      this._markerManager.updateZIndex(this);
    }
    if (changes['clickable']) {
      this._markerManager.updateClickable(this);
    }
    if (changes['animation']) {
      this._markerManager.updateAnimation(this);
    }
  }

  /** @internal */
  getFitBoundsDetails$(): Observable<FitBoundsDetails> {
    return this._fitBoundsDetails$.asObservable();
  }

  protected _updateFitBoundsDetails() {
    this._fitBoundsDetails$.next({ latLng: { lat: this.latitude, lng: this.longitude } });
  }

  private _addEventListeners() {
    const cs = this._markerManager.createEventObservable('click', this).subscribe(() => {
      if (this.openInfoWindow) {
        this.infoWindow.forEach(infoWindow => infoWindow.open());
      }
      this.markerClick.emit(this);
    });
    this._eventSubscriptions.push(cs);

    const dcs = this._markerManager.createEventObservable('dblclick', this).subscribe(() => {
      this.markerDblClick.emit(this);
    });
    this._eventSubscriptions.push(dcs);

    const rcs = this._markerManager.createEventObservable('rightclick', this).subscribe(() => {
      this.markerRightClick.emit();
    });
    this._eventSubscriptions.push(rcs);

    const ds = this._markerManager.createEventObservable('dragstart', this).subscribe((e: any) => {
      this.dragStart.emit(e);
    });
    this._eventSubscriptions.push(ds);

    const d = this._markerManager.createEventObservable('drag', this).subscribe((e: any) => {
      this.drag.emit(e);
    });
    this._eventSubscriptions.push(d);

    const de = this._markerManager.createEventObservable('dragend', this).subscribe((e: any) => {
      this.dragEnd.emit(e);
    });
    this._eventSubscriptions.push(de);

    const mo = this._markerManager.createEventObservable('mouseover', this).subscribe((e: any) => {
      this.mouseOver.emit(e);
    });
    this._eventSubscriptions.push(mo);

    const mout = this._markerManager.createEventObservable('mouseout', this).subscribe((e: any) => {
      this.mouseOut.emit(e);
    });
    this._eventSubscriptions.push(mout);

    const ac = this._markerManager.createEventObservable('animation_changed', this).subscribe(() => {
      this._markerManager.getNativeMarker(this).then((marker: google.maps.Marker) => {
        const animation = marker.getAnimation();
        if (animation !== null) {
          this.animationChange.emit(animation as unknown as keyof typeof google.maps.Animation);
        }
      });
    });
    this._eventSubscriptions.push(ac);
  }

  /** @internal */
  id(): string { return this._id; }

  /** @internal */
  toString(): string { return 'AgmMarker-' + this._id.toString(); }

  /** @internal */
  ngOnDestroy() {
    this._markerManager.deleteMarker(this);
    // unsubscribe all registered observable subscriptions
    this._eventSubscriptions.forEach((s) => s.unsubscribe());
    this._fitBoundsDetails$.complete();
  }
}
