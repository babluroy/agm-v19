import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChange } from '@angular/core';
import { Subscription } from 'rxjs';

import { InfoWindowManager } from '../services/managers/info-window-manager';

import { AgmMarker } from './marker';

let infoWindowId = 0;

/**
 * AgmInfoWindow renders a info window inside a {@link AgmMarker} or standalone.
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
 *        <agm-info-window [disableAutoPan]="true">
 *          Hi, this is the content of the <strong>info window</strong>
 *        </agm-info-window>
 *      </agm-marker>
 *    </agm-map>
 *  `
 * })
 * ```
 */
@Component({
  selector: 'agm-info-window',
  standalone: true,
  template: `<div class='agm-info-window-content'>
      <ng-content></ng-content>
    </div>
  `,
})
export class AgmInfoWindow implements OnDestroy, OnChanges, OnInit {
  /**
   * The latitude position of the info window (only usefull if you use it ouside of a {@link
   * AgmMarker}).
   */
  @Input() latitude: number = 0;

  /**
   * The longitude position of the info window (only usefull if you use it ouside of a {@link
   * AgmMarker}).
   */
  @Input() longitude: number = 0;

  /**
   * Disable auto-pan on open. By default, the info window will pan the map so that it is fully
   * visible when it opens.
   */
  @Input() disableAutoPan: boolean = false;

  /**
   * All InfoWindows are displayed on the map in order of their zIndex, with higher values
   * displaying in front of InfoWindows with lower values. By default, InfoWindows are displayed
   * according to their latitude, with InfoWindows of lower latitudes appearing in front of
   * InfoWindows at higher latitudes. InfoWindows are always displayed in front of markers.
   */
  @Input() zIndex: number = 0;

  /**
   * Maximum width of the infowindow, regardless of content's width. This value is only considered
   * if it is set before a call to open. To change the maximum width when changing content, call
   * close, update maxWidth, and then open.
   */
  @Input() maxWidth: number = 0;

  /**
   * Holds the marker that is the host of the info window (if available)
   */
  @Input() hostMarker: AgmMarker | undefined = undefined;

  /**
   * Holds the native element that is used for the info window content.
   */
  @Input() content: string | undefined = undefined;

  /**
   * Sets the open state for the InfoWindow. You can also call the open() and close() methods.
   */
  @Input() isOpen = false;

  /**
   * Emits an event when the info window is closed.
   */
  @Output() infoWindowClose: EventEmitter<void> = new EventEmitter<void>();

  private static _infoWindowOptionsInputs: string[] = ['disableAutoPan', 'maxWidth'];
  private _infoWindowAddedToManager = false;
  private _id: string = (infoWindowId++).toString();
  private _eventSubscriptions: Subscription[] = [];

  constructor(private _infoWindowManager: InfoWindowManager) {}

  ngOnInit() {
    this._infoWindowManager.addInfoWindow(this);
    this._infoWindowAddedToManager = true;
    this._updateOpenState();
    this._registerEventListeners();
  }

  /** @internal */
  ngOnChanges(changes: {[key: string]: SimpleChange}) {
    if (!this._infoWindowAddedToManager) {
      return;
    }
    // tslint:disable: no-string-literal
    if ((changes['latitude'] || changes['longitude']) && typeof this.latitude === 'number' &&
        typeof this.longitude === 'number') {
      this._infoWindowManager.setPosition(this);
    }
    if (changes['zIndex']) {
      this._infoWindowManager.setZIndex(this);
    }
    if (changes['isOpen']) {
      this._updateOpenState();
    }
    this._setInfoWindowOptions(changes);
  }
  // tslint:enable: no-string-literal

  private _registerEventListeners() {
    this._eventSubscriptions.push(this._infoWindowManager.createEventObservable('closeclick', this).subscribe(() => {
      this.isOpen = false;
      this.infoWindowClose.emit();
    }));
  }

  private _updateOpenState() {
    this.isOpen ? this.open() : this.close();
  }

  private _setInfoWindowOptions(changes: {[key: string]: SimpleChange}) {
    const options: {[propName: string]: any} = {};
    const optionKeys = Object.keys(changes).filter(
        k => AgmInfoWindow._infoWindowOptionsInputs.indexOf(k) !== -1);
    optionKeys.forEach((k) => { options[k] = changes[k].currentValue; });
    this._infoWindowManager.setOptions(this, options);
  }

  /**
   * Opens the info window.
   */
  open(): Promise<void> { return this._infoWindowManager.open(this); }

  /**
   * Closes the info window.
   */
  close(): Promise<void> {
    return this._infoWindowManager.close(this).then(() => { this.infoWindowClose.emit(); });
  }

  /** @internal */
  id(): string { return this._id; }

  /** @internal */
  toString(): string { return 'AgmInfoWindow-' + this._id.toString(); }

  /** @internal */
  ngOnDestroy() {
    this._infoWindowManager.deleteInfoWindow(this);
    this._eventSubscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
