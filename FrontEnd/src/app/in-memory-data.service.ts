import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Dvd } from './dvd';
import { DVDS } from './mock-dvds';
import {User} from "./user";

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const dvds: Dvd[] = DVDS;
    const logins: User[] = [
      {
      id: "1",
      username: "marchetto",
      password: "pass",
      firstName: "Marco"
      },
      {
        id: "2",
        username: "luchino",
        password: "pass",
        firstName: "luca"
      }];
    return {dvds, logins};
  }

  // Overrides the genId method to ensure that a hero always has an id.
  // If the heroes array is empty,
  // the method below returns the initial number (11).
  // if the heroes array is not empty, the method below returns the highest
  // hero id + 1.
  genId(dvds: Dvd[]): number {
    return dvds.length > 0 ? Math.max(...dvds.map(dvd => dvd.id)) + 1 : 1;
  }
}
