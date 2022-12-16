const Sequelize = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

module.exports = (sequelize, type) => {
    return sequelize.define('usuario', {
        ID: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        Nombre: {
            type: Sequelize.STRING,
            required: 'El nombre es obligatorio',
            allowNull: false,
        },
        Apellido_1: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        Apellido_2: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        Email: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        Telefono: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        Contrasenna: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        Rol: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
    }, {
        tableName: 'usuario',
        createdAt:false,
        updatedAt: false,
    });
}




// const sql = require("../db.js");


// // constructor, nos conectamos al tabla de Usuarios desde nuestra base de datos.
// var Usuario = sql.extend({
//     tableName: "usuario",
// });

// usuario = new Usuario();

// Usuario.getAll = result => {
//     usuario.find('all', function (err, rows) {
//         if (err) {
//             console.log("error: ", err);
//             result(null, err);
//             return;
//         }
//         console.log("usuarios: ", rows);
//         result(null, rows);
//     });
// }

// Usuario.getById = (usuarioId, result) => {
//     usuario.find('first',{where : `ID = ${usuarioId}`}, function (err, rows) {
//         if (err) {
//             console.log("error: ", err);
//             result(null, err);
//             return;
//         }
//         console.log("usuarios: ", rows);
//         result(null, rows);
//     });
// }


// module.exports = Usuario;





