import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {BehaviorSubject, Observable, of} from 'rxjs';

import { MessageService } from "../../messages/service/message.service";
import {ApiService} from "../../services/api.service";
import {Login} from "../../utilities/typeDB";

@Injectable({ providedIn: 'root' })
export class LoginService {
  private userSubject: BehaviorSubject<Login | null>;
  public user: Observable<Login | null>;

  constructor(
    private router: Router,
    private messageService: MessageService,
    private apiService: ApiService
  ) {
    this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user')!));
    this.user = this.userSubject.asObservable();
  }

  public get userValue() {
    return this.userSubject.value;
  }

  login(username: string, password: string) {
    // @ts-ignore
    return this.apiService.getLogin(username, password).then(user => {
      localStorage.setItem('user', JSON.stringify(user));
      this.userSubject.next(user);
      this.userSubject.asObservable();
      return user;
    }).catch(error => {
      console.log("Richiesta andata male");
      this.handleError<Login>(`${error}`, {customer_id: 1});
    });
  }

  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  private log(message: string) {
    this.messageService.add(`LoginService:${message}`);
  }
}
