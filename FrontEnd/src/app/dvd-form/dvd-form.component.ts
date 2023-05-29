import { Component } from '@angular/core';

import { Dvd } from '../dvd'

@Component({
  selector: 'app-dvd-form',
  templateUrl: './dvd-form.component.html',
  styleUrls: ['./dvd-form.component.css']
})
export class DvdFormComponent {
  genres = ['Horror', 'Action', 'Thriller'];
  model : Dvd = {
    "id": 22,
    "name": "The Hulk",
    "genre": this.genres[0]
  };
  submitted = false;

  onSubmit() { this.submitted = true;}

  newDvd() {
    this.model = {
      "id": 32,
      "name": "",
      "genre": ""
    }
  }
}
