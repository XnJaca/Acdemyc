const { response, request } = require('express');
const bycript = require('bcryptjs');
const { Usuario, TipoUsuarioxUsuario, TipoUsuario, Administrador, Rol_Administrador } = require('../../config/modelsdb');
const { generarJWT } = require('../../helpers/generar-jwt');


const login = async (req = request, res = response) => {

    const { cedula, clave } = req.body;

    try {
        // Verificar si la cedula existe
        const usuario = await Usuario.findOne({ where: { cedula } });
        if(usuario == null){
            return res.status(400).json({
                ok: false,
                msg: 'Cedula no encontrada'
            })
        }
        // Consultar el tipo de usuario
        let tipo_usuario = await TipoUsuarioxUsuario.findOne({ where: { fk_usuario: usuario.id } });
        tipo_usuario = await TipoUsuario.findByPk(tipo_usuario.fk_tipo_usuario);
        
        let rol_administrador = '';
        if (tipo_usuario.id == 0) {
            rol_administrador = await Administrador.findOne({where : {fk_usuario : usuario.id}});
            rol_administrador = await Rol_Administrador.findByPk(rol_administrador.fk_rol_administrador);
        }

        // TODO: BUSCAR EL TIPO DE USUARIO Y RETORNAR UNA RESPUESTA EN BASE A 

        
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
        
        //Comparar la clave de usuario
        const validPassword = bycript.compareSync(clave + "", usuario.clave);

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
                descripcion: tipo_usuario.descripcion,
                rol_administrador: (rol_administrador == "") ? "N/A" : rol_administrador.descripcion
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
