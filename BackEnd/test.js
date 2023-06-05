const { db } = require("./pgAdaptor");

db.any("SELECT * FROM category ORDER BY category_id ASC")
    .then(res => {
        console.log(res);
    });
