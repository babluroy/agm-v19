import { AgmMarker, GoogleMapsAPIWrapper } from '@babluroy/agm-core';
import { NgZone } from '@angular/core';
import { inject, TestBed } from '@angular/core/testing';
import MarkerClusterer from '@google/markerclustererplus';
import { AgmMarkerCluster } from '../../directives/marker-cluster';
import { ClusterManager } from './cluster-manager';

describe('ClusterManager', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: NgZone, useFactory: () => new NgZone({enableLongStackTrace: true})},
        ClusterManager, {
          provide: GoogleMapsAPIWrapper,
          useValue: {
            createMarker: jest.fn().mockImplementation(() => Promise.resolve({
              setMap: jest.fn(),
              setIcon: jest.fn(),
              setOpacity: jest.fn(),
              setVisible: jest.fn(),
              setZIndex: jest.fn(),
            })),
          },
        },
      ],
    });
  });

  describe('Create a new marker', () => {
    it('should call the mapsApiWrapper when creating a new marker',
       inject(
           [ClusterManager, GoogleMapsAPIWrapper],
           async (clusterManager: ClusterManager, apiWrapper: GoogleMapsAPIWrapper) => {
             const newMarker = new AgmMarker(clusterManager);
             newMarker.latitude = 34.4;
             newMarker.longitude = 22.3;
             newMarker.label = 'A';
             await clusterManager.addMarker(newMarker);

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
             }, false);
           }));
  });

  describe('Delete a marker', () => {
    it('should set the map to null when deleting a existing marker',
       inject(
           [ClusterManager, GoogleMapsAPIWrapper],
           (clusterManager: ClusterManager, apiWrapper: GoogleMapsAPIWrapper) => {
             const newMarker = new AgmMarker(clusterManager);
             newMarker.latitude = 34.4;
             newMarker.longitude = 22.3;
             newMarker.label = 'A';

             const markerInstance: any = {
              setMap: jest.fn(),
             };
             (apiWrapper.createMarker as jest.Mock).mockReturnValue(Promise.resolve(markerInstance));

             clusterManager.addMarker(newMarker);
             clusterManager.deleteMarker(newMarker).then(
                 () => { expect(markerInstance.setMap).toHaveBeenCalledWith(null); });
           }));
  });

  describe('set marker icon', () => {
    it('should update that marker via setIcon method when the markerUrl changes',
       inject(
           [ClusterManager, GoogleMapsAPIWrapper],
           async (markerManager: ClusterManager, apiWrapper: GoogleMapsAPIWrapper) => {
             const newMarker = new AgmMarker(markerManager);
             newMarker.latitude = 34.4;
             newMarker.longitude = 22.3;
             newMarker.label = 'A';

             const markerInstance: any = {
              setMap: jest.fn(),
              setIcon: jest.fn(),
             };
             (apiWrapper.createMarker as jest.Mock).mockReturnValue(Promise.resolve(markerInstance));

             markerManager.addMarker(newMarker);
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
             }, false);
             const iconUrl = 'http://angular-maps.com/icon.png';
             newMarker.iconUrl = iconUrl;
             await markerManager.updateIcon(newMarker);
             expect(markerInstance.setIcon).toHaveBeenCalledWith(iconUrl);
           }));
  });

  describe('set marker opacity', () => {
    it('should update that marker via setOpacity method when the markerOpacity changes',
       inject(
           [ClusterManager, GoogleMapsAPIWrapper],
           async (markerManager: ClusterManager, apiWrapper: GoogleMapsAPIWrapper) => {
             const newMarker = new AgmMarker(markerManager);
             newMarker.latitude = 34.4;
             newMarker.longitude = 22.3;
             newMarker.label = 'A';

             const markerInstance: any = {
              setMap: jest.fn(),
              setOpacity: jest.fn(),
             };
             (apiWrapper.createMarker as jest.Mock).mockReturnValue(Promise.resolve(markerInstance));

             markerManager.addMarker(newMarker);
             expect(apiWrapper.createMarker).toHaveBeenCalledWith({
               position: {lat: 34.4, lng: 22.3},
               label: 'A',
               draggable: false,
               icon: '',
               visible: true,
               opacity: 1,
               zIndex: 0,
               title: '',
               clickable: true,
             }, false);
             const opacity = 0.4;
             newMarker.opacity = opacity;
             await markerManager.updateOpacity(newMarker);
             expect(markerInstance.setOpacity).toHaveBeenCalledWith(opacity);
           }));
  });

  describe('set visible option', () => {
    it('should update that marker via setVisible method when the visible changes',
       inject(
           [ClusterManager, GoogleMapsAPIWrapper],
           async (markerManager: ClusterManager, apiWrapper: GoogleMapsAPIWrapper) => {
             const newMarker = new AgmMarker(markerManager);
             newMarker.latitude = 34.4;
             newMarker.longitude = 22.3;
             newMarker.label = 'A';
             newMarker.visible = false;

             const markerInstance: any = {
               setMap: jest.fn(),
               setVisible: jest.fn(),
             };
             (apiWrapper.createMarker as jest.Mock).mockReturnValue(Promise.resolve(markerInstance));

             markerManager.addMarker(newMarker);
             expect(apiWrapper.createMarker).toHaveBeenCalledWith({
               position: {lat: 34.4, lng: 22.3},
               label: 'A',
               draggable: false,
               icon: '',
               visible: false,
               opacity: 1,
               zIndex: 0,
               title: '',
               clickable: true,
             }, false);
             newMarker.visible = true;
             await markerManager.updateVisible(newMarker);
             expect(markerInstance.setVisible).toHaveBeenCalledWith(true);
           }));
  });

  describe('set zIndex option', () => {
    it('should update that marker via setZIndex method when the zIndex changes',
       inject(
           [ClusterManager, GoogleMapsAPIWrapper],
           async (markerManager: ClusterManager, apiWrapper: GoogleMapsAPIWrapper) => {
             const newMarker = new AgmMarker(markerManager);
             newMarker.latitude = 34.4;
             newMarker.longitude = 22.3;
             newMarker.label = 'A';
             newMarker.visible = false;

             const markerInstance = {
               setMap: jest.fn(),
               setZIndex: jest.fn(),
             };
             (apiWrapper.createMarker as jest.Mock).mockReturnValue(Promise.resolve(markerInstance));

             markerManager.addMarker(newMarker);
             expect(apiWrapper.createMarker).toHaveBeenCalledWith({
               position: {lat: 34.4, lng: 22.3},
               label: 'A',
               draggable: false,
               icon: '',
               visible: false,
               opacity: 1,
               zIndex: 0,
               title: '',
               clickable: true,
             }, false);
             newMarker.zIndex = 2;
             await markerManager.updateZIndex(newMarker);
             expect(markerInstance.setZIndex).toHaveBeenCalledWith(2);
           }));
  });

  describe('set calculator', () => {
    it('should call the setCalculator method when the calculator changes and is a function',
      inject(
        [ClusterManager],
        async (markerManager: ClusterManager) => {

          const mockClusterer: Partial<MarkerClusterer> = { setCalculator: jest.fn() };
          const instancePromise = Promise.resolve(mockClusterer as MarkerClusterer);

          const spy = jest.spyOn(markerManager, 'getClustererInstance')
                          .mockImplementation(() => instancePromise);

          const markerCluster: Partial<AgmMarkerCluster> = {};

          // negative case
          markerCluster.calculator = undefined;
          markerManager.setCalculator(markerCluster as AgmMarkerCluster);
          await instancePromise;
          expect(mockClusterer.setCalculator).not.toHaveBeenCalled();

          // positive case
          markerCluster.calculator = jest.fn();
          markerManager.setCalculator(markerCluster as AgmMarkerCluster);
          await instancePromise;
          expect(mockClusterer.setCalculator).toHaveBeenCalledTimes(1);

          spy.mockReset();
        }));
  });
});
