export interface User {
    customer_id: number;
    username: string;
    token: string;
}

export interface Film {
    film_id: number;
    title: string;
    description: string;
    release_year: string;
    rental_duration: string;
    rental_rate: number;
    length: string;
    rating: string;
    genre: string;
    language: string;
    return_date: Date;
    inventory_id: string;
    store_id: string;
    customer_id: string;
    rental_date: Date;
    amount: number;
    duration: Interval;
}

export interface Interval {
    days: number;
    hours: number;
    minutes: number;
}

export interface listFilms {
    count: number;
    films: Film[];
}

export interface Category {
    category_id: number;
    name: string;
}

export interface Store {
    store_id: number;
    city: string;
    address: string;
}

export interface Actor {
    actor_id?: number;
    first_name?: string;
    last_name?: string;
}

export interface Inventory {
    inventory_id?: number;
}
