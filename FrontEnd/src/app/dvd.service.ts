import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { MessageService } from './messages/service/message.service';
import { ApiService } from "./api.service";

@Injectable({
  providedIn: 'root'
})
export class DvdService {
  constructor(private apiService: ApiService, private messageService: MessageService) { }

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
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  /** PUT: update the hero on the server */
  /*updateDvd(dvd: Dvd): Observable<any> {
    return this.http.put(this.dvdsUrl, dvd, this.httpOptions).pipe(
      tap(_ => this.log(`updated dvd id=${dvd.id}`)),
      catchError(this.handleError<any>('updateDvd'))
    );
  }

  getDvd(id: number): Observable<Dvd> {
    const url = `${this.dvdsUrl}/${id}`;
    return this.http.get<Dvd>(url).pipe(
      tap(_ => this.log(`fetched dvd id=${id}`)),
      catchError(this.handleError<Dvd>(`getDvd id=${id}`))
    );
  }

  addDvd(dvd: Dvd): Observable<Dvd> {
    return this.http.post<Dvd>(this.dvdsUrl, dvd, this.httpOptions).pipe(
      tap((newDvd: Dvd) => this.log(`added dvd w/ id=${newDvd.id}`)),
      catchError(this.handleError<Dvd>('addDvd'))
    );
  }

  deleteDvd(id: number): Observable<Dvd> {
    const url = `${this.dvdsUrl}/${id}`;

    return this.http.delete<Dvd>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted dvd id=${id}`)),
      catchError(this.handleError<Dvd>('deleteDvd'))
    );
  }


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
  }*/
}
