export class Login {
  customer_id?: string;
  username?: string;
  password?: string;
}

export class Film {
  film_id?: number;
  title?: string;
  description?: string;
  release_year?: string;
  rental_duration?: string;
  rental_rate?: string;
  length?: string;
  replacement_cost?: string;
  rating?: string;
  special_features?: string;
  fulltext?: string;
  genre?: string;
  language?: string;
  return_date?: string;
  inventory_id?: string;
  store_id?: string;
  customer_id?: string;
}

export interface Films {
  count: number;
  filmArray: Film[];
}
