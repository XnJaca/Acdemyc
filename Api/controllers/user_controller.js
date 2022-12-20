const { response, request } = require('express');
const bycript = require('bcryptjs');
const { UserModel } = require('../models/db');

const usuariosGetById = async (req = request, res = response) => {
  const { id } = req.query;
  const user = await UserModel.findByPk(id);

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
  if (id != null) { // Si el id no es nulo, se busca el usuario por el id
    usuariosGetById(req, res);
    return;
  }

  const users = await UserModel.findAll();
  console.log(users.every(user => user instanceof UserModel)); // true
  console.log("All users:", JSON.stringify(users, null, 2));
  res.json({
    users: users,
  },)
}


//METODO POST PARA CREAR UN USUARIO
const usuariosPost = (req, res = response) => {
  const body = req.body;

  const data = {
    Nombre: body.Nombre,
    Apellido_1: body.Apellido_1,
    Apellido_2: body.Apellido_2,
    Email: body.Email,
    Telefono: body.Telefono,
    Contrasenna: body.Contrasenna,
    Rol: body.Rol
  }

  //Encriptar la contraseña
  const salt = bycript.genSaltSync(); //Genera el salt (Numero de vueltas para encriptar)
  data.Contrasenna = bycript.hashSync(data.Contrasenna, salt); //Encripta la contraseña

  UserModel.create(data).then(() => { // Creamos el usuario
    console.log('Usuario creado');
    res.json('Usuario creado');
  }).catch(err => {
    console.log(err)
    res.send('error: ' + err)
  })

}

const usuariosPut = async (req, res = response) => {
  const id = req.params.id;
  const { ID ,Contrasenna, ...body } = req.body;

  //TODO: Validar contra base de datos
  if (Contrasenna) {
    //Encriptar la contraseña
    const salt = bycript.genSaltSync(); //Genera el salt (Numero de vueltas para encriptar)
    body.Contrasenna = bycript.hashSync(Contrasenna, salt); //Encripta la contraseña
  }

  let user = await UserModel.update(body, { // Actualizamos el usuario
    where: {
      ID: id,
    }
  });
  user = await UserModel.findByPk(id); // Buscamos el usuario actualizado
  res.json({
    user: user,
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