import {Component, OnInit} from '@angular/core';
import {DvdService} from "../dvd.service";
import {Dvd} from "../dvd";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  constructor(public dvdService: DvdService) {
  }

}
