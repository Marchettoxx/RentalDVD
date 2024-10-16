import {Component, OnInit} from '@angular/core';
import { debounceTime, distinctUntilChanged, Observable, of, Subject, switchMap } from "rxjs";

import {Category, Film, User} from "../utilities/typeDB";
import {ApiService} from "../services/api.service";
import {LoginService} from "../services/login.service";
import {MatDialog} from "@angular/material/dialog";
import {DetailsFilmComponent} from "../details-film/details-film.component";
import {DetailsService} from "../services/details.service";
import {PageEvent} from "@angular/material/paginator";

@Component({
    selector: 'app-films',
    templateUrl: './films.html',
    styleUrls: ['./films.css']
})
export class Films implements OnInit {
    rented!: boolean;
    rentedFilmTitle!: string;
    research: boolean = true;

    fontSize: number = 1;
    isIncreased: boolean = false;

    user!: User;

    films?: Film[];
    categories?: Category[];
    selectedCategory: Category = {category_id: -1, name: "Categories"};

    films$?: Observable<Film[]>;
    private searchTerms = new Subject<string>();

    gotoTop() {
        window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }

    // aggiunto per paginator
    length!: number;
    offset: number = 0;
    pageSize = 10;
    pageIndex = 0;
    hidePageSize = true;
    showFirstLastButtons = true;

    pageEvent!: PageEvent;

    // aggiunto per search
    searchString!: string;

    clearSearch() {
        this.searchString = '';
        this.searchTerms.next("");
    }

    async handlePageEvent(e: PageEvent) {
        this.pageEvent = e;
        this.length = e.length;
        this.pageSize = e.pageSize;
        this.pageIndex = e.pageIndex;
        await this.jump();
    }

    constructor(private apiService: ApiService, private loginService: LoginService, public dialog: MatDialog, public detailsService: DetailsService) {
        this.loginService.user.subscribe(x => this.user = x!);
    }

    openDialog(value: Film) {
        this.detailsService.setSize(this.fontSize);
        this.detailsService.setInRented(false);
        this.detailsService.setFilm(value);
        this.research = true;
        const dialogRef = this.dialog.open(DetailsFilmComponent);

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.rented = true;
                this.rentedFilmTitle = result;
                this.gotoTop();
            }
            this.clearSearch();
        });
    }

    async ngOnInit(): Promise<void> {
        this.rented = false;
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
        const categories = await this.apiService.getCategories();
        if (!categories) {
            await this.loginService.logout(true);
        }
        this.categories = categories;
    }

    async updateFilms() {
        if (this.selectedCategory.category_id! > 0) {
            const listFilmsCategory = await this.apiService.getFilms_category(this.offset, this.selectedCategory.category_id!);
            if (!listFilmsCategory) {
                await this.loginService.logout(true);
            } else {
                this.length = listFilmsCategory.count!;
                this.films = listFilmsCategory.films;
            }
        } else {
            const listFilms = await this.apiService.getFilms(this.offset);
            if (!listFilms) {
                await this.loginService.logout(true);
            } else {
                this.length = listFilms.count!;
                this.films = listFilms.films;
            }
        }
    }

    async jump(): Promise<void> {
        this.offset = this.pageIndex * 10;
        await this.updateFilms();
    }

    async filter(category: Category) {
        this.selectedCategory = category;
        this.pageIndex = 0;
        this.offset = 0;
        await this.updateFilms();
    }

    async noFilter() {
        this.selectedCategory = {category_id: -1, name: "Categories"};
        await this.updateFilms();
    }

    search(term: string): void {
        this.searchTerms.next(term);
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
