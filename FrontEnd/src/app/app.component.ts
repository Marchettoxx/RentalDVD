import { Component } from '@angular/core';

import { LoginService } from "./login/service/login.service";
import { Login } from "./utilities/typeDB";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  user?: Login | null = null;

  constructor(private accountService: LoginService) {
    this.accountService.user.subscribe(x => this.user = x);
  }

  logout() {
    this.accountService.logout();
  }
}
