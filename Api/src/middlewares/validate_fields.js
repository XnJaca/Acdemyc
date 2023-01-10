//Require validation result
const { validationResult } = require('express-validator');

// Middleware para validar los campos
const validateFields = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            ok: false,
            errors: errors.mapped()
        });
    }
    next();
}


// Exportar el middleware
module.exports = {
    validateFields
}
