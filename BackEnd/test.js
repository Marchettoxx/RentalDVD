const { db } = require("./pgAdaptor");

const tipo = "c.name"
db.any("SELECT f.film_id, f.title, f.description, " +
    "f.release_year, f.rental_duration, f.rental_rate, f.length, " +
    "f.replacement_cost, f.rating, f.special_features, f.fulltext, c.name AS genre, l.name AS language, i.inventory_id, s.store_id, r.customer_id, r.return_date " +
"FROM film f " +
"JOIN film_category fc ON f.film_id = fc.film_id " +
"JOIN category c ON c.category_id = fc.category_id "+
"JOIN language l ON l.language_id = f.language_id "+
"JOIN inventory i ON i.film_id = f.film_id "+
"JOIN rental r ON r.inventory_id = i.inventory_id "+
"JOIN store s ON s.store_id = i.store_id "+
"WHERE r.return_date is not NULL AND r.customer_id = 1 "+
`ORDER BY ${tipo}`)
    .then(res => {
        console.log(res);
    });
