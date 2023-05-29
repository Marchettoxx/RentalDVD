import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Dvd } from './dvd'
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class DvdService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  private dvdsUrl = 'api/dvds';  // URL to web api
  constructor(private http: HttpClient, private messageService: MessageService) { }

  getDvds(): Observable<Dvd[]> {
    return this.http.get<Dvd[]>(this.dvdsUrl).pipe(tap(_ => this.log('fetched dvds')),
      catchError(this.handleError<Dvd[]>('getDvds', []))
    );
  }

  /** GET hero by id. Will 404 if id not found */
  getDvd(id: number): Observable<Dvd> {
    const url = `${this.dvdsUrl}/${id}`;
    return this.http.get<Dvd>(url).pipe(
      tap(_ => this.log(`fetched dvd id=${id}`)),
      catchError(this.handleError<Dvd>(`getDvd id=${id}`))
    );
  }

  private log(message: string) {
    this.messageService.add(`DvdService:${message}`);
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      console.error(error); // log to console instead

      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** PUT: update the hero on the server */
  updateDvd(dvd: Dvd): Observable<any> {
    return this.http.put(this.dvdsUrl, dvd, this.httpOptions).pipe(
      tap(_ => this.log(`updated dvd id=${dvd.id}`)),
      catchError(this.handleError<any>('updateDvd'))
    );
  }

  /** POST: add a new hero to the server */
  addDvd(dvd: Dvd): Observable<Dvd> {
    return this.http.post<Dvd>(this.dvdsUrl, dvd, this.httpOptions).pipe(
      tap((newDvd: Dvd) => this.log(`added dvd w/ id=${newDvd.id}`)),
      catchError(this.handleError<Dvd>('addDvd'))
    );
  }

  /** DELETE: delete the hero from the server */
  deleteDvd(id: number): Observable<Dvd> {
    const url = `${this.dvdsUrl}/${id}`;

    return this.http.delete<Dvd>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted dvd id=${id}`)),
      catchError(this.handleError<Dvd>('deleteDvd'))
    );
  }

  /* GET heroes whose name contains search term */
  searchDvds(term: string): Observable<Dvd[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.http.get<Dvd[]>(`${this.dvdsUrl}/?name=${term}`).pipe(
      tap(x => x.length ?
        this.log(`found dvds matching "${term}"`) :
        this.log(`no dvds matching "${term}"`)),
      catchError(this.handleError<Dvd[]>('searchDvds', []))
    );
  }
}
