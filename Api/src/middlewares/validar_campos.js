const { validationResult } = require('express-validator');

// Middleware para validar los campos
const validarCampos = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors);
    }
    next(); // Si no hay errores, continua con el siguiente middleware
}

module.exports = {
    validarCampos
}