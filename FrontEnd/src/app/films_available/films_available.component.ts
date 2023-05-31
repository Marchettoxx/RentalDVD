import {Component, OnInit} from '@angular/core';

import { Film } from "../utilities/typeDB";
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

  constructor(private apiService: ApiService) {}

  async ngOnInit(): Promise<void> {
    await this.updateFilms();
  }

  async updateFilms() {
    const result = await this.apiService.getFilms(this.offset);
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
