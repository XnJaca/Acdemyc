const AdministradorFactory = require('./usuarios/administrador/administrador_model');
const UsuarioFactory = require('./usuarios/usuario/usuario_model');
const EstudianteFactory = require('./usuarios/estudiante/estudiante_model');
const TipoUsuarioxUsuarioFactory = require('./usuarios/tipo_usuario_x_usuario/tipo_usuario_x_usuario_model');
const TipoUsuarioFactory = require('./usuarios/tipo_usuario/tipo_usuario_model');
const ProfesorFactory = require('./usuarios/profesor/profesor_model');
const EncargadoFactory = require('./usuarios/encargado/encargado_model');
const EncargadoXEstudianteFactory = require('./usuarios/encargado/encargado_x_estudiante_model');
const RolAdminFactory = require('./rol/rol_administrador_model');
const RolInstitucionFactory = require('./rol/rol_institucion_model');
const InstitucionFactory = require('./institucion/institucion_model');
const TipoInstitucionFactory = require('./institucion/tipo_institucion_model');

module.exports = {
    AdministradorFactory,
    UsuarioFactory,
    EstudianteFactory,
    TipoUsuarioxUsuarioFactory,
    TipoUsuarioFactory,
    ProfesorFactory,
    EncargadoFactory,
    EncargadoXEstudianteFactory,
    RolInstitucionFactory,
    RolAdminFactory,
    InstitucionFactory,
    TipoInstitucionFactory,
}

// Si añade un modelo, debe sincronizarlo en el archivo de '../config/models_sync'