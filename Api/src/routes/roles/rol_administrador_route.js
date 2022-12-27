const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../../middlewares/validar_campos');
const { RolAdministrador } = require('../../controllers/controller');
const {  rolAdministradorGet, rolAdministradorPost, rolAdministradorPut, rolAdministradorDelete } = RolAdministrador;

const router = Router();

router.get('/', rolAdministradorGet);

// Metodo para crear un rol de administrador
router.post('/', [
    check('descripcion', 'El nombre del rol es obligatorio').not().isEmpty(),
    // TODO: VALIDAR QUE NO HALLAN ROLES CON EL MISMO NOMBRE
    validarCampos
], rolAdministradorPost);


//Ruta para modificar un tipo de rol
router.put('/:id', [
    check('descripcion', 'El nombre del rol es obligatorio').not().isEmpty(),
    validarCampos
], rolAdministradorPut);

//Ruta para eliminar el rol de administrador
router.delete('/:id', rolAdministradorDelete);



module.exports = router;


