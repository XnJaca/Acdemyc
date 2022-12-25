const { Sequelize, DataTypes } = require('sequelize');
const {
    AdministradorFactory,
    EstudianteFactory,
    InstitucionFactory,
    RolFactory,
    TipoInstitucionFactory,
    UsuarioFactory,
    TipoUsuarioFactory, 
    TipoUsuarioxUsuarioFactory} = require('../models/models');

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
    port: connProduccion.PORT, //Descomentar solo en produccion
})

//Una vez creada la conexion, obtenemos los modelos
const Administrador = AdministradorFactory(sequelize, DataTypes);
const Usuario = UsuarioFactory(sequelize, DataTypes);
const TipoUsuario = TipoUsuarioFactory(sequelize, DataTypes);
const TipoUsuarioxUsuario = TipoUsuarioxUsuarioFactory(sequelize, DataTypes);
const Estudiante = EstudianteFactory(sequelize, DataTypes);
const Institucion = InstitucionFactory(sequelize, DataTypes);
const TipoInstitucion = TipoInstitucionFactory(sequelize, DataTypes);
const Rol = RolFactory(sequelize, DataTypes);

//Definimos las relaciones entre las tablas

//Relacion entre Estudiante y Usuario
Usuario.hasOne(Estudiante, { foreignKey: 'fk_usuario' });
Estudiante.belongsTo(Usuario, { foreignKey: 'fk_usuario' });

//Relacion entre Usuario y Tipo UsuarioxUsuario
TipoUsuarioxUsuario.belongsTo(Estudiante, { foreignKey: 'fk_usuario' });
Estudiante.hasOne(TipoUsuarioxUsuario, { foreignKey: 'fk_usuario' });


//Relacion entre Admnistrador y Usuario
Usuario.hasOne(Administrador, { foreignKey: 'fk_usuario' });
Administrador.belongsTo(Usuario, { foreignKey: 'fk_usuario' });

//Relacion entre Administrador y Rol Administrador
Rol.hasOne(Administrador, {foreignKey: 'fk_usuario'});
Administrador.belongsTo(Rol, {foreignKey: 'fk_rol_administrador'});




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
    Rol,
    sequelize,
    TipoInstitucion,
    TipoUsuario,
    TipoUsuarioxUsuario,
    Usuario
};
