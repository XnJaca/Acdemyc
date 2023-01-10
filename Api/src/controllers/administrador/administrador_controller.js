//Require express
const { response, request } = require('express');
//Require encriptar
const { encriptar } = require('../../helpers/encriptar');
//Require usuario
const { Usuario, Administrador, TipoUsuarioxUsuario, RolAdmin, RolInstitucion, sequelize } = require('../../config/models_sync');

//Creamos el controlador
const administradorController = {};

//Creamos el metodo de guardar
administradorController.save = async (req = request, res = response) => {
    // Creamos un transac para crear usuario, administrador y RolAdmin
    try {
        const result = await sequelize.transaction(async (t) => {
            //Encriptamos la contrasena
            req.body.clave = await encriptar(req.body.clave);
            //Creamos el usuario
            const usuario = await Usuario.create(req.body, { transaction: t });
            //Creamos el administrador
            const administrador = await Administrador.create({ fk_usuario: usuario.id, fk_RolAdministrador: req.body_fk_RolAdministrador }, { transaction: t });
            // Guardamos en la tabla tipo_usuario_x_usuario
            const tipo_usuario_x_usuario = await TipoUsuarioxUsuario.create({ fk_usuario: usuario.id, fk_tipo_usuario: req.body.tipo_usuario }, { transaction: t });
            // Guardamos en la tabla de RolAdministrador el rol y el fk_administrador
            const RolAdministrador = await RolAdmin.create({ fk_administrador: administrador.fk_usuario, fk_rol_institucion: req.body.rol }, { transaction: t });
            // Buscamos el rol_institucion
            const rol_institucion = await RolInstitucion.findOne({ where: { fk_institucion: req.body.fk_institucion, fk_institucion: req.body.rol }, attributes: ['descripcion', 'fk_institucion'] });

            //Retornamos
            return {
                usuario,
                administrador,
                tipo_usuario_x_usuario,
                RolAdministrador: rol_institucion,
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
administradorController.getAll = async (req = request, res = response) => {
    // Obtenemos el fk_institucion
    const fk_institucion = req.header('fk_institucion');

    try {
        // Obtenemos el id
        const id = req.query.id;
        // Si viene el id
        if (id) {
            // Buscamos el administrador por id
            return administradorController.getById(req, res);
        }

        let administradores;
        if (req.query.estado == 1) {
            administradores = await Administrador.findAll({
                include: [
                    {
                        model: Usuario,
                        where: {
                            fk_institucion,
                            estado: 1
                        },
                        attributes: ['nombre', 'apellidos', 'email', 'cedula', 'celular', 'direccion', 'fk_institucion', 'estado'],
                    },
                    {
                        model: RolAdmin,
                    },
                    {
                        model: TipoUsuarioxUsuario,
                        attributes: ['fk_tipo_usuario'],
                    }
                ]
            });
        } else {
            administradores = await Administrador.findAll({
                include: [
                    {
                        model: Usuario,
                        where: {
                            fk_institucion,
                            estado: 0
                        },
                        attributes: ['nombre', 'apellidos', 'email', 'cedula', 'celular', 'direccion', 'fk_institucion', 'estado'],
                    },
                    {
                        model: RolAdmin,
                    },
                    {
                        model: TipoUsuarioxUsuario,
                        attributes: ['fk_tipo_usuario'],
                    }
                ]
            });
        }

        //Enviamos la respuesta
        res.json({
            administradores
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
administradorController.getById = async (req = request, res = response) => {
    // Obtenemos el usuario que viene en el id
    const administrador = await Administrador.findOne({
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
                model: RolAdmin,
            },
            {
                model: TipoUsuarioxUsuario,
                attributes: ['fk_tipo_usuario'],
            }
        ]
    });

    if (administrador == null) {
        return res.status(404).json({
            msg: 'No existe el administrador'
        });
    }

    //Enviamos la respuesta
    res.json({
        administrador
    });
}

//Creamos el metodo para actualizar
administradorController.update = async (req = request, res = response) => {

    try {
        // Obtenemos el id
        const id = req.params.id;
        // Obtenemos el fk_institucion
        const fk_institucion = req.header('fk_institucion');

        // Si viene la clave la encritamos
        if (req.body.clave) {
            req.body.clave = await encriptar(req.body.clave);
        }

        // Creamos un transac para actualizar usuario, administrador y RolAdmin
        await sequelize.transaction(async (t) => {
            // Actualizamos el usuario
            const usuario = await Usuario.update(req.body, {
                where: {
                    id: id,
                    fk_institucion: fk_institucion
                },
                transaction: t
            });

            // Actualizamos el administrador
            await Administrador.update({ fk_RolAdministrador: req.body.fk_RolAdministrador }, {
                where: {
                    fk_usuario: id
                },
                transaction: t
            });

        });

        // Buscamos el administrador actualizado
        const result = await Administrador.findOne({
            where: {
                fk_usuario: id
            },
            // Excluir el fk_usuario
            attributes: { exclude: ['fk_usuario'] },
            include: [
                {
                    model: Usuario,
                    attributes: ['id','nombre', 'apellidos', 'email', 'cedula', 'celular', 'direccion', 'fk_institucion', 'estado'],
                    where: { fk_institucion: fk_institucion }
                },
                {
                    model: RolAdmin,
                },
                {
                    model: TipoUsuarioxUsuario,
                    attributes: ['fk_tipo_usuario'],
                }
            ]
        });

        //Enviamos la respuesta
        res.status(200).json({
            result
        });

    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error inesperado',
            error
        });
    }
}


//Creamos el metodo para eliminar
administradorController.delete = async (req = request, res = response) => {
    // Obtenemos el id
    const id = req.params.id;
    // Obtenemos el fk_institucion
    const fk_institucion = req.header('fk_institucion');

    // Creamos un transac para actualizar usuario, administrador y RolAdmin
    try {
        await sequelize.transaction(async (t) => {
            // Actualizamos el usuario
            await Usuario.update({ estado: 0 }, {
                where: {
                    id: id,
                    fk_institucion: fk_institucion
                },
                transaction: t
            });

            // Enviamos la respueta
            res.json({
                msg: 'Usuario eliminado correctamente'
            });
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
module.exports = { administradorController };