import {Component, OnInit} from '@angular/core';

import {Category, Film, Store} from "../utilities/typeDB";
import { ApiService } from "../services/api.service";
import {debounceTime, distinctUntilChanged, Observable, of, Subject, switchMap} from "rxjs";

@Component({
  selector: 'app-films_available',
  templateUrl: './films_available.component.html',
  styleUrls: ['./films_available.component.css']
})
export class Films_availableComponent implements OnInit {
  offset: number = 0;
  count: number = 0;
  diff: number = 0;
  current_page: number = 0;

  films: Film[] | null = null;
  selectedFilm: Film = {};
  categories: Category[] | null = null;
  selectedCategory: Category | null = null;
  list_index: number[] = []
  selectedIndex: number = 0;
  stores: Store[] = [];

  films$!: Observable<Film[]> | undefined;
  private searchTerms = new Subject<string>();

  constructor(private apiService: ApiService) {}

  async ngOnInit(): Promise<void> {
    await this.updateFilms();
    this.diff = this.count / 10;
    this.list_index = Array.from({ length: this.diff + 1 }, (_, index) => index);
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
      this.diff = this.count / 10;
      this.list_index = Array.from({ length: this.diff + 1 }, (_, index) => index);
      this.selectedIndex = this.current_page;
    } else {
      const result = await this.apiService.getFilms(this.offset);
      this.count = result.count;
      this.films = result.filmArray;
      this.selectedIndex = this.current_page;
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

  async jump(index: number): Promise<void> {
    this.offset = index * 10;
    this.current_page = index;
    await this.updateFilms();
  }

  async onSelect(film: Film): Promise<void> {
    this.selectedFilm = film;
    const result = await this.apiService.getStores(this.selectedFilm.film_id!);
    this.stores = result.stores!;
  }

  async filter(category: Category){
    this.selectedCategory = category;
    await this.updateFilms();
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

}
