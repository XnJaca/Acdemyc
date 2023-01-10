//Require express
const { response, request } = require('express');
//Require bycript
const bycript = require('bcryptjs');
//Require usuario
const { Usuario, Estudiante, TipoUsuario, TipoUsuarioxUsuario, sequelize } = require('../../config/models_sync');
const { encriptar } = require('../../helpers/encriptar');

//Creamos el controlador
const estudianteController = {};

//Creamos el metodo de registro

estudianteController.save = async (req = request, res = response) => {
    // Creamos una transaccion para crear estudiante, usuario y tipo_usuario_x_usuario
    try {

        const result = await sequelize.transaction(async (t) => {
            //Encriptamos la contrasena
            req.body.clave = await encriptar(req.body.clave);

            //Creamos el usuario
            const usuario = await Usuario.create(req.body, { transaction: t });
            //Creamos el estudiante
            const estudiante = await Estudiante.create({ fk_usuario: usuario.id }, { transaction: t });

            //Ingresamos a la tabla de tipo_usuario_x_usuario
            const tipo_usuario_x_usuario = await TipoUsuarioxUsuario.create({ fk_usuario: usuario.id, fk_tipo_usuario: req.body.tipo_usuario }, { transaction: t });
            
            //Retornamos
            return {
                usuario,
                estudiante,
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
estudianteController.getAll = async (req = request, res = response) => {

    // Obtenemos el fk_institucion
    const fk_institucion = req.header('fk_institucion');
    // SI no viene el fk_institucion lanzamos un error
    if (!fk_institucion) {
        return res.status(400).json({
            msg: 'El fk_institucion es obligatorio'
        });
    }
    //Si viene el id llamamos al metodo buscar por id
    if (req.query.id) {
        return estudianteController.getById(req, res);
    }

    let estudiantes;

    // Si estado es igual a 1 
    if (req.query.estado == 1) {
        //Buscamos todos los usuarios
        estudiantes = await Estudiante.findAll({
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
                    attributes: ['fk_tipo_usuario']
                }
            ],
        });
    }
    // Si estado es igual a 0
    if (req.query.estado == 0) {
        //Buscamos todos los usuarios con el estado igual a 0
        estudiantes = await Estudiante.findAll({
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
                    attributes: ['fk_tipo_usuario']
                }
            ],
        });
    }
    //Enviamos los usuarios
    res.json(estudiantes);
}

//Creamos el metodo para buscar por id
estudianteController.getById = async (req = request, res = response) => {
    //Obtenemos el usaurio que viene en el di
    const estudiante = await Estudiante.findOne({
        where: { fk_usuario: req.query.id },
        include: [{
            model: Usuario,
            attributes: ['nombre', 'apellidos', 'email', 'cedula', 'celular', 'direccion', 'estado', 'fk_institucion'],
            where: { estado: 1, fk_institucion: req.header('fk_institucion') },
        },
        {
            model: TipoUsuarioxUsuario,
            attributes: ['fk_tipo_usuario']
        }]
    });

    if (estudiante == null) {

        return res.status(400).json({
            msg: 'No existe un estudiante con el id ' + req.query.id
        });
    }

    res.json({
        estudiante
    })
}

//Creamos el metodo para actualizar
estudianteController.update = async (req = request, res = response) => {
    //Obtenemos el id del usuario
    const { id } = req.params;
    //Obtenemos el fk_institucion
    const fk_institucion = req.header('fk_institucion');
    //Si viene la clave la encriptamos
    if (req.body.clave) {
        req.body.clave = await encriptar(req.body.clave);
    }

    //Creamos una transaccion para actualizar es usuario estudiante
    try {

        await sequelize.transaction(async (t) => {
            //Actualizamos el usuario
            const usuario = await Usuario.update(
                req.body,
                {
                    where:
                    {
                        id: id,
                        fk_institucion: fk_institucion
                    }, transaction: t
                }
            );
            //Actualizamos el estudiante
            await Estudiante.update(req.body, { where: { fk_usuario: id }, transaction: t });
        });

        // Buscamos el estudiante actualizado sin la clave
        const estudianteActualizado = await Estudiante.findOne({
            where: { fk_usuario: id },
            include: [{
                model: Usuario,
                attributes: ['nombre', 'apellidos', 'email', 'cedula', 'celular', 'direccion', 'estado', 'fk_institucion'],
                where: { fk_institucion: fk_institucion },
            },
            {
                model: TipoUsuarioxUsuario,
                attributes: ['fk_tipo_usuario']
            }]
        });

        //Enviamos la respuesta.
        res.json({
            estudianteActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error inesperado',
            error
        });
    }
}

//Creamos el metodo para eliminar logico
estudianteController.delete = async (req = request, res = response) => {
    //Obtenemos el id del usuario
    const { id } = req.params;
    //Obtenemos el fk_institucion
    const fk_institucion = req.header('fk_institucion');
    //Creamos una transaccion para actualizar es usuario estudiante
    try {
        await sequelize.transaction(async (t) => {

            //Actualizamos el usuario
            await Usuario.update(
                { estado: 0 },
                {
                    where:
                    {
                        id: id,
                        fk_institucion: fk_institucion
                    }, transaction: t
                }
            );
        });

        // Buscamos el usuario estudiante actualizado
        const estudianteActualizado = await Estudiante.findOne({
            where: { fk_usuario: id },
            include: [{
                model: Usuario,
                attributes: ['nombre', 'apellidos', 'email', 'cedula', 'celular', 'direccion', 'estado', 'fk_institucion'],
                where: { fk_institucion: fk_institucion },
            },
            {
                model: TipoUsuarioxUsuario,
                attributes: ['fk_tipo_usuario']
            }]
        });

        //Enviamos la respuesta.
        res.json({
            estudianteActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error inesperado',
            error
        });
    }
}

//Exportamos el controlador
module.exports = {
    estudianteController
};
