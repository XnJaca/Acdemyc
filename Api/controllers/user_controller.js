const { response, request } = require('express');
// const Usuario = require("../models/Usuario/Usuario_model");
const models = require('../models/db')

const User = models.userModel; // Obtenemos el modelo de usuario

const usuarioGetById = async (req = request, res = response) => {
  const { id } = req.query;
  const user = await User.findByPk(id);
  
  if (user === null) {
    res.json({
      message: `No se encontro el usuario con el id \'${id}\'.`
    });
    console.log(user instanceof User);
  } else {
    res.json({
      user: user,
    },)
    console.log(user instanceof User); // true
  }
}


const usuariosGet = async (req = request, res = response) => {
  const { id } = req.query;
  if (id != null) {
    usuarioGetById(req, res);
    return;
  }
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

  //TODO: CAMBIAR LA BUSQUEDA POR LA CEDULA.
  User.findOne({
    where: {
      Email: data.Email
    } // Buscamos el usuario por el nombre
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