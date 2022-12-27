const { Sequelize, DataTypes } = require('sequelize');

const {sequelize} = require('./db_config');

const {
    AdministradorFactory,
    EstudianteFactory,
    InstitucionFactory,
    RolAdministradorFactory,
    TipoInstitucionFactory,
    UsuarioFactory,
    ProfesorFactory,
    TipoUsuarioFactory,
    TipoUsuarioxUsuarioFactory } = require('../models/models');


//Definimos las tablas
const Administrador = AdministradorFactory(sequelize, DataTypes);
const Usuario = UsuarioFactory(sequelize, DataTypes);
const Profesor = ProfesorFactory(sequelize, DataTypes);
const TipoUsuario = TipoUsuarioFactory(sequelize, DataTypes);
const TipoUsuarioxUsuario = TipoUsuarioxUsuarioFactory(sequelize, DataTypes);
const Estudiante = EstudianteFactory(sequelize, DataTypes);
const Institucion = InstitucionFactory(sequelize, DataTypes);
const TipoInstitucion = TipoInstitucionFactory(sequelize, DataTypes);
const Rol_Administrador = RolAdministradorFactory(sequelize, DataTypes);


//Definimos las relaciones entre las tablas

//Relacion entre Estudiante y Usuario
Usuario.hasOne(Estudiante, { foreignKey: 'fk_usuario' });
Estudiante.belongsTo(Usuario, { foreignKey: 'fk_usuario' });

//Relacion entre Profesor y Usuario
Usuario.hasOne(Profesor, { foreignKey: 'fk_usuario' });
Profesor.belongsTo(Usuario, { foreignKey: 'fk_usuario' });


//Relacion entre Usuario y Tipo UsuarioxUsuario
TipoUsuarioxUsuario.belongsTo(Estudiante, { foreignKey: 'fk_usuario' });
Estudiante.hasOne(TipoUsuarioxUsuario, { foreignKey: 'fk_usuario' });


//Relacion entre Admnistrador y Usuario
Usuario.hasOne(Administrador, { foreignKey: 'fk_usuario' });
Administrador.belongsTo(Usuario, { foreignKey: 'fk_usuario' });

//Relacion entre Administrador y Rol Administrador
Rol_Administrador.hasOne(Administrador, { foreignKey: 'fk_usuario' });
Administrador.belongsTo(Rol_Administrador, { foreignKey: 'fk_rol_administrador' });




sequelize.sync().then(() => {
    console.log('Tablas sincronizadas');
}).catch((error) => {
    console.log('Error al sincronizar las tablas');
    console.log(error);
})


module.exports = {
    Administrador,
    Estudiante,
    Institucion,
    Profesor,
    Rol_Administrador,
    sequelize,
    TipoInstitucion,
    TipoUsuario,
    TipoUsuarioxUsuario,
    Usuario,
    sequelize
};