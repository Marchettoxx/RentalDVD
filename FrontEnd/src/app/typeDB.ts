export class Login {
  customer_id?: string;
  username?: string;
  password?: string
}

export class Film {
  film_id?: string;
  title?: string;
  description?: string;
  release_year?: string;
  language_id?: string;
  rental_duration?: string;
  rental_rate?: string;
  length?: string;
  replacement_cost?: string;
  rating?: string;
  last_update?: string;
  special_features?: string;
  fulltext?: string;
}

export interface Films {
  count: number;
  filmArray: Film[];
}
