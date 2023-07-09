import {Component, OnInit} from '@angular/core';
import { debounceTime, distinctUntilChanged, Observable, of, Subject, switchMap } from "rxjs";

import {Category, Film, User} from "../utilities/typeDB";
import {ApiService} from "../services/api.service";
import {LoginService} from "../services/login.service";
import {MatDialog} from "@angular/material/dialog";
import {DetailsFilmComponent} from "../details-film/details-film.component";
import {DetailsService} from "../services/details.service";
import {LiveAnnouncer} from "@angular/cdk/a11y";

@Component({
    selector: 'app-films',
    templateUrl: './films.html',
    styleUrls: ['./films.css']
})
export class Films implements OnInit {
    offset: number = 0;
    count?: number = 0;
    current_page: number = 0;
    rented!: boolean;
    rentedFilmTitle!: string;
    error: boolean = false;

    fontSize: number = 1;
    isIncreased: boolean = false;

    user!: User;

    films?: Film[];
    categories?: Category[];
    selectedCategory: Category = {category_id: -1, name: "Categorie"};

    films$?: Observable<Film[]>;
    private searchTerms = new Subject<string>();

    constructor(private apiService: ApiService, private loginService: LoginService, public dialog: MatDialog, public detailsService: DetailsService, liveAnnouncer: LiveAnnouncer) {
        liveAnnouncer.announce("Film nello store");
        this.loginService.user.subscribe(x => this.user = x!);
    }

    openDialog(value: Film) {
        this.detailsService.setInRented(false);
        this.detailsService.setFilm(value);
        const dialogRef = this.dialog.open(DetailsFilmComponent);

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.rented = true;
                this.rentedFilmTitle = result;
            }
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
                this.count = listFilmsCategory.count;
                this.films = listFilmsCategory.films;
            }
        } else {
            const listFilms = await this.apiService.getFilms(this.offset);
            if (!listFilms) {
                await this.loginService.logout(true);
            } else {
                this.count = listFilms.count;
                this.films = listFilms.films;
            }
        }
    }

    showPrevious(pos: number) {
        return this.offset - pos > 0;
    }

    showNext(pos: number) {
        return this.offset + 10 + pos < this.count!;
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

    async jump(index: number): Promise<void> {
        this.offset = index * 10;
        this.current_page = index;
        await this.updateFilms();
    }

    async filter(category: Category) {
        this.selectedCategory = category;
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
