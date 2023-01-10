const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');


module.exports = (sequelize, type) => { // Exportamos el modelo de estudiante.
    return sequelize.define('administrador', {
        fk_usuario: {
            type: type.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
    }, {
        timestamps: false,
        freezeTableName: true,
    });
};

