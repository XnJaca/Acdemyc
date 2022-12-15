const mysqlModel = require('mysql-model');
/* Buscamos el archivo que habíamos creado antes. */
const dbConfig = require("../config/db_config.js");

var connection = mysqlModel.createConnection({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB
});

module.exports = connection;