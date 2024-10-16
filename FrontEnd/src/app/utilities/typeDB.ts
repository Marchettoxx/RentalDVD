export class User {
    customer_id?: number;
    username?: string;
    token?: string;
}

export class Film {
    film_id?: number;
    title?: string;
    description?: string;
    release_year?: string;
    rental_duration?: string;
    rental_rate?: number;
    length?: string;
    rating?: string;
    genre?: string;
    language?: string;
    return_date?: Date;
    inventory_id?: string;
    store_id?: string;
    customer_id?: string;
    rental_date?: Date;
    amount?: number;
    duration?: Interval;
}

export class Interval {
    days?: number;
    hours?: number;
    minutes?: number;
}

export class listFilms {
    count?: number;
    films?: Film[];
}

export class Category {
    category_id?: number;
    name?: string;
}

export class Store {
    store_id?: number;
    city?: string;
    address?: string;
}

export class Actor {
    actor_id?: number;
    first_name?: string;
    last_name?: string;
}

export class Inventory {
    inventory_id?: number;
}

export class Amount {
    amount?: number | null;
}
