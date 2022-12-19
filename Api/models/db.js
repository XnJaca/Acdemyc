const Sequelize = require('sequelize');
const UserModel = require('./Usuario/Usuario_model'); // Importamos el modelo de usuario

const dbConfig = require("../config/db_config.js"); // Importamos la configuración de la base de datos

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD,{
    host: dbConfig.HOST,
    dialect: 'mysql',
    port: dbConfig.PORT
}); // Creamos la conexión a la base de datos

const User = UserModel(sequelize, Sequelize); // Creamos el modelo de usuario

sequelize.sync().then(()=>{
    console.log('Tablas sincronizadas\n');
}); // Sincronizamos las tablas

module.exports = User;