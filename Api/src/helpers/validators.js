const { Usuario, Estudiante, TipoUsuario, TipoUsuarioxUsuario, Encargado, Administrador, RolAdmin, RolInstitucion } = require('../config/models_sync');

// Buscamos usuario por id
const existUserById = async (id = '') => {
    // Verificar si el id existe
    const existeUsuario = await Usuario.findByPk(id);
    if (!existeUsuario) {
        throw new Error(`El id ${id} no existe`);
    }
}

// Buscar usuario por cedula
const existUserByCedula = async (cedula = '') => {
    // Verificar si la cedula existe
    const existeUsuario = await Usuario.findOne({ where: { cedula } });
    if (existeUsuario) {
        throw new Error(`La cedula ${cedula} ya está registrada`);
    }
}

// Buscar usuario por correo
const existUserByCorreo = async (correo = '') => {
    // Verificar si el correo existe
    const existeUsuario = await Usuario.findOne({ where: { email: correo } });
    if (existeUsuario) {
        throw new Error(`El correo ${correo} ya está registrado`);
    }
}

// ESTUDIANTE VALIDATORS

// Es estudiante
const isEstudiante = async (tipo_usuario = '') => {
    //Obtenemos el tipo de usuario por id que viene por paraemtro
    const tipoUsuario = await TipoUsuario.findByPk(tipo_usuario);
    // Si no existe el tipo de usuario lanzamos un error
    if (!tipoUsuario) {
        throw new Error(`El tipo de usuario ${tipo_usuario} no existe`);
    }
    // Si el tipo de usuario no es estudiante lanzamos un error
    if (tipoUsuario.descripcion.toLowerCase() !== 'estudiante') {
        throw new Error(`El tipo de usuario ${tipoUsuario.descripcion} no es estudiante`);
    }
}

// Buscar estudiante
const existEstudiante = async (id = '') => {
    // Verificar si el id existe
    const existeEstudiante = await Estudiante.findByPk(id);
    if (!existeEstudiante) {
        throw new Error(`El estudiante con el id ${id} no existe`);
    }
}

// Buscar encargado
const existEncargado = async (id = '') => {
    // Verificar si el id existe
    const existeEncargado = await Encargado.findByPk(id);
    if (!existeEncargado) {
        throw new Error(`El encargado ( Id: ${id} ) no existe.`);
    }
}

// Buscar Admin
const existAdmin = async (id = '') => {
    // Verificar si el id existe
    const existeAdmin = await Administrador.findByPk(id);
    if (!existeAdmin) {
        throw new Error(`El administrador ( Id: ${id} ) no existe.`);
    }
}

// Buscar si existe el rol de institucion
const existRolInstitucion = async (id = '') => {
    // Verificar si el id existe
    const existeRolInstitucion = await RolInstitucion.findByPk(id);
    if (!existeRolInstitucion) {
        throw new Error(`El rol de institucion ( Id: ${id} ) no existe.`);
    }
}




// Validar que el tipo de usuario sea administrador
const isAdmin = async (tipo_usuario = '') => {
    //Obtenemos el tipo de usuario por id que viene por paraemtro
    const tipoUsuario = await TipoUsuario.findByPk(tipo_usuario);
    // Si no existe el tipo de usuario lanzamos un error
    if (!tipoUsuario) {
        throw new Error(`El tipo de usuario ${tipo_usuario} no existe`);
    }
    // Si el tipo de usuario no es administrador lanzamos un error
    if (tipoUsuario.descripcion.toLowerCase() !== 'administrador') {
        throw new Error(`El tipo de usuario debe ser administrador.`);
    }
}

// Encargado validator
const isEncargado = async (tipo_usuario = '') => {
    //Obtenemos el tipo de usuario por id que viene por paraemtro
    const tipoUsuario = await TipoUsuario.findByPk(tipo_usuario);
    // Si no existe el tipo de usuario lanzamos un error
    if (!tipoUsuario) {
        throw new Error(`El tipo de usuario ${tipo_usuario} no existe`);
    }
    // Si el tipo de usuario no es encargado lanzamos un error
    if (tipoUsuario.descripcion.toLowerCase() !== 'encargado') {
        throw new Error(`El tipo de usuario ${tipoUsuario.descripcion} no es encargado.`);
    }
}


// Exportamos
module.exports = {
    existAdmin,
    existEncargado,
    existEstudiante,
    existRolInstitucion,
    existUserByCedula,
    existUserByCorreo,
    existUserById,
    isAdmin,
    isEncargado,
    isEstudiante,
}



