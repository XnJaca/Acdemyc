const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

module.exports = (sequelize, type) => { // Exportamos el modelo de usuario
    return sequelize.define('usuario', {
        ID: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        Nombre: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Por favor ingrese su nombre'
                },
            },
        },
        // Apellidos: {
        //     type: Sequelize.STRING,
        //     allowNull: false,
        //     validate: {
        //         notNull: {
        //             msg: 'Por favor ingrese sus apellidos'
        //         },
        //     },
        // },
        Apellido_1: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Por favor ingrese su apellido'
                },
            },
        },
        Apellido_2: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Por favor ingrese su segundo apellido'
                },
            },
        },
        Email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notNull: {
                    msg: 'Por favor ingrese su email'
                },
                isEmail: {
                    msg: 'Por favor ingrese un email valido (ejemplo: email@gmail.com)',
                }
            },
        },
        Telefono: {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Por favor ingrese su telefono',
                },
                isNumeric: {
                    msg: 'Por favor ingrese un numero de telefono valido',
                },
                len: {
                    args: [8, 8],
                    msg: 'El numero de telefono debe tener 8 digitos',
                },
            }
        },
        Contrasenna: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Por favor ingrese su contraseña',
                },
            }
        },
        // Dirección: {
        //     type: Sequelize.STRING,
        //     allowNull: false,
        //     validate: {
        //         notNull: {
        //             msg: 'Por favor ingrese su dirección',
        //         },
        //     },
        // },
        // fk_institucion: {
        //     type: Sequelize.INTEGER,
        //     allowNull: false,
        //     validate: {
        //         notNull: {
        //             msg: 'Por favor ingrese su institucion',
        //         },
        //         isNumeric: {
        //             msg: 'Por favor ingrese un numero de institucion valido',
        //         },
        //     },
        // },
        Rol: {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Por favor ingrese su rol',
                },
                isNumeric: {
                    msg: 'Por favor ingrese un numero de rol valido',
                },
            }
        },
    }, {
        tableName: 'usuario',
        timestamps: false
    });

    
}