import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';

import {LoginService} from './login.service';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private loginService: LoginService) {
    }

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const user = this.loginService.userValue;
        if (user) {
            // authorised so return true
            console.log("canActivate, user_logged");
            return true;
        } else {
            console.log("canActivate, user_not_logged");
            // not logged in so redirect to login page with the return url
            await this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
            return false;
        }
    }

}
