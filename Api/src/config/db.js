//Require sequelize
const {Sequelize, DataTypes} = require('sequelize');

//Creamos la conexion a la base de datos
const conexion = {
    HOST: "mysql-100641-0.cloudclusters.net",
    USER: "acdemyccoffee",
    PASSWORD: "Jaca2001!",
    DB: "acdemycdb",
    PORT:"10014"
}

const sequelize = new Sequelize(conexion.DB, conexion.USER, conexion.PASSWORD, {
    host: conexion.HOST,
    dialect: 'mysql',
    port: conexion.PORT, //Descomentar solo en produccion
});

//Exportamos la conexion
module.exports = {
    sequelize
};

