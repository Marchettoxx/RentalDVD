const { db, db1 } = require("./pgAdaptor");
const jwt = require('jsonwebtoken');
require('dotenv').config();
const bcrypt = require('bcrypt');
const { _} = require("lodash");

const root = {
    /*
        Query per effettuare il login dell'utente in "login" e generare
        i token di sessione
     */
    login: async (args, { SK }) => {
        const query = `SELECT * FROM login WHERE username=$1`;
        const values = [args.username];
        const user = await db1
            .one(query, values)
            .then(res => res)
            .catch(err => err);
        if (!user) {
            return null
        } else {
            const isValid = await bcrypt.compare(args.password, user.password);
            if (!isValid) {
                throw new Error('Errore: credenziali errate');
            } else {
                const token = jwt.sign(
                    {
                        user: _.pick(user, ['customer_id', 'username'])
                    },
                    SK,
                    {
                        expiresIn: '10h'
                    });
                return {
                    customer_id: user.customer_id,
                    username: user.username,
                    token: token
                };
            }
        }
    },

    /*
        Query per ottenere tutti i film in "films"
     */
    films: (args, { user }) => {
        if (!user) {
            return null
        } else {
            const query = `SELECT f.film_id, f.title, f.release_year, f.rental_rate, f.rating, c.name AS genre, l.name AS language
                FROM film f 
                JOIN film_category fc ON f.film_id = fc.film_id
                JOIN category c ON c.category_id = fc.category_id
                JOIN language l ON l.language_id = f.language_id
                ORDER BY f.title`;
            return db
                .any(query)
                .then(res => {
                    return {
                        count: res.length,
                        films: res.slice(args.offset, args.offset + args.limit)
                    }
                })
                .catch(err => err);
        }
    },

    /*
        Query per ottenere un film
     */
    film: (args, { user }) => {
        if (!user) {
            return null
        } else {
            const query = `SELECT *, c.name AS genre, l.name AS language
            FROM film f
            JOIN film_category fc ON f.film_id = fc.film_id
            JOIN category c ON c.category_id = fc.category_id
            JOIN language l ON l.language_id = f.language_id
            WHERE f.film_id=$1`;
            const values = [args.film_id];
            return db
                .one(query, values)
                .then(res => res)
                .catch(err => err);
        }
    },

    actors: (args, { user }) => {
        if (!user) {
            return null
        } else {
            const query = `SELECT * 
            FROM actor a 
            JOIN film_actor fa ON a.actor_id = fa.actor_id 
            WHERE fa.film_id = $1`;
            const values = [args.film_id];
            return db
                .any(query, values)
                .then(res => res)
                .catch(err => err);
        }
    },

    films_category: (args, { user }) => {
        if (!user) {
            return null
        } else {
            const query = `SELECT f.film_id, f.title, f.release_year, f.rental_rate, f.rating, c.name AS genre, l.name AS language
            FROM film f 
            JOIN film_category fc ON f.film_id = fc.film_id
            JOIN category c ON c.category_id = fc.category_id
            JOIN language l ON l.language_id = f.language_id
            WHERE c.category_id = $1
            ORDER BY f.title`;
            const values = [args.category_id];
            return db
                .any(query, values)
                .then(res => {
                    return {
                        count: res.length,
                        films: res.slice(args.offset, args.offset + args.limit)
                    }
                })
                .catch(err => err);
        }
    },

    // tutti i film noleggiati di un utente
    films_user: (args, { user }) => {
        if (!user) {
            return null
        } else {
            const query = `SELECT f.film_id, f.title, c.name AS genre, r.return_date, r.rental_date, f.rental_rate, r.return_date-rental_date as duration, p.amount
            FROM film f
            JOIN film_category fc ON f.film_id = fc.film_id
            JOIN category c ON c.category_id = fc.category_id
            JOIN inventory i ON i.film_id = f.film_id 
            JOIN rental r ON r.inventory_id = i.inventory_id
            LEFT JOIN payment p ON p.rental_id = r.rental_id
            WHERE r.customer_id = $1`
            const values = [args.customer_id];
            return db
                .any(query, values)
                .then(res => {
                    return {
                        count: res.length,
                        films: res.slice(args.offset, args.offset + args.limit)
                    }
                })
                .catch(err => err);
        }
    },

    films_user_rental_date: (args, { user }) => {
        if (!user) {
            return null
        } else {
            const query = `SELECT f.film_id, f.title, c.name AS genre, r.return_date, r.rental_date, f.rental_rate, r.return_date-rental_date AS duration, p.amount
            FROM film f
            JOIN film_category fc ON f.film_id = fc.film_id
            JOIN category c ON c.category_id = fc.category_id
            JOIN inventory i ON i.film_id = f.film_id 
            JOIN rental r ON r.inventory_id = i.inventory_id
            LEFT JOIN payment p ON p.rental_id = r.rental_id
            WHERE r.customer_id = $1
            ORDER BY r.rental_date`;
            const values = [args.customer_id];
            return db
                .any(query, values)
                .then(res => {
                    return {
                        count: res.length,
                        films: res.slice(args.offset, args.offset + args.limit)
                    }
                })
                .catch(err => err);
        }
    },

    films_user_title: (args, { user }) => {
        if (!user) {
            return null
        } else {
            const query = `SELECT f.film_id, f.title, c.name AS genre, r.return_date, r.rental_date, f.rental_rate, r.return_date-rental_date AS duration, p.amount
            FROM film f
            JOIN film_category fc ON f.film_id = fc.film_id
            JOIN category c ON c.category_id = fc.category_id
            JOIN inventory i ON i.film_id = f.film_id 
            JOIN rental r ON r.inventory_id = i.inventory_id
            LEFT JOIN payment p ON p.rental_id = r.rental_id
            WHERE r.customer_id = $1
            ORDER BY f.title`;
            const values = [args.customer_id];
            return db
                .any(query, values)
                .then(res => {
                    return {
                        count: res.length,
                        films: res.slice(args.offset, args.offset + args.limit)
                    }
                })
                .catch(err => err);
        }
    },

    films_user_amount: (args, { user }) => {
        if (!user) {
            return null
        } else {
            const query = `SELECT f.film_id, f.title, c.name AS genre, r.return_date, r.rental_date, f.rental_rate, r.return_date-rental_date AS duration, p.amount
            FROM film f
            JOIN film_category fc ON f.film_id = fc.film_id
            JOIN category c ON c.category_id = fc.category_id
            JOIN inventory i ON i.film_id = f.film_id 
            JOIN rental r ON r.inventory_id = i.inventory_id
            LEFT JOIN payment p ON p.rental_id = r.rental_id
            WHERE r.customer_id = $1
            ORDER BY p.amount`;
            const values = [args.customer_id];
            return db
                .any(query, values)
                .then(res => {
                    return {
                        count: res.length,
                        films: res.slice(args.offset, args.offset + args.limit)
                    }
                })
                .catch(err => err);
        }
    },

    films_user_duration: (args, { user }) => {
        if (!user) {
            return null
        } else {
            const query = `SELECT f.film_id, f.title, c.name AS genre, r.return_date, r.rental_date, f.rental_rate, p.amount, r.return_date - r.rental_date AS duration
            FROM film f
            JOIN film_category fc ON f.film_id = fc.film_id
            JOIN category c ON c.category_id = fc.category_id
            JOIN inventory i ON i.film_id = f.film_id 
            JOIN rental r ON r.inventory_id = i.inventory_id
            LEFT JOIN payment p ON p.rental_id = r.rental_id
            WHERE r.customer_id = 1
            ORDER BY duration`;
            const values = [args.customer_id];
            return db
                .any(query, values)
                .then(res => {
                    return {
                        count: res.length,
                        films: res.slice(args.offset, args.offset + args.limit)
                    }
                })
                .catch(err => err);
        }
    },

    /*
        Query per la ricerca tramite nome del titolo in "films
     */
    films_search: (args, { user }) => {
        if (!user) {
            return null
        } else {
            const query = `SELECT f.film_id, f.title
            FROM film f
            WHERE f.title ILIKE '%' || LOWER($1) || '%'
            ORDER BY f.title`;
            const values = [args.title];
            return db
                .any(query, values)
                .then(res => res.slice(args.offset, args.offset + args.limit))
                .catch(err => err);
        }
    },

    /*
        Query per ottenere tutte le categorie e utilizzarle per filtrare i film
        in "films"
     */
    categories: (args, { user }) => {
        console.log("categories", user);
        if (!user) {
            return null
        } else {
            const query = `SELECT * FROM category ORDER BY category_id ASC`;
            return db
                .any(query)
                .then(res => res)
                .catch(err => err);
        }
    },

    /*
        Query per ottenere gli store disponibili di un determinato
        film in "films"
     */
    stores_available: (args, { user }) => {
        if (!user) {
            return null
        } else {
            const query = `SELECT s.store_id, ci.city, a.address
            FROM store s 
            JOIN address a ON a.address_id = s.address_id
            JOIN city ci ON ci.city_id = a.city_id
            WHERE store_id IN (
                SELECT i.store_id 
                FROM inventory i
                WHERE i.film_id = $1 
                AND inventory_id NOT IN ( 
                    SELECT inventory_id 
                    FROM rental r   
                    WHERE return_date IS NULL))`
            const values = [args.film_id];
            return db
                .any(query, values)
                .then(res => res)
                .catch(err => err);
        }
    },

    rent_film: async (args, {user}) => {
        if (!user) {
            return null
        } else {
            const query = `SELECT inventory_id
                FROM rental
                WHERE inventory_id IN (SELECT inventory_id 
                FROM inventory i 
                WHERE film_id = $1 AND store_id = $2) 
                 AND inventory_id NOT IN (
                     SELECT inventory_id
                     FROM rental
                     WHERE return_date is null)
                     GROUP BY inventory_id;`
            const values = [args.film_id, args.store_id];
            const result = await db
                .any(query, values)
                .then(res => res)
                .catch(err => err);
            const rental_date = args.rental_date.slice(0, 19).replace('T', ' ');
            const now = new Date();
            now.setHours(now.getHours() - now.getTimezoneOffset() / 60);
            const last_update = now.toISOString().slice(0, 19).replace('T', ' ');
            const mutation = `INSERT INTO rental (rental_date, inventory_id, customer_id, return_date, staff_id, last_update) 
                        VALUES($1, $2, $3, NULL, 1, $4);`
            const valuesMutation = [rental_date, result[0].inventory_id, args.customer_id, last_update];
            db.any(mutation, valuesMutation)
                .then(res => res)
                .catch(err => err);
            return result[0].inventory_id;
        }
    }
}

exports.root = root;
