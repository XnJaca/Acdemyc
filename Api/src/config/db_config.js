const { Sequelize, DataTypes } = require('sequelize');

// AMBIENTE DE PRODUCCION
const connProduccion = {
    HOST: "mysql-100641-0.cloudclusters.net",
    USER: "acdemyccoffee",
    PASSWORD: "Jaca2001!",
    DB: "acdemycdb",
    PORTDB:"10014"
}
// AMBIENTE LOCAL
const connLocal = {
    HOST: process.env.HOST,
    USER: process.env.USER,
    PASSWORD: process.env.PASSWORD,
    DB: process.env.DB,
    PORT: process.env.PORT
}

const sequelize = new Sequelize(connProduccion.DB, connProduccion.USER, connProduccion.PASSWORD, {
    host: connProduccion.HOST,
    dialect: 'mysql',
    port: connProduccion.PORTDB, //Descomentar solo en produccion
})

module.exports = {
    sequelize
}