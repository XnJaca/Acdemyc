// Primero traemos nuestra base de datos
const sql = require("./db.js");

// constructor, nos conectamos al tabla de Usuarios desde nuestra base de datos.
const Usuario = function(Usuarios) {
  this.name = Usuarios.name;
};

//Traemos todos los datos desde la tabla Products
Usuario.getAll = result => {
  sql.query("SELECT * FROM usuario", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("usuarios: ", res);
    result(null, res);
  });
};

//Buscamos datos por ID
Usuario.findById = (usuarioId, result) => {
  sql.query(`SELECT * FROM usuario WHERE ID = ${usuarioId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found usuarios: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Product with the id
    result({ kind: "not_found" }, null);
  });
};

module.exports = Usuario;