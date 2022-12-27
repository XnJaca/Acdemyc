const { response, request } = require('express');
const bycript = require('bcryptjs');
const { Administrador, Usuario, TipoUsuarioxUsuario, Rol_Administrador, sequelize } = require('../../config/modelsdb');

const administradoresGet = async (req = request, res = response) => {
    //Obtener los parametros del header
    const fk_institucion = req.header('fk_institucion');

    if (fk_institucion == null) {
        return res.status(400).json({
            msg: 'No se ha enviado el parametro fk_institucion en el header'
        });
    }

    //Buscar todos los usuarios administradores
    const administradores = await Administrador.findAll({
        include: [{
            model: Usuario,
            attributes: ['nombre', 'apellidos', 'email', 'cedula', 'celular', 'direccion', 'estado'],
            where: { estado: 1, fk_institucion: fk_institucion }
        },
        {
            model: Rol_Administrador,
            attributes: ['descripcion']
        }
        ],
    });

    //Total de Administradores
    const total = await Administrador.count();

    res.json({
        administradores,
        total,
        // rol: rol_admin
    })
}

//Metodo para guardar administradores
const administradoresPost = async (req = request, res = response) => {

    //Creamos una transaccion para crear admnistrador, usuario, y tipo_usuario_x_usuario
    try {
        const result = await sequelize.transaction(async (t) => {

            //Encriptamos la contrasena
            const salt = bycript.genSaltSync();
            const password = bycript.hashSync(req.body.clave, salt);

            //Creamos el usuario
            const usuario = await Usuario.create({
                cedula: req.body.cedula,
                nombre: req.body.nombre,
                apellidos: req.body.apellidos,
                fecha_nacimiento: req.body.fecha_nacimiento,
                genero: req.body.genero,
                email: req.body.email,
                clave: password,
                telefono: req.body.telefono,
                celular: req.body.celular,
                direccion: req.body.direccion,
                fk_institucion: req.body.fk_institucion,
                estado: req.body.estado,
                imagen: req.body.imagen,
            }, { transaction: t });

            //Creamos el administrador
            const administrador = await Administrador.create({
                fk_usuario: usuario.id,
                fk_rol_administrador: req.body.fk_rol_administrador
            }, { transaction: t });

            //Ingresamos a la tabla de tipo_usuario_x_usuario el usuario mas el tipo.
            const tpUsuarioxUsuario = await TipoUsuarioxUsuario.create({
                fk_usuario: usuario.id,
                fk_tipo_usuario: req.body.tipo_usuario
            }, { transaction: t })

            return {
                usuario,
                administrador,
                tipo_usuario: tpUsuarioxUsuario
            }
        });

        //Devolvemos al respuesta
        res.json({
            msg: 'Administrador creado',
            result
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error al crear el Administrador',
            error
        });
    }

}

// METODO PARA MODIFICAR UN ADMINISTRADOR
const administradoresPut = async (req = request, res = response) => {

    //Obtenemos el id del administrador
    const { id } = req.params;

    //Obtenemos el id del usuario
    const { fk_usuario } = id;

    //Obtenemos los datos para modificar el usuario
    const { clave, ...resto } = req.body;

    //Creamos una transaccion para modificar el administrador, usuario, y tipo_usuario_x_usuario
    try {
        const result = await sequelize.transaction(async (t) => {

            //Buscamos el usuario
            const usuario = await Usuario.findByPk(id);

            //Si existe no el usuario
            if (!usuario) {
                return res.status(400).json({
                    msg: 'No existe el usuario con el id ' + id
                });
            }

            //Si viene la clave la encriptamos
            if (clave) {
                const salt = bycript.genSaltSync();
                resto.clave = bycript.hashSync(clave, salt);
            }

            //Actualizamos el usario
            await usuario.update(resto, { transaction: t });

            //Buscamos el administrador
            const administrador = await Administrador.findByPk(id);

            //Si existe no el administrador
            if (!administrador) {
                return res.status(400).json({
                    msg: 'No existe el administrador con el id ' + id
                });
            }

            //Actualizamos el administrador
            await administrador.update(resto, { transaction: t });

            //Buscamos el tipo_usuario_x_usuario
            const tipo_usuario = await TipoUsuarioxUsuario.findOne({ where: { fk_usuario: id } });


            //Si existe no el tipo_usuario_x_usuario
            if (!tipo_usuario) {
                return res.status(400).json({
                    msg: 'No existe el tipo_usuario_x_usuario con el id ' + id
                });
            }

            //Actualizamos el tipo_usuario_x_usuario
            await tipo_usuario.update(resto, { transaction: t });

            //Buscamos el administrador usuario actualizado
            const administradorActualizado = await Administrador.findOne({
                where: { fk_usuario: id },
                include: [
                    {
                        model: Usuario,
                        as: 'usuario',
                        attributes: ['id', 'cedula', 'nombre', 'apellidos', 'fecha_nacimiento', 'genero', 'email', 'clave', 'telefono', 'celular', 'direccion', 'fk_institucion', 'estado', 'imagen'],
                        include: [
                            {
                                model: TipoUsuarioxUsuario,
                                as: 'tipo_usuario',
                                attributes: ['id', 'fk_usuario', 'fk_tipo_usuario'],
                                include: [
                                    {
                                        model: TipoUsuario,
                                        as: 'tipo_usuario',
                                        attributes: ['id', 'nombre']
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        model: RolAdministrador,

                        as: 'rol_administrador',
                        attributes: ['id', 'nombre']
                    }
                ]
            });


            return {
                administrador: administradorActualizado
            }

        });

        //Devolvemos al respuesta
        res.json({
            msg: 'Administrador actualizado',
            result
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error al actualizar el Administrador',
            error
        });
    }
}



// METODO PARA ELIMINAR EL USUARIO ADMINISTRADOR
const administradoresDelete = async (req = request, res = response) => {

    //Obtenemos el id del administrador
    const { id } = req.params;

    //Obtenemos el id del usuario
    const { fk_usuario } = req.body;

    //Creamos una transaccion para eliminar el administrador, usuario, y tipo_usuario_x_usuario
    try {
        const result = await sequelize.transaction(async (t) => {

            //Actualizamos el estado del usuario a 0
            const usuario = await Usuario.update({
                estado: 0
            }, {
                where: {
                    id: fk_usuario
                }
            }, { transaction: t });

            return {
                usuario,
            }
        });

        //Devolvemos al respuesta
        res.json({
            msg: 'Administrador eliminado',
            result
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error al eliminar el Administrador',
            error
        });
    }
}



module.exports = {
    administradoresGet,
    administradoresPost,
    administradoresPut,
    administradoresDelete

}



