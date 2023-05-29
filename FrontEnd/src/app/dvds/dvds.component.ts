import {Component, OnInit} from '@angular/core';

import { Dvd } from '../dvd';
import { DvdService } from "../dvd.service";

@Component({
  selector: 'app-dvds',
  templateUrl: './dvds.component.html',
  styleUrls: ['./dvds.component.css']
})
export class DvdsComponent implements OnInit {
  dvds:Dvd[] = [];

  constructor(private dvdService: DvdService) {
  }

  getDvds(): void {
    this.dvdService.getDvds().subscribe(dvds => this.dvds = dvds);
  }

  ngOnInit(): void {
    this.getDvds();
  }

  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.dvdService.addDvd({ name } as Dvd)
      .subscribe(dvd => {
        this.dvds.push(dvd);
      });
  }

  delete(dvd: Dvd): void {
    this.dvds = this.dvds.filter(h => h !== dvd);
    this.dvdService.deleteDvd(dvd.id).subscribe();
  }
}
