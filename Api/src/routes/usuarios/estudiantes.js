// Require Router
const { Router } = require('express');
// Require check
const { check } = require('express-validator');
// Require validateFields
const { validateFields, validarRoles } = require('../../middlewares/middlewares');
// Require validators
const {existUserByCedula,existUserByCorreo,existUserById,isEstudiante, isAdmin, existEstudiante } = require('../../helpers/validators')

// Require controller
const {estudianteController} = require('../../controllers/estudiante/estudiante_controller')

// Create router
const router = Router();

// Create routes

// Ruta para guardar
router.post('/', [
    validarRoles.isAdminRole,
    check('cedula', 'La cedula es obligatoria').not().isEmpty(),
    check('cedula', 'La cedula debe ser numerica').isNumeric(),
    check('cedula', 'Ya existe un usuario con este numero de cedula.').custom(existUserByCedula),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('apellidos', 'Los apellidos son obligatorios').not().isEmpty(),
    check('fecha_nacimiento', 'La fecha de nacimiento es obligatoria').not().isEmpty(),
    check('genero', 'El genero es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').not().isEmpty(),
    check('email', 'El email no es valido').isEmail(),
    check('email', 'Ya existe un usuario con este correo electronico.').custom(existUserByCorreo),
    check('clave', 'La clave es obligatoria').not().isEmpty(),
    check('celular', 'El celular es obligatorio').not().isEmpty(),
    check('direccion', 'La direccion es obligatoria').not().isEmpty(),
    check('fk_institucion', 'La institucion es obligatoria').not().isEmpty(),
    check('tipo_usuario', 'El tipo de usuario es obligatorio').not().isEmpty(),
    check('tipo_usuario', 'El tipo de usuario no es valido').isNumeric(),
    check('tipo_usuario', 'El tipo de usuario debe ser Estudiante.').custom(isEstudiante),
    validateFields.validateFields
], estudianteController.save);


router.get('/',[
    check('fk_institucion', 'El fk_institucion es obligatorio.').not().isEmpty(),
    check('estado', 'El estado es obligatorio.').not().isEmpty(),
    validateFields.validateFields
], estudianteController.getAll);

// Ruta para actualzar
router.put('/:id', [
    validarRoles.isAdminRole,
    check('id', 'El id es obligatorio').not().isEmpty(),
    check('id').custom(existEstudiante),
    check('fk_institucion', 'El fk_institucion es obligatorio.').not().isEmpty(),
    validateFields.validateFields
], estudianteController.update);

// Ruta para eliminar
router.delete('/:id', [
    validarRoles.isAdminRole,
    check('id', 'El id es obligatorio').not().isEmpty(),
    check('id').custom(existUserById),
    check('fk_institucion', 'El fk_institucion es obligatorio.').not().isEmpty(),
    check('tipo_usuario').custom(isAdmin),
    validateFields.validateFields
], estudianteController.delete);

// Exportamos
module.exports = router;