//Creamos las rutas para institucion
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../../middlewares/validar_campos');
const { existeTipoInstitucionPorId, existeInstitucionPorCedula } = require('../../helpers/db-validators');
//Llamamos al controlador de Instituciones
const { Instituciones } = require('../../controllers/controller');
const { institucionesDelete, institucionesGet, institucionesPost, institucionesPut, } = Instituciones;

const router = Router();

router.get('/', institucionesGet);

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('direccion', 'La direccion es obligatoria').not().isEmpty(),
    check('cedula', 'La cedula es obligatoria').not().isEmpty(),
    check('cedula', 'Ya existe una institucion con este numero de cedula').custom(existeInstitucionPorCedula),
    check('tipo_institucion', 'El tipo de institucion es obligatorio').not().isEmpty(),
    check('tipo_institucion', 'El tipo de institucion no existe').custom(existeTipoInstitucionPorId),
    validarCampos
], institucionesPost);

//Ruta para modificar la institucion
router.put('/:id_institucion', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('direccion', 'La direccion es obligatoria').not().isEmpty(),
    check('cedula', 'La cedula es obligatoria').not().isEmpty(),
    check('tipo_institucion', 'El tipo de institucion es obligatorio').not().isEmpty(),
    check('tipo_institucion', 'El tipo de institucion debe ser numerico').isNumeric(),
    check('tipo_institucion', 'El tipo de institucion no existe').custom(existeTipoInstitucionPorId),
    validarCampos
], institucionesPut);

// Ruta para borrar una institucion
router.delete('/:id_institucion', institucionesDelete);

module.exports = router;