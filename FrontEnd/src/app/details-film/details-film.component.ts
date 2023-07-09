import {Component, OnInit} from '@angular/core';
import {Actor, Film, User} from "../utilities/typeDB";
import {ApiService} from "../services/api.service";
import {LoginService} from "../services/login.service";
import {Store} from "../utilities/typeDB";
import {DetailsService} from "../services/details.service";

@Component({
  selector: 'app-details-film',
  templateUrl: './details-film.component.html',
  styleUrls: ['./details-film.component.css']
})
export class DetailsFilmComponent implements OnInit{
    actors!: Actor[];
    stores!: Store[];

    noStores!: boolean;
    validRent!: boolean;
    confirm!: boolean;
    inRented!: boolean;

    user!: User;

    today!: Date;
    tomorrow!: Date;
    afterTomorrow!: Date;

    film: Film = {};
    selectedStore: Store = {store_id: -1, city: "Store"};
    selectedDate!: Date;

    constructor(private apiService: ApiService, private loginService: LoginService, private detailsService: DetailsService) {
        this.loginService.user.subscribe(x => this.user = x!);
    }

    async ngOnInit(): Promise<void> {
        this.film = this.detailsService.getFilm();
        this.confirm = true;
        this.validRent = true;
        this.inRented = this.detailsService.getInRented();

        this.today = new Date();
        this.today.setHours(this.today.getHours() - this.today.getTimezoneOffset() / 60);
        this.tomorrow = new Date();
        this.tomorrow.setHours(this.tomorrow.getHours() - this.tomorrow.getTimezoneOffset() / 60);
        this.afterTomorrow = new Date();
        this.afterTomorrow.setHours(this.afterTomorrow.getHours() - this.afterTomorrow.getTimezoneOffset() / 60);
        this.tomorrow.setDate(this.tomorrow.getDate() + 1);
        this.afterTomorrow.setDate(this.afterTomorrow.getDate() + 2);
        this.selectedDate = this.today;

        await this.update();
    }

    async update(): Promise<void> {
        const filmDetails = await this.apiService.getFilm(this.film.film_id!);
        if (!filmDetails) {
            await this.loginService.logout(true);
        } else {
            this.film = filmDetails
            const actors = await this.apiService.getActors(this.film.film_id!);
            if (!actors) {
                await this.loginService.logout(true);
            } else {
                this.actors = actors;
                const stores = await this.apiService.getStores(this.film.film_id!);
                if (stores === null) {
                    await this.loginService.logout(true);
                } else if (stores.length === 0) {
                    this.noStores = true;
                } else {
                    this.noStores = false;
                    this.stores = stores;
                }
            }
        }
    }

    onSelectDate(date: Date) {
        this.selectedDate = date;
    }

    onSelectStore(store: Store) {
        this.selectedStore = store;
        this.validRent = false
    }

    setConfirm(val: boolean) {
        this.confirm = val;
        if (val) {
            this.selectedStore = {store_id: -1, city: "Store"};
            this.validRent = true;
        }
    }

    async rent() {
        if(this.selectedStore.store_id! > 0){
            const result = await this.apiService.putRentFilm(this.selectedStore.store_id!, this.film.film_id!, this.selectedDate.toISOString(), this.user.customer_id!);
            if (!result){
                await this.loginService.logout(true);
            }
        }
    }
}
