const express = require('express');
const router = express.Router();
const { obtenerMesas, crearMesa, actualizarMesa, eliminarMesa } = require('../controllers/mesa.controller');
const { verifyToken, esAdmin } = require('../middlewares/auth.middleware');

router.get('/', obtenerMesas);
router.post('/', verifyToken, esAdmin, crearMesa);
router.put('/:id', verifyToken, esAdmin, actualizarMesa);
router.delete('/:id', verifyToken, esAdmin, eliminarMesa);

module.exports = router;
