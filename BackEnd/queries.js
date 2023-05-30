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
        const query = `SELECT * FROM film f ORDER BY f.film_id`;
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
