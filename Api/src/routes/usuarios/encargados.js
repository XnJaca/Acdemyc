// Require Router
const { Router } = require('express');
// Require check
const { check } = require('express-validator');
// Require validate
const { validateFields,validarJWT,isAdminRole } = require('../../middlewares/')
// Require validators
const {existUserById,existUserByCedula, existUserByCorreo,isAdmin, isEncargado,existEncargado, existEstudiante } = require('../../helpers/validators')

// Require controller
const {encargadoController} = require('../../controllers/encargado/encargado_controller')

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
    check('email', 'El email es obligatorio').not().isEmpty(),
    check('email', 'El email no es valido').isEmail(),
    check('email', 'Ya existe un usuario con este correo electronico.').custom(existUserByCorreo),
    check('clave', 'La clave es obligatoria').not().isEmpty(),
    check('celular', 'El celular es obligatorio').not().isEmpty(),
    check('celular', 'El celular debe ser numerico').isNumeric(),
    check('direccion', 'La direccion es obligatoria').not().isEmpty(),
    check('fk_institucion', 'El fk_institucion es obligatorio').not().isEmpty(),
    check('fk_institucion', 'El fk_institucion debe ser numerico').isNumeric(),
    check('tipo_usuario', 'El tipo_usuario es obligatorio').not().isEmpty(),
    check('tipo_usuario', 'El tipo_usuario debe ser numerico').isNumeric(),
    check('tipo_usuario', 'El tipo de usuario debe ser encargado.').custom(isEncargado),
    check('fk_estudiante', 'El fk_estudiante es obligatorio.').not().isEmpty(),
    check('fk_estudiante', 'El estudiante no existe').custom(existEstudiante),
    validateFields
], encargadoController.save);

// Ruta para buscar todos
router.get('/', [
    validarJWT,
    isAdminRole,
    check('fk_institucion', 'El fk_institucion es obligatorio.').not().isEmpty(),
    check('estado', 'El estado es obligatorio.').not().isEmpty(),
    validateFields
], encargadoController.getAll);

// Ruta para actualizar
router.put('/:id', [
    validarJWT,
    isAdminRole,
    check('id', 'El id es obligatorio').not().isEmpty(),
    check('id').custom(existUserById),
    check('id', 'El encargado que intenta modificar no existe.').custom(existEncargado),
    check('fk_institucion', 'El fk_institucion es obligatorio').not().isEmpty(),
    validateFields
], encargadoController.update);

// Ruta para eliminar
router.delete('/:id', [
    validarJWT,
    isAdminRole,
    check('id', 'El id es obligatorio').not().isEmpty(),
    check('id').custom(existUserById),
    check('fk_institucion', 'El fk_institucion es obligatorio').not().isEmpty(),
    check('id', 'El encargado que intenta eliminar no existe.').custom(existEncargado),    
    validateFields
], encargadoController.delete);

// Exportamos
module.exports = router;


