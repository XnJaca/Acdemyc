const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const { Usuario, TipoUsuarioxUsuario, TipoUsuario, RolAdmin, RolInstitucion } = require('../config/models_sync');

const validarJWT = async (req = request, res = response, next) => {
    const token = req.header('x-token');
    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        });
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        // Leer el usuario que corresponde al uid
        // req.usuario = await Usuario.findByPk(uid);
        let usuario = await Usuario.findByPk(uid);

        // Verificamos si existe el usuario
        if (!usuario) {
            return res.status(401).json({
                msg: 'Token no valido - Usuario no existe en DB'
            });
        }
         // Verificar si el uid tiene estado en true
         if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Token no valido - Usuario con estado: false'
            });
        }

        let tipo_usuario = await TipoUsuarioxUsuario.findOne({ where: { fk_usuario: usuario.id } });
        tipo_usuario = await TipoUsuario.findByPk(tipo_usuario.fk_tipo_usuario);

        let rol_admin;
        if (tipo_usuario.descripcion.toLowerCase() == 'administrador') {
            rol_admin = await RolAdmin.findOne({ where: { fk_administrador: usuario.id } });
            rol_admin = await RolInstitucion.findByPk(rol_admin.fk_rol_institucion);
        }

        usuario.tipo_usuario = tipo_usuario;
        if (tipo_usuario.descripcion.toLowerCase() == 'administrador') {
            usuario.rol_admin = rol_admin;
        }

        req.usuario = usuario;

        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            msg: 'Token no valido'
        });
    }


}

module.exports = {
    validarJWT
}