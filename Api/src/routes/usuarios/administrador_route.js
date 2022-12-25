const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../../middlewares/validar_campos');
const { existeUsuarioPorCedula, existeEmail, existeRolPorId, verificarTipoUsuario, isAdmin } = require('../../helpers/db-validators');

const { Administradores } = require('../../controllers/controller');
const { administradoresGet, administradoresPost } = Administradores;
const router = Router();

router.get('/', administradoresGet);

router.post('/', [
    check('cedula', 'La cedula es obligatoria').not().isEmpty(),
    check('cedula').custom(existeUsuarioPorCedula),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('apellidos', 'Los apellidos son obligatorios').not().isEmpty(),
    check('fecha_nacimiento', 'La fecha de nacimiento es obligatoria').not().isEmpty(),
    check('genero', 'El genero es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').not().isEmpty(),
    check('email').custom(existeEmail),
    check('clave', 'La clave es obligatoria').not().isEmpty(),
    check('celular', 'El celular es obligatorio').not().isEmpty(),
    check('direccion', 'La direccion es obligatoria').not().isEmpty(),
    check('fk_institucion', 'La institucion es obligatoria').not().isEmpty(),
    check('tipo_usuario', 'El tipo de usuario es obligatorio').not().isEmpty(),
    check('tipo_usuario', 'El tipo de usuario no existe.').custom(verificarTipoUsuario),
    check('tipo_usuario', 'El tipo de usuario debe ser un estudiante').custom(isAdmin),
    check('fk_rol_administrador', 'El rol del administrador es obligatorio').not().isEmpty(),
    check('fk_rol_administrador', 'El rol del administrador no existe').custom(existeRolPorId),

    validarCampos
], administradoresPost);


module.exports = router;


