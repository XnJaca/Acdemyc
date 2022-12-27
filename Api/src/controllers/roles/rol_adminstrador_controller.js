const { response, request } = require('express');
const bycript = require('bcryptjs');
const { Rol_Administrador, sequelize } = require('../../config/db_config');

//Metodo get para obtener todos los rol de administrador
const rolAdministradorGet = async (req = request, res = response) => {
    const rol_administrador = await Rol_Administrador.findAll();
    res.json({
        rol_administrador
    });
}

//Metodo post para crear un rol de administrador
const rolAdministradorPost = async (req = request, res = response) => {
    const { descripcion } = req.body;
    const rol_administrador = await Rol_Administrador.create({
        descripcion
    });
    res.json({
        rol_administrador
    });
}

//Metodo put para actualizar un rol de administrador
const rolAdministradorPut = async (req = request, res = response) => {
    const { id } = req.params;
    const { descripcion } = req.body;
    const rol_administrador = await Rol_Administrador.update({
        descripcion
    }, {
        where: {
            id: id
        }
    });

    //Buscamos el rol de administrador actualizado
    const rol_administrador_actualizado = await Rol_Administrador.findOne({
        where: {
            id: id
        }
    });

    res.json({
        rol_administrador_actualizado
    });
}

//Metodo delete para eliminar un rol de administrador
const rolAdministradorDelete = async (req = request, res = response) => {
    const { id } = req.params;
    const rol_administrador = await Rol_Administrador.destroy({
        where: {
            id: id
        }
    });
    res.json({
        rol_administrador
    });
}

module.exports = {
    rolAdministradorGet,
    rolAdministradorPost,
    rolAdministradorPut,
    rolAdministradorDelete
}

