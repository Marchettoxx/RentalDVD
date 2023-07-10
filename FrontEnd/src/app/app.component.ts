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
    confirm: boolean = false;

    constructor(private loginService: LoginService) {
        this.loginService.user.subscribe(x => this.user = x);
    }

    async logout() {
        this.confirm = false;
        await this.loginService.logout();
    }

    setConfirm(val: boolean){
        this.confirm = val;
        console.log("aperto")
    }
}
