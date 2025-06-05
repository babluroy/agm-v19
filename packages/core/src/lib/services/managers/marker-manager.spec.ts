import { NgZone } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AgmMarker } from './../../directives/marker';
import { GoogleMapsAPIWrapper } from './../google-maps-api-wrapper';
import { MarkerManager } from './../managers/marker-manager';

describe('MarkerManager', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: NgZone, useFactory: () => new NgZone({enableLongStackTrace: true})},
        MarkerManager, {
          provide: GoogleMapsAPIWrapper,
          useValue: {
            createMarker: jest.fn().mockImplementation(() => Promise.resolve({
              setMap: jest.fn(),
              setIcon: jest.fn(),
              setOpacity: jest.fn(),
              setVisible: jest.fn(),
              setZIndex: jest.fn(),
              setAnimation: jest.fn(),
            })),
            getNativeMap: jest.fn().mockReturnValue(Promise.resolve()),
          },
        },
      ],
    });
  });

  describe('Create a new marker', () => {
    it('should call the mapsApiWrapper when creating a new marker', async () => {
      const markerManager = TestBed.inject(MarkerManager);
      const apiWrapper = TestBed.inject(GoogleMapsAPIWrapper);
      const newMarker = new AgmMarker(markerManager);
      newMarker.latitude = 34.4;
      newMarker.longitude = 22.3;
      newMarker.label = 'A';
      await markerManager.addMarker(newMarker);
      expect(apiWrapper.createMarker).toHaveBeenCalledWith({
        position: {lat: 34.4, lng: 22.3},
        label: 'A',
        draggable: false,
        icon: '',
        opacity: 1,
        visible: true,
        zIndex: 0,
        title: '',
        clickable: true,
        animation: undefined,
      });
    });
  });

  describe('Delete a marker', () => {
    it('should set the map to null when deleting a existing marker', async () => {
      const markerManager = TestBed.inject(MarkerManager);
      const apiWrapper = TestBed.inject(GoogleMapsAPIWrapper);
      const newMarker = new AgmMarker(markerManager);
      newMarker.latitude = 34.4;
      newMarker.longitude = 22.3;
      newMarker.label = 'A';

      const markerInstance: any = {
        setMap: jest.fn(),
      };
      (apiWrapper.createMarker as jest.Mock).mockReturnValue(Promise.resolve(markerInstance));

      await markerManager.addMarker(newMarker);
      await markerManager.deleteMarker(newMarker);
      expect(markerInstance.setMap).toHaveBeenCalledWith(null);
    });
  });

  describe('set marker icon', () => {
    it('should update that marker via setIcon method when the markerUrl changes', async () => {
      const markerManager = TestBed.inject(MarkerManager);
      const apiWrapper = TestBed.inject(GoogleMapsAPIWrapper);
      const newMarker = new AgmMarker(markerManager);
      newMarker.latitude = 34.4;
      newMarker.longitude = 22.3;
      newMarker.label = 'A';
      await markerManager.addMarker(newMarker);
      expect(apiWrapper.createMarker).toHaveBeenCalledWith({
        position: {lat: 34.4, lng: 22.3},
        label: 'A',
        draggable: false,
        icon: '',
        opacity: 1,
        visible: true,
        zIndex: 0,
        title: '',
        clickable: true,
        animation: undefined,
      });
    });
  });

  describe('set marker opacity', () => {
    it('should update that marker via setOpacity method when the markerOpacity changes', async () => {
      const markerManager = TestBed.inject(MarkerManager);
      const apiWrapper = TestBed.inject(GoogleMapsAPIWrapper);
      const newMarker = new AgmMarker(markerManager);
      newMarker.latitude = 34.4;
      newMarker.longitude = 22.3;
      newMarker.label = 'A';
      await markerManager.addMarker(newMarker);
      expect(apiWrapper.createMarker).toHaveBeenCalledWith({
        position: {lat: 34.4, lng: 22.3},
        label: 'A',
        draggable: false,
        icon: '',
        opacity: 1,
        visible: true,
        zIndex: 0,
        title: '',
        clickable: true,
        animation: undefined,
      });
    });
  });

  describe('set visible option', () => {
    it('should update that marker via setVisible method when the visible changes', async () => {
      const markerManager = TestBed.inject(MarkerManager);
      const apiWrapper = TestBed.inject(GoogleMapsAPIWrapper);
      const newMarker = new AgmMarker(markerManager);
      newMarker.latitude = 34.4;
      newMarker.longitude = 22.3;
      newMarker.label = 'A';
      newMarker.visible = false;
      await markerManager.addMarker(newMarker);
      expect(apiWrapper.createMarker).toHaveBeenCalledWith({
        position: {lat: 34.4, lng: 22.3},
        label: 'A',
        draggable: false,
        icon: '',
        opacity: 1,
        visible: false,
        zIndex: 0,
        title: '',
        clickable: true,
        animation: undefined,
      });
    });
  });

  describe('set zIndex option', () => {
    it('should update that marker via setZIndex method when the zIndex changes', async () => {
      const markerManager = TestBed.inject(MarkerManager);
      const apiWrapper = TestBed.inject(GoogleMapsAPIWrapper);
      const newMarker = new AgmMarker(markerManager);
      newMarker.latitude = 34.4;
      newMarker.longitude = 22.3;
      newMarker.label = 'A';
      newMarker.visible = false;
      await markerManager.addMarker(newMarker);
      expect(apiWrapper.createMarker).toHaveBeenCalledWith({
        position: {lat: 34.4, lng: 22.3},
        label: 'A',
        draggable: false,
        icon: '',
        opacity: 1,
        visible: false,
        zIndex: 0,
        title: '',
        clickable: true,
        animation: undefined,
      });
    });
  });

  describe('set animation option', () => {
    it('should update that marker via setAnimation method when the animation changes', async () => {
      const markerManager = TestBed.inject(MarkerManager);
      const apiWrapper = TestBed.inject(GoogleMapsAPIWrapper);
      const newMarker = new AgmMarker(markerManager);
      newMarker.latitude = 34.4;
      newMarker.longitude = 22.3;
      newMarker.label = 'A';
      newMarker.visible = false;
      newMarker.animation = null;
      await markerManager.addMarker(newMarker);
      expect(apiWrapper.createMarker).toHaveBeenCalledWith({
        position: {lat: 34.4, lng: 22.3},
        label: 'A',
        draggable: false,
        icon: '',
        opacity: 1,
        visible: false,
        zIndex: 0,
        title: '',
        clickable: true,
        animation: undefined,
      });
    });
  });
});
