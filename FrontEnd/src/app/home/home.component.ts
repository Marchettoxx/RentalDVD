import { Component } from '@angular/core';

import {LoginService} from "../services/login.service";
import {Login} from "../utilities/typeDB";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  user!: Login | null;

  constructor(private loginService: LoginService) {
    this.loginService.user.subscribe(x => this.user = x);
  }
}
