const { response, request } = require('express');
const bycript = require('bcryptjs');
const { Usuario, Estudiante, TipoUsuarioxUsuario, sequelize } = require('../../config/db_config');

const estudiantesGet = async (req = request, res = response) => {
    const estudiantes = await Estudiante.findOne({

        include: [{
            model: Usuario,
            attributes: ['nombre', 'apellidos', 'email', 'cedula', 'telefono', 'direccion', 'estado'],
            where: { estado: 1 },
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
            where:{estado: 1},
        }]
    });
    
    res.json({
        estudiantes,
        total,
    })
}

//METODO PARA CREAR UN ESTUDIANTE
const estudiantesPost = async (req = request, res = response) => {
    const {
        cedula,
        nombre,
        apellidos,
        fecha_nacimiento,
        genero,
        email,
        telefono,
        clave,
        celular,
        direccion,
        fk_institucion,
        estado,
        imagen,
        tipo_usuario } = req.body;

    //Creamos una transaccion para crear estudiante, usuario, y tipo_usuario_x_usuario
    try {
        const result = await sequelize.transaction(async (t) => {

            //Encriptamos la contrasena
            const salt = bycript.genSaltSync();
            const password = bycript.hashSync(clave, salt);

            //Creamos el usuario
            const usuario = await Usuario.create({
                cedula,
                nombre,
                apellidos,
                fecha_nacimiento,
                genero,
                email,
                clave: password,
                telefono,
                celular,
                direccion,
                fk_institucion,
                imagen,
                estado
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
    estudiantesDelete
}


