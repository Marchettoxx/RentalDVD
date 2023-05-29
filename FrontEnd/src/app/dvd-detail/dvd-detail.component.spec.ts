import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DvdDetailComponent } from './dvd-detail.component';

describe('DvdDetailComponent', () => {
  let component: DvdDetailComponent;
  let fixture: ComponentFixture<DvdDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DvdDetailComponent]
    });
    fixture = TestBed.createComponent(DvdDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
