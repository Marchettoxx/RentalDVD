import { Component } from '@angular/core';

import {AccountService} from "../account.service";
import {Login} from "../login";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  // @ts-ignore
  user: Login | null;

  constructor(private accountService: AccountService) {
    this.accountService.user.subscribe(x => this.user = x);
  }

  protected readonly String = String;
}
