import { AgmMap } from '@babluroy/agm-core';
import { Directive, Host, Input, OnDestroy, OnInit, Inject } from '@angular/core';

declare var google: any;

@Directive({
  selector: 'agm-drawing-manager-trigger',
  standalone: true,
})
export class AgmDrawingManagerTrigger implements OnInit, OnDestroy {
  @Input() drawingMode: google.maps.drawing.OverlayType | null = null;
  @Input() options: google.maps.drawing.DrawingManagerOptions = {};

  private _drawingManager: google.maps.drawing.DrawingManager | null = null;

  constructor(@Host() @Inject(AgmMap) private _agmMap: AgmMap) {}

  ngOnInit() {
    this._agmMap.mapReady.subscribe((map) => {
      this._drawingManager = new google.maps.drawing.DrawingManager(this.options);
      this._drawingManager?.setMap(map);
    });
  }

  ngOnDestroy() {
    if (this._drawingManager) {
      this._drawingManager.setMap(null);
    }
  }
}
