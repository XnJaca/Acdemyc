const { response, request } = require('express');
const Usuario = require("../models/Usuario/Usuario_model");

const usuariosGet = (req = request, res = response) => {
  const { id } = req.query;
  
  if (id != null) {
    Usuario.getById(id, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Usuario with id ${id}.`
          });
        } else {
          res.status(500).send({
            message: "Error retrieving Product with id " + id
          });
        }
      } else res.send(data);
    });
  }else{
    Usuario.getAll((err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving customers."
        });
      else res.send(data);
    });
  }
}

const usuariosPost = (req, res = response) => {
  const body = req.body;
  res.json({
    msg: "post Api - Controller",
    body
  },)
}

const usuariosPut = (req, res = response) => {
  const id = req.params.id;
  res.json({
    msg: "put Api - Controller",
    id: id
  },)
}

const usuariosDelete = (req, res = response) => {
  res.json({
    msg: "delete Api - Controller",
  },)
}


module.exports = {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosDelete

}