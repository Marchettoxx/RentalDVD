import { Component } from '@angular/core';

@Component({
  selector: 'app-dvd-search',
  templateUrl: './dvd-search.component.html',
  styleUrls: ['./dvd-search.component.css']
})
export class DvdSearchComponent {
  /*films_available$!: Observable<Dvd[]>;
  private searchTerms = new Subject<string>();

  constructor(private dvdService: DvdService) {}

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  /*ngOnInit(): void {
    this.films_available$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.dvdService.searchDvds(term))
    );
  }*/
}
