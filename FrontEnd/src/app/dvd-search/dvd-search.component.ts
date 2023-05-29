import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { Dvd } from '../dvd';
import { DvdService } from "../dvd.service";

@Component({
  selector: 'app-dvd-search',
  templateUrl: './dvd-search.component.html',
  styleUrls: ['./dvd-search.component.css']
})
export class DvdSearchComponent implements OnInit {
  dvds$!: Observable<Dvd[]>;
  private searchTerms = new Subject<string>();

  constructor(private dvdService: DvdService) {}

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.dvds$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.dvdService.searchDvds(term)),
    );
  }
}
