const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

module.exports = (sequelize, DataTypes) => { // Exportamos el modelo de usuario
    return sequelize.define('rol_institucion', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        descripcion: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Por favor ingrese la descripcion.'
                },
            },
        },
        fk_institucion: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Por favor ingrese el fk_institucion.'
                }
            }
        }
    }, {
        timestamps: false,
        freezeTableName: true,
    });
}