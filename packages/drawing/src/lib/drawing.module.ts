import { AgmCoreModule } from '@babluroy/agm-core';
import { NgModule } from '@angular/core';
import { AgmDrawingManager } from './directives/drawing-manager';
import { AgmDrawingManagerTrigger } from './directives/drawing-manager-trigger';

@NgModule({
  imports: [AgmCoreModule, AgmDrawingManager, AgmDrawingManagerTrigger],
  declarations: [],
  exports: [],
})
export class AgmDrawingModule {
}
