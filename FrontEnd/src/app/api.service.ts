import { Injectable } from '@angular/core';
import { Apollo, gql, QueryRef } from 'apollo-angular';
import {Login, Films, Film} from './typeDB';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private loginQuery: QueryRef<{login: Login}, {username: string, password: string}>;
  private filmsQuery: QueryRef<{films: Films}, {offset: number}>;
  private filmQuery: QueryRef<{film: Film}, {film_id: number}>;
  constructor(private apollo: Apollo) {
    this.loginQuery = this.apollo.watchQuery({
      query: gql`query login($username: String!, $password: String!) {
        login(username:$username, password:$password){
          customer_id
        }
      }`
    });
    this.filmsQuery = this.apollo.watchQuery({
      query: gql`query films($offset: Int!){
        films(offset: $offset){
          count
          filmArray {
            film_id
            title
            release_year
            rating
            genre
            language
            description
          }
        }
      }`
    });
    this.filmQuery = this.apollo.watchQuery({
      query: gql`query film($film_id: Int!){
        film(film_id: $film_id){
            film_id
            title
            release_year
            rating
            genre
            language
            rental_rate
          }
      }`
    });
  }

  async getLogin(username: string, password: string): Promise<Login> {
    const result = await this.loginQuery.refetch({ username, password});
    return result.data.login;
  }

  async getFilms(offset: number): Promise<Films> {
    const result = await this.filmsQuery.refetch({ offset });
    return result.data.films;
  }

  async getFilm(film_id: number): Promise<Film> {
    const result = await this.filmQuery.refetch({ film_id });
    return result.data.film;
  }

}
