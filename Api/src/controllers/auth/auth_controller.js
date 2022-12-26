const { response, request } = require('express');
const bycript = require('bcryptjs');
const { Usuario, TipoUsuarioxUsuario, TipoUsuario } = require('../../config/db_config');
const { generarJWT } = require('../../helpers/generar-jwt');


const login = async (req = request, res = response) => {

    const { cedula, clave } = req.body;

    try {
        // Verificar si la cedula existe
        const usuario = await Usuario.findOne({ where: { cedula } });
        // Consultar el tipo de usuario
        let tipo_usuario = await TipoUsuarioxUsuario.findOne({ where: { fk_usuario: usuario.id } });
        tipo_usuario = await TipoUsuario.findByPk(tipo_usuario.fk_tipo_usuario);
        //Mostrar el tipo de usuario
        console.log(tipo_usuario);

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Cedula no encontrada'
            })
        }
        // Verificar si el usuario esta activo
        if (!usuario.estado) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario no activo'
            })
        }
        // Verificar si la clave es correcta
        const validPassword = bycript.compareSync(clave, usuario.clave);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Clave no valida'
            })
        }
        // Generar el JWT
        const token = await generarJWT(usuario.id);

        //Mostrar usuario sin clave

        res.json({
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
            },
            token
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador',
            error: error

        })
    }



}


module.exports = {
    login
}
