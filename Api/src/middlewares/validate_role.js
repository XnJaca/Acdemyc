const { response, request } = require('express');


const isAdminRole = (req = request, res = response) => {

    if (!req.usuario) {
        return res.status(500).json({
            msg: 'Se quiere verificar el rol sin validar el token primero'
        })
    }
    console.log(req.usuario);
    const { tipo_usuario } = req.usuario;
    if (tipo_usuario.descripcion.toLowerCase() !== 'administrador') {
        return res.status(401).json({
            msg: `${req.usuario.nombre} no es administrador - No puede hacer esto`
        })
    }
    
    next();
}


module.exports = {
    isAdminRole
}
