import { Component } from '@angular/core';

import { Category, Film, Login } from "../utilities/typeDB";
import { ApiService } from "../services/api.service";
import { LoginService } from "../services/login.service";
import {debounceTime, distinctUntilChanged, Observable, of, Subject, switchMap} from "rxjs";

@Component({
  selector: 'app-films_rented',
  templateUrl: './films_rented.component.html',
  styleUrls: ['./films_rented.component.css']
})
export class Films_rentedComponent {
  offset: number = 0;
  count: number = 0;
  current_page: number = 0;
  diff: number = 0;

  user!: Login;
  films: Film[] | null = null;
  selectedFilm: Film = {};
  categories: Category[] | null = null;
  list_index: number[] = []
  selectedIndex: number = 0;


  constructor(private loginService: LoginService, private apiService: ApiService) {
    this.loginService.user.subscribe(x => this.user = x!);
  }

  async ngOnInit(): Promise<void> {
    await this.updateFilms();
    this.diff = this.count / 10;
    this.list_index = Array.from({ length: this.diff + 1 }, (_, index) => index);

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

}
