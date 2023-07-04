import {Component, OnInit} from '@angular/core';
import {debounceTime, distinctUntilChanged, Observable, of, Subject, switchMap} from "rxjs";

import {Actor, Category, Film, Store, User} from "../utilities/typeDB";
import {ApiService} from "../services/api.service";
import {LoginService} from "../services/login.service";

@Component({
    selector: 'app-films',
    templateUrl: './films.html',
    styleUrls: ['./films.css']
})
export class Films implements OnInit {
    offset: number = 0;
    count: number = 0;
    current_page: number = 0;
    fontSize: number = 1;

    today!: Date;
    tomorrow!: Date;
    afterTomorrow!: Date;
    selectedDate!: Date;

    rented: boolean = false;
    error: boolean = false;
    validRent: boolean = true;
    isIncreased: boolean = false;

    user!: User;

    rentedFilm!: Film;
    films!: Film[];
    selectedFilm!: Film;
    categories!: Category[];
    selectedCategory: Category = {category_id: -1, name: "Categorie"};
    stores!: Store[];
    selectedStore: Store = {store_id: -1, city: "Store", address: ""};

    actors!: Actor[];

    films$!: Observable<Film[]>;
    private searchTerms = new Subject<string>();

    constructor(private apiService: ApiService, private loginService: LoginService) {
        this.loginService.user.subscribe(x => this.user = x!);
    }

    async ngOnInit(): Promise<void> {
        this.today = new Date();
        this.today.setHours(this.today.getHours() - this.today.getTimezoneOffset() / 60);
        this.tomorrow = new Date();
        this.tomorrow.setHours(this.tomorrow.getHours() - this.tomorrow.getTimezoneOffset() / 60);
        this.afterTomorrow = new Date();
        this.afterTomorrow.setHours(this.afterTomorrow.getHours() - this.afterTomorrow.getTimezoneOffset() / 60);
        this.tomorrow.setDate(this.tomorrow.getDate() + 1);
        this.afterTomorrow.setDate(this.afterTomorrow.getDate() + 2);
        this.selectedDate = this.today;
        this.films$ = this.searchTerms.pipe(
            // wait 300ms after each keystroke before considering the term
            debounceTime(300),
            // ignore new term if same as previous term
            distinctUntilChanged(),
            // switch to new search observable each time the term changes
            switchMap((term: string) => {
                if (!term.trim()) {
                    // if not search term, return empty hero array.
                    return of([]);
                } else {
                    return this.apiService.getFilms_search(term);
                }
            })
        );
        await this.updateFilms();
        const result = await this.apiService.getCategories();
        if (!result) {
            await this.loginService.logout(true);
        }
        this.categories = result;
    }

    async updateFilms() {
        if (this.selectedCategory.category_id! > 0) {
            const result = await this.apiService.getFilms_category(this.offset, this.selectedCategory.category_id!);
            if (!result) {
                await this.loginService.logout(true);
            } else {
                this.count = result.count;
                this.films = result.films;
            }
        } else {
            const result = await this.apiService.getFilms(this.offset);
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
            this.selectedFilm = result
            const result1 = await this.apiService.getActors(film.film_id!);
            if (!result1) {
                await this.loginService.logout(true);
            } else {
                this.actors = result1;
                const result2 = await this.apiService.getStores(film.film_id!);
                if (!result2) {
                    await this.loginService.logout(true);
                } else {
                    this.stores = result2;
                }
            }
        }
    }

    async jump(index: number): Promise<void> {
        this.offset = index * 10;
        this.current_page = index;
        await this.updateFilms();
    }

    async filter(category: Category) {
        this.selectedCategory = category;
        await this.updateFilms();
    }

    selectStore(store: Store) {
        this.selectedStore = store;
        this.validRent = false
    }

    search(term: string): void {
        this.searchTerms.next(term);
    }

    onSelectDate(date: Date) {
        this.selectedDate = date;
    }

    async rent() {
        if (this.selectedStore.store_id! > 0) {
            this.rented = true;
            this.rentedFilm = this.selectedFilm;
            const result = await this.apiService.putRentFilm(this.selectedStore.store_id!, this.selectedFilm.film_id!, this.selectedDate.toISOString(), this.user.customer_id!);
            if (!result) {
                await this.loginService.logout(true);
            } else {
                setTimeout(() => {
                    this.rented = false;
                }, 3000)
                setTimeout(() => {
                    this.validRent = true
                }, 1000)
                this.selectedStore = {store_id: -1, city: "Store", address:""}
            }
        } else {
            this.error = true
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
