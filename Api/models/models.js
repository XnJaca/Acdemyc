const UserModel = require('./User/user_model'); // Importamos el modelo de usuario
const RoleModel = require('./Rol/role_model'); // Importamos el modelo de rol
const dbConfig = require("../config/db_config.js");

module.exports = {
    UserModel,
    RoleModel,
    dbConfig
}