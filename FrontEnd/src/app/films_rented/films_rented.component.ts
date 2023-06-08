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
  selectedReturnDate: Boolean = true;
  selectedTitle: Boolean = false;
  selectedGenre: Boolean = false;
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
    if(this.selectedTitle){
      const result = await this.apiService.getFilms_user_title(this.offset, this.user.customer_id);
      this.count = result.count;
      this.films = result.filmArray;
      this.selectedIndex = this.current_page;
    }
    else if(this.selectedGenre){
      const result = await this.apiService.getFilms_user_genre(this.offset, this.user.customer_id);
      this.count = result.count;
      this.films = result.filmArray;
      this.selectedIndex = this.current_page;
    }
    else if(this.selectedReturnDate){
      const result = await this.apiService.getFilms_user(this.offset, this.user.customer_id);
      this.count = result.count;
      this.films = result.filmArray;
      this.selectedIndex = this.current_page;
    }

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

  async sortByTitle(){
    this.selectedTitle=true;
    this.selectedGenre=false;
    this.selectedReturnDate=false;
    await this.updateFilms()
  }

  async sortByGenre(){
    this.selectedTitle=false;
    this.selectedGenre=true;
    this.selectedReturnDate=false;
    await this.updateFilms()
  }

  async sortByReturnDate(){
    this.selectedTitle=false;
    this.selectedGenre=false;
    this.selectedReturnDate=true;
    await this.updateFilms()
  }

}
