//Require express
const { response, request } = require('express');
//Require bycript
const bycript = require('bcryptjs');
//Require usuario
const { Usuario, Encargado, EncargadoXEstudiante, Estudiante, TipoUsuarioxUsuario, sequelize } = require('../../config/models_sync');
const { encriptar } = require('../../helpers/encriptar');

//Creamos el controlador
const encargadoController = {};

//Creamos el metodo de guardar
encargadoController.save = async (req = request, res = response) => {
    // Creamos un transac para crear encargado, usuario y la relacion encargado por estudiante
    try {
        const result = await sequelize.transaction(async (t) => {
            //Encriptamos la contrasena
            req.body.clave = await encriptar(req.body.clave);
            //Creamos el usuario
            const usuario = await Usuario.create(req.body, { transaction: t });
            //Creamos el encargado
            const encargado = await Encargado.create({ fk_usuario: usuario.id }, { transaction: t });
            //Creamos la relacion encargado por estudiante
            const encargado_x_estudiante = await EncargadoXEstudiante.create({ fk_encargado: encargado.fk_usuario, fk_estudiante: req.body.fk_estudiante }, { transaction: t });
            // Guardamos en la tabla tipo_usuario_x_usuario
            const tipo_usuario_x_usuario = await TipoUsuarioxUsuario.create({ fk_usuario: usuario.id, fk_tipo_usuario: req.body.tipo_usuario }, { transaction: t });

            //Retornamos
            return {
                usuario,
                encargado,
                encargado_x_estudiante,
                tipo_usuario_x_usuario
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
encargadoController.getAll = async (req = request, res = response) => {

    // Obtenemos el fk_institucion
    const fk_institucion = req.header('fk_institucion');
    // SI no viene el fk_institucion lanzamos un error
    if (!fk_institucion) {
        return res.status(400).json({
            msg: 'El fk_institucion es obligatorio'
        });
    }
    //Si viene el id llamamos al metodo buscar por id
    try {
        //Obtenemos el id
        const id = req.query.id;
        //Si viene el id llamamos al metodo buscar por id
        if (id) {
            return encargadoController.getById(req, res);
        }

        let encargados;
        if (req.query.estado == 1) {
            encargados = await Encargado.findAll({
                include: [
                    {
                        model: Usuario,
                        where: {
                            fk_institucion: fk_institucion,
                            estado: 1
                        },
                        attributes: ['nombre', 'apellidos', 'email', 'cedula', 'celular', 'direccion', 'fk_institucion', 'estado'],
                    },
                    {
                        model: TipoUsuarioxUsuario,
                        attributes: ['fk_tipo_usuario'],
                    }
                ],
            });
        } else {
            encargados = await Encargado.findAll({
                include: [
                    {
                        model: Usuario,
                        where: {
                            fk_institucion: fk_institucion,
                            estado: 0
                        },
                        attributes: ['nombre', 'apellidos', 'email', 'cedula', 'celular', 'direccion', 'fk_institucion', 'estado'],
                    },
                    {
                        model: TipoUsuarioxUsuario,
                        attributes: ['fk_tipo_usuario'],
                    }
                ],
            });
        }
        //Enviamos la respuesta
        res.json({
            encargados
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error inesperado',
            error
        });
    }
}

//Creamos el metodo para buscar por id
encargadoController.getById = async (req = request, res = response) => {
    //Obtenemos el usuario que viene en el id
    const encargado = await Encargado.findOne({
        where: {
            fk_usuario: req.query.id
        },
        include: [
            {
                model: Usuario,
                attributes: ['nombre', 'apellidos', 'email', 'cedula', 'celular', 'direccion', 'fk_institucion', 'estado'],
                where: { fk_institucion: req.header('fk_institucion') }
            },
            {
                model: TipoUsuarioxUsuario,
                attributes: ['fk_tipo_usuario'],
            }
        ],
    });

    if (encargado == null) {
        return res.status(400).json({
            msg: 'No existe el encargado'
        });
    }

    //Enviamos la respuesta
    res.json({
        encargado
    });
}

//Creamos el metodo para actualizar
encargadoController.update = async (req = request, res = response) => {

    //Creamos un transac para actualizar el encargado, usuario y la relacion encargado por estudiante
    try {
        //Obtenemos el id
        const id = req.params.id;
        //Obtenemos el fk_institucion
        const fk_institucion = req.header('fk_institucion');

        // Si viene la clave la encriptamos
        if (req.body.clave) {
            req.body.clave = await encriptar(req.body.clave);
        }

        await sequelize.transaction(async (t) => {
            //Actualizamos el usuario
            await Usuario.update(req.body,
                { where: { id: id, fk_institucion: fk_institucion }, transaction: t });
            //Actualizamos el encargado
            await Encargado.update({ fk_usuario: id },
                { where: { fk_usuario: id }, transaction: t });
            //Actualizamos la relacion encargado por estudiante
            // await EncargadoXEstudiante.update({ fk_encargado: id },
            //     { where: { fk_encargado: id }, transaction: t });
            //Retornamos
            return {
                id
            }
        });

        // Buscamos le estudiante actualizado sin la clave
        const result = await Encargado.findOne({
            where: {
                fk_usuario: result.id
            },
            include: [
                {
                    model: Usuario,
                    attributes: ['nombre', 'apellidos', 'email', 'cedula', 'celular', 'direccion', 'fk_institucion', 'estado'],
                    where: { fk_institucion: fk_institucion }
                },
                {
                    model: TipoUsuarioxUsuario,
                    attributes: ['fk_tipo_usuario'],
                }
            ],
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

//Creamos el metodo para eliminar
encargadoController.delete = async (req = request, res = response) => {
    //Obtenemos el id
    const id = req.params.id;
    //Obtenemos el fk_institucion
    const fk_institucion = req.header('fk_institucion');

    //Creamos un transac para actualizar el encargado, usuario y la relacion encargado por estudiante
    try {
        await sequelize.transaction(async (t) => {
            //Actualizamos el usuario
            await Usuario.update({ estado: 0 },
                { where: { id: id, fk_institucion: fk_institucion }, transaction: t });
        });

        //Enviamos la respuesta.
        res.json({
            msg: 'Usuario eliminado correctamente'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error inesperado',
            error
        });
    }
}

// Exportamos
module.exports = {
    encargadoController
};


