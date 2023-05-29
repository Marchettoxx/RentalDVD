import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DvdFormComponent } from './dvd-form.component';

describe('DvdFormComponent', () => {
  let component: DvdFormComponent;
  let fixture: ComponentFixture<DvdFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DvdFormComponent]
    });
    fixture = TestBed.createComponent(DvdFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
