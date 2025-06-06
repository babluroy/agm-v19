import { AgmCoreModule } from '@babluroy/agm-core';
import { NgModule } from '@angular/core';
import { AgmMarkerCluster } from './directives/marker-cluster';

@NgModule({
  imports: [AgmCoreModule, AgmMarkerCluster],
  declarations: [],
  exports: [],
})
export class AgmMarkerClustererModule {
}
