const express = require('express');
const router = express.Router();
const { crearReserva, misReservas, reservasPorFecha, agendaDia, cancelarReserva } = require('../controllers/reserva.controller');
const { verifyToken, esAdmin } = require('../middlewares/auth.middleware');

router.post('/', verifyToken, crearReserva);
router.get('/mis-reservas', verifyToken, misReservas);
router.get('/por-fecha', verifyToken, esAdmin, reservasPorFecha);
router.get('/agenda', verifyToken, esAdmin, agendaDia);
router.patch('/:id/cancelar', verifyToken, cancelarReserva);

module.exports = router;
