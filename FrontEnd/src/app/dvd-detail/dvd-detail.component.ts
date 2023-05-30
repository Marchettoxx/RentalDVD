import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Dvd } from '../dvd';
import { DvdService } from "../dvd.service";

@Component({
  selector: 'app-dvd-detail',
  templateUrl: './dvd-detail.component.html',
  styleUrls: ['./dvd-detail.component.css']
})
export class DvdDetailComponent {
  @Input() dvd?: Dvd;

  constructor(
    private route: ActivatedRoute,
    private heroService: DvdService,
    private location: Location
  ) {}

  ngOnInit(): void {

  }

  /*getDvd(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.heroService.getDvd(id).subscribe(dvd => this.dvd = dvd);
  }*/

  goBack(): void {
    this.location.back();
  }
}
