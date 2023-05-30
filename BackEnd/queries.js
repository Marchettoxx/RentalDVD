const { db, db1 } = require("./pgAdaptor");

const root = {
    login: (args) => {
        const query = `SELECT * FROM login WHERE username=$1 and password=$2`;
        const values = [args.username, args.password];
        return db1
            .one(query, values)
            .then(res => res)
            .catch(err => err);
    },
    films: (args) => {
        const query = `select f.film_id, f.title, f.description, f.release_year, f.length, f.rating, c.name as genre, l.name as language
            from film f JOIN film_category fc ON f.film_id = fc.film_id
            JOIN category c ON c.category_id = fc.category_id
            JOIN language l ON l.language_id = f.language_id`;
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
    }
}

exports.root = root;
