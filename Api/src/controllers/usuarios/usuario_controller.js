const { response, request } = require('express');
const bcrypt = require('bcryptjs');
const { Usuario } = require('../../config/modelsdb');

const usuariosGet = async (req = request, res = response) => {
    //Buscar todos los usuarios
    const usuarios = await Usuario.findAll();

    //Contar todos los usuarios
    const total = await Usuario.count();

    console.log(usuarios.every(user => user instanceof Usuario)); // true

    res.json({
        total,
        usuarios
    });
}


const usuariosPost = async (req, res = response) => {
    const { clave, ...body } = req.body;

    //Encriptamos la clave
    const salt = bcrypt.genSaltSync();
    body.clave = bcrypt.hashSync(clave, salt);

    //Creamos el usuario
    const usuario = await Usuario.create(body);

    res.json({
        usuario
    });
}

//Metodo para eliminar un usuario en cascada
const usuariosDelete = async (req, res = response) => {
    const { id } = req.params;

    //Eliminamos el usuario
    const usuario = await Usuario.findByPk(id);
    await usuario.destroy();
    
    res.json({
        msg: "Se elimino correctamente el usuario",
        usuario
    });
}


module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosDelete
}




