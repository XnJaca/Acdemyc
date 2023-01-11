// Require middleware
const validarCampos = require('../middlewares/validate_fields');
const validarRoles = require('../middlewares/validate_role');
// Require validate-jwt
const validarJWT = require('../middlewares/validate_jwt');


// Export middlewares
module.exports = {
    ...validarCampos,
    ...validarRoles,
    ...validarJWT
}