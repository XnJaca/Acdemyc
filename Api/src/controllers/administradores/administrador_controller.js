const { response, request } = require('express');
const bycript = require('bcryptjs');
const { Administrador, Usuario, TipoUsuarioxUsuario, Rol, sequelize } = require('../../config/db_config');

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
            model: Rol,
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
    const { fk_usuario } = req.body;

    //Creamos una transaccion para modificar el administrador, usuario, y tipo_usuario_x_usuario
    try {
        const result = await sequelize.transaction(async (t) => {

            //Encriptamos la contrasena
            const salt = bycript.genSaltSync();
            const password = bycript.hashSync(req.body.clave, salt);

            //Modificamos el usuario
            const usuario = await Usuario.update({
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
            }, {
                where: {
                    id: fk_usuario
                }
            }, { transaction: t });

            //Modificamos el administrador
            const administrador = await Administrador.update({
                fk_rol_administrador: req.body.fk_rol_administrador
            }, {
                where: {
                    id: id
                }
            }, { transaction: t });
            
            //Modificamos el tipo de usuario
            const tipo_usuario = await TipoUsuarioxUsuario.update({
                fk_tipo_usuario: req.body.tipo_usuario
            }, {
                where: {
                    fk_usuario: fk_usuario
                }
            }, { transaction: t });

            return {
                usuario,
                administrador,
                tipo_usuario
            }
        });
        
        //Devolvemos al respuesta
        res.json({
            msg: 'Administrador modificado',
            result
        }); 
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error al modificar el Administrador',
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



