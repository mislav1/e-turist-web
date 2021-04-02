const { Sequelize } = require('sequelize');
const config = require('./config').db

module.exports = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: "mysql"
});