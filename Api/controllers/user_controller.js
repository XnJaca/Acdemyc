const { response, request } = require('express');
const Usuario = require("../models/Usuario/Usuario_model");
const User = require('../models/db')

// const usuariosGet = (req = request, res = response) => {
//   const { id } = req.query;

//   if (id != null) {
//     Usuario.getById(id, (err, data) => {
//       if (err) {
//         if (err.kind === "not_found") {
//           res.status(404).send({
//             message: `Not found Usuario with id ${id}.`
//           });
//         } else {
//           res.status(500).send({
//             message: "Error retrieving Product with id " + id
//           });
//         }
//       } else res.send(data);
//     });
//   }else{
//     Usuario.getAll((err, data) => {
//       if (err)
//         res.status(500).send({
//           message:
//             err.message || "Some error occurred while retrieving customers."
//         });
//       else res.send(data);
//     });
//   }
// }

const usuariosGet = async (req = request, res = response) => {
  const users = await User.findAll();
  console.log(users.every(user => user instanceof User)); // true
  console.log("All users:", JSON.stringify(users, null, 2));
  res.json({
    users: users,
    
  },)
}

const usuariosPost = (req, res = response) => {
  const body = req.body;
  console.log(body);

  const data = {
    Nombre: body.Nombre,
    Apellido_1: body.Apellido_1,
    Apellido_2: body.Apellido_2,
    Email: body.Email,
    Telefono: body.Telefono,
    Contrasenna: body.Contrasenna,
    Rol: body.Rol
  }
  if (data.Contrasenna == '' || data.Nombre == '') {
    res.json('Usuario y Contrasena vacios');
  }

  User.findOne({
    where: {
      Nombre: data.Nombre
    }
  }).then(user => {
    if (user != null) {
      res.json({
        msg: "Usuario ya existe",
        user
      },)
    } else {
      User.create(data).then(() => {
        console.log('Usuario creado');
        res.json('Usuario creado');
      }).catch(err => {
        console.log(err)
        res.send('error: ' + err)
      })
    }
  })



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