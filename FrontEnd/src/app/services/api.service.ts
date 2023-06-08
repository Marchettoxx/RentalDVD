import { Injectable } from '@angular/core';
import { Apollo, gql, QueryRef } from 'apollo-angular';

import {Login, Films, Film, Categories, Stores} from '../utilities/typeDB';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private loginQuery: QueryRef<{login: Login}, {username: string, password: string}>;
  private filmsQuery: QueryRef<{films: Films}, {offset: number}>;
  private films_categoryQuery: QueryRef<{films_category: Films}, {offset: number, category_id: number}>;
  private films_userQuery: QueryRef<{films_user: Films}, {offset: number, customer_id: number}>;
  private films_user_searchQuery: QueryRef<{films_user_search: Films}, {customer_id: number, title: string}>;
  private films_user_categoryQuery: QueryRef<{films_user_category: Films}, {offset: number, customer_id: number, category_id: number}>;
  private films_user_in_rentQuery: QueryRef<{films_user: Films}, {offset: number, customer_id: number}>;
  private filmQuery: QueryRef<{film: Film}, {film_id: number}>;
  private categoriesQuery: QueryRef<{categories: Categories}>;
  private storesQuery: QueryRef<{stores_available: Stores}, {film_id: number}>;
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
    this.films_categoryQuery = this.apollo.watchQuery({
      query: gql`query films_category($offset: Int!, $category_id: Int!){
        films_category(offset: $offset, category_id: $category_id){
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
    this.films_user_searchQuery = this.apollo.watchQuery({
      query: gql`query films_user_search($customer_id: Int!, $title: String!){
        films_user_search(customer_id: $customer_id, title: $title){
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
    this.films_user_categoryQuery = this.apollo.watchQuery({
      query: gql`query films_user_category($offset: Int!, $customer_id: Int!, $category_id: Int!){
        films_user_category(offset: $offset, customer_id: $customer_id, category_id: $category_id){
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
    this.categoriesQuery = this.apollo.watchQuery({
      query: gql`query categories{
        categories{
          categoryArray {
            category_id
            name
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
    this.storesQuery = this.apollo.watchQuery({
      query: gql`query stores_available($film_id: Int!){
        stores_available(film_id: $film_id){
          stores{
            city
          }
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

  async getFilms_category(offset: number, category_id: number): Promise<Films> {
    const result = await this.films_categoryQuery.refetch({ offset, category_id });
    return result.data.films_category;
  }

  async getFilms_user(offset: number, customer_id: number): Promise<Films> {
    const result = await this.films_userQuery.refetch({ offset, customer_id });
    return result.data.films_user;
  }

  async getFilms_user_search(customer_id: number, title: string): Promise<Film[]> {
    const result = await this.films_user_searchQuery.refetch({ customer_id, title });
    const temp = result.data.films_user_search;
    return temp.filmArray;
  }

  async getFilms_user_category(offset: number, customer_id: number, category_id: number): Promise<Films> {
    const result = await this.films_user_categoryQuery.refetch({ offset, customer_id, category_id });
    return result.data.films_user_category;
  }

  async getFilms_user_in_rent(offset: number, customer_id: number): Promise<Films> {
    const result = await this.films_user_in_rentQuery.refetch({ offset, customer_id });
    return result.data.films_user;
  }

  async getFilm(film_id: number): Promise<Film> {
    const result = await this.filmQuery.refetch({ film_id });
    return result.data.film;
  }

  async getCategories(): Promise<Categories> {
    const result = await this.categoriesQuery.refetch();
    return result.data.categories;
  }

  async getStores(film_id: number): Promise<Stores> {
    const result = await this.storesQuery.refetch({film_id});
    return result.data.stores_available;
  }
}
