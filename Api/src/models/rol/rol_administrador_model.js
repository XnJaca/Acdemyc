const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

module.exports = (sequelize, DataTypes) => { // Exportamos el modelo de usuario
    return sequelize.define('rol_administrador', {
        fk_rol_institucion: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Por favor ingrese el fk_rol_institucion.'
                },
            },
        },
        fk_administrador: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Por favor ingrese el fk_administrador.'
                },
            },
        },
    }, {
        timestamps: false,
        freezeTableName: true,
    });
}