import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DvdSearchComponent } from './dvd-search.component';

describe('DvdSearchComponent', () => {
  let component: DvdSearchComponent;
  let fixture: ComponentFixture<DvdSearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DvdSearchComponent]
    });
    fixture = TestBed.createComponent(DvdSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
