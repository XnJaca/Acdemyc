const AdministradorController = require('./administrador/administrador_controller');
const LoginController = require('./auth/login_controller')

// Export
module.exports = {
    ...AdministradorController,
    ...LoginController,
};