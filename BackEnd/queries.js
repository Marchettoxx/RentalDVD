const { db, db1 } = require("./pgAdaptor");
const jwt = require('jsonwebtoken');
require('dotenv').config();
const bcrypt = require('bcrypt');

const root = {
    login: async (args) => {
        const query = `SELECT * FROM login WHERE username=$1`;
        const values = [args.username];
        const user = await db1
            .one(query, values)
            .then(res => res)
            .catch(err => err);
        if (!user) {
            throw new Error("Errore: credenziali errate")
        } else {
            const isValid = await bcrypt.compare(args.password, user.password);
            if (!isValid) {
                throw new Error('Errore: credenziali errate');
            } else {
                const token = jwt.sign(
                    {
                        user: user.username
                    },
                    process.env.JWT,
                    {
                        expiresIn: '6m'
                    });
                return {
                    customer_id: user.customer_id,
                    username: user.username,
                    token: token
                };
            }
        }
    },
    // tutti i film disponibili
    films: (args) => {
        const query = `SELECT f.title, f.description, f.release_year, f.rental_duration, f.rental_rate, f.length, f.replacement_cost, f.rating, f.special_features, f.fulltext, c.name AS genre, l.name AS language, f.film_id
            FROM film f 
            JOIN film_category fc ON f.film_id = fc.film_id
            JOIN category c ON c.category_id = fc.category_id
            JOIN language l ON l.language_id = f.language_id
            order by f.film_id`;
        return db
            .any(query)
            .then(res => {
                return {
                    count: res.length,
                    filmArray: res.slice(args.offset, args.offset + args.limit)
                }
            })
            .catch(err => err);
    },
    film: (args) => {
        const query = `SELECT * FROM film f WHERE f.film_id=$1`;
        const values = [args.film_id];
        return db
            .one(query, values)
            .then(res => res)
            .catch(err => err);
    },
    films_category: (args) => {
        const query = `SELECT f.film_id, f.title, f.description, f.release_year, f.rental_duration, f.rental_rate, f.length, f.replacement_cost, f.rating, f.special_features, f.fulltext, c.name AS genre, l.name AS language, i.inventory_id, s.store_id, r.customer_id, r.return_date
            FROM film f 
            JOIN film_category fc ON f.film_id = fc.film_id
            JOIN category c ON c.category_id = fc.category_id
            JOIN language l ON l.language_id = f.language_id
            JOIN inventory i ON i.film_id = f.film_id 
            JOIN rental r ON r.inventory_id = i.inventory_id
            JOIN store s ON s.store_id = i.store_id
            WHERE c.category_id = $1
            ORDER BY r.return_date`;
        const values = [args.category_id];
        return db
            .any(query, values)
            .then(res => {
                return {
                    count: res.length,
                    filmArray: res.slice(args.offset, args.offset + args.limit)
                }
            })
            .catch(err => err);
    },
    // tutti i film noleggiati di un utente
    films_user: (args) => {
        const query = `SELECT f.film_id, f.title, f.description, f.release_year, f.rental_duration, f.rental_rate, f.length, f.replacement_cost, f.rating, f.special_features, f.fulltext, c.name AS genre, l.name AS language, r.return_date, r.rental_date 
            FROM film f 
            JOIN film_category fc ON f.film_id = fc.film_id
            JOIN category c ON c.category_id = fc.category_id
            JOIN language l ON l.language_id = f.language_id
            JOIN inventory i ON i.film_id = f.film_id 
            JOIN rental r ON r.inventory_id = i.inventory_id
            JOIN customer cu ON cu.customer_id = r.customer_id
            JOIN payment p ON p.customer_id = cu.customer_id
            WHERE r.return_date is not NULL AND r.customer_id = $1
            GROUP BY f.film_id, c.name, l.name, r.rental_date, r.return_date
            ORDER BY r.return_date`;
        const values = [args.customer_id];
        return db
            .any(query, values)
            .then(res => {
                return {
                    count: res.length,
                    filmArray: res.slice(args.offset, args.offset + args.limit)
                }
            })
            .catch(err => err);
    },

    films_user_rental_date: (args) => {
        const query = `SELECT f.film_id, f.title, f.description, f.release_year, f.rental_duration, f.rental_rate, f.length, f.replacement_cost, f.rating, f.special_features, f.fulltext, c.name AS genre, l.name AS language, r.return_date, r.rental_date 
            FROM film f 
            JOIN film_category fc ON f.film_id = fc.film_id
            JOIN category c ON c.category_id = fc.category_id
            JOIN language l ON l.language_id = f.language_id
            JOIN inventory i ON i.film_id = f.film_id 
            JOIN rental r ON r.inventory_id = i.inventory_id
            JOIN customer cu ON cu.customer_id = r.customer_id
            JOIN payment p ON p.customer_id = cu.customer_id
            WHERE r.return_date is not NULL AND r.customer_id = $1
            GROUP BY f.film_id, c.name, l.name, r.rental_date, r.return_date
            ORDER BY r.rental_date`;
        const values = [args.customer_id];
        return db
            .any(query, values)
            .then(res => {
                return {
                    count: res.length,
                    filmArray: res.slice(args.offset, args.offset + args.limit)
                }
            })
            .catch(err => err);
    },

    films_user_title: (args) => {
        const query = `SELECT f.film_id, f.title, f.description, f.release_year, f.rental_duration, f.rental_rate, f.length, f.replacement_cost, f.rating, f.special_features, f.fulltext, c.name AS genre, l.name AS language, r.return_date, r.rental_date 
            FROM film f 
            JOIN film_category fc ON f.film_id = fc.film_id
            JOIN category c ON c.category_id = fc.category_id
            JOIN language l ON l.language_id = f.language_id
            JOIN inventory i ON i.film_id = f.film_id 
            JOIN rental r ON r.inventory_id = i.inventory_id
            JOIN customer cu ON cu.customer_id = r.customer_id
            JOIN payment p ON p.customer_id = cu.customer_id
            WHERE r.return_date is not NULL AND r.customer_id = $1
            GROUP BY f.film_id, c.name, l.name, r.rental_date, r.return_date
            ORDER BY f.title`;
        const values = [args.customer_id];
        return db
            .any(query, values)
            .then(res => {
                return {
                    count: res.length,
                    filmArray: res.slice(args.offset, args.offset + args.limit)
                }
            })
            .catch(err => err);
    },
    films_user_genre: (args) => {
        const query = `SELECT f.film_id, f.title, f.description, f.release_year, f.rental_duration, f.rental_rate, f.length, f.replacement_cost, f.rating, f.special_features, f.fulltext, c.name AS genre, l.name AS language, r.return_date, r.rental_date 
            FROM film f 
            JOIN film_category fc ON f.film_id = fc.film_id
            JOIN category c ON c.category_id = fc.category_id
            JOIN language l ON l.language_id = f.language_id
            JOIN inventory i ON i.film_id = f.film_id 
            JOIN rental r ON r.inventory_id = i.inventory_id
            JOIN customer cu ON cu.customer_id = r.customer_id
            JOIN payment p ON p.customer_id = cu.customer_id
            WHERE r.return_date is not NULL AND r.customer_id = $1
            GROUP BY f.film_id, c.name, l.name, r.rental_date, r.return_date
            ORDER BY c.name`;
        const values = [args.customer_id];
        return db
            .any(query, values)
            .then(res => {
                return {
                    count: res.length,
                    filmArray: res.slice(args.offset, args.offset + args.limit)
                }
            })
            .catch(err => err);
    },

    films_search: (args) => {
        const query = `SELECT f.title, f.description, f.release_year, f.rental_duration, f.rental_rate, f.length, f.replacement_cost, f.rating, f.special_features, f.fulltext, c.name AS genre, l.name AS language, f.film_id
            FROM film f 
            JOIN film_category fc ON f.film_id = fc.film_id
            JOIN category c ON c.category_id = fc.category_id
            JOIN language l ON l.language_id = f.language_id
            WHERE f.title ILIKE '%' || LOWER($1) || '%'
            order by f.film_id`;
        const values = [args.title];
        return db
            .any(query, values)
            .then(res => {
                return {
                    count: res.length,
                    filmArray: res.slice(args.offset, args.offset + args.limit)
                }
            })
            .catch(err => err);
    },
    // film user noleggiati pendenti
    films_user_in_rent: (args) => {
        const query = `SELECT f.film_id, f.title, f.description, f.release_year, f.rental_duration, f.rental_rate, f.length, f.replacement_cost, f.rating, f.special_features, f.fulltext, c.name AS genre, l.name AS language, i.inventory_id, s.store_id, r.customer_id, r.return_date
            FROM film f 
            JOIN film_category fc ON f.film_id = fc.film_id
            JOIN category c ON c.category_id = fc.category_id
            JOIN language l ON l.language_id = f.language_id
            JOIN inventory i ON i.film_id = f.film_id 
            JOIN rental r ON r.inventory_id = i.inventory_id
            JOIN store s ON s.store_id = i.store_id
            WHERE r.return_date is NULL AND r.customer_id = $1
            ORDER BY r.return_date`;
        const values = [args.customer_id];
        return db
            .any(query, values)
            .then(res => {
                return {
                    count: res.length,
                    filmArray: res.slice(args.offset, args.offset + args.limit)
                }
            })
            .catch(err => err);
    },

    categories: _ => {
        const query = `SELECT * FROM category ORDER BY category_id ASC`;
        return db
            .any(query)
            .then(res => {
                return {
                    categoryArray: res
                }
            })
            .catch(err => err);
    },
    stores_available: (args) => {
        const query = `SELECT s.store_id, ci.city, a.address 
            FROM film f 
            JOIN inventory i ON i.film_id = f.film_id 
            JOIN rental r ON r.inventory_id = i.inventory_id
            JOIN store s ON s.store_id = i.store_id
            JOIN address a ON a.address_id = s.address_id
            JOIN city ci ON ci.city_id = a.city_id
            WHERE f.film_id = $1
            GROUP BY s.store_id, ci.city, a.address`;
        const values = [args.film_id];
        return db
            .any(query, values)
            .then(res => {
                return {
                    stores: res
                }
            })
            .catch(err => err);
    },
}

exports.root = root;
