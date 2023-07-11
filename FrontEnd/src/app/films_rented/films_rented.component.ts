import {Component} from '@angular/core';

import {Actor, Amount, Film, Interval, listFilms, User} from "../utilities/typeDB";
import {ApiService} from "../services/api.service";
import {LoginService} from "../services/login.service";
import {DetailsFilmComponent} from "../details-film/details-film.component";
import {MatDialog} from "@angular/material/dialog";
import {DetailsService} from "../services/details.service";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {PageEvent} from "@angular/material/paginator";

@Component({
    selector: 'app-films_rented',
    templateUrl: './films_rented.component.html',
    styleUrls: ['./films_rented.component.css']
})
export class Films_rentedComponent {
    fontSize: number = 1;
    totalAmount: Amount = {};

    user!: User;
    actors!: Actor[];
    films!: Film[];
    selectedFilm: Film = {};
    selectedFilter: string = "Filter";

    isIncreased: boolean = false;

    selectedReturnDate: Boolean = false;
    selectedTitle: Boolean = false;
    selectedRentalDate: Boolean = false;
    selectedAmountASC: Boolean = false;
    selectedAmountDESC: Boolean = false;
    selectedDuration: Boolean = false;
    emptyTable!: boolean;

    // aggiunto per paginator
    length!: number;
    offset: number = 0;
    pageSize = 10;
    pageIndex = 0;
    hidePageSize = true;
    showFirstLastButtons = true;

    pageEvent!: PageEvent;

    async handlePageEvent(e: PageEvent) {
        this.pageEvent = e;
        this.length = e.length;
        this.pageSize = e.pageSize;
        this.pageIndex = e.pageIndex;
        await this.jump();
    }

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

    async fillFilms(list_films: listFilms) {
        if (!list_films) {
            await this.loginService.logout(true);
        } else {
            if (list_films.count == 0) {
                this.emptyTable = true;
            } else {
                this.emptyTable = false;
                this.length = list_films.count!;
                this.films = list_films.films!;
            }
        }
    }

    async updateFilms() {
        if (this.selectedTitle) {
            const result = await this.apiService.getFilms_user_title(this.offset, this.user.customer_id!);
            await this.fillFilms(result);
        } else if (this.selectedReturnDate) {
            const result = await this.apiService.getFilms_user_return_date(this.offset, this.user.customer_id!);
            await this.fillFilms(result);
        } else if (this.selectedRentalDate) {
            const result = await this.apiService.getFilms_user_rental_date(this.offset, this.user.customer_id!);
            await this.fillFilms(result);
        } else if (this.selectedAmountASC) {
            const result = await this.apiService.getFilms_user_amount_ASC(this.offset, this.user.customer_id!);
            await this.fillFilms(result);
        } else if (this.selectedAmountDESC) {
            const result = await this.apiService.getFilms_user_amount_DESC(this.offset, this.user.customer_id!);
            await this.fillFilms(result);
        } else if (this.selectedDuration) {
            const result = await this.apiService.getFilms_user_duration(this.offset, this.user.customer_id!);
            await this.fillFilms(result);
        } else {
            const result = await this.apiService.getFilms_user(this.offset, this.user.customer_id!);
            await this.fillFilms(result);
        }
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

    async jump(): Promise<void> {
        this.offset = this.pageIndex * 10;
        await this.updateFilms();
    }

    async sortByTitle() {
        this.selectedFilter = "Title";
        this.selectedTitle = true;
        this.selectedReturnDate = false;
        this.selectedRentalDate = false;
        this.selectedAmountASC = false;
        this.selectedAmountDESC = false;
        this.selectedDuration = false;
        await this.updateFilms()
    }

    async sortByReturnDate() {
        this.selectedFilter = "Return date";
        this.selectedTitle = false;
        this.selectedReturnDate = true;
        this.selectedRentalDate = false;
        this.selectedAmountASC = false;
        this.selectedAmountDESC = false;
        this.selectedDuration = false;
        await this.updateFilms()
    }

    async sortByRentedDate() {
        this.selectedFilter = "Rental date";
        this.selectedTitle = false;
        this.selectedReturnDate = false;
        this.selectedRentalDate = true;
        this.selectedAmountASC = false;
        this.selectedAmountDESC = false;
        this.selectedDuration = false;
        await this.updateFilms()
    }

    async sortByAmountASC() {
        this.selectedFilter = "Expense ASC";
        this.selectedTitle = false;
        this.selectedReturnDate = false;
        this.selectedRentalDate = false;
        this.selectedAmountASC = true;
        this.selectedAmountDESC = false;
        this.selectedDuration = false;
        await this.updateFilms()
    }

    async sortByAmountDESC() {
        this.selectedFilter = "Expense DESC";
        this.selectedTitle = false;
        this.selectedReturnDate = false;
        this.selectedRentalDate = false;
        this.selectedAmountASC = false;
        this.selectedAmountDESC = true;
        this.selectedDuration = false;
        await this.updateFilms()
    }

    async sortByDuration() {
        this.selectedFilter = "Duration";
        this.selectedTitle = false;
        this.selectedReturnDate = false;
        this.selectedRentalDate = false;
        this.selectedAmountASC = false;
        this.selectedAmountDESC = false;
        this.selectedDuration = true;
        await this.updateFilms()
    }

    async sortByNothing() {
        this.selectedFilter = "Filter";
        this.selectedTitle = false;
        this.selectedReturnDate = false;
        this.selectedRentalDate = false;
        this.selectedAmountASC = false;
        this.selectedAmountDESC = false;
        this.selectedDuration = false;
        await this.updateFilms()
    }

    dataIsNull(return_date: Date){
        if(!return_date){
            return;
        } else {
            return return_date;
        }
    }

    amountIsNull(amount: number){
        if(!amount){
            return '-';
        } else {
            return amount + ' €';
        }
    }

    durationIsNull(duration: Interval){
        if(!duration){
            return '-';
        } else {
            return duration.days + ' days';
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
