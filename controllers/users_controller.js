const {response, request} = require('express')

const usuariosGet =  (req=request, res = response) => {
    const {q, nombre, apikey} = req.query;

    res.json({
        msg: "get Api - Controller",
        q,
        nombre,
        apikey
    },)
}

const usuariosPost =  (req, res = response) => {
    const body = req.body;
    res.json({
        msg: "post Api - Controller",
        body
    },)
}

const usuariosPut =  (req, res = response) => {
    const id = req.params.id;
    res.json({
        msg: "put Api - Controller",
        id: id
    },)
}

const usuariosDelete =  (req, res = response) => {
    res.json({
        msg: "delete Api - Controller",
    },)
}


module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete

}