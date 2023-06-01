import { Component } from '@angular/core';

import {Film } from "../utilities/typeDB";
import { ApiService } from "../services/api.service";
import {LoginService} from "../login/service/login.service";

@Component({
  selector: 'app-films_rented',
  templateUrl: './films_rented.component.html',
  styleUrls: ['./films_rented.component.css']
})
export class Films_rentedComponent {
  offset: number = 0;
  count: number = 0;
  films: Film[] = [];
  selectedFilm: Film = {};
  customer_id: number = 0;

  constructor(private loginService: LoginService, private apiService: ApiService) {
    this.loginService.user.subscribe(x => this.customer_id = x!.customer_id);
  }

  async ngOnInit(): Promise<void> {
    await this.updateFilms();
  }

  async updateFilms() {
    console.log(this.customer_id);
    const result = await this.apiService.getFilms_user(this.offset, this.customer_id);
    this.count = result.count;
    this.films = result.filmArray;
  }

  showPrevious() {
    return this.offset > 0;
  }

  showNext() {
    return this.offset + 10 < this.count;
  }

  async onPrevious() {
    this.offset -= 10;
    await this.updateFilms();
  }

  async onNext() {
    this.offset += 10
    console.log(this.offset + (this.count - this.offset));
    await this.updateFilms();
  }

  onSelect(film: Film): void {
    this.selectedFilm = film;
  }
}
