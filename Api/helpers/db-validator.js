const {RoleModel, UserModel } = require('../models/db');

//TODO: Crear un middleware para validar la cedula
//TODO: Crear un middleware para validar el telefono


const userExist = async (ID) => {
    const existeUsuario = await UserModel.findByPk(ID);
    if (!existeUsuario) {
        throw new Error(`El usuario ${ID} no existe en la base de datos`);
    }
    
}

const isValidRole = () => async (Rol = '') => {
    const existeRol = await RoleModel.findOne({ where: { ID: Rol } });
    if (!existeRol) {
        throw new Error(`El rol ${Rol} no existe en la base de datos`);
    }
}

const emailExist = () => async (Email = '') => {
    const existeEmail = await UserModel.findOne({ where: { Email: Email } });
    if (existeEmail) {
        throw new Error(`El correo ${Email} ya existe en la base de datos`);
    }
}

module.exports = {
    isValidRole,
    emailExist,
    userExist
}




