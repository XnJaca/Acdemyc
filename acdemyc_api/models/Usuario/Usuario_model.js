const sql = require("../db.js");

// constructor, nos conectamos al tabla de Usuarios desde nuestra base de datos.
var Usuario = sql.extend({
    tableName: "usuario",
});

usuario = new Usuario();

Usuario.getAll = result => {
    usuario.find('all', function (err, rows) {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        console.log("usuarios: ", rows);
        result(null, rows);
    });
}

Usuario.getById = (usuarioId, result) => {
    usuario.find('first',{where : `ID = ${usuarioId}`}, function (err, rows) {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        console.log("usuarios: ", rows);
        result(null, rows);
    });
}


module.exports = Usuario;
