import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';

import {LoginService} from './login.service';

@Injectable({providedIn: 'root'})
export class LoginGuard implements CanActivate {
    constructor(
        private router: Router,
        private loginService: LoginService
    ) {
    }

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const user = this.loginService.userValue;
        if (user) {
            if (state.url == '/login'){
               await this.router.navigate(['/home']);
            }
            return false;
        }
        return true;
    }

}
