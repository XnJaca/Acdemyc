const { response, request } = require('express');
const bcrypt = require('bcryptjs');
const { Usuario, TipoUsuarioxUsuario } = require('../../config/modelsdb');

//Get Usuario by Cedula

const usuarioGetByCedula = async (req = request, res = response) => {
    const { cedula } = req.params;
    const usuario = await Usuario.findOne({
        where: { cedula }, include: [{
            model: Usuario,
            attributes: ['nombre', 'apellidos', 'email', 'cedula', 'telefono', 'direccion', 'estado', 'fk_institucion'],
            where: { estado: 1, fk_institucion: req.header('fk_institucion') },
        },
        {
            model: TipoUsuarioxUsuario,
            attributes: ['fk_tipo_usuario', 'fk_usuario']
        }]
    });
    res.json({
        usuario
    });
}


const usuariosGet = async (req = request, res = response) => {
    //Obtener el fk_institucion. que viene en el header
    const fk_institucion = req.header('fk_institucion');
    if (fk_institucion == null) {
        return res.status(400).json({
            msg: 'No se ha enviado el parametro fk_institucion en el header'
        });
    }
    //Obtenemos el id que viene en el request
    if (req.query.id) {
        usuarioGetByCedula(req, res);
        return
    }

    //Buscar todos los usuarios
    const usuarios = await Usuario.findAll();

    //Contar todos los usuarios
    const total = await Usuario.count();

    console.log(usuarios.every(user => user instanceof Usuario)); // true

    res.json({
        total,
        usuarios
    });
}


const usuariosPost = async (req, res = response) => {
    const { clave, ...body } = req.body;

    //Encriptamos la clave
    const salt = bcrypt.genSaltSync();
    body.clave = bcrypt.hashSync(clave, salt);

    //Creamos el usuario
    const usuario = await Usuario.create(body);

    res.json({
        usuario
    });
}

//Metodo para eliminar un usuario en cascada
const usuariosDelete = async (req, res = response) => {
    const { id } = req.params;

    //Eliminamos el usuario
    const usuario = await Usuario.findByPk(id);
    await usuario.destroy();

    res.json({
        msg: "Se elimino correctamente el usuario",
        usuario
    });
}


module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosDelete
}




