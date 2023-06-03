import { Component } from '@angular/core';

import {Film, Login} from "../utilities/typeDB";
import { ApiService } from "../services/api.service";
import {LoginService} from "../services/login.service";

@Component({
  selector: 'app-films_rented',
  templateUrl: './films_rented.component.html',
  styleUrls: ['./films_rented.component.css']
})
export class Films_rentedComponent {
  offset: number = 0;
  count: number = 0;
  films: Film[] | null = null;
  selectedFilm: Film = {};
  current_page: number = 0;
  diff: number = 0;
  list_index: number[] = []
  selectedIndex: number = 0;
  offset_in_rent: number = 0;
  count_in_rent: number = 0;
  selectedFilm_in_rent: Film = {};
  current_page_in_rent: number = 0;
  diff_in_rent: number = 0;
  list_index_in_rent: number[] = []
  selectedIndex_in_rent: number = 0;
  films_in_rent: Film[] | null = null;
  user!: Login;

  constructor(private loginService: LoginService, private apiService: ApiService) {
    this.loginService.user.subscribe(x => this.user = x!);
  }

  async ngOnInit(): Promise<void> {
    await this.updateFilms();
    this.diff = this.count / 10;
    this.list_index = Array.from({ length: this.diff + 1 }, (_, index) => index);
    this.diff_in_rent = this.count_in_rent / 10;
    this.list_index_in_rent = Array.from({ length: this.diff_in_rent + 1 }, (_, index) => index);
  }

  async updateFilms() {
    const result = await this.apiService.getFilms_user(this.offset, this.user.customer_id);
    this.count = result.count;
    this.films = result.filmArray;
    this.selectedIndex = this.current_page;
  }

  showPrevious() {
    return this.offset > 0;
  }

  showNext() {
    return this.offset + 10 < this.count;
  }

  async onPrevious() {
    this.offset -= 10;
    this.current_page = this.offset / 10;
    await this.updateFilms();
  }

  async onNext() {
    this.offset += 10
    this.current_page = this.offset / 10;
    await this.updateFilms();
  }

  onSelect(film: Film): void {
    this.selectedFilm = film;
  }

  async jump(index: number): Promise<void> {
    this.offset = index * 10;
    this.current_page = index;
    await this.updateFilms();
  }

  async updateFilms_in_rent() {
    const result_in_rent = await this.apiService.getFilms_user_in_rent(this.offset, this.user.customer_id);
    this.count_in_rent = result_in_rent.count;
    this.films_in_rent = result_in_rent.filmArray;
    this.selectedIndex_in_rent = this.current_page_in_rent;
  }

  showPrevious_in_rent() {
    return this.offset_in_rent > 0;
  }

  showNext_in_rent() {
    return this.offset_in_rent + 10 < this.count_in_rent;
  }

  async onPrevious_in_rent() {
    this.offset_in_rent -= 10;
    this.current_page_in_rent = this.offset_in_rent / 10;
    await this.updateFilms_in_rent();
  }

  async onNext_in_rent() {
    this.offset_in_rent += 10
    this.current_page_in_rent = this.offset_in_rent / 10;
    await this.updateFilms_in_rent();
  }

  onSelect_in_rent(film: Film): void {
    this.selectedFilm_in_rent = film;
  }

  async jump_in_rent(index: number): Promise<void> {
    this.offset_in_rent = index * 10;
    this.current_page_in_rent = index;
    await this.updateFilms_in_rent();
  }
}
