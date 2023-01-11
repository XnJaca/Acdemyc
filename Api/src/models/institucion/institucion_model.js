const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');


module.exports = (sequelize, DataTypes) => { // Exportamos el modelo de usuario
    return sequelize.define('institucion', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Por favor ingrese el nombre.'
                },
            },
        },
        cedula: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Por favor ingrese la cedula.'
                },
            },
        },
        direccion: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Por favor ingrese la direccion.'
                }
            }
        },
        estado: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Por favor ingrese el estado.'
                },
            }
        },
        fk_tipo_institucion: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Por favor ingrese el fk_tipo_institucion.'
                },
            },
        }
    },{
        timestamps: false,
        freezeTableName: true,
    });
}