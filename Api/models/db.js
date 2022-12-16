// const mysqlModel = require('mysql-model');
const Sequelize = require('sequelize');
const UserModel = require('./Usuario/Usuario_model');

/* Buscamos el archivo que habíamos creado antes. */
const dbConfig = require("../config/db_config.js");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD,{
    host: dbConfig.HOST,
    dialect: 'mysql',
    port: dbConfig.PORT
});

const User = UserModel(sequelize, Sequelize);

sequelize.sync().then(()=>{
    console.log('Tablas sincronizadas');
})

// var connection = mysqlModel.createConnection({
//     host: dbConfig.HOST,
//     user: dbConfig.USER,
//     password: dbConfig.PASSWORD,
//     database: dbConfig.DB
// });

module.exports = User;