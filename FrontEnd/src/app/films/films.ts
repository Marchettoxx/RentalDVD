import { Component, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, Observable, of, Subject, switchMap } from "rxjs";

import {Actor, Category, Film, Store} from "../utilities/typeDB";
import { ApiService } from "../services/api.service";

@Component({
  selector: 'app-films',
  templateUrl: './films.html',
  styleUrls: ['./films.css']
})
export class Films implements OnInit {
  offset: number = 0;
  count: number = 0;
  current_page: number = 0;
  my_date = new Date();
  tomorrow= new Date();
  afterTomorrow = new Date();
  rented = false;
  rentedFilm: Film = {}

  films?: Film[];
  selectedFilm: Film = {};
  categories?: Category[];
  selectedCategory: Category = {category_id: 1, name: "Categorie"};
  stores?: Store[];
  selectedStore: Store = {store_id: 1, city: "Store"};
  selectedDate: Date = this.my_date;

  actors?: Actor[];

  films$?: Observable<Film[]>;
  private searchTerms = new Subject<string>();

  constructor(private apiService: ApiService) {}

  async ngOnInit(): Promise<void> {
    this.tomorrow.setDate(this.tomorrow.getDate()+1);
    this.afterTomorrow.setDate(this.afterTomorrow.getDate()+2);
    await this.updateFilms();
    this.categories = await this.apiService.getCategories();
    this.films$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),
      // ignore new term if same as previous term
      distinctUntilChanged(),
      // switch to new search observable each time the term changes
      switchMap((term: string) => {
        if (!term.trim()) {
          // if not search term, return empty hero array.
          return of([]);
        } else {
          return this.apiService.getFilms_search(term);
        }
      })
    );
  }

  async updateFilms() {
    if (this.selectedCategory) {
      const result = await this.apiService.getFilms_category(this.offset, this.selectedCategory.category_id!);
      this.count = result.count!;
      this.films = result.films;
    } else {
      const result = await this.apiService.getFilms(this.offset);
      this.count = result.count!;
      this.films = result.films;
    }
  }

  showPrevious(n: number) {
    return this.offset - n > 0;
  }

  showNext(n: number) {
    return this.offset + 10 + n < this.count;
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

  async onSelect(film: Film): Promise<void> {
    this.selectedFilm = await this.apiService.getFilm(film.film_id!);
    this.actors = await this.apiService.getActors(film.film_id!);
    this.stores = await this.apiService.getStores(film.film_id!);
  }

  async jump(index: number): Promise<void> {
    this.offset = index * 10;
    this.current_page = index;
    await this.updateFilms();
  }

  async filter(category: Category){
    this.selectedCategory = category;
    await this.updateFilms();
  }

  selectStore(store: Store) {
    this.selectedStore = store;
  }

  search(term: string): void {
    console.log(term);
    this.searchTerms.next(term);
  }

  onSelectDate(date: Date){
    this.selectedDate = date;
  }

  rent() {
    this.rented = true;
    this.rentedFilm = this.selectedFilm;
    setTimeout(() => {this.rented = false;}, 3000)
  }
}
