import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <agm-map [latitude]="lat" [longitude]="lng" [zoom]="zoom">
    </agm-map>
  `,
  styles: [`
    agm-map {
      height: 300px;
    }
  `]
})
export class AppComponent {
  lat = 51.678418;
  lng = 7.809007;
  zoom = 8;
} 