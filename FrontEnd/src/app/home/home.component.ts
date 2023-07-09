import {Component} from '@angular/core';

import {LoginService} from "../services/login.service";
import {User} from "../utilities/typeDB";
import {LiveAnnouncer} from "@angular/cdk/a11y";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent {
    public user!: User | null;

    constructor(private loginService: LoginService, liveAnnouncer: LiveAnnouncer) {
        liveAnnouncer.announce("Home dello store")
        this.loginService.user.subscribe(x => this.user = x);
    }
}
