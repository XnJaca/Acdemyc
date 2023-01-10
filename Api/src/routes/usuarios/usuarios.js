//Require Router
const { Router } = require('express');
// Require check
const { check } = require('express-validator');

// Require middlewares
const { validateFields, validarJWT, isAdminRole } = require('../../middlewares/')

// Require validators
const { existUserByCedula, existUserByCorreo, existUserById, isAdmin } = require('../../helpers/validators')

// Require controller
const { usuarioController } = require('../../controllers/usuario/usuario_controller')

// Create router
const router = Router();

// Create routes
router.post('/', [
    validarJWT,
    isAdminRole,
    check('cedula', 'La cedula es obligatoria').not().isEmpty(),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('apellidos', 'Los apellidos son obligatorios').not().isEmpty(),
    check('fecha_nacimiento', 'La fecha de nacimiento es obligatoria').not().isEmpty(),
    check('fecha_nacimiento', 'La fecha de nacimiento debe tener el formato YYYY-MM-DD').isISO8601(),
    check('genero', 'El genero es obligatorio').not().isEmpty(),
    check('genero', 'El genero debe ser M o F').isIn(['M', 'F']),
    check('email', 'El email es obligatorio').not().isEmpty(),
    check('email', 'El email no es valido').isEmail(),
    check('email').custom(existUserByCorreo),
    check('clave', 'La clave es obligatoria').not().isEmpty(),
    check('celular', 'El celular es obligatorio').not().isEmpty(),
    check('direccion', 'La direccion es obligatoria').not().isEmpty(),
    check('fk_institucion', 'La institucion es obligatoria').not().isEmpty(),
    validateFields
], usuarioController.save);

router.get('/', [
], usuarioController.getAll);


router.put('/:id', [
    validarJWT,
    isAdminRole,
    check('id', 'El id es obligatorio').not().isEmpty(),
    check('id').custom(existUserById),
    check('tipo_usuario', 'Especifique el tipo de usuario que hace la consulta.').not().isEmpty(),
    check('tipo_usuario').custom(isAdmin),
    validateFields
], usuarioController.update);

router.delete('/:id', [
    validarJWT,
    isAdminRole,
    check('id', 'El id es obligatorio').not().isEmpty(),
    check('id').custom(existUserById),
    check('tipo_usuario').custom(isAdmin),
    validateFields
], usuarioController.delete);

// Export router
module.exports = router;

