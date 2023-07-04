import {Component} from '@angular/core';

import {LoginService} from "./services/login.service";
import {User} from "./utilities/typeDB";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    public user!: User | null;

    constructor(private loginService: LoginService) {
        this.loginService.user.subscribe(x => this.user = x);
    }

    async logout() {
        await this.loginService.logout();
    }
}
