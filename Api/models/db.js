const Sequelize = require('sequelize');
const { UserModel, RoleModel, dbConfig } = require('./models'); // Importamos los modelos

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: 'mysql',
    // port: dbConfig.PORT
}); // Creamos la conexión a la base de datos

const models = {
    'UserModel': UserModel(sequelize, Sequelize), // Creamos el modelo de usuario
    'RoleModel': RoleModel(sequelize, Sequelize), // Creamos el modelo de rol
};

sequelize.sync(UserModel, RoleModel).then(() => {
    console.log('Tablas sincronizadas\n');
}); // Sincronizamos las tablas

module.exports = models;