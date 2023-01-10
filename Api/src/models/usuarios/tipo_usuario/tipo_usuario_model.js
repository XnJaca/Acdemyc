const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

module.exports = (sequelize, type) => sequelize.define('tipo_usuario', {
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: false
    },
},{
    // Other model options go here
    tableName: 'tipo_usuario',
    timestamps: false
});
