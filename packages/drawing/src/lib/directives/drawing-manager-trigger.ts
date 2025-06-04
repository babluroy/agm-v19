import { AgmMap } from '@agm-roy/core';
import { Directive, Host, Input, OnDestroy, OnInit } from '@angular/core';

@Directive({
  selector: 'agm-drawing-manager-trigger',
})
export class AgmDrawingManagerTrigger implements OnInit, OnDestroy {
  @Input() drawingMode: google.maps.drawing.OverlayType | null = null;
  @Input() options: google.maps.drawing.DrawingManagerOptions = {};

  private _drawingManager: google.maps.drawing.DrawingManager | null = null;

  constructor(@Host() private _agmMap: AgmMap) {}

  ngOnInit() {
    this._agmMap.mapReady.subscribe((map) => {
      this._drawingManager = new google.maps.drawing.DrawingManager(this.options);
      this._drawingManager.setMap(map);
    });
  }

  ngOnDestroy() {
    if (this._drawingManager) {
      this._drawingManager.setMap(null);
    }
  }
}
