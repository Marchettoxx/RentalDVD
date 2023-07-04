import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {BehaviorSubject, Observable} from 'rxjs';

import {ApiService} from "./api.service";
import {User} from "../utilities/typeDB";

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    private userSubject: BehaviorSubject<User | null>;
    public user: Observable<User | null>;

    constructor(private router: Router, private apiService: ApiService) {
        this.userSubject = new BehaviorSubject(JSON.parse(sessionStorage.getItem('user')!));
        this.user = this.userSubject.asObservable();
    }

    public get userValue() {
        return this.userSubject.value;
    }

    login(username: string, password: string) {
        return this.apiService.getLogin(username, password).then(user => {
            if (user) {
                sessionStorage.setItem('user', JSON.stringify(user));
                this.userSubject.next(user);
                this.userSubject.asObservable();
                return user;
            } else {
                const user: User = {customer_id: -1, username: "", token: ""}
                return user;
            }
        }).catch( _ => {
            const user: User = {customer_id: -1, username: "", token: ""}
            return user;
        });
    }

    async logout(expired: boolean = false) {
        // remove user from local storage and set current user to null
        sessionStorage.removeItem('user');
        this.userSubject.next(null);
        await this.router.navigate(['/login']);
        window.location.reload();
        sessionStorage.setItem('session', JSON.stringify(expired));
    }
}
