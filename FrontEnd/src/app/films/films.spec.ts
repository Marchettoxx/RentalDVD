import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Films } from './films';

describe('DvdsComponent', () => {
  let component: Films;
  let fixture: ComponentFixture<Films>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Films]
    });
    fixture = TestBed.createComponent(Films);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
