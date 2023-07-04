import {Component} from '@angular/core';

import {Actor, Film, Interval, Login} from "../utilities/typeDB";
import {ApiService} from "../services/api.service";
import {LoginService} from "../services/login.service";

@Component({
    selector: 'app-films_rented',
    templateUrl: './films_rented.component.html',
    styleUrls: ['./films_rented.component.css']
})
export class Films_rentedComponent {
    offset: number = 0;
    count?: number = 0;
    current_page: number = 0;

    fontSize: number = 1;
    isIncreased: boolean = false;

    user!: Login;

    films?: Film[];
    selectedFilm: Film = {};
    selectedFilter: string = "Filtro";

    selectedReturnDate: Boolean = false;
    selectedTitle: Boolean = false;
    selectedRentalDate: Boolean = true;
    selectedAmount: Boolean = false;
    selectedDuration: Boolean = false;

    actors?: Actor[];

    constructor(private loginService: LoginService, private apiService: ApiService) {
        this.loginService.user.subscribe(x => this.user = x!);
    }

    async ngOnInit(): Promise<void> {
        await this.updateFilms();
    }

    async updateFilms() {
        if (this.selectedTitle) {
            const result = await this.apiService.getFilms_user_title(this.offset, this.user.customer_id!);
            if (!result) {
                await this.loginService.logout(true);
            } else {
                this.count = result.count;
                this.films = result.films;
            }
        } else if (this.selectedReturnDate) {
            const result = await this.apiService.getFilms_user(this.offset, this.user.customer_id!);
            if (!result) {
                await this.loginService.logout(true);
            } else {
                this.count = result.count;
                this.films = result.films;
            }
        } else if (this.selectedRentalDate) {
            const result = await this.apiService.getFilms_user_rental_date(this.offset, this.user.customer_id!);
            if (!result) {
                await this.loginService.logout(true);
            } else {
                this.count = result.count;
                this.films = result.films;
            }
        } else if (this.selectedAmount) {
            const result = await this.apiService.getFilms_user_amount(this.offset, this.user.customer_id!);
            if (!result) {
                await this.loginService.logout(true);
            } else {
                this.count = result.count;
                this.films = result.films;
            }
        } else if (this.selectedDuration) {
            const result = await this.apiService.getFilms_user_duration(this.offset, this.user.customer_id!);
            if (!result) {
                await this.loginService.logout(true);
            } else {
                this.count = result.count;
                this.films = result.films;
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
        this.selectedAmount = false;
        this.selectedDuration = false;
        await this.updateFilms()
    }

    async sortByReturnDate() {
        this.selectedFilter = "Data Riconsegna";
        this.selectedTitle = false;
        this.selectedReturnDate = true;
        this.selectedRentalDate = false;
        this.selectedAmount = false;
        this.selectedDuration = false;
        await this.updateFilms()
    }

    async sortByRentedDate() {
        this.selectedFilter = "Data noleggio";
        this.selectedTitle = false;
        this.selectedReturnDate = false;
        this.selectedRentalDate = true;
        this.selectedAmount = false;
        this.selectedDuration = false;
        await this.updateFilms()
    }

    async sortByAmount() {
        this.selectedFilter = "Spesa";
        this.selectedTitle = false;
        this.selectedReturnDate = false;
        this.selectedRentalDate = false;
        this.selectedAmount = true;
        this.selectedDuration = false;
        await this.updateFilms()
    }

    async sortByDuration() {
        this.selectedFilter = "Durata";
        this.selectedTitle = false;
        this.selectedReturnDate = false;
        this.selectedRentalDate = false;
        this.selectedAmount = false;
        this.selectedDuration = true;
        await this.updateFilms()
    }

    dataIsNull(return_date: Date){
        if(return_date == null){
            return;
        } else {
            return return_date;
        }
    }

    amountIsNull(amount: number){
        if(amount == null){
            return '-';
        } else {
            return amount + ' €';
        }
    }

    durationIsNull(duration: Interval){
        if(duration == null){
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
