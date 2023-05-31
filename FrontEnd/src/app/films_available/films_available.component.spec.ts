import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Films_availableComponent } from './films_available.component';

describe('DvdsComponent', () => {
  let component: Films_availableComponent;
  let fixture: ComponentFixture<Films_availableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Films_availableComponent]
    });
    fixture = TestBed.createComponent(Films_availableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
