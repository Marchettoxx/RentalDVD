import { Injectable } from '@angular/core';
import { Apollo, gql, QueryRef } from 'apollo-angular';
import {Login, Films, Film} from '../utilities/typeDB';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private loginQuery: QueryRef<{login: Login}, {username: string, password: string}>;
  private filmsQuery: QueryRef<{films: Films}, {offset: number}>;
  private films_userQuery: QueryRef<{films_user: Films}, {offset: number, customer_id: number}>;
  private films_user_in_rentQuery: QueryRef<{films_user: Films}, {offset: number, customer_id: number}>;
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
    this.films_userQuery = this.apollo.watchQuery({
      query: gql`query films_user($offset: Int!, $customer_id: Int!){
        films_user(offset: $offset, customer_id: $customer_id){
          count
          filmArray {
            film_id
            title
            release_year
            rating
            genre
            language
            description
            return_date
          }
        }
      }`
    });
    this.films_user_in_rentQuery = this.apollo.watchQuery({
      query: gql`query films_user_in_rent($offset: Int!, $customer_id: Int!){
        films_user_in_rent(offset: $offset, customer_id: $customer_id){
          count
          filmArray {
            film_id
            title
            release_year
            rating
            genre
            language
            description
            return_date
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

  async getFilms_user(offset: number, customer_id: number): Promise<Films> {
    const result = await this.films_userQuery.refetch({ offset, customer_id });
    return result.data.films_user;
  }

  async getFilms_user_in_rent(offset: number, customer_id: number): Promise<Films> {
    const result = await this.films_user_in_rentQuery.refetch({ offset, customer_id });
    return result.data.films_user;
  }

  async getFilm(film_id: number): Promise<Film> {
    const result = await this.filmQuery.refetch({ film_id });
    return result.data.film;
  }

}
