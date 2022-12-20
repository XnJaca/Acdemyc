const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

module.exports = (sequelize, type) => { // Exportamos el modelo de usuario
    return sequelize.define('rol', {
        ID: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        Nombre: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notNull: {
                    msg: 'Por favor ingrese el nombre del rol'
                },
            },
        },
        // Descripcion: {
        //     type: Sequelize.STRING,
        //     allowNull: false,
        //     validate: {
        //         notNull: {
        //             msg: 'Por favor ingrese la descripción del rol'
        //         },
        //     },
        // },
    }, {
        timestamps: false,
        tableName: 'rol',
    });
}