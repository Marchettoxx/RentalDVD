const { db, db1 } = require("./pgAdaptor");
const jwt = require('jsonwebtoken');
require('dotenv').config();
const bcrypt = require('bcrypt');

const root = {
    /*
        Query per effettuare il login dell'utente in "login" e generare
        i token di sessione
     */
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
                        expiresIn: '5s'
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
    films: (args) => {
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
            .catch(err => console.log("errore"));
    },

    /*
        Query per ottenere un film
     */
    film: (args) => {
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
    },

    actors: (args) => {
        const query = `SELECT * 
            FROM actor a 
            JOIN film_actor fa ON a.actor_id = fa.actor_id 
            WHERE fa.film_id = $1`;
        const values = [args.film_id];
        return db
            .any(query, values)
            .then(res => res)
            .catch(err => err);
    },

    films_category: (args) => {
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
    },

    // tutti i film noleggiati di un utente
    films_user: (args) => {
        /*const query = `SELECT f.film_id, f.title, c.name AS genre, r.return_date, r.rental_date
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
            ORDER BY r.return_date`;*/
        const query = `SELECT f.film_id, f.title, c.name AS genre, r.return_date, r.rental_date, f.rental_rate
            FROM film f
            JOIN film_category fc ON f.film_id = fc.film_id
            JOIN category c ON c.category_id = fc.category_id
            JOIN inventory i ON i.film_id = f.film_id 
            JOIN rental r ON r.inventory_id = i.inventory_id
            WHERE f.film_id in (
                SELECT i.film_id
                FROM inventory i
                JOIN rental r ON i.inventory_id = r.inventory_id
                WHERE r.customer_id = $1
                AND i.inventory_id not in (
                    SELECT inventory_id
                    FROM rental r
                    WHERE return_date is NULL)
                    GROUP BY film_id)
            ORDER BY f.film_id`
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
    },

    films_user_rental_date: (args) => {
        const query = `SELECT f.film_id, f.title, c.name AS genre, r.return_date, r.rental_date, f.rental_rate
            FROM film f
            JOIN film_category fc ON f.film_id = fc.film_id
            JOIN category c ON c.category_id = fc.category_id
            JOIN inventory i ON i.film_id = f.film_id 
            JOIN rental r ON r.inventory_id = i.inventory_id
            WHERE f.film_id in (
                SELECT i.film_id
                FROM inventory i
                JOIN rental r ON i.inventory_id = r.inventory_id
                WHERE r.customer_id = $1
                AND i.inventory_id not in (
                    SELECT inventory_id
                    FROM rental r
                    WHERE return_date is NULL)
                    GROUP BY film_id)
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
    },

    films_user_title: (args) => {
        const query = `SELECT f.film_id, f.title, c.name AS genre, r.return_date, r.rental_date, f.rental_rate
            FROM film f
            JOIN film_category fc ON f.film_id = fc.film_id
            JOIN category c ON c.category_id = fc.category_id
            JOIN inventory i ON i.film_id = f.film_id 
            JOIN rental r ON r.inventory_id = i.inventory_id
            WHERE f.film_id in (
                SELECT i.film_id
                FROM inventory i
                JOIN rental r ON i.inventory_id = r.inventory_id
                WHERE r.customer_id = $1
                AND i.inventory_id not in (
                    SELECT inventory_id
                    FROM rental r
                    WHERE return_date is NULL)
                    GROUP BY film_id)
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
    },
    films_user_genre: (args) => {
        const query = `SELECT f.film_id, f.title, c.name AS genre, r.return_date, r.rental_date, f.rental_rate
            FROM film f
            JOIN film_category fc ON f.film_id = fc.film_id
            JOIN category c ON c.category_id = fc.category_id
            JOIN inventory i ON i.film_id = f.film_id 
            JOIN rental r ON r.inventory_id = i.inventory_id
            WHERE f.film_id in (
                SELECT i.film_id
                FROM inventory i
                JOIN rental r ON i.inventory_id = r.inventory_id
                WHERE r.customer_id = $1
                AND i.inventory_id not in (
                    SELECT inventory_id
                    FROM rental r
                    WHERE return_date is NULL)
                    GROUP BY film_id)
            ORDER BY c.name`;
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
    },

    /*
        Query per la ricerca tramite nome del titolo in "films
     */
    films_search: (args) => {
        const query = `SELECT f.film_id, f.title
            FROM film f
            WHERE f.title ILIKE '%' || LOWER($1) || '%'
            ORDER BY f.title`;
        const values = [args.title];
        return db
            .any(query, values)
            .then(res => res.slice(args.offset, args.offset + args.limit))
            .catch(err => err);
    },

    /*
        Query per ottenere tutte le categorie e utilizzarle per filtrare i film
        in "films"
     */
    categories: _ => {
        const query = `SELECT * FROM category ORDER BY category_id ASC`;
        return db
            .any(query)
            .then(res => res)
            .catch(err => err);
    },

    /*
        Query per ottenere gli store disponibili di un determinato
        film in "films"
     */
    stores_available: (args) => {
        /*const query = `SELECT s.store_id, ci.city, a.address
            FROM film f 
            JOIN inventory i ON i.film_id = f.film_id 
            JOIN rental r ON r.inventory_id = i.inventory_id
            JOIN store s ON s.store_id = i.store_id
            JOIN address a ON a.address_id = s.address_id
            JOIN city ci ON ci.city_id = a.city_id
            WHERE f.film_id = $1
            GROUP BY s.store_id, ci.city, a.address`;*/
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
    },
}

exports.root = root;
