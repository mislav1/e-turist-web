const path = require('path');
require('dotenv').config({
    path: path.join(__dirname, "../../", '.env')
});

const { DB_USERNAME, DB_PASSWORD, DATABASE, HOST, NODE_ENV, CRYPTO_SECRET } = process.env

const config = {
    development: {
        db: {
            "username": DB_USERNAME,
            "password": DB_PASSWORD,
            "database": DATABASE,
            "host": HOST
        },
        uploadsFolder: "uploads",
        cryptoSecret: CRYPTO_SECRET,
    },
    production: {
        db: {
            "username": DB_USERNAME,
            "password": DB_PASSWORD,
            "database": DATABASE,
            "host": HOST
        },
        uploadsFolder: "uploads",
        cryptoSecret: CRYPTO_SECRET,
    },
}

module.exports = config[NODE_ENV]