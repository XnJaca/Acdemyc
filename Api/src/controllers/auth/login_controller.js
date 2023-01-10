const { response, request } = require('express');
const { Usuario, Administrador, TipoUsuario, RolAdmin, TipoUsuarioxUsuario, RolInstitucion } = require('../../config/models_sync');
const { generarJWT } = require('../../helpers/generar-jwt');
const { encriptar, comparar } = require('../../helpers/encriptar');

// Creamos el controlador
const loginController = {};

// Creamos el metodo de login
loginController.login = async (req = request, res = response) => {
    const { cedula, clave } = req.body;

    try {
        // Verificar si la cedula existe

        const usuario = await Usuario.findOne({ where: { cedula } });
        if (usuario == null) {
            return res.status(400).json({
                msg: 'No se encontro el usuario con este numero de cedula.'
            })
        }

        // Consultamos el tipo de usuario
        let tipo_usuario = await TipoUsuarioxUsuario.findOne({ where: { fk_usuario: usuario.id } });
        tipo_usuario = await TipoUsuario.findByPk(tipo_usuario.fk_tipo_usuario);

        let rol_admin;
        if (tipo_usuario.descripcion.toLowerCase() == 'administrador') {
            rol_admin = await RolAdmin.findOne({ where: { fk_administrador: usuario.id } });
            rol_admin = await RolInstitucion.findByPk(rol_admin.fk_institucion);
        }

        // Verificar el estado del usuario
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'El usuario no esta activo.'
            });
        }

        // Comparamos la clave
        const comparePassword = comparar(clave + "", usuario.clave);
        if (!comparePassword) {
            return res.status(400).json({
                msg: 'La clave es incorrecta.'
            });
        }

        // Generamos el jwt
        const token = await generarJWT(usuario.id);

        // Retornamos el usuario sin clave

        // Creamos un json
        let result = {
            usuario: {
                id: usuario.id,
                cedula: usuario.cedula,
                nombre: usuario.nombre,
                apellidos: usuario.apellidos,
                fecha_nacimiento: usuario.fecha_nacimiento,
                genero: usuario.genero,
                email: usuario.email,
                telefono: usuario.telefono,
                celular: usuario.celular,
                direccion: usuario.direccion,
                fk_institucion: usuario.fk_institucion,
                estado: usuario.estado,
                imagen: usuario.imagen,
            },
            tipo_usuario: {
                id: tipo_usuario.id,
                descripcion: tipo_usuario.descripcion
            }
        }

        // Si rol_admin != null agregado el rol_admin al json
        if (rol_admin != null) {
            result.rol_admin = {
                id: rol_admin.id,
                descripcion: rol_admin.descripcion
            }
        }


        res.json({
            result,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el Administrador'
        });
    }
}

module.exports = {
    loginController
}