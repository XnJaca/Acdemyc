const { response, request } = require('express');
const bycript = require('bcryptjs');
const { Usuario, Estudiante, TipoUsuarioxUsuario, sequelize } = require('../../config/modelsdb');

const estudiantesGetById = async (req = request, res = response) => {
    //Obtenemos el usaurio que viene en el di
    const estudiante = await Estudiante.findOne({
        where: { fk_usuario: req.query.id },
        include: [{
            model: Usuario,
            attributes: ['nombre', 'apellidos', 'email', 'cedula', 'telefono', 'direccion', 'estado', 'fk_institucion'],
            where: { estado: 1, fk_institucion: req.header('fk_institucion') },
        },
        {
            model: TipoUsuarioxUsuario,
            attributes: ['fk_tipo_usuario', 'fk_usuario']
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

//METODO PARA OBTENER TODOS LOS ESTUDIANTES
const estudiantesGet = async (req = request, res = response) => {
    //Obtener el fk_institucion. que viene en el header
    const fk_institucion = req.header('fk_institucion');
    //Obtenemos el id que viene en el request
    if (req.query.id) {
        estudiantesGetById(req, res, req.param.id, fk_institucion);
        return
    }

    if (fk_institucion == null) {
        return res.status(400).json({
            msg: 'No se ha enviado el parametro fk_institucion en el header'
        });
    }

    const estudiantes = await Estudiante.findAll({
        include: [{
            model: Usuario,
            attributes: ['nombre', 'apellidos', 'email', 'cedula', 'celular', 'direccion', 'estado', 'fk_institucion'],
            where: { estado: 1, fk_institucion: fk_institucion },
        },
        {
            model: TipoUsuarioxUsuario,
            attributes: ['fk_tipo_usuario', 'fk_usuario']
        }]
    });

    //Contamos el total de estudiantes con estado = 1
    const total = await Estudiante.count({
        include: [{
            model: Usuario,
            where: { estado: 1 },
        }]
    });

    res.json({
        estudiantes,
        total,
    })
}

//METODO PARA CREAR UN ESTUDIANTE
const estudiantesPost = async (req = request, res = response) => {
    //Creamos una transaccion para crear estudiante, usuario, y tipo_usuario_x_usuario
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
                telefono: req.body.telefono,
                clave: password,
                celular: req.body.celular,
                direccion: req.body.direccion,
                fk_institucion: req.body.fk_institucion,
                estado: req.body.estado,
                imagen: req.body.imagen
            }, { transaction: t });

            //Creamos el estudiante
            const estudiante = await Estudiante.create({
                fk_usuario: usuario.id
            }, { transaction: t });

            //Ingresamos a la tabla de tipo_usuario_x_usuario el usuario mas el tipo.
            const tpUsuarioxUsuario = await TipoUsuarioxUsuario.create({
                fk_usuario: usuario.id,
                fk_tipo_usuario: tipo_usuario
            }, { transaction: t })

            return {
                usuario,
                estudiante,
                tpUsuarioxUsuario
            }
        });

        //Devolvemos al respuesta
        res.json({
            msg: 'Estudiante creado',
            result
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error al crear el estudiante',
            error
        });
    }

}

//METODO PARA MODIFICAR ESTUDIANTE
const estudiantesPut = async (req = request, res = response) => {
    const { id } = req.params;
    const { _id, ...resto } = req.body;
    const fk_institucion = req.header('fk_institucion');

    //creamos una transaccion para actualizar el usuario
    try {
        const result = await sequelize.transaction(async (t) => {

            //Buscamos el usuario
            const usuario = await Usuario.findByPk(id);

            //Si no existe el usuario
            if (!usuario) {
                return res.status(404).json({
                    msg: 'No existe el usuario con el id ' + id
                });
            }

            //Actualizamos el usuario
            await usuario.update(resto, { transaction: t });

            //Buscamos el usuario 
            const estudiante = await Estudiante.findOne({
                include: [{
                    model: Usuario,
                    attributes: ['nombre', 'apellidos', 'email', 'cedula', 'telefono', 'direccion', 'estado', 'fk_institucion'],
                    where: { estado: 1, fk_institucion: fk_institucion },
                },
                {
                    model: TipoUsuarioxUsuario,
                    attributes: ['fk_tipo_usuario', 'fk_usuario']
                }]
            });

            //Actualizamos el estudiante
            await estudiante.update(resto, { transaction: t });

            return {
                estudiante
            }
        });

        res.json({
            msg: 'Estudiante actualizado',
            result
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error al actualizar el estudiante',
            error
        });
    }
}

//Eliminamos un usuario
const estudiantesDelete = async (req = request, res = response) => {
    const { id } = req.params;

    //Buscamos el usuario
    const usuario = await Usuario.findByPk(id);

    //Si no existe el usuario
    if (!usuario) {
        return res.status(404).json({
            msg: 'No existe el usuario con el id ' + id
        });
    }

    //Eliminamos el usuario
    await usuario.update({ estado: 0 });

    res.json({
        msg: 'Usuario eliminado',
        usuario
    });
}

module.exports = {
    estudiantesGet,
    estudiantesPost,
    estudiantesPut,
    estudiantesDelete
}


