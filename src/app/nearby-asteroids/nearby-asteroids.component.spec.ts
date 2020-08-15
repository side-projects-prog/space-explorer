import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NearbyAsteroidsComponent } from './nearby-asteroids.component';

describe('NearbyAsteroidsComponent', () => {
  let component: NearbyAsteroidsComponent;
  let fixture: ComponentFixture<NearbyAsteroidsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NearbyAsteroidsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NearbyAsteroidsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
