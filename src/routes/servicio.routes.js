const express = require('express');
const router = express.Router();
const { obtenerServicios, crearServicio, actualizarServicio, eliminarServicio } = require('../controllers/servicio.controller.js');
const { verifyToken, esAdmin } = require('../middlewares/auth.middleware');

router.get('/', obtenerServicios);
router.post('/', verifyToken, esAdmin, crearServicio);
router.put('/:id', verifyToken, esAdmin, actualizarServicio);
router.delete('/:id', verifyToken, esAdmin, eliminarServicio);

module.exports = router;