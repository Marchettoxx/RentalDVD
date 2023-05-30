import {Component, OnInit, ViewChild} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

import { Film } from "../typeDB";
import {ApiService} from "../api.service";

@Component({
  selector: 'app-dvds',
  templateUrl: './dvds.component.html',
  styleUrls: ['./dvds.component.css']
})
export class DvdsComponent implements OnInit {
  // @ts-ignore
  offset: number = 0;
  count: number = 0;
  films: Film[] = [];

  constructor(private apiService: ApiService) {}

  async ngOnInit(): Promise<void> {
    await this.updateFilms();
  }

  async updateFilms() {
    const result = await this.apiService.getFilms(this.offset);
    this.count = result.count;
    this.films = result.films;
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
    this.offset += 10;
    await this.updateFilms();
  }
}
