import {Injectable} from '@angular/core';
import {Apollo, gql, QueryRef} from 'apollo-angular';

import {Login, Film, Store, Actor, listFilms, Category} from '../utilities/typeDB';
import {HttpHeaders} from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    private loginQuery: QueryRef<{ login: Login }, { username: string, password: string }>;
    private filmsQuery: QueryRef<{ films: listFilms }, { offset: number }>;
    private films_categoryQuery: QueryRef<{ films_category: listFilms }, { offset: number, category_id: number }>;
    private films_userQuery: QueryRef<{ films_user: listFilms }, { offset: number, customer_id: number }>;
    private films_user_rental_dateQuery: QueryRef<{ films_user_rental_date: listFilms }, {
        offset: number,
        customer_id: number
    }>;
    private films_user_titleQuery: QueryRef<{ films_user_title: listFilms }, { offset: number, customer_id: number }>;
    private films_user_genreQuery: QueryRef<{ films_user_genre: listFilms }, { offset: number, customer_id: number }>;
    private films_searchQuery: QueryRef<{ films_search: Film[] }, { title: string }>;
    private filmQuery: QueryRef<{ film: Film }, { film_id: number }>;
    private actorsQuery: QueryRef<{ actors: Actor[] }, { film_id: number }>;
    private categoriesQuery: QueryRef<{ categories: Category[] }>;
    private storesQuery: QueryRef<{ stores_available: Store[] }, { film_id: number }>;

    constructor(private apollo: Apollo) {
        const user = JSON.parse(sessionStorage.getItem('user')!);
        const token = user ? user.token : "NO_TOKEN";
        console.log("TOKEN", token);

        this.loginQuery = this.apollo.watchQuery({
            query: gql`query login($username: String!, $password: String!) {
                login(username:$username, password: $password){
                    customer_id
                    username
                    token
                }
            }`,
            context: {
                headers: new HttpHeaders().set("authorization", "LOGIN"),
            }
        });

        this.filmsQuery = this.apollo.watchQuery({
            query: gql`query films($offset: Int!){
                films(offset: $offset){
                    count
                    films {
                        film_id
                        title
                        release_year
                        rating
                        genre
                        language
                        rental_rate
                    }
                }
            }`,
            context: {
                headers: new HttpHeaders().set("authorization", token),
            }
        });

        this.films_categoryQuery = this.apollo.watchQuery({
            query: gql`query films_category($offset: Int!, $category_id: Int!){
                films_category(offset: $offset, category_id: $category_id){
                    count
                    films {
                        film_id
                        title
                        release_year
                        rating
                        genre
                        language
                        rental_rate
                    }
                }
            }`,
            context: {
                headers: new HttpHeaders().set("authorization", token),
            }
        });

        this.films_userQuery = this.apollo.watchQuery({
            query: gql`query films_user($offset: Int!, $customer_id: Int!){
                films_user(offset: $offset, customer_id: $customer_id){
                    count
                    films {
                        film_id
                        title
                        genre
                        rental_date
                        return_date
                        rental_rate
                    }
                }
            }`,
            context: {
                headers: new HttpHeaders().set("authorization", token),
            }
        });

        this.films_user_rental_dateQuery = this.apollo.watchQuery({
            query: gql`query films_user_rental_date($offset: Int!, $customer_id: Int!){
                films_user_rental_date(offset: $offset, customer_id: $customer_id){
                    count
                    films {
                        film_id
                        title
                        genre
                        rental_date
                        return_date
                        rental_rate
                    }
                }
            }`,
            context: {
                headers: new HttpHeaders().set("authorization", token),
            }
        });

        this.films_user_titleQuery = this.apollo.watchQuery({
            query: gql`query films_user_title($offset: Int!, $customer_id: Int!){
                films_user_title(offset: $offset, customer_id: $customer_id){
                    count
                    films {
                        film_id
                        title
                        genre
                        rental_date
                        return_date
                        rental_rate
                    }
                }
            }`,
            context: {
                headers: new HttpHeaders().set("authorization", token),
            }
        });

        this.films_user_genreQuery = this.apollo.watchQuery({
            query: gql`query films_user_genre($offset: Int!, $customer_id: Int!){
                films_user_genre(offset: $offset, customer_id: $customer_id){
                    count
                    films {
                        film_id
                        title
                        genre
                        rental_date
                        return_date
                        rental_rate
                    }
                }
            }`,
            context: {
                headers: new HttpHeaders().set("authorization", token),
            }
        });

        this.films_searchQuery = this.apollo.watchQuery({
            query: gql`query films_search($title: String!){
                films_search( title: $title){
                    film_id
                    title
                }
            }`,
            context: {
                headers: new HttpHeaders().set("authorization", token),
            }
        });

        this.categoriesQuery = this.apollo.watchQuery({
            query: gql`query categories{
                categories {
                    category_id
                    name
                }
            }`,
            context: {
                headers: new HttpHeaders().set("authorization", token),
            }
        });

        this.filmQuery = this.apollo.watchQuery({
            query: gql`query film($film_id: Int!){
                film(film_id: $film_id){
                    film_id
                    title
                    description
                    release_year
                    rental_duration
                    rental_rate
                    length
                    rating
                    genre
                    language
                }
            }`,
            context: {
                headers: new HttpHeaders().set("authorization", token),
            }
        });

        this.actorsQuery = this.apollo.watchQuery({
            query: gql`query actors($film_id: Int!){
                actors(film_id: $film_id){
                    first_name
                    last_name
                }
            }`,
            context: {
                headers: new HttpHeaders().set("authorization", token),
            }
        });

        this.storesQuery = this.apollo.watchQuery({
            query: gql`query stores_available($film_id: Int!){
                stores_available(film_id: $film_id){
                    store_id
                    city
                    address
                }
            }`,
            context: {
                headers: new HttpHeaders().set("authorization", token),
            }
        });
    }

    async getLogin(username: string, password: string): Promise<Login> {
        const result = await this.loginQuery.refetch({username, password});
        return result.data.login;
    }

    async getFilms(offset: number): Promise<listFilms> {
        const result = await this.filmsQuery.refetch({offset});
        return result.data.films;
    }

    async getFilms_category(offset: number, category_id: number): Promise<listFilms> {
        const result = await this.films_categoryQuery.refetch({offset, category_id});
        return result.data.films_category;
    }

    async getFilms_user(offset: number, customer_id: number): Promise<listFilms> {
        const result = await this.films_userQuery.refetch({offset, customer_id});
        return result.data.films_user;
    }

    async getFilms_user_rental_date(offset: number, customer_id: number): Promise<listFilms> {
        const result = await this.films_user_rental_dateQuery.refetch({offset, customer_id});
        console.log(result.data.films_user_rental_date);
        return result.data.films_user_rental_date;
    }

    async getFilms_user_title(offset: number, customer_id: number): Promise<listFilms> {
        const result = await this.films_user_titleQuery.refetch({offset, customer_id});
        return result.data.films_user_title;
    }

    async getFilms_user_genre(offset: number, customer_id: number): Promise<listFilms> {
        const result = await this.films_user_genreQuery.refetch({offset, customer_id});
        return result.data.films_user_genre;
    }

    async getFilms_search(title: string): Promise<Film[]> {
        const result = await this.films_searchQuery.refetch({title});
        return result.data.films_search;
    }

    async getFilm(film_id: number): Promise<Film> {
        const result = await this.filmQuery.refetch({film_id});
        return result.data.film;
    }

    async getActors(film_id: number): Promise<Actor[]> {
        const result = await this.actorsQuery.refetch({film_id});
        return result.data.actors;
    }

    async getCategories(): Promise<Category[]> {
        const result = await this.categoriesQuery.refetch();
        return result.data.categories;
    }

    async getStores(film_id: number): Promise<Store[]> {
        const result = await this.storesQuery.refetch({film_id});
        return result.data.stores_available;
    }
}
