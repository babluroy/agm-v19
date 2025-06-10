[![AGM - Angular Google Maps](assets/images/angular-google-maps-logo.png)](https://angular-maps.com/)

# Angular Google Maps (AGM) v2

Angular Google Maps (AGM) is a set of Angular components for Google Maps. This version is specifically designed to work with Angular 19 and provides a modern, type-safe way to integrate Google Maps into your Angular applications.

## Features

- 🗺️ Full Google Maps JavaScript API support
- 📍 Markers, Info Windows, and Custom Controls
- 🎯 Drawing Tools (Polygons, Polylines, Circles)
- 📊 Marker Clustering
- 🎨 Custom Styling
- 🔄 Real-time Updates
- 📱 Responsive Design
- 🚀 Standalone Components Support
- ⚡ Angular 19 Compatibility

## Installation

```bash
# Install the core package
npm install @babluroy/agm-core@4.0.0-beta.27

# Optional packages
npm install @babluroy/agm-markerclusterer@4.0.0-beta.27
npm install @babluroy/agm-snazzy-info-window@4.0.0-beta.27
npm install @babluroy/agm-drawing@4.0.0-beta.27
```

## Quick Start

### 1. Get a Google Maps API Key
First, you need to get a Google Maps API key from the [Google Cloud Console](https://console.cloud.google.com/).

### 2. Import the Module

#### For Standalone Components (Recommended for Angular 19)
```typescript
import { Component } from '@angular/core';
import { AgmCoreModule } from '@babluroy/agm-core';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [
    AgmCoreModule.forRoot({
      apiKey: 'YOUR_GOOGLE_MAPS_API_KEY'
    })
  ],
  template: `
    <agm-map [latitude]="lat" [longitude]="lng" [zoom]="zoom">
      <agm-marker [latitude]="lat" [longitude]="lng"></agm-marker>
    </agm-map>
  `,
  styles: [`
    agm-map {
      height: 400px;
      width: 100%;
    }
  `]
})
export class MapComponent {
  lat = 51.678418;
  lng = 7.809007;
  zoom = 8;
}
```

#### For NgModules
```typescript
import { NgModule } from '@angular/core';
import { AgmCoreModule } from '@babluroy/agm-core';

@NgModule({
  imports: [
    AgmCoreModule.forRoot({
      apiKey: 'YOUR_GOOGLE_MAPS_API_KEY'
    })
  ]
})
export class AppModule { }
```

## Demo Project

Check out our demo project that showcases various features of AGM with Angular 19:
[AGM Demo Angular Project](https://github.com/babluroy/agm-babluroy-package-demo-angular)

The demo includes:
- Basic map integration
- Custom markers and info windows
- Drawing tools
- Marker clustering
- Custom styling
- Event handling
- And more!

## Advanced Usage

### Custom Styling
```typescript
const mapStyles = [
  {
    "featureType": "all",
    "elementType": "geometry",
    "stylers": [{"color": "#f5f5f5"}]
  }
];

// In your template
<agm-map [styles]="mapStyles">
```

### Marker Clustering
```typescript
import { AgmMarkerClustererModule } from '@babluroy/agm-markerclusterer';

@Component({
  // ...
  imports: [AgmMarkerClustererModule],
  template: `
    <agm-map [latitude]="lat" [longitude]="lng">
      <agm-marker-cluster>
        <agm-marker *ngFor="let marker of markers"
          [latitude]="marker.lat"
          [longitude]="marker.lng">
        </agm-marker>
      </agm-marker-cluster>
    </agm-map>
  `
})
```

### Drawing Tools
```typescript
import { AgmDrawingModule } from '@babluroy/agm-drawing';

@Component({
  // ...
  imports: [AgmDrawingModule],
  template: `
    <agm-map [latitude]="lat" [longitude]="lng">
      <agm-drawing-manager
        [drawingMode]="'polygon'"
        [drawingControl]="true">
      </agm-drawing-manager>
    </agm-map>
  `
})
```

## Environment Configuration

Create or update your environment files:

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  googleMapsApiKey: 'YOUR_GOOGLE_MAPS_API_KEY'
};
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- IE 11 (with polyfills)

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- [GitHub Issues](https://github.com/babluroy/angular-google-maps-v2/issues)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/angular-google-maps)

## Related Projects

- [AGM Demo Angular Project](https://github.com/babluroy/agm-babluroy-package-demo-angular) - Demo project showcasing AGM features
- [AGM Core](https://www.npmjs.com/package/@babluroy/agm-core) - Core package
- [AGM MarkerClusterer](https://www.npmjs.com/package/@babluroy/agm-markerclusterer) - Marker clustering
- [AGM Snazzy Info Window](https://www.npmjs.com/package/@babluroy/agm-snazzy-info-window) - Custom info windows
- [AGM Drawing](https://www.npmjs.com/package/@babluroy/agm-drawing) - Drawing tools

[Website](https://angular-maps.com/) | [Demo](https://stackblitz.com/edit/angular-google-maps-demo) | [Twitter](https://twitter.com/Sebholstein) | [Chat](https://discord.gg/XAr2ACE) | [API Documentation](https://angular-maps.com/api-docs/)

[![Build Status](https://travis-ci.org/SebastianM/angular-google-maps.svg?branch=master)](https://travis-ci.org/SebastianM/angular-google-maps) [![Questions?: join the chat](https://img.shields.io/badge/questions%3F-join%20the%20chat-blue.svg)](https://discord.gg/XAr2ACE) [![npm version](https://img.shields.io/npm/v/@babluroy/core.svg)](https://www.npmjs.com/package/@babluroy/core) ![supported angular versions: 9+](https://img.shields.io/badge/supported%20angular%20versions-9.1+-green.svg)

## Packages

This project is a mono repo and hosts multiple packages:

| Package                  | Downloads                                                                                                                                         |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| @babluroy/core                | [![@babluroy/core](https://img.shields.io/npm/dm/@babluroy/core.svg)](https://www.npmjs.com/package/@babluroy/core)                                              |
| @babluroy/snazzy-info-window  | [![@babluroy/snazzy-info-window](https://img.shields.io/npm/dm/@babluroy/snazzy-info-window.svg)](https://www.npmjs.com/package/@babluroy/snazzy-info-window)    |
| @babluroy/markerclusterer | [![@babluroy/markerclusterer](https://img.shields.io/npm/dm/@babluroy/markerclusterer.svg)](https://www.npmjs.com/package/@babluroy/markerclusterer) |
| @babluroy/drawing | [![@babluroy/drawing](https://img.shields.io/npm/dm/@babluroy/drawing.svg)](https://www.npmjs.com/package/@babluroy/drawing) |

## Playing with AGM (Angular Google Maps)

If you just want to play with AGM and don't want to set up a full project, you can use the following Plunker. It has all the dependencies to play with Angular, Typescript and of course `AGM`:

[&raquo; Play with Angular Google Maps on Stackblitz](https://stackblitz.com/edit/angular-google-maps-demo)
