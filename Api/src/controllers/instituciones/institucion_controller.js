const { response, request } = require('express');
const { Institucion, TipoInstitucion } = require('../../config/db_config');

// Metodo para obtener todas instituciones
const institucionesGet = async (req = request, res = response) => {
    if (req.params.id)
        return institucionesGetById(req, res);

    const instituciones = await Institucion.findAll();

    const total = await Institucion.count();

    res.json({
        instituciones,
        total
    });
}

//Metodo para obtener por id
const institucionesGetById = async (req = resquest, res = response) => {
    const { id } = req.params;
    const institucion = await Institucion.findByPk(id);
    res.json({
        institucion
    });
}


//Metodo para crear instituciones
const institucionesPost = async (req = request, res = response) => {
    const { nombre, direccion,cedula, tipo_institucion} = req.body;
    const fk_tipo_institucion = tipo_institucion;
    const institucion = Institucion.build({ nombre, direccion,cedula, fk_tipo_institucion});
    await institucion.save();
    res.json({
        msg: "Se creo la institucion",
        institucion
    });
}

// Metodo para modificar instituciones
const institucionesPut = async (req = request, res = response) => {
    const id = req.params.id_institucion;
    console.log("IDDDDD",id);
    const { nombre, cedula, direccion, tipoInstitucion } = req.body;

    if (tipoInstitucion != undefined) {
        const tpInstitucion = await TipoInstitucion.findByPk(tipoInstitucion);
        if (tpInstitucion === null) {
            res.json({
                message: `No se encontro el tipo de institucion con el id \'${tipoInstitucion}\'.`
            });
            console.log(tpInstitucion instanceof TipoInstitucion);
            return;
        }
    }

    const institucion = await Institucion.update({
        nombre,
        cedula,
        direccion,
        fk_tipo_institucion: tipoInstitucion
    }, {
        where: {
            id: id
        }
    });
    console.log(institucion instanceof Institucion); // true
    //Buscamos la institucion actualizada
    const institucionActualizada = await Institucion.findByPk(id);
    res.json({
        msg: `Se actulizaron los datos de la institucion con el id ${id}`,
        institucionActualizada
    });
}

//Metodo para eliminar instituciones
const institucionesDelete = async (req = request, res = response) => {
    const id = req.params.id_institucion;

    // TODO: HACER BORRADO LOGICO
    const institucion = await Institucion.destroy({
        where: {
            id: id
        }
    });
    res.json({
        msg: `Se elimino la institucion con el id ${id}`,
    });
}


module.exports = {
    institucionesGet,
    institucionesPost,
    institucionesPut,
    institucionesDelete
}