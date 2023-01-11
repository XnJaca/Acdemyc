const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../../middlewares/validate_fields');

const { loginController } = require('../../controllers');

const router = Router();

router.post('/',[
    check('cedula', 'La cedula es obligatoria').not().isEmpty(),
    check('clave', 'La clave es obligatoria').not().isEmpty(),
], loginController.login);


module.exports = router;



