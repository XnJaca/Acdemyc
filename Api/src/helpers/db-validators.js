const { Usuario, Institucion, Rol, TipoInstitucion, TipoUsuario } = require('../config/db_config');

//Buscar usuario por cedula
const existeUsuarioPorCedula = async (cedula = '') => {
    const existeUsuario = await Usuario.findOne({ where: { cedula } });
    if (existeUsuario) {
        throw new Error(`La cedula ${cedula} ya está registrada`);
    }
}

//Buscar usuario por id
const existeUsuarioPorId = async (id) => {
    const existeUsuario = await Usuario.findByPk(id);
    if (!existeUsuario) {
        throw new Error(`El id ${id} no existe`);
    }
}

//Existe email
const existeEmail = async (email = '') => {
    const existeEmail = await Usuario.findOne({ where: { email } });
    if (existeEmail) {
        throw new Error(`El email ${email} ya está registrado`);
    }
}

// ESTUDIANTE HELPERS
const isEstudiante = async (tipo_usuario = '') => {
    const existeTipoUsuario = await TipoUsuario.findByPk(tipo_usuario);
    if (existeTipoUsuario.id != 1) {
        throw new Error(`El tipo de usuario debe ser estudiante.`);
    }
}

// PROFESOR HELPERS
const isProfesor = async (tipo_usuario = '') => {
    const existeTipoUsuario = await TipoUsuario.findByPk(tipo_usuario);
    if (existeTipoUsuario.id != 2) {
        throw new Error(`El tipo de usuario debe ser profesor.`);
    }
}

// ADMINISTRADOR HELPERS
const isAdmin = async (tipo_usuario = '') => {
    const existeTipoUsuario = await TipoUsuario.findByPk(tipo_usuario);
    if (existeTipoUsuario.id != 0) {
        throw new Error(`El tipo de usuario debe ser administrador.`);
    }
}





const verificarTipoUsuario = async (tipoUsuario = '') => {
    const existeTipoUsuario = await TipoUsuario.findByPk(tipoUsuario);
    if (!existeTipoUsuario) {
        throw new Error(`El tipo de usuario ${tipoUsuario} no existe`);
    }
}


// INSTITUCION HELPERS

//Buscar institucion por id
const existeInstitucionPorId = async (id) => {
    const existeInstitucion = await Institucion.findByPk(id);
    if (!existeInstitucion) {
        throw new Error(`El id ${id} no existe`);
    }
}

//Existe institucion por cedula
const existeInstitucionPorCedula = async (cedula = '') => {
    const existeInstitucion = await Institucion.findOne({ where: { cedula } });
    if (existeInstitucion) {
        throw new Error(`Ya existe una institucion con la cedula ${cedula}.`);
    }
}


//Buscar tipo de institucion por id
const existeTipoInstitucionPorId = async (id) => {
    const existeTipoInstitucion = await TipoInstitucion.findByPk(id);
    // Obtenemos todas los tipo de institucion
    const tiposInstituciones = await TipoInstitucion.findAll();
    if (!existeTipoInstitucion) {
        throw new Error(`El id ${id} no existe`, `Tipos de instituciones permitidas: ${tiposInstituciones}`);
    }
}


//ROL HELPERS 

//Buscar rol por id
const existeRolPorId = async (id) => {
    const existeRol = await Rol.findByPk(id);
    if (!existeRol) {
        throw new Error(`El id ${id} no existe`);
    }
}



module.exports = {
    existeEmail,
    existeInstitucionPorCedula,
    existeInstitucionPorId,
    existeRolPorId,
    existeTipoInstitucionPorId,
    existeUsuarioPorCedula,
    existeUsuarioPorId,
    isAdmin,
    isEstudiante,
    isProfesor,
    verificarTipoUsuario,
}

