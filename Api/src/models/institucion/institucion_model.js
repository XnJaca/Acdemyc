const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db_config');

module.exports = (sequelize, DataTypes) => sequelize.define('institucion', {
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    direccion: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cedula: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fk_tipo_institucion: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

}, {
    timestamps: false,
    freezeTableName: true,
});
