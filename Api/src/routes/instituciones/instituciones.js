const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../../middlewares');
const {} = require('../../helpers/validators')

const { institucionesController } = require('../../controllers/instituciones/instituciones_controller')

const router = Router();
