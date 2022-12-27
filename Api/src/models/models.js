const AdministradorFactory = require('./usuario/administrador/administrador_model');
const UsuarioFactory = require('./usuario/usuario_model');
const TipoUsuarioFactory = require('./usuario/tipo_usuario_model');
const TipoUsuarioxUsuarioFactory = require('./usuario/tipo_usuario_x_usuario_model');
const EstudianteFactory = require('./usuario/estudiante/estudiante_model');
const InstitucionFactory = require('./institucion/institucion_model');
const TipoInstitucionFactory = require('./institucion/tipo_institucion_model');
const RolAdministradorFactory = require('./rol/rol_administrador_model');

module.exports = {
    AdministradorFactory,
    UsuarioFactory,
    TipoUsuarioFactory,
    TipoUsuarioxUsuarioFactory,
    EstudianteFactory,
    InstitucionFactory,
    TipoInstitucionFactory,
    RolAdministradorFactory
}

// Si añade un modelo, debe sincronizarlo en el archivo de '../config/db_config'