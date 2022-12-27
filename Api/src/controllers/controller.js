const Auth = require('./auth/auth_controller');
const Usuarios = require('./usuarios/usuario_controller');
const Profesores = require('./profesores/profesor_controller');
const RolAdministrador = require('./roles/rol_adminstrador_controller');
const Estudiantes = require('./estudiantes/estudiante_controller');
const Instituciones = require('./instituciones/institucion_controller');
const Administradores = require('./administradores/administrador_controller')
const TipoInstituciones = require('./instituciones/tipo_institucion_controller');

module.exports = {
    Auth,
    Usuarios,
    Profesores,
    Estudiantes,
    Instituciones,
    Administradores,
    RolAdministrador,
    TipoInstituciones,
}