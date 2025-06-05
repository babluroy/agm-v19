import { NgZone } from '@angular/core';
import { inject, TestBed } from '@angular/core/testing';

import { AgmPolygon } from '../../directives/polygon';
import { MvcArrayMock } from '../../utils/mvcarray-utils';
import { GoogleMapsAPIWrapper } from '../google-maps-api-wrapper';
import { PolygonManager } from './polygon-manager';

describe('PolygonManager', () => {
  let polygonManager: PolygonManager;
  let apiWrapper: GoogleMapsAPIWrapper;
  let ngZone: NgZone;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: NgZone, useFactory: () => new NgZone({enableLongStackTrace: true})},
        PolygonManager,
        AgmPolygon,
        {
          provide: GoogleMapsAPIWrapper,
          useValue: {
            createPolygon: jest.fn(),
          },
        },
      ],
    });

    polygonManager = TestBed.inject(PolygonManager);
    apiWrapper = TestBed.inject(GoogleMapsAPIWrapper);
    ngZone = TestBed.inject(NgZone);
  });

  describe('Create a new polygon', () => {
    it('should call the mapsApiWrapper when creating a new polygon', async () => {
      const newPolygon = new AgmPolygon(polygonManager);
      polygonManager.addPolygon(newPolygon);

      expect(apiWrapper.createPolygon).toHaveBeenCalledWith({
        clickable: true,
        draggable: false,
        editable: false,
        fillColor: '',
        fillOpacity: 0,
        geodesic: false,
        paths: [],
        strokeColor: '',
        strokeOpacity: 0,
        strokeWeight: 0,
        visible: true,
        zIndex: 0,
      });
    });
  });

  describe('Delete a polygon', () => {
    it('should set the map to null when deleting a existing polygon', async () => {
      const newPolygon = new AgmPolygon(polygonManager);
      const polygonInstance: any = {
        setMap: jest.fn(),
      };
      (apiWrapper.createPolygon as jest.Mock).mockReturnValue(Promise.resolve(polygonInstance));

      polygonManager.addPolygon(newPolygon);
      await polygonManager.deletePolygon(newPolygon);
      expect(polygonInstance.setMap).toHaveBeenCalledWith(null);
    });
  });

  describe('Path changes', () => {
    let newPolygon: AgmPolygon;
    let paths: google.maps.MVCArray<google.maps.MVCArray<google.maps.LatLng>>;
    const initLatLng = {lat: () => 15, lng: () => 15, toJSON: () => ({lat: 15, lng: 15})} as google.maps.LatLng;

    beforeEach(async () => {
      paths = new MvcArrayMock<google.maps.MVCArray<google.maps.LatLng>>();
      const path: MvcArrayMock<google.maps.LatLng> = new MvcArrayMock<google.maps.LatLng>();
      path.push(initLatLng);
      paths.push(path);
      const polygonInstance: any = {
        getPaths: () => paths,
        setMap: jest.fn(),
      };
      (apiWrapper.createPolygon as jest.Mock).mockReturnValue(Promise.resolve(polygonInstance));
      newPolygon = new AgmPolygon(polygonManager);
      polygonManager.addPolygon(newPolygon);
    });

    afterEach(async () => {
      await polygonManager.deletePolygon(newPolygon);
    });

    it('should emit a path change when a path is added', (done) => {
      const expectations = [1, 2];
      let expectationIndex = 0;
      expect.assertions(expectations.length);

      polygonManager.createPathEventObservable(newPolygon)
        .then(paths$ => {
          paths$.subscribe((polygonPathEvent) => {
            expect(polygonPathEvent).toEqual({
              newArr: [[{lat: 15, lng: 15}], ...Array(expectationIndex + 1).fill([])],
              eventName: 'insert_at',
              index: expectations[expectationIndex++],
            });
            if (expectationIndex === expectations.length) {
              done();
            }
          });
          paths.push(new MvcArrayMock());
          paths.push(new MvcArrayMock());
        });
    });

    it('should emit a path change when a path is removed', (done) => {
      const expectations = [
        {index: 2, previous: [] as google.maps.LatLng[], newArr: [[{lat: 15, lng: 15}], []]},
        {index: 0, previous: [{lat: 15, lng: 15}], newArr: [[]]}
      ];
      let expectationIndex = 0;
      expect.assertions(expectations.length);

      // prepare the array
      paths.push(new MvcArrayMock());
      paths.push(new MvcArrayMock());

      polygonManager.createPathEventObservable(newPolygon)
        .then(paths$ => {
          paths$.subscribe((polygonPathEvent) => {
            expect(polygonPathEvent).toEqual({
              eventName: 'remove_at',
              ...expectations[expectationIndex++],
            });
            if (expectationIndex === expectations.length) {
              done();
            }
          });
          paths.pop();
          paths.removeAt(0);
        });
    });

    it('should emit a path change when a path is set', (done) => {
      const expectations = [
        {index: 0, previous: [{lat: 15, lng: 15}], newArr: [Array(2).fill({lat: 15, lng: 15}), []]},
        {index: 1, previous: [] as google.maps.LatLng[], newArr: [Array(2).fill({lat: 15, lng: 15}), [{lat: 15, lng: 15}]]}
      ];
      let expectationIndex = 0;
      expect.assertions(expectations.length);

      // prepare the array
      paths.push(new MvcArrayMock());

      polygonManager.createPathEventObservable(newPolygon)
        .then(paths$ => {
          paths$.subscribe((polygonPathEvent) => {
            expect(polygonPathEvent).toEqual({
              eventName: 'set_at',
              ...expectations[expectationIndex++],
            });
            if (expectationIndex === expectations.length) {
              done();
            }
          });
          const firstMvcArray = new MvcArrayMock<google.maps.LatLng>();
          firstMvcArray.push(initLatLng);
          firstMvcArray.push(initLatLng);
          paths.setAt(0, firstMvcArray);
          const secondMvcArray = new MvcArrayMock<google.maps.LatLng>();
          secondMvcArray.push(initLatLng);
          paths.setAt(1, secondMvcArray);
        });
    });

    it('should emit a path change when a point is added to a path', (done) => {
      const expectations = [
        {pathIndex: 0, index: 1, newArr: [Array(2).fill({lat: 15, lng: 15})]},
        {pathIndex: 0, index: 2, newArr: [Array(3).fill({lat: 15, lng: 15})]}
      ];
      let expectationIndex = 0;
      expect.assertions(expectations.length);

      polygonManager.createPathEventObservable(newPolygon)
        .then(paths$ => {
          paths$.subscribe((polygonPathEvent) => {
            expect(polygonPathEvent).toEqual({
              eventName: 'insert_at',
              ...expectations[expectationIndex++],
            });
            if (expectationIndex === expectations.length) {
              done();
            }
          });
          paths.getAt(0).push(initLatLng);
          paths.getAt(0).push(initLatLng);
        });
    });

    it('should emit a path change when a point is removed from a path', (done) => {
      const expectations = [
        {pathIndex: 0, index: 1, previous: [{lat: 15, lng: 15}], newArr: [[{lat: 15, lng: 15}]]},
        {pathIndex: 0, index: 0, previous: [{lat: 15, lng: 15}], newArr: [[] as google.maps.LatLngLiteral[]]}
      ];
      let expectationIndex = 0;
      expect.assertions(expectations.length);

      // prepare the array
      paths.getAt(0).push(initLatLng);

      polygonManager.createPathEventObservable(newPolygon)
        .then(paths$ => {
          paths$.subscribe((polygonPathEvent) => {
            expect(polygonPathEvent).toEqual({
              eventName: 'remove_at',
              ...expectations[expectationIndex++],
            });
            if (expectationIndex === expectations.length) {
              done();
            }
          });
          paths.getAt(0).pop();
          paths.getAt(0).removeAt(0);
        });
    });

    it('should emit a path change when a point is added to an added path', (done) => {
      const expectations = [
        {index: 1, newArr: [[{lat: 15, lng: 15}], []]},
        {pathIndex: 1, index: 0, newArr: [[{lat: 15, lng: 15}], [{lat: 15, lng: 15}]]}
      ];
      let expectationIndex = 0;
      expect.assertions(expectations.length);

      polygonManager.createPathEventObservable(newPolygon)
        .then(paths$ => {
          paths$.subscribe((polygonPathEvent) => {
            expect(polygonPathEvent).toEqual({
              eventName: 'insert_at',
              ...expectations[expectationIndex++],
            });
            if (expectationIndex === expectations.length) {
              done();
            }
          });
          paths.push(new MvcArrayMock());
          paths.getAt(1).push(initLatLng);
        });
    });
  });
});
