import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgmDrawingManager } from './drawing-manager';

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