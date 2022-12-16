const { Router } = require('express');
const { profesoresGet, profesoresPost, profesoresPut, profesoresDelete } = require('../controllers/teacher_controller');

const router = Router();

router.get('/', profesoresGet);

router.post('/', profesoresPost);

router.put('/:id', profesoresPut);

router.delete('/', profesoresDelete);

module.exports = router;