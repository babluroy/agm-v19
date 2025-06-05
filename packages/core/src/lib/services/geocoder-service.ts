import { Injectable } from '@angular/core';
import { connectable, Connectable, Observable, of, ReplaySubject, throwError, defer, bindCallback } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { MapsAPILoader } from './maps-api-loader/maps-api-loader';

@Injectable({providedIn: 'root'})
export class AgmGeocoder {
  protected readonly geocoder$: Observable<google.maps.Geocoder>;

  constructor(loader: MapsAPILoader) {
    const connectableGeocoder$: Connectable<google.maps.Geocoder> = connectable(new Observable(subscriber => {
      loader.load().then(() => subscriber.next(undefined));
    }).pipe(map(() => this._createGeocoder())), {connector: () => new ReplaySubject(1)});

    connectableGeocoder$.connect(); // ignore the subscription
    // since we will remain subscribed till application exits

    this.geocoder$ = connectableGeocoder$;
  }

  geocode(request: google.maps.GeocoderRequest): Observable<google.maps.GeocoderResult[]> {
    return this.geocoder$.pipe(
      switchMap((geocoder) => this._getGoogleResults(geocoder, request))
    );
  }

  private _getGoogleResults(geocoder: google.maps.Geocoder, request: google.maps.GeocoderRequest):
    Observable<google.maps.GeocoderResult[]> {
    const geocodeCallback = bindCallback<[google.maps.GeocoderRequest], [google.maps.GeocoderResult[] | null, google.maps.GeocoderStatus]>(
      geocoder.geocode.bind(geocoder)
    );
    return defer(() => geocodeCallback(request)).pipe(
      switchMap(([results, status]) => {
        if (status === 'OK' && results) {
          return of(results);
        }
        return throwError(() => status);
      }),
      catchError((err) => throwError(() => err))
    );
  }

  private _createGeocoder() {
    return new google.maps.Geocoder();
  }
}
