const { response, request } = require('express');
const bycript = require('bcryptjs');
const { Usuario, Profesor, TipoUsuarioxUsuario, sequelize, TipoUsuario } = require('../../config/modelsdb');

//metodo para obtener los profesores
const profesoresGet = async (req = request, res = response) => {

    //Obtenemos el fk de institucion
    const fk_institucion = req.header('fk_institucion');
    //Obtenemos el id que viene en el request
    if (req.query.id) {
        profesoresGetById(req, res, req.param.id, fk_institucion);
        return
    }

    if (fk_institucion == null) {
        return res.status(400).json({
            msg: 'No se ha enviado el parametro fk_institucion en el header'
        });
    }

    const profesores = await Profesor.findAll({
        include: [
            {
                model: Usuario,
                where: { estado: 1, fk_institucion: fk_institucion },
                attributes: ['nombre', 'apellidos', 'email', 'cedula', 'telefono', 'direccion', 'estado', 'fk_institucion'],
            },
            {
                model: TipoUsuarioxUsuario,
                attributes: ['fk_tipo_usuario', 'fk_usuario']
            },
        ]
    });

    res.json({
        profesores
    })
}

// Metodo para crear un nuevo profesor
const profesoresPost = async (req = request, res = response) => {
    //Creamos una transaccion para crear profesor, usuario, y tipo_usuario_x_usuario
    try {
        const result = await sequelize.transaction(async (t) => {
            //Encriptamos la contrasena
            const salt = bycript.genSaltSync();
            req.body.clave = bycript.hashSync(req.body.clave, salt);

            //Creamos el usuario
            const usuario = await Usuario.create(req.body, { transaction: t });
            //Creamos el profesor
            const profesor = await Profesor.create({
                fk_usuario: usuario.id
            }, { transaction: t });

            //Ingresamos a la tabla de tipo_usuario_x_usuario el usuario profesor
            const tipo_usuario_x_usuario = await TipoUsuarioxUsuario.create({
                fk_tipo_usuario: 3,
                fk_usuario: usuario.id
            }, { transaction: t });

            return {
                usuario,
                profesor,
                tipo_usuario_x_usuario
            }
        }
        );

        res.json({
            result
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error inesperado',
            error
        })
    }
}

//METODO PARA MODIFICAR EL USUARIO PROFESOR
const profesoresPut = async (req = request, res = response) => {
    //Obtenemos el id que viene en el request
    const id = req.params.id;
    //Obtenemos el fk de institucion
    const fk_institucion = req.header('fk_institucion');

    //Validamos que el id no sea nulo
    if (id == null) {
        return res.status(400).json({
            msg: 'No se ha enviado el parametro id en el header'
        });
    }

    //Validamos que el fk_institucion no sea nulo
    if (fk_institucion == null) {
        return res.status(400).json({
            msg: 'No se ha enviado el parametro fk_institucion en el header'
        });
    }

    //Validamos que el usuario exista
    const usuario = await Usuario.findByPk(id);
    if (usuario == null) {
        return res.status(400).json({
            msg: 'No existe el usuario con el id ' + id
        });
    }

    //Validamos que el usuario pertenezca a la institucion

    if (usuario.fk_institucion != fk_institucion) {
        return res.status(400).json({
            msg: 'El usuario con el id ' + id + ' no pertenece a la institucion con el id ' + fk_institucion
        });
    }

    //Validamos que el usuario sea un profesor
    const tipo_usuario_x_usuario = await TipoUsuarioxUsuario.findOne({
        where: {
            fk_usuario: id,
            fk_tipo_usuario: 3
        }
    });

    if (tipo_usuario_x_usuario == null) {
        return res.status(400).json({
            msg: 'El usuario con el id ' + id + ' no es un profesor'
        });
    }

    //Creamos una transaccion para modificar profesor, usuario, y tipo_usuario_x_usuario
    try {
        const result = await sequelize.transaction(async (t) => {
            //Encriptamos la contrasena

            if (req.body.clave) {
                const salt = bycript.genSaltSync();
                req.body.clave = bycript.hashSync(req.body.clave, salt);
            }

            //Modificamos el profesor usuario
            const usuario = await Usuario.update(req.body, {
                where: {
                    id
                }
            }, { transaction: t });

            //Modificamos el profesor
            const profesor = await Profesor.update({
                fk_usuario: usuario.id
            }, {
                where: {
                    fk_usuario: id
                }
            }, { transaction: t });

            //Buscamos el profesor actualizado incluyendo el usuario
            const profesorActualizado = await Profesor.findOne({
                where: {
                    fk_usuario: id
                },
                include: [
                    {
                        model: Usuario,
                        attributes: ['nombre', 'apellidos', 'email', 'cedula', 'telefono', 'direccion', 'estado', 'fk_institucion'],
                        where: {
                            id
                        }
                    }
                ]
            });



            return {
                profesorActualizado
            }
        }
        );

        res.json({
            result
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error inesperado',
            error
        })
    }
}

/// METODO PARA ELIMINAR EL USUARIO ADMINISTRADOR
const profesoresDelete = async (req = request, res = response) => {
    //Obtenemos el id que viene en el request
    const id = req.params.id;
    //Obtenemos el fk de institucion
    const fk_institucion = req.header('fk_institucion');

    //Creamos una transaccion para eliminar el administrador, usuario, y tipo_usuario_x_usuario
    try {
        const result = await sequelize.transaction(async (t) => {

            //Actualizamos el estado del usuario a 0
            const usuario = await Usuario.update({
                estado: 0
            }, {
                where: {
                    id: id
                }
            }, { transaction: t });

            return {
                usuario,
            }
        });

        //Devolvemos al respuesta
        res.json({
            msg: 'Profesor eliminado',
            result
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error al eliminar el Profesor',
            error
        });
    }
}

module.exports = {
    profesoresGet,
    profesoresPost,
    profesoresPut,
    profesoresDelete
}