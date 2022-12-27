const { response, request } = require('express');
const { TipoInstitucion } = require('../../config/modelsdb');

const tipoInstitucionGet = async (req = request, res = response) => {
    const tipo_institucion = await TipoInstitucion.findAll();

    const total = await TipoInstitucion.count();

    res.json({
        tipo_institucion,
        total
    });
}

//Metodo para obtener por id
const tipoInstitucionGetById = async (req = resquest, res = response) => {
    const { id } = req.params;
    const tipo_institucion = await TipoInstitucion.findByPk(id);
    res.json({
        tipo_institucion
    });
}

//Metodo para crear un tipo de institucion
const tipoInstitucionPost = async (req = request, res = response) => {
    const { descripcion } = req.body;
    const tipo_institucion = TipoInstitucion.build({ descripcion });
    await tipo_institucion.save();
    res.json({
        tipo_institucion
    });
}

// Metodo para modificar un tipo de institucion
const tipoInstitucionPut = async (req = request, res = response) => {
    const id = req.params.id_tipo_institucion;
    const { descripcion } = req.body;

    const tipo_institucion = await TipoInstitucion.update({
        descripcion
    }, {
        where: {
            id
        }
    });
    //Buscamos al tipo de institucion modificada
    const tipo_institucion_modificada = await TipoInstitucion.findByPk(id);

    res.json({
        tipo_institucion_modificada
    });
}

//Metodo para eliminar un tipo de institucion
const tipoInstitucionDelete = async (req = request, res = response) => {
    const id = req.params.id;
    const tipo_institucion = await TipoInstitucion.destroy({
        where: {
            id
        }
    });
    res.json({
        tipo_institucion
    });
}

module.exports = {
    tipoInstitucionGet,
    tipoInstitucionGetById,
    tipoInstitucionPost,
    tipoInstitucionPut,
    tipoInstitucionDelete
}
