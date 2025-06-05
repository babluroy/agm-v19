import { Injectable, NgZone } from '@angular/core';
import { Observable, Observer } from 'rxjs';

import { AgmPolyline } from '../../directives/polyline';
import { createMVCEventObservable, MVCEvent } from '../../utils/mvcarray-utils';
import { GoogleMapsAPIWrapper } from '../google-maps-api-wrapper';

@Injectable()
export class PolylineManager {
  private _polylines: Map<AgmPolyline, Promise<google.maps.Polyline>> =
      new Map<AgmPolyline, Promise<google.maps.Polyline>>();

  constructor(private _mapsWrapper: GoogleMapsAPIWrapper, private _zone: NgZone) {}

  private static _convertPoints(line: AgmPolyline): google.maps.LatLngLiteral[] {
    return line.points;
  }

  private static _convertPath(path: keyof typeof google.maps.SymbolPath | string): google.maps.SymbolPath | string {
    const symbolPath = google.maps.SymbolPath[path as keyof typeof google.maps.SymbolPath];
    if (typeof symbolPath === 'number') {
      return symbolPath;
    } else{
      return path;
    }
  }

  private static _convertIcons(line: AgmPolyline): Array<google.maps.IconSequence> {
    const icons = line._getIcons().map(agmIcon => ({
      fixedRotation: agmIcon.fixedRotation,
      offset: agmIcon.offset,
      repeat: agmIcon.repeat,
      icon: {
        anchor: agmIcon.anchorX !== undefined && agmIcon.anchorY !== undefined
          ? new google.maps.Point(agmIcon.anchorX, agmIcon.anchorY)
          : undefined,
        fillColor: agmIcon.fillColor,
        fillOpacity: agmIcon.fillOpacity,
        path: PolylineManager._convertPath(agmIcon.path),
        rotation: agmIcon.rotation,
        scale: agmIcon.scale,
        strokeColor: agmIcon.strokeColor,
        strokeOpacity: agmIcon.strokeOpacity,
        strokeWeight: agmIcon.strokeWeight,
      },
    } as google.maps.IconSequence));
    // prune undefineds;
    icons.forEach(icon => {
      Object.entries(icon).forEach(([key, val]) => {
        if (typeof val === 'undefined') {
          delete (icon as any)[key];
        }
      });
      if (icon.icon && !icon.icon.anchor) {
        delete icon.icon.anchor;
      }
    });
    return icons;
  }

  async addPolyline(line: AgmPolyline) {
    await this._mapsWrapper.getNativeMap();
    const path = PolylineManager._convertPoints(line);
    const icons = PolylineManager._convertIcons(line);
    const polylinePromise = this._mapsWrapper.createPolyline({
      clickable: line.clickable,
      draggable: line.draggable,
      editable: line.editable,
      geodesic: line.geodesic,
      strokeColor: line.strokeColor,
      strokeOpacity: line.strokeOpacity,
      strokeWeight: line.strokeWeight,
      visible: line.visible,
      zIndex: line.zIndex,
      path,
      icons,
    });
    this._polylines.set(line, polylinePromise);
    return polylinePromise;
  }

  updatePolylinePoints(line: AgmPolyline): Promise<void> {
    const path = PolylineManager._convertPoints(line);
    const m = this._polylines.get(line);
    if (m == null) {
      return Promise.resolve();
    }
    return m.then((l) => this._zone.run(() => l.setPath(path)));
  }

  async updateIconSequences(line: AgmPolyline): Promise<void> {
    await this._mapsWrapper.getNativeMap();
    const icons = PolylineManager._convertIcons(line);
    const m = this._polylines.get(line);
    if (m == null) {
      return;
    }
    const polyline = await m;
    return this._zone.run(() => polyline.setOptions({icons}));
  }

  setPolylineOptions(line: AgmPolyline, options: {[propName: string]: any}): Promise<void> {
    const polylinePromise = this._polylines.get(line);
    if (!polylinePromise) {
      return Promise.reject(new Error('Polyline not found'));
    }
    return polylinePromise.then((l: google.maps.Polyline) => { l.setOptions(options); });
  }

  deletePolyline(line: AgmPolyline): Promise<void> {
    const m = this._polylines.get(line);
    if (m == null) {
      return Promise.resolve();
    }
    return m.then((l: google.maps.Polyline) => {
      return this._zone.run(() => {
        l.setMap(null);
        this._polylines.delete(line);
      });
    });
  }

  private async getMVCPath(agmPolyline: AgmPolyline): Promise<google.maps.MVCArray<google.maps.LatLng>> {
    const polyline = await this._polylines.get(agmPolyline);
    if (!polyline) {
      throw new Error('Polyline not found');
    }
    return polyline.getPath();
  }

  async getPath(agmPolyline: AgmPolyline): Promise<google.maps.LatLng[]> {
    const path = await this.getMVCPath(agmPolyline);
    return path.getArray();
  }

  createEventObservable<T extends (google.maps.MapMouseEvent | google.maps.PolyMouseEvent)>(eventName: string, line: AgmPolyline): Observable<T> {
    return new Observable((observer: Observer<T>) => {
      const polylinePromise = this._polylines.get(line);
      if (!polylinePromise) {
        observer.error(new Error('Polyline not found'));
        return;
      }
      polylinePromise.then((l: google.maps.Polyline) => {
        l.addListener(eventName, (...args: unknown[]) => {
          const event = args[0] as T;
          this._zone.run(() => observer.next(event));
        });
      });
    });
  }

  async createPathEventObservable(line: AgmPolyline): Promise<Observable<MVCEvent<google.maps.LatLng>>> {
    const mvcPath = await this.getMVCPath(line);
    return createMVCEventObservable(mvcPath);
  }
}
