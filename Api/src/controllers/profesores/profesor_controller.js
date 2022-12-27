const { response, request } = require('express');


//metodo para obtener los profesores
const profesoresGet = async(req = request, res = response) => {
    res.json({
        msg: 'getProfesores'
    });
}

module.exports = {
    profesoresGet
}