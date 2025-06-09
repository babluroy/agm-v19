import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AgmCoreModule, LAZY_MAPS_API_CONFIG } from '@babluroy/agm-core';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserModule,
      AgmCoreModule
    ),
    {
      provide: LAZY_MAPS_API_CONFIG,
      useValue: {
        apiKey: 'AIzaSyDmGxQxQxQxQxQxQxQxQxQxQxQxQxQxQxQ',
        libraries: ['places', 'drawing']
      }
    }
  ]
}).catch(err => console.error(err)); 