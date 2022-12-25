const { Router } = require('express');
const { check } = require('express-validator');
//Llamamos al controlador de TipoInstituciones
const { TipoInstituciones } = require('../../controllers/controller');
const {tipoInstitucionGet,tipoInstitucionPost,tipoInstitucionPut,tipoInstitucionDelete} = TipoInstituciones;
//ValidarCampos
const { validarCampos } = require('../../middlewares/validar_campos');

const router = Router();

router.get('/', tipoInstitucionGet);

//Ruta post
router.post('/', [
    check('descripcion', 'La descripcion es obligatoria').not().isEmpty(),
    validarCampos
], tipoInstitucionPost);

//Ruta para modificar el tipo de institucion
router.put('/:id_tipo_institucion', [
    check('descripcion', 'La descripcion es obligatoria').not().isEmpty(),
    validarCampos
], tipoInstitucionPut);

// Ruta para borrar un tipo de institucion
router.delete('/:id_tipo_institucion', tipoInstitucionDelete);




module.exports = router;