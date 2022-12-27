const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

module.exports = (sequelize, DataTypes) => { // Exportamos el modelo de usuario
    return sequelize.define('rol_administrador', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        descripcion: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Por favor ingrese la descripción del rol'
                },
            },
        },
    }, {
        timestamps: false,
        freezeTableName: true,
    });
}