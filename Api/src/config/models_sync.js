//Require sequelize
const { Sequelize, DataTypes } = require('sequelize');

//Llamamos al archivo de conexion
const { sequelize } = require('./db');

// Llamamos a los modelos que ocupamos sincronizar.
const {
    AdministradorFactory,
    UsuarioFactory,
    EstudianteFactory,
    TipoUsuarioFactory,
    TipoUsuarioxUsuarioFactory,
    ProfesorFactory,
    EncargadoFactory, EncargadoXEstudianteFactory,
    RolAdminFactory,
    RolInstitucionFactory
} = require('../models/models');


//Definimos las tablas
const Administrador = AdministradorFactory(sequelize, DataTypes);
const Usuario = UsuarioFactory(sequelize, DataTypes);
const Estudiante = EstudianteFactory(sequelize, DataTypes);
const TipoUsuario = TipoUsuarioFactory(sequelize, DataTypes);
const TipoUsuarioxUsuario = TipoUsuarioxUsuarioFactory(sequelize, DataTypes);
const Encargado = EncargadoFactory(sequelize, DataTypes);
const Profesor = ProfesorFactory(sequelize, DataTypes);
const EncargadoXEstudiante = EncargadoXEstudianteFactory(sequelize, DataTypes);
const RolAdmin = RolAdminFactory(sequelize, DataTypes);
const RolInstitucion = RolInstitucionFactory(sequelize, DataTypes);


//Relacion entre Administrador y Usuario
Usuario.hasOne(Administrador, { foreignKey: 'fk_usuario' });
Administrador.belongsTo(Usuario, { foreignKey: 'fk_usuario' });

//Relacion entre Estudiante y Usuario
Usuario.hasOne(Estudiante, { foreignKey: 'fk_usuario' });
Estudiante.belongsTo(Usuario, { foreignKey: 'fk_usuario' });

// Relacion entre Profesor y Usuario
Usuario.hasOne(Profesor, { foreignKey: 'fk_usuario' });
Profesor.belongsTo(Usuario, { foreignKey: 'fk_usuario' });

// Relacion entre encargado y Usuario
Usuario.hasOne(Encargado, { foreignKey: 'fk_usuario' });
Encargado.belongsTo(Usuario, { foreignKey: 'fk_usuario' });


//Relacion entre administrador y tipo_usuario_x_usuario
TipoUsuarioxUsuario.belongsTo(Administrador, { foreignKey: 'fk_usuario' });
Administrador.hasOne(TipoUsuarioxUsuario, { foreignKey: 'fk_usuario' });

//Relacion entre estudiante y tipo_usuario_x_usuario
TipoUsuarioxUsuario.belongsTo(Estudiante, { foreignKey: 'fk_usuario' });
Estudiante.hasOne(TipoUsuarioxUsuario, { foreignKey: 'fk_usuario' });

//Relacion entre encargado y tipo_usuario_x_usuario
TipoUsuarioxUsuario.belongsTo(Encargado, { foreignKey: 'fk_usuario' });
Encargado.hasOne(TipoUsuarioxUsuario, { foreignKey: 'fk_usuario' });

// Relacion entre profesor y tipo_usuario_x_usuario
TipoUsuarioxUsuario.belongsTo(Profesor, { foreignKey: 'fk_usuario' });
Profesor.hasOne(TipoUsuarioxUsuario, { foreignKey: 'fk_usuario' });

// Relacion entre TipoUsuario y TipoUsuarioxUsuario
TipoUsuario.hasOne(TipoUsuarioxUsuario, { foreignKey: 'id' });
TipoUsuarioxUsuario.belongsTo(TipoUsuario, { foreignKey: 'id' });

// Relacion entre Usuario y TipoUsuarioxUsuario
Usuario.hasMany(TipoUsuarioxUsuario, { foreignKey: 'fk_usuario' });
TipoUsuarioxUsuario.belongsTo(Usuario, { foreignKey: 'fk_usuario' });

// Relacion entre Institucion y Tipo Institucion
// TipoInstitucion.hasOne(Institucion, { foreignKey: 'fk_tipo_institucion' });
// Institucion.belongsTo(TipoInstitucion, { foreignKey: 'fk_tipo_institucion' });

// Relacion entre administrador y Rol Administrador
Administrador.hasOne(RolAdmin, { foreignKey: 'fk_administrador' });
RolAdmin.belongsTo(Administrador, { foreignKey: 'fk_administrador' });

//Sincronizamos las tablas
sequelize.sync()
    .then(() => console.log('Tablas sincronizadas'))
    .catch(error => console.log(error));


//Exportamos las tablas
module.exports = {
    Administrador,
    Usuario,
    Estudiante,
    TipoUsuario,
    TipoUsuarioxUsuario,
    Encargado,
    EncargadoXEstudiante,
    Profesor,
    RolAdmin,
    RolInstitucion,
    sequelize
}
