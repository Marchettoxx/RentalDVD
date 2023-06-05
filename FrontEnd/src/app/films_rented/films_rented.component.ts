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
  films: Film[] | null = null;
  selectedFilm: Film = {};
  current_page: number = 0;
  diff: number = 0;
  list_index: number[] = []
  selectedIndex: number = 0;
  user!: Login;
  categories: Category[] | null = null;
  selectedCategory: Category | null = null;

  films$!: Observable<Film[]> | undefined;
  private searchTerms = new Subject<string>();

  constructor(private loginService: LoginService, private apiService: ApiService) {
    this.loginService.user.subscribe(x => this.user = x!);
  }

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
      switchMap((term: string) => {{
        if (!term.trim()) {
          // if not search term, return empty hero array.
          return of([]);
        }
        return this.apiService.getFilms_user_search(this.user.customer_id, term)}}
      )
    );
  }

  async updateFilms() {
    if (this.selectedCategory) {
      const result = await this.apiService.getFilms_user_category(this.offset, this.user.customer_id, this.selectedCategory.category_id!);
      this.count = result.count;
      this.films = result.filmArray;
      this.selectedIndex = this.current_page;
    } else {
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

  async filter(category: Category){
    this.selectedCategory = category;
    await this.updateFilms();
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }
}
