import {Component} from '@angular/core';

import {Actor, Amount, Film, Interval, User} from "../utilities/typeDB";
import {ApiService} from "../services/api.service";
import {LoginService} from "../services/login.service";
import {DetailsFilmComponent} from "../details-film/details-film.component";
import {MatDialog} from "@angular/material/dialog";
import {DetailsService} from "../services/details.service";
import {LiveAnnouncer} from "@angular/cdk/a11y";

@Component({
    selector: 'app-films_rented',
    templateUrl: './films_rented.component.html',
    styleUrls: ['./films_rented.component.css']
})
export class Films_rentedComponent {
    offset: number = 0;
    count: number = 0;
    current_page: number = 0;
    fontSize: number = 1;
    totalAmount: Amount = {};

    user!: User;
    actors!: Actor[];
    films!: Film[];
    selectedFilm: Film = {};
    selectedFilter: string = "Filtro";

    isIncreased: boolean = false;

    selectedReturnDate: Boolean = false;
    selectedTitle: Boolean = false;
    selectedRentalDate: Boolean = false;
    selectedAmountASC: Boolean = false;
    selectedAmountDESC: Boolean = false;
    selectedDuration: Boolean = false;

    constructor(private loginService: LoginService, private apiService: ApiService, public dialog: MatDialog, public detailsService: DetailsService, liveAnnouncer: LiveAnnouncer) {
        liveAnnouncer.announce("I tuoi film noleggiati");
        this.loginService.user.subscribe(x => this.user = x!);
    }

    openDialog(value: Film, ) {
        this.detailsService.setFilm(value);
        this.detailsService.setInRented(true);
        this.dialog.open(DetailsFilmComponent);
    }

    async ngOnInit(): Promise<void> {
        await this.updateFilms();
        const total_amount = await this.apiService.getTotal_amount(this.user.customer_id!);
        if (!total_amount) {
            await this.loginService.logout(true);
        } else {
            this.totalAmount = total_amount;
        }
    }

    async updateFilms() {
        if (this.selectedTitle) {
            const result = await this.apiService.getFilms_user_title(this.offset, this.user.customer_id!);
            if (!result) {
                await this.loginService.logout(true);
            } else {
                this.count = result.count!;
                this.films = result.films!;
            }
        } else if (this.selectedReturnDate) {
            const result = await this.apiService.getFilms_user_return_date(this.offset, this.user.customer_id!);
            if (!result) {
                await this.loginService.logout(true);
            } else {
                this.count = result.count!;
                this.films = result.films!;
            }
        } else if (this.selectedRentalDate) {
            const result = await this.apiService.getFilms_user_rental_date(this.offset, this.user.customer_id!);
            if (!result) {
                await this.loginService.logout(true);
            } else {
                this.count = result.count!;
                this.films = result.films!;
            }
        } else if (this.selectedAmountASC) {
            const result = await this.apiService.getFilms_user_amount_ASC(this.offset, this.user.customer_id!);
            if (!result) {
                await this.loginService.logout(true);
            } else {
                this.count = result.count!;
                this.films = result.films!;
            }
        } else if (this.selectedAmountDESC) {
            const result = await this.apiService.getFilms_user_amount_DESC(this.offset, this.user.customer_id!);
                if (!result) {
                await this.loginService.logout(true);
            } else {
                this.count = result.count!;
                this.films = result.films!;
            }
        } else if (this.selectedDuration) {
            const result = await this.apiService.getFilms_user_duration(this.offset, this.user.customer_id!);
            if (!result) {
                await this.loginService.logout(true);
            } else {
                this.count = result.count!;
                this.films = result.films!;
            }
        } else {
            const result = await this.apiService.getFilms_user(this.offset, this.user.customer_id!);
            if (!result) {
                await this.loginService.logout(true);
            } else {
                this.count = result.count!;
                this.films = result.films!;
            }
        }
    }

    showPrevious(n: number) {
        return this.offset - n > 0;
    }

    showNext(n: number) {
        return this.offset + 10 + n < this.count!;
    }

    async onPrevious() {
        this.offset -= 10;
        this.current_page = this.offset / 10;
        await this.updateFilms();
    }

    async onNext() {
        this.offset += 10
        this.current_page = this.offset / 10;
        await this.updateFilms();
    }

    async onSelect(film: Film): Promise<void> {
        const result = await this.apiService.getFilm(film.film_id!);
        if (!result) {
            await this.loginService.logout(true);
        } else {
            this.selectedFilm = result;
            const result1 = await this.apiService.getActors(film.film_id!);
            if (!result1) {
                await this.loginService.logout(true);
            } else {
                this.actors = result1;
            }
        }
    }

    async jump(index: number): Promise<void> {
        this.offset = index * 10;
        this.current_page = index;
        await this.updateFilms();
    }

    async sortByTitle() {
        this.selectedFilter = "Titolo";
        this.selectedTitle = true;
        this.selectedReturnDate = false;
        this.selectedRentalDate = false;
        this.selectedAmountASC = false;
        this.selectedAmountDESC = false;
        this.selectedDuration = false;
        await this.updateFilms()
    }

    async sortByReturnDate() {
        this.selectedFilter = "Data Riconsegna";
        this.selectedTitle = false;
        this.selectedReturnDate = true;
        this.selectedRentalDate = false;
        this.selectedAmountASC = false;
        this.selectedAmountDESC = false;
        this.selectedDuration = false;
        await this.updateFilms()
    }

    async sortByRentedDate() {
        this.selectedFilter = "Data noleggio";
        this.selectedTitle = false;
        this.selectedReturnDate = false;
        this.selectedRentalDate = true;
        this.selectedAmountASC = false;
        this.selectedAmountDESC = false;
        this.selectedDuration = false;
        await this.updateFilms()
    }

    async sortByAmountASC() {
        this.selectedFilter = "Spesa";
        this.selectedTitle = false;
        this.selectedReturnDate = false;
        this.selectedRentalDate = false;
        this.selectedAmountASC = true;
        this.selectedAmountDESC = false;
        this.selectedDuration = false;
        await this.updateFilms()
    }

    async sortByAmountDESC() {
        this.selectedFilter = "Spesa";
        this.selectedTitle = false;
        this.selectedReturnDate = false;
        this.selectedRentalDate = false;
        this.selectedAmountASC = false;
        this.selectedAmountDESC = true;
        this.selectedDuration = false;
        await this.updateFilms()
    }

    async sortByDuration() {
        this.selectedFilter = "Durata";
        this.selectedTitle = false;
        this.selectedReturnDate = false;
        this.selectedRentalDate = false;
        this.selectedAmountASC = false;
        this.selectedAmountDESC = false;
        this.selectedDuration = true;
        await this.updateFilms()
    }

    dataIsNull(return_date: Date){
        if(return_date === null){
            return;
        } else {
            return return_date;
        }
    }

    amountIsNull(amount: number){
        if(amount === null){
            return '-';
        } else {
            return amount + ' €';
        }
    }

    durationIsNull(duration: Interval){
        if(duration === null){
            return '-';
        } else {
            return duration.days + ' giorni';
        }
    }

    increaseFontSize() {
        this.fontSize += 0.3;
        this.isIncreased = true;
    }

    decreaseFontSize() {
        this.fontSize -= 0.3;
        if (this.fontSize <= 1) {
            this.isIncreased = false;
        }
    }
}
