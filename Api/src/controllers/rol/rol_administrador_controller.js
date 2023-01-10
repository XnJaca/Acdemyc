const { response, request } = require('express');
const bycript = require('bcryptjs');
const {Administrador,Rol_Admin, sequelize} = require('../../config/models_sync');

// Creamos el controlador
const rol_administradorController = {};

// Creamos el metodo de guardar
rol_administradorController.save = async (req = request, res = response) => {
    // Creamos un transac para crear rol_admin
    try {
        const result = await sequelize.transaction(async (t) => {
            // Creamos el rol_admin
            const rol_admin = await Rol_Admin.create(req.body, { transaction: t });
            //Retornamos
            return {
                rol_admin,
            }
        });

        //Enviamos la respuesta.
        res.json({
            result
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error inesperado',
            error
        });
    }
}

//Creamos el metodo para buscar todos
rol_administradorController.getAll = async (req = request, res = response) => {
    // Obtenemos el fk_institucion
    const fk_institucion = req.header('fk_institucion');
    // SI no viene el fk_institucion lanzamos un error
    if (!fk_institucion) {
        return res.status(400).json({
            msg: 'El fk_institucion es obligatorio'
        });
    }
    // Obtenemos el rol_admin
    const rol_admin = await Rol_Admin.findAll({
        where: {
            fk_institucion
        }
    });
    // Enviamos la respuesta
    res.json({
        rol_admin
    });
}