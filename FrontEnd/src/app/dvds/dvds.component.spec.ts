import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DvdsComponent } from './dvds.component';

describe('DvdsComponent', () => {
  let component: DvdsComponent;
  let fixture: ComponentFixture<DvdsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DvdsComponent]
    });
    fixture = TestBed.createComponent(DvdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
