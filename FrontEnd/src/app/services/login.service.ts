import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { compare } from "bcrypt-ts";

import { ApiService } from "./api.service";
import { Login } from "../utilities/typeDB";

@Injectable({ providedIn: 'root' })
export class LoginService {
  private userSubject: BehaviorSubject<Login | null>;
  public user: Observable<Login | null>;

  constructor(
    private router: Router,
    private apiService: ApiService
  ) {
    this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user')!));
    this.user = this.userSubject.asObservable();
  }

  public get userValue() {
    return this.userSubject.value;
  }

  login(username: string) {
    return this.apiService.getLogin(username).then(user => {
      return compare("pass", user.password!).then((result) => {
        if (result) {
          localStorage.setItem('user', JSON.stringify(user));
          this.userSubject.next(user);
          this.userSubject.asObservable();
          console.log(result);
          console.log(user);
          return user;
        } else {
          const user: Login = {customer_id: -1}
          return user;
        }
      });
    }).catch(_ => {
      const user: Login = {customer_id: -1}
      return user;
    });
  }

  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }
}
