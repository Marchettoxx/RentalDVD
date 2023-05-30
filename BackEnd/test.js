const { db } = require("./pgAdaptor");

db.any("SELECT film_id, title\n" +
    "FROM film_disponibili\n" +
    "GROUP BY film_id, title\n" +
    "ORDER BY film_id")
    .then(res => {
        console.log(res);
    });
