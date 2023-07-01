import {Component} from '@angular/core';

import {Actor, Film, Login} from "../utilities/typeDB";
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
    selectedFilter = "Filtro";

    selectedReturnDate: Boolean = false;
    selectedTitle: Boolean = false;
    selectedGenre: Boolean = false;
    selectedRentalDate: Boolean = true;

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
                this.loginService.logout();
            } else {
                this.count = result.count;
                this.films = result.films;
            }
        } else if (this.selectedGenre) {
            const result = await this.apiService.getFilms_user_genre(this.offset, this.user.customer_id!);
            if (!result) {
                this.loginService.logout();
            } else {
                this.count = result.count;
                this.films = result.films;
            }
        } else if (this.selectedReturnDate) {
            const result = await this.apiService.getFilms_user(this.offset, this.user.customer_id!);
            if (!result) {
                this.loginService.logout();
            } else {
                this.count = result.count;
                this.films = result.films;
            }
        } else if (this.selectedRentalDate) {
            const result = await this.apiService.getFilms_user_rental_date(this.offset, this.user.customer_id!);
            if (!result) {
                this.loginService.logout();
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
            this.loginService.logout();
        }
        this.selectedFilm = result;
        const result1 = await this.apiService.getActors(film.film_id!);
        if (!result1) {
            this.loginService.logout();
        }
        this.actors = result1;
    }

    async jump(index: number): Promise<void> {
        this.offset = index * 10;
        this.current_page = index;
        await this.updateFilms();
    }

    async sortByTitle() {
        this.selectedFilter = "Titolo";
        this.selectedTitle = true;
        this.selectedGenre = false;
        this.selectedReturnDate = false;
        this.selectedRentalDate = false;
        await this.updateFilms()
    }

    async sortByGenre() {
        this.selectedFilter = "Genere";
        this.selectedTitle = false;
        this.selectedGenre = true;
        this.selectedReturnDate = false;
        this.selectedRentalDate = false;
        await this.updateFilms()
    }

    async sortByReturnDate() {
        this.selectedFilter = "Data Riconsegna";
        this.selectedTitle = false;
        this.selectedGenre = false;
        this.selectedReturnDate = true;
        this.selectedRentalDate = false;
        await this.updateFilms()
    }

    async sortByRentedDate() {
        this.selectedFilter = "Data noleggio";
        this.selectedTitle = false;
        this.selectedGenre = false;
        this.selectedReturnDate = false;
        this.selectedRentalDate = true;
        await this.updateFilms()
    }

    calculateCost(rental_date: Date, return_date: Date, rental_rate: number) {
        const rentalDate = new Date(rental_date);
        const returnDate = new Date(return_date);
        const days = Math.ceil((returnDate.getTime() - rentalDate.getTime()) / 86400000);
        return days * rental_rate;
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
