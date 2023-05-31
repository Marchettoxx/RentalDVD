import {Component, OnInit} from '@angular/core';

import { Film } from "../typeDB";
import { ApiService } from "../api.service";

@Component({
  selector: 'app-dvds',
  templateUrl: './dvds.component.html',
  styleUrls: ['./dvds.component.css']
})
export class DvdsComponent implements OnInit {
  // @ts-ignore
  offset: number = 0;
  count: number = 0;
  diff: number = 0;
  films: Film[] = [];
  selectedFilm?: Film;

  constructor(private apiService: ApiService) {}

  async ngOnInit(): Promise<void> {
    await this.updateFilms();
  }

  async updateFilms() {
    const result = await this.apiService.getFilms(this.offset);
    this.count = result.count;
    this.diff = this.count / 10;
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
