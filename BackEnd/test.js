const { db1 } = require("./pgAdaptor");

db1.any("select * from login where username='mary' and password='pass'")
    .then(res => {
        console.log(res);
    });
