import {Component, OnInit} from '@angular/core';

import {Category, Film, Store} from "../utilities/typeDB";
import { ApiService } from "../services/api.service";
import {debounceTime, distinctUntilChanged, Observable, of, Subject, switchMap} from "rxjs";


@Component({
  selector: 'app-films',
  templateUrl: './films.html',
  styleUrls: ['./films.css']
})
export class Films implements OnInit {
  offset: number = 0;
  count: number = 0;
  diff: number = 0;
  current_page: number = 0;
  my_date = new Date();
  tomorrow= new Date();
  aftertomorrow = new Date();
  rented = false;
  rentedFilm: Film = {}

  films: Film[] | null = null;
  selectedFilm: Film = {};
  categories: Category[] | null = null;
  selectedCategory: Category = {category_id: 1, name: "Categorie"};
  stores: Store[] | null = null;
  selectedStore: Store = {store_id: 1, city: "Store"};
  selectedDate: Date = this.my_date;

  films$!: Observable<Film[]> | undefined;
  private searchTerms = new Subject<string>();

  constructor(private apiService: ApiService) {}

  async ngOnInit(): Promise<void> {
    this.tomorrow.setDate(this.tomorrow.getDate()+1);
    this.aftertomorrow.setDate(this.aftertomorrow.getDate()+2);
    await this.updateFilms();
    const result = await this.apiService.getCategories();
    this.categories = result.categoryArray;
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
          return this.apiService.getFilms_search(term)
        }
      })
    );
  }

  async updateFilms() {
    if (this.selectedCategory) {
      const result = await this.apiService.getFilms_category(this.offset, this.selectedCategory.category_id!);
      this.count = result.count;
      this.films = result.filmArray;
    } else {
      const result = await this.apiService.getFilms(this.offset);
      this.count = result.count;
      this.films = result.filmArray;
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
    this.selectedFilm = film;
    console.log(this.selectedFilm);
    const result = await this.apiService.getStores(this.selectedFilm.film_id!);
    this.stores = result.stores!;
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
