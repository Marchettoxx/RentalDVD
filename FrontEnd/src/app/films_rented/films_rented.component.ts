import { Component } from '@angular/core';

import { Film, Login } from "../utilities/typeDB";
import { ApiService } from "../services/api.service";
import { LoginService } from "../services/login.service";

@Component({
  selector: 'app-films_rented',
  templateUrl: './films_rented.component.html',
  styleUrls: ['./films_rented.component.css']
})
export class Films_rentedComponent {
  offset: number = 0;
  count: number = 0;
  diff: number = 0;
  current_page: number = 0;

  user!: Login;

  films: Film[] | null = null;
  selectedFilm: Film = {};
  selectedReturnDate: Boolean = false;
  selectedTitle: Boolean = false;
  selectedGenre: Boolean = false;
  selectedRentedDate: Boolean = true;

  constructor(private loginService: LoginService, private apiService: ApiService) {
    this.loginService.user.subscribe(x => this.user = x!);
  }

  async ngOnInit(): Promise<void> {
    await this.updateFilms();
  }

  async updateFilms() {
    if(this.selectedTitle){
      const result = await this.apiService.getFilms_user_title(this.offset, this.user.customer_id);
      this.count = result.count;
      this.films = result.filmArray;
    }
    else if(this.selectedGenre){
      const result = await this.apiService.getFilms_user_genre(this.offset, this.user.customer_id);
      this.count = result.count;
      this.films = result.filmArray;
    }
    else if(this.selectedReturnDate){
      const result = await this.apiService.getFilms_user(this.offset, this.user.customer_id);
      this.count = result.count;
      this.films = result.filmArray;
    }
    else if(this.selectedRentedDate){
      const result = await this.apiService.getFilms_user_rental_date(this.offset, this.user.customer_id);
      this.count = result.count;
      this.films = result.filmArray;
    }
  }

  showPrevious(n: number) {
    return this.offset - n > 0;
  }

  showNext(n: number) {
    return this.offset + 10 + n < this.count;
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

  onSelect(film: Film): void {
    this.selectedFilm = film;
  }

  async jump(index: number): Promise<void> {
    this.offset = index * 10;
    this.current_page = index;
    await this.updateFilms();
  }

  async sortByTitle(){
    this.selectedTitle=true;
    this.selectedGenre=false;
    this.selectedReturnDate=false;
    this.selectedRentedDate=false;
    await this.updateFilms()
  }

  async sortByGenre(){
    this.selectedTitle=false;
    this.selectedGenre=true;
    this.selectedReturnDate=false;
    this.selectedRentedDate=false;
    await this.updateFilms()
  }

  async sortByReturnDate(){
    this.selectedTitle=false;
    this.selectedGenre=false;
    this.selectedReturnDate=true;
    this.selectedRentedDate=false;
    await this.updateFilms()
  }

  async sortByRentedDate(){
    this.selectedTitle=false;
    this.selectedGenre=false;
    this.selectedReturnDate=false;
    this.selectedRentedDate=true;
    await this.updateFilms()
  }

  calculateCost(rental_date: Date, return_date: Date, rental_rate: number){
    const rentalDate= new Date (rental_date);
    const returnDate= new Date (return_date);
    const days = Math.ceil((returnDate.getTime() - rentalDate.getTime())/86400000);
    return days * rental_rate;
  }

}
