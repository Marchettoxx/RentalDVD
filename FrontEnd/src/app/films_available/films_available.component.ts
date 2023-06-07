import {Component, OnInit} from '@angular/core';

import {Film, Store} from "../utilities/typeDB";
import { ApiService } from "../services/api.service";

@Component({
  selector: 'app-films_available',
  templateUrl: './films_available.component.html',
  styleUrls: ['./films_available.component.css']
})
export class Films_availableComponent implements OnInit {
  offset: number = 0;
  count: number = 0;
  films: Film[] = [];
  selectedFilm: Film = {};
  current_page: number = 0;
  diff: number = 0;
  list_index: number[] = []
  selectedIndex: number = 0;
  stores: Store[] = [];

  constructor(private apiService: ApiService) {}

  async ngOnInit(): Promise<void> {
    await this.updateFilms();
    this.diff = this.count / 10;
    this.list_index = Array.from({ length: this.diff + 1 }, (_, index) => index);
  }

  async updateFilms() {
    const result = await this.apiService.getFilms(this.offset);
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

  async onSelect(film: Film): Promise<void> {
    this.selectedFilm = film;
    const result = await this.apiService.getStores(this.selectedFilm.film_id!);
    this.stores = result.stores!;
  }

  async jump(index: number): Promise<void> {
    this.offset = index * 10;
    this.current_page = index;
    await this.updateFilms();
  }
}
