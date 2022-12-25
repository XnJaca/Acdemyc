const { response, request } = require('express');
const bycript = require('bcryptjs');
const { Administrador, Usuario, TipoUsuarioxUsuario, Rol, sequelize } = require('../../config/db_config');

const administradoresGet = async (req = request, res = response) => {
    //Buscar todos los usuarios administradores
    const administradores = await Administrador.findAll({
        include: [{

            model: Usuario,
            attributes: ['nombre', 'apellidos', 'email', 'cedula', 'celular', 'direccion', 'estado']
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


module.exports = {
    administradoresGet,
    administradoresPost
}



