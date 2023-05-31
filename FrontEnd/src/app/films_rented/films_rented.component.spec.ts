import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Films_rentedComponent } from './films_rented.component';

describe('RentedComponent', () => {
  let component: Films_rentedComponent;
  let fixture: ComponentFixture<Films_rentedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Films_rentedComponent]
    });
    fixture = TestBed.createComponent(Films_rentedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
