const Administradores = require('./administradores/administrador_controller')
const Instituciones = require('./instituciones/institucion_controller');
const TipoInstituciones = require('./instituciones/tipo_institucion_controller');
const Estudiantes = require('./estudiantes/estudiante_controller');
const Usuarios = require('./usuarios/usuario_controller');
const Auth = require('./auth/auth_controller');

module.exports = {
    Administradores,
    Auth,
    Estudiantes,
    Instituciones,
    TipoInstituciones,
    Usuarios,
}