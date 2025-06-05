import { NgZone, QueryList } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Subject } from 'rxjs';
import { AgmPolyline } from '../../directives/polyline';
import { AgmPolylineIcon } from '../../directives/polyline-icon';
import { GoogleMapsAPIWrapper } from '../../services/google-maps-api-wrapper';
import { PolylineManager } from '../../services/managers/polyline-manager';

describe('PolylineManager', () => {
  let polylineInstance: any;
  let apiWrapper: any;

  beforeAll(() => {
    Object.assign((window as any).google.maps, {
      Point: class Point {
        constructor(public x: number, public y: number) {
        }
      },
    });
  });

  beforeEach(() => {
    polylineInstance = {
      setMap: jest.fn(),
      setOptions: jest.fn(),
      setPath: jest.fn(),
    };

    apiWrapper = {
      createPolyline: jest.fn().mockImplementation(() => Promise.resolve(polylineInstance)),
      getNativeMap: jest.fn().mockReturnValue(Promise.resolve()),
    };

    TestBed.configureTestingModule({
      providers: [
        {provide: NgZone, useFactory: () => new NgZone({enableLongStackTrace: true})},
        PolylineManager,
        {provide: GoogleMapsAPIWrapper, useValue: apiWrapper},
      ],
    });
  });

  describe('Create a new polyline', () => {
    it('should call the mapsApiWrapper when creating a new polyline',
      async () => {
        const polylineManager = TestBed.inject(PolylineManager);
        const newPolyline = new AgmPolyline(polylineManager);
        newPolyline.points = [{lat: 0, lng: 0}, {lat: 1, lng: 1}];
        newPolyline.strokeColor = '#FF0000';
        newPolyline.strokeOpacity = 0.5;
        newPolyline.strokeWeight = 2;
        newPolyline.visible = true;
        newPolyline.zIndex = 1;
        newPolyline.geodesic = true;
        newPolyline.clickable = true;
        (newPolyline as any)._getIcons = () => [];
        await polylineManager.addPolyline(newPolyline);
        expect(apiWrapper.createPolyline).toHaveBeenCalledWith({
          path: [{lat: 0, lng: 0}, {lat: 1, lng: 1}],
          strokeColor: '#FF0000',
          strokeOpacity: 0.5,
          strokeWeight: 2,
          visible: true,
          zIndex: 1,
          geodesic: true,
          clickable: true,
          draggable: false,
          editable: false,
          icons: [],
        });
      });
  });

  describe('Update a polyline', () => {
    it('should update the polyline path when it changes',
      async () => {
        const polylineManager = TestBed.inject(PolylineManager);
        const newPolyline = new AgmPolyline(polylineManager);
        newPolyline.points = [{lat: 0, lng: 0}, {lat: 1, lng: 1}];
        (newPolyline as any)._getIcons = () => [];
        await polylineManager.addPolyline(newPolyline);
        newPolyline.points = [{lat: 2, lng: 2}, {lat: 3, lng: 3}];
        await polylineManager.setPolylineOptions(newPolyline, { path: newPolyline.points });
        expect(polylineInstance.setOptions).toHaveBeenCalledWith({ path: newPolyline.points });
      });
  });

  describe('Icons', () => {
    it('should call the mapsApiWrapper when creating a new polyline',
      async () => {
        const polylineManager = TestBed.inject(PolylineManager);
        const newPolyline = new AgmPolyline(polylineManager);
        (newPolyline as any)._getIcons = () => [{
          fixedRotation: true,
          offset: '1px',
          repeat: '50px',
          anchorX: 10,
          anchorY: 15,
          fillColor: 'blue',
          fillOpacity: 0.5,
          path: 0,
          rotation: 60,
          scale: 2,
          strokeColor: 'green',
          strokeOpacity: 0.7,
          strokeWeight: 1.5,
        }];
        await polylineManager.addPolyline(newPolyline);
        expect(apiWrapper.createPolyline).toHaveBeenCalledWith({
          clickable: true,
          draggable: false,
          editable: false,
          geodesic: false,
          icons: [{
            fixedRotation: true,
            icon: {
              anchor: {x: 10, y: 15},
              fillColor: 'blue',
              fillOpacity: 0.5,
              path: 0,
              rotation: 60,
              scale: 2,
              strokeColor: 'green',
              strokeOpacity: 0.7,
              strokeWeight: 1.5,
            },
            offset: '1px',
            repeat: '50px',
          }],
          path: [],
          strokeColor: '',
          strokeOpacity: 0,
          strokeWeight: 0,
          visible: true,
          zIndex: 0,
        });
      });
    it('should update the icons when the data structure changes',
      async () => {
        const polylineManager = TestBed.inject(PolylineManager);
        const apiWrapper = TestBed.inject(GoogleMapsAPIWrapper);
        const testPolyline = {
          setOptions: jest.fn(),
        } as any as google.maps.Polyline;
        (apiWrapper.createPolyline as jest.Mock).mockReturnValue(Promise.resolve(testPolyline));

        const iconArray = [{
          fixedRotation: true,
          offset: '1px',
          repeat: '50px',
          anchorX: 10,
          anchorY: 15,
          fillColor: 'blue',
          fillOpacity: 0.5,
          rotation: 60,
          scale: 2,
          strokeColor: 'green',
          strokeOpacity: 0.7,
          strokeWeight: 1.5,
          path: 'CIRCLE',
        }];
        const iconChanges = new Subject<AgmPolyline>();

        const newPolyline = new AgmPolyline(polylineManager);
        newPolyline.iconSequences = Object.assign({},
          new QueryList<AgmPolylineIcon>(),
          {changes: iconChanges, toArray: () => iconArray}) as QueryList<AgmPolylineIcon>;

        await polylineManager.addPolyline(newPolyline);
        iconArray.push({
          fixedRotation: false,
          offset: '2px',
          repeat: '20px',
          anchorX: 11,
          anchorY: 16,
          fillColor: 'cyan',
          fillOpacity: 0.6,
          rotation: 120,
          scale: 0.5,
          strokeColor: 'yellow',
          strokeOpacity: 0.2,
          strokeWeight: 3,
          path: 'BACKWARD_OPEN_ARROW',
        });
        await polylineManager.updateIconSequences(newPolyline);

        expect((testPolyline.setOptions as jest.Mock).mock.calls.length).toBe(1);
        expect((testPolyline.setOptions as jest.Mock).mock.calls[0][0])
          .toEqual({
            'icons':
              [{
                'fixedRotation': true,
                'icon': {
                  'anchor': {'x': 10, 'y': 15},
                  'fillColor': 'blue',
                  'fillOpacity': 0.5,
                  'path': 0,
                  'rotation': 60,
                  'scale': 2,
                  'strokeColor': 'green',
                  'strokeOpacity': 0.7,
                  'strokeWeight': 1.5
                },
                'offset': '1px',
                'repeat': '50px'
              },
                {
                  'fixedRotation': false,
                  'icon': {
                    'anchor': {'x': 11, 'y': 16},
                    'fillColor': 'cyan',
                    'fillOpacity': 0.6,
                    'path': 4,
                    'rotation': 120,
                    'scale': 0.5,
                    'strokeColor': 'yellow',
                    'strokeOpacity': 0.2,
                    'strokeWeight': 3,
                  },
                  'offset': '2px',
                  'repeat': '20px'
                }],
          });
      });
  });

  describe('Delete a polyline', () => {
    it('should set the map to null when deleting a existing polyline',
      async () => {
        const polylineManager = TestBed.inject(PolylineManager);
        const newPolyline = new AgmPolyline(polylineManager);
        (newPolyline as any)._getIcons = () => [];
        await polylineManager.addPolyline(newPolyline);
        await polylineManager.deletePolyline(newPolyline);
        expect(polylineInstance.setMap).toHaveBeenCalledWith(null);
      });
  });

});
