// Require Router
const { Router } = require('express');
// Require check
const { check } = require('express-validator');
// Require validateFields
const { validateFields, validarJWT, isAdminRole } = require('../../middlewares/')
// Require validators
const { existUserById, existUserByCedula, existUserByCorreo, isAdmin, existAdmin, existRolInstitucion } = require('../../helpers/validators')

// Require controller
const { administradorController } = require('../../controllers/administrador/administrador_controller')


// Create router
const router = Router();

// Create routes

// Ruta para guardar
router.post('/', [
    validarJWT,
    isAdminRole,
    check('cedula', 'La cedula es obligatoria').not().isEmpty(),
    check('cedula', 'La cedula debe ser numerica').isNumeric(),
    check('cedula', 'Ya existe un usuario con este numero de cedula.').custom(existUserByCedula),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('apellidos', 'Los apellidos son obligatorios').not().isEmpty(),
    check('fecha_nacimiento', 'La fecha de nacimiento es obligatoria').not().isEmpty(),
    check('genero', 'El genero es obligatorio').not().isEmpty(),
    check('email', 'El correo es obligatorio').not().isEmpty(),
    check('email', 'El correo no es valido').isEmail(),
    check('email', 'Ya existe un usuario con este correo.').custom(existUserByCorreo),
    check('clave', 'La clave es obligatoria').not().isEmpty(),
    check('clave', 'La clave debe tener minimo 6 caracteres').isLength({ min: 6 }),
    check('celular', 'El celular es obligatorio').not().isEmpty(),
    check('celular', 'El celular debe ser numerico').isNumeric(),
    check('direccion', 'La direccion es obligatoria').not().isEmpty(),
    check('fk_institucion', 'La institucion es obligatoria').not().isEmpty(),
    check('tipo_usuario', 'El tipo de usuario es obligatorio').not().isEmpty(),
    check('tipo_usuario', 'El tipo de usuario no es valido').custom(isAdmin),
    check('rol', 'El rol de administrador no existe.').custom(existRolInstitucion),
    validateFields
], administradorController.save);

// Ruta para buscar todos
router.get('/', [
    validarJWT,
    isAdminRole,
    check('fk_institucion', 'El fk_institucion es obligatorio.').not().isEmpty(),
    check('estado', 'El estado es obligatorio.').not().isEmpty(),
    validateFields
], administradorController.getAll);

// Ruta para actualizar
router.put('/:id', [
    validarJWT,
    isAdminRole,
    check('id', 'El id es obligatorio').not().isEmpty(),
    check('id').custom(existUserById),
    check('id', 'El administrador que intenta modificar no existe.').custom(existAdmin),
    check('fk_institucion', 'El fk_institucion es obligatorio').not().isEmpty(),
    validateFields
], administradorController.update);

// Ruta para eliminar
router.delete('/:id', [
    validarJWT,
    isAdminRole,
    check('id', 'El id es obligatorio').not().isEmpty(),
    check('id').custom(existUserById),
    check('id', 'El administrador que intenta eliminar no existe.').custom(existAdmin),
    check('fk_institucion', 'El fk_institucion es obligatorio').not().isEmpty(),
    validateFields
], administradorController.delete);


// Export router
module.exports = router;
