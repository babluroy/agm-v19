import { AgmMap } from '@babluroy/agm-core';
import { Directive, Host, Input, OnDestroy, OnInit, Inject } from '@angular/core';
import { AgmDrawingManager } from './drawing-manager';

declare var google: any;

@Directive({
  selector: 'agm-map[agmDrawingManager]',
  standalone: true,
})
export class AgmDrawingManagerTrigger implements OnInit, OnDestroy {
  /** The drawing manager to be attached to this trigger. */
  @Input() drawingManager!: AgmDrawingManager;

  constructor(@Host() @Inject(AgmMap) private _agmMap: AgmMap) {}

  ngOnInit() {
    this._agmMap.mapReady.subscribe((map: google.maps.Map) => {
      if (this.drawingManager) {
        this.drawingManager.setMap(map);
      }
    });
  }

  ngOnDestroy() {
    if (this.drawingManager) {
      this.drawingManager.setMap(null as unknown as google.maps.Map);
    }
  }
}
