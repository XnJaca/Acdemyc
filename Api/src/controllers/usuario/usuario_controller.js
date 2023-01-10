//Require express
const { response, request }  = require('express');
//Require bycript
const bycript = require('bcryptjs');
//Require usuario
const { Usuario } = require('../../config/models_sync');

//Creamos el controlador
const usuarioController = {};

//Creamos el metodo de registro
usuarioController.save = async (req = request, res = response) => {
    //Obtenemos los datos del usuario
    const { cedula, nombre, apellidos, fecha_nacimiento, genero, email, clave, telefono, celular, direccion, fk_institucion } = req.body;
    //Encriptamos la clave
    const claveEncriptada = await bycript.hash(clave, 10);
    //Creamos el usuario
    const usuario = await Usuario.create({
        cedula,
        nombre,
        apellidos,
        fecha_nacimiento,
        genero,
        email,
        clave: claveEncriptada,
        telefono,
        celular,
        direccion,
        fk_institucion
    });
    //Enviamos el usuario
    res.json({
        usuario: usuario
    });
}

//Creamos el metodo para buscar todos
usuarioController.getAll = async (req = request, res = response) => {
    //Si viene el id llamamos al metodo buscar por id
    if (req.query.id) {
        return usuarioController.getById(req, res);
    }

    //Buscamos todos los usuarios sin la clave
    const usuarios = await Usuario.findAll({
        attributes: { exclude: ['clave'] }
    });

    //Enviamos el usuario
    res.json({
        usuarios: usuarios
    });
}

//Creamos el metodo para buscar por id
usuarioController.getById = async (req = request, res = response) => {
    //Obtenemos el id
    const  id  = req.query.id;
    //Buscamos el usuario sin la clave
    const usuario = await Usuario.findByPk(id, {
        attributes: { exclude: ['clave'] }
    });

    //Enviamos el usuario
    res.json(usuario);
}

//Creamos el metodo para actualizar
usuarioController.update = async (req = request, res = response) => {
    //Obtenemos el id
    const { id } = req.params;
    //Obtenemos los datos del usuario
    const { clave, ...body } = req.body

    //Si viene la clave la encriptamos
    if (clave) {
        clave = await bycript.hash(clave, 10);
    }

    // Creamos una transaccion para actualizar el usuario
    const transaction = await Usuario.sequelize.transaction();
    try {
        //Actualizamos el usuario
        const usuario = await Usuario.update(body, {
            where: {
                id
            }
        },
        { transaction }
        );

        // Buscamos el usuario actualizado pero sin la clave
        const usuarioActualizado = await Usuario.findByPk(id, {
            attributes: { exclude: ['clave'] }
        });

        //Enviamos el usuario
        res.json(usuarioActualizado);
        //Si todo sale bien hacemos el commit
        await transaction.commit();
    } catch (error) {
        //Si algo sale mal hacemos el rollback
        await transaction.rollback();
        //Enviamos el error
        res.json(error);
    }


}

//Creamos el metodo para eliminar logico
usuarioController.delete = async (req = request, res = response) => {
    
    const usuarioAutenticado = req.usuario;
    console.log(usuarioAutenticado);
    return;
    //Obtenemos el id
    const { id } = req.params;



    //Actualizamos el usuario
    const usuario = await Usuario.update({
        estado: 0
    }, {
        where: {
            id
        }
    });
    //Enviamos el usuario
    res.json(usuario);
}

//Exportamos el controlador
module.exports = {
    usuarioController
};