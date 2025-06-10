import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { AgmMarker } from '../../directives/marker';
import { GoogleMapsAPIWrapper } from '../google-maps-api-wrapper';

@Injectable()
export class MarkerManager {
  protected _mapsWrapper: GoogleMapsAPIWrapper;
  protected _zone: NgZone;
  protected _markers: Map<AgmMarker, Promise<google.maps.Marker>> = new Map<AgmMarker, Promise<google.maps.Marker>>();

  constructor(mapsWrapper: GoogleMapsAPIWrapper, zone: NgZone) {
    this._mapsWrapper = mapsWrapper;
    this._zone = zone;
  }

  deleteMarker(marker: AgmMarker): Promise<void> {
    const m = this._markers.get(marker);
    if (m == null) {
      return Promise.resolve();
    }
    return m.then((m: google.maps.Marker) => {
      return this._zone.run(() => {
        m.setMap(null);
        this._markers.delete(marker);
      });
    });
  }

  updateMarkerPosition(marker: AgmMarker): Promise<void> {
    return this._markers.get(marker)!.then((m: google.maps.Marker) => m.setPosition({ lat: marker.latitude, lng: marker.longitude }));
  }

  updateTitle(marker: AgmMarker): Promise<void> {
    return this._markers.get(marker)!.then((m: google.maps.Marker) => m.setTitle(marker.title));
  }

  updateLabel(marker: AgmMarker): Promise<void> {
    return this._markers.get(marker)!.then((m: google.maps.Marker) => {
      if (typeof marker.label === 'string') {
        m.setLabel(marker.label);
      } else {
        m.setLabel(marker.label);
      }
    });
  }

  updateDraggable(marker: AgmMarker): Promise<void> {
    return this._markers.get(marker)!.then((m: google.maps.Marker) => m.setDraggable(marker.draggable));
  }

  updateIcon(marker: AgmMarker): Promise<void> {
    return this._markers.get(marker)!.then((m: google.maps.Marker) => {
      const icon = {
        url: marker.iconUrl,
        ...(typeof google !== 'undefined' && google.maps && google.maps.Size ? 
          { scaledSize: new google.maps.Size(32, 32) } : {})
      };
      m.setIcon(icon);
    });
  }

  updateOpacity(marker: AgmMarker): Promise<void> {
    return this._markers.get(marker)!.then((m: google.maps.Marker) => m.setOpacity(marker.opacity));
  }

  updateVisible(marker: AgmMarker): Promise<void> {
    return this._markers.get(marker)!.then((m: google.maps.Marker) => m.setVisible(marker.visible));
  }

  updateZIndex(marker: AgmMarker): Promise<void> {
    return this._markers.get(marker)!.then((m: google.maps.Marker) => m.setZIndex(marker.zIndex));
  }

  updateClickable(marker: AgmMarker): Promise<void> {
    return this._markers.get(marker)!.then((m: google.maps.Marker) => m.setClickable(marker.clickable));
  }

  updateAnimation(marker: AgmMarker): Promise<void> {
    return this._markers.get(marker)!.then((m: google.maps.Marker) => {
      if (marker.animation) {
        m.setAnimation(google.maps.Animation[marker.animation]);
      } else {
        m.setAnimation(null);
      }
    });
  }

  addMarker(marker: AgmMarker) {
    const markerPromise = this._mapsWrapper.createMarker({
      position: { lat: marker.latitude, lng: marker.longitude },
      label: marker.label,
      draggable: marker.draggable,
      clickable: marker.clickable,
      title: marker.title,
      opacity: marker.opacity,
      visible: marker.visible,
      zIndex: marker.zIndex,
      icon: marker.iconUrl,
      animation: marker.animation ? google.maps.Animation[marker.animation] : undefined,
    });
    this._markers.set(marker, markerPromise);
  }

  getNativeMarker(marker: AgmMarker): Promise<google.maps.Marker> {
    return this._markers.get(marker)!;
  }

  createEventObservable<T>(eventName: string, marker: AgmMarker): Observable<T> {
    return new Observable((observer: any) => {
      this._markers.get(marker)!.then((m: google.maps.Marker) => {
        m.addListener(eventName, (e: T) => this._zone.run(() => observer.next(e)));
      });
    });
  }
}
