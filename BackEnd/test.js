const { db } = require("./pgAdaptor");

db.any("select * from film f ORDER BY f.film_id")
    .then(res => {
        console.log(res);
    });
