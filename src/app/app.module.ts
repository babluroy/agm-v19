import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AgmCoreModule, LAZY_MAPS_API_CONFIG } from '@babluroy/agm-core';
import { AppComponent } from 'src/app/app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AgmCoreModule
  ],
  providers: [
    {
      provide: LAZY_MAPS_API_CONFIG,
      useValue: {
        apiKey: 'AIzaSyDmGxQxQxQxQxQxQxQxQxQxQxQxQxQxQxQ',
        libraries: ['places']
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { } 