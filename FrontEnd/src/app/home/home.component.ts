import { Component } from '@angular/core';

import {LoginService} from "../login/service/login.service";
import {Login} from "../utilities/typeDB";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  // @ts-ignore
  user: Login | null;

  constructor(private accountService: LoginService) {
    this.accountService.user.subscribe(x => this.user = x);
  }
}
