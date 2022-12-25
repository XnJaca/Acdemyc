const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../../middlewares/validar_campos');
const { existeUsuarioPorCedula, existeEmail,isEstudiante,verificarTipoUsuario } = require('../../helpers/db-validators');

const { Estudiantes } = require('../../controllers/controller');
const { estudiantesGet,estudiantesPost,estudiantesDelete } = Estudiantes;



const router = Router();

router.get('/', estudiantesGet);

router.post('/', [
    check('cedula', 'La cedula es obligatoria').not().isEmpty(),
    check('cedula', 'La cedula debe tener 10 caracteres').isLength({ min: 9, max: 12 }),
    check('cedula', 'Ya existe un usuario con esta cedula').custom(existeUsuarioPorCedula),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('apellidos', 'El apellido es obligatorio').not().isEmpty(),
    check('fecha_nacimiento', 'La fecha de nacimiento es obligatoria').not().isEmpty(),
    check('fecha_nacimiento', 'La fecha de nacimiento debe tener el formato YYYY-MM-DD').isISO8601(),
    check('genero', 'El genero es obligatorio').not().isEmpty(),
    check('genero', 'El genero debe ser M o F').isIn(['M', 'F']),
    check('email', 'El email es obligatorio').not().isEmpty(),
    check('email', 'El email no es válido').isEmail(),
    check('email', 'Ya existe un usuario con este email').custom(existeEmail),
    check('clave', 'La clave es obligatoria').not().isEmpty(),
    check('clave', 'La clave debe tener al menos 6 caracteres').isLength({ min: 6 }),
    check('celular', 'El celular es obligatorio').not().isEmpty(),
    check('celular', 'El celular debe tener 10 caracteres').isLength({ min: 8, max: 10 }),
    check('direccion', 'La direccion es obligatoria').not().isEmpty(),
    check('fk_institucion', 'La institucion es obligatoria').not().isEmpty(),
    check('tipo_usuario', 'El tipo de usuario es obligatorio').not().isEmpty(),
    check('tipo_usuario', 'El tipo de usuario no existe.').custom(verificarTipoUsuario),
    check('tipo_usuario', 'El tipo de usuario debe ser un estudiante').custom(isEstudiante),
    
    validarCampos
], estudiantesPost);

//Ruta para eliminar el Estudiante
router.delete('/:id', [
    check('id').not().isEmpty(),
    validarCampos
], estudiantesDelete);

module.exports = router;
