const express = require('express');
const router = express.Router();
const { obtenerDisponibilidades, crearDisponibilidad, actualizarDisponibilidad, eliminarDisponibilidad } = require('../controllers/disponibilidad.controller');
const { verifyToken, esAdmin } = require('../middlewares/auth.middleware');

router.get('/', obtenerDisponibilidades);
router.post('/', verifyToken, esAdmin, crearDisponibilidad);
router.put('/:id', verifyToken, esAdmin, actualizarDisponibilidad);
router.delete('/:id', verifyToken, esAdmin, eliminarDisponibilidad);

module.exports = router;
