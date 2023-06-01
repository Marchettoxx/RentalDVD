import { Component } from '@angular/core';

import { LoginService } from "./services/login.service";
import { Login } from "./utilities/typeDB";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  user?: Login | null = null;

  constructor(private loginService: LoginService) {
    this.loginService.user.subscribe(x => this.user = x);
  }

  logout() {
    this.loginService.logout();
  }
}
