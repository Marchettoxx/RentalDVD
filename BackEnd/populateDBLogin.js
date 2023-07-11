const { db1, db} = require("./pgAdaptor");
const {genSalt, hash} = require("bcrypt");
const fs = require('fs');

async function getUsers() {
    return await db.any(`SELECT c.customer_id, c.first_name
    FROM customer c
    ORDER BY c.customer_id`)
        .then(res => res);
}

function generateRandomPassword(length) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!#$%&*_+?-";
    let password = "";

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }

    return password;
}

async function createHash(password) {
    return await genSalt(10).then((salt) => hash(password, salt)).then((hash) => {
        return hash;
    });
}

function write(customer_id, username, password) {
    const riga = `customer_id: ${customer_id}, username: ${username}, password: ${password};\n`;

    fs.appendFile('password.txt', riga, (err) => {
        if (err) {
            console.log(err);
        }
    });
}

async function populateLogin() {
    const users = await getUsers();
    for (let user of users) {
        const randomPassword = generateRandomPassword(8);
        const saltedPassword = await createHash(randomPassword);
        const valuesMutation = [user.customer_id, saltedPassword, user.first_name, user.customer_id];
        const mutation = `INSERT INTO login (user_id, password, username, customer_id)
                        VALUES($1, $2, $3, $4);`
        db1.any(mutation, valuesMutation)
            .then(res => res)
            .catch(err => err);
        write(user.customer_id, user.first_name, randomPassword);
    }
}

populateLogin();
