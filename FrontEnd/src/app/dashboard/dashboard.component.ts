import {Component, OnInit} from '@angular/core';
import {DvdService} from "../dvd.service";
import {Dvd} from "../dvd";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  dvds:Dvd[] = [];

  constructor(public dvdService: DvdService) {
  }
  getDvds(): void {
    this.dvdService.getDvds()
      .subscribe(dvds => this.dvds = dvds.slice(1, 5));
  }

  ngOnInit(): void {
    this.getDvds();
  }
}
