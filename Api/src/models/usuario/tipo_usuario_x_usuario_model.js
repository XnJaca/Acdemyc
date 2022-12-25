const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

module.exports = (sequelize, type) => sequelize.define('tipo_usuario_x_usuario', {
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    fk_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    fk_tipo_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
},{
    tableName: 'tipo_usuario_x_usuario',
    timestamps: false,
})
