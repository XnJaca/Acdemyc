const { Router } = require('express');
const { check } = require('express-validator');
const { isValidRole, emailExist, userExist } = require('../helpers/db-validator');
const { usuariosGet, usuariosPost, usuariosPut, usuariosDelete } = require('../controllers/user_controller');

const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.get('/', usuariosGet);

router.post('/', [
    check('Nombre', 'El nombre es obligatorio.').not().isEmpty(), // El nombre no puede estar vacio
    check('Apellido_1', 'El primer apellido es obligatorio.').not().isEmpty(), // El primer apellido no puede estar vacio
    check('Apellido_2', 'El segundo apellido es obligatorio.').not().isEmpty(), // El segundo apellido no puede estar vacio
    check('Email', 'El correo no es valido.').isEmail(), // El correo debe ser valido
    check('Email', 'Ya existe un usuario con este email.').custom(emailExist()), // El correo debe ser unico
    check('Telefono', "El telefono debe tener 8 digitos").isLength({ min: 8, max: 8 }), // El telefono debe tener 8 digitos
    check('Telefono', 'El telefono no es valido.').isMobilePhone(), // El telefono debe ser valido
    check('Contrasenna', 'La contraseña debe tener al menos 6 caracteres.').isLength({ min: 6 }), // La contraseña debe tener al menos 6 caracteres
    check('Rol', 'El rol no es valido.').custom(isValidRole()), // El rol debe ser valido
    validarCampos // Middleware para validar los campos
], usuariosPost);

router.put('/:id',[
    // check('id', 'No es un ID valido.').isID, // El id debe ser valido
    check('id').custom(userExist), // El id debe existir
    check('Rol', 'El rol no es valido.').custom(isValidRole()), // El rol debe ser valido
    validarCampos // Middleware para validar los campos
], usuariosPut);

router.delete('/', usuariosDelete);

module.exports = router;