require('dotenv').config();

const {DB_USERNAME, DB_PASSWORD, DATABASE, HOST, NODE_ENV} = process.env

const config = {
    development: {
        db: {
            "username": DB_USERNAME,
            "password": DB_PASSWORD,
            "database": DATABASE,
            "host": HOST
        }
    },
    production: {
        db: {
            "username": DB_USERNAME,
            "password": DB_PASSWORD,
            "database": DATABASE,
            "host": HOST
        }
    },
}

module.exports = config[NODE_ENV]