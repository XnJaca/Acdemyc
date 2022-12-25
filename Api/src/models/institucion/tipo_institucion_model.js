const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db_config');

module.exports = (sequelize, DataTypes) => sequelize.define('tipo_institucion', {
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    timestamps: false,
    freezeTableName: true,
});

