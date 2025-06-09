import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgmDrawingManager } from './drawing-manager';

// Mock Google Maps API
declare global {
  interface Window {
    google: {
      maps: {
        ControlPosition: {
          TOP_CENTER: number;
        };
        drawing: {
          DrawingManager: any;
          OverlayType: {
            MARKER: string;
            CIRCLE: string;
            POLYGON: string;
            POLYLINE: string;
            RECTANGLE: string;
          };
        };
      };
    };
  }
}

// Setup Google Maps API mocks
beforeAll(() => {
  (window as any).google = {
    maps: {
      ControlPosition: {
        TOP_CENTER: 1
      },
      drawing: {
        DrawingManager: class {
          constructor(options: any) {}
          setMap(map: any) {}
        },
        OverlayType: {
          MARKER: 'marker',
          CIRCLE: 'circle',
          POLYGON: 'polygon',
          POLYLINE: 'polyline',
          RECTANGLE: 'rectangle'
        }
      }
    }
  };
});

@Component({
  template: '<agm-drawing-manager></agm-drawing-manager>',
  standalone: true,
  imports: [AgmDrawingManager]
})
class TestHostComponent {}

describe('AgmDrawingManager (hosted)', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should create the host component', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should create the AgmDrawingManager directive instance', () => {
    const drawingManagerEl = fixture.nativeElement.querySelector('agm-drawing-manager');
    expect(drawingManagerEl).toBeTruthy();
  });
}); 