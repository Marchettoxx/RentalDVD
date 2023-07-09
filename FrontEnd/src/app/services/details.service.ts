import {Injectable} from '@angular/core';

import {Film} from "../utilities/typeDB";

@Injectable({
    providedIn: 'root'
})
export class DetailsService {
    private _film!: Film;
    private inRented!: boolean;

    setInRented(value: boolean) {
        this.inRented = value;
    }

    getInRented() {
        return this.inRented;
    }

    getFilm() {
        return this._film;
    }

    setFilm(value: Film) {
        this._film = value;
    }
}
