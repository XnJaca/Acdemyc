//Require sequelize
const {Sequelize, DataTypes} = require('sequelize');

const sequelize = new Sequelize('sqlite::memory:');

//Define the model
module.exports = (sequelize, DataTypes) => sequelize.define('usuario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    cedula: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    apellidos: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fecha_nacimiento: {
        type: DataTypes.DATE,
        allowNull: false
    },
    genero: {
        type: DataTypes.CHAR,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    clave: {
        type: DataTypes.STRING,
        allowNull: false
    },
    telefono: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    celular: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    direccion: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fk_institucion: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    estado: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    google: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    imagen: {
        type: DataTypes.TEXT,
        allowNull: true,
    }
}, {
    // Other model options go here
    tableName: 'usuario',
    timestamps: false
});