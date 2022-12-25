const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar_campos')
// const {} = require('../../helpers/db-validators');

const { login } = require('../controllers/auth/auth_controller');

const router = Router();

router.post('/login',[
    check('cedula', 'La cedula es obligatorio').not().isEmpty(),
    check('clave', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], login);



module.exports = router;