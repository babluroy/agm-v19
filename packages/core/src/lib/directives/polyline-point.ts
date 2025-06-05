import { Directive, EventEmitter, forwardRef, Input, OnChanges, Output, SimpleChanges, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FitBoundsAccessor, FitBoundsDetails } from '../services/fit-bounds';

/**
 * AgmPolylinePoint represents one element of a polyline within a  {@link
 * AgmPolyline}
 */
@Directive({
  selector: 'agm-polyline-point',
  standalone: true,
  providers: [
    {provide: FitBoundsAccessor, useExisting: forwardRef(() => AgmPolylinePoint)},
  ],
})
export class AgmPolylinePoint implements OnInit, OnDestroy, OnChanges, FitBoundsAccessor {
  /**
   * The latitude position of the point.
   */
  @Input() public latitude: number = 0;

  /**
   * The longitude position of the point;
   */
  @Input() public longitude: number = 0;

  /**
   * This event emitter gets emitted when the position of the point changed.
   */
  @Output() positionChanged: EventEmitter<google.maps.LatLngLiteral> = new EventEmitter<google.maps.LatLngLiteral>();

  constructor() {}

  ngOnInit(): void {
    // Additional initialization logic if needed
  }

  ngOnDestroy(): void {
    // Cleanup logic if needed
  }

  ngOnChanges(changes: SimpleChanges): any {
    // tslint:disable: no-string-literal
    if (changes['latitude'] || changes['longitude']) {
      this.positionChanged.emit({
        lat: changes['latitude'] ? changes['latitude'].currentValue : this.latitude,
        lng: changes['longitude'] ? changes['longitude'].currentValue : this.longitude,
      });
    }
    // tslint:enable: no-string-literal
  }

  /** @internal */
  getFitBoundsDetails$(): Observable<FitBoundsDetails> {
    return this.positionChanged.pipe(
      startWith({lat: this.latitude, lng: this.longitude}),
      map(position => ({latLng: position}))
    );
  }
}
