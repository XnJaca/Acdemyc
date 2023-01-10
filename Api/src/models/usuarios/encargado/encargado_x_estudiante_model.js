const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

module.exports = (sequelize, type) => sequelize.define('encargado_x_estudiante', {
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    fk_estudiante: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    fk_encargado: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: false,
    freezeTableName: true,
})
