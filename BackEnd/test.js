const { db1 } = require("./pgAdaptor");

db1.one("select * from login where username='mary'")
    .then(res => {
        console.log(res);
    });
