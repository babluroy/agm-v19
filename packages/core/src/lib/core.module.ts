import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgmMap } from './directives/map';
import { AgmMarker } from './directives/marker';
import { AgmInfoWindow } from './directives/info-window';
import { AgmCircle } from './directives/circle';
import { AgmPolygon } from './directives/polygon';
import { AgmPolyline } from './directives/polyline';
import { AgmPolylinePoint } from './directives/polyline-point';
import { AgmPolylineIcon } from './directives/polyline-icon';
import { AgmRectangle } from './directives/rectangle';
import { AgmKmlLayer } from './directives/kml-layer';
import { AgmDataLayer } from './directives/data-layer';
import { AgmBicyclingLayer } from './directives/bicycling-layer';
import { AgmTransitLayer } from './directives/transit-layer';
import { AgmFitBounds } from './directives/fit-bounds';

/**
 * The @agm-roy/core module. Contains all Directives/Services/Pipes
 * of the core module. Please use `AgmCoreModule.forRoot()` in your app module.
 */
@NgModule({
  imports: [
    CommonModule,
    AgmMap,
    AgmMarker,
    AgmInfoWindow,
    AgmCircle,
    AgmPolygon,
    AgmPolyline,
    AgmPolylinePoint,
    AgmPolylineIcon,
    AgmRectangle,
    AgmKmlLayer,
    AgmDataLayer,
    AgmBicyclingLayer,
    AgmTransitLayer,
    AgmFitBounds
  ],
  declarations: [],
  exports: []
})
export class AgmCoreModule { }
