const { Reserva, Mesa, Servicio, Usuario } = require('../database');
const { Op } = require('sequelize');

const crearReserva = async (req, res) => {
  try {
    const { mesa_id, servicio_id, fecha_hora } = req.body;
    const usuario_id = req.usuario.id;

    if (!mesa_id || !servicio_id || !fecha_hora) {
      return res.status(400).json({ error: 'mesa_id, servicio_id y fecha_hora son obligatorios' });
    }

    const mesa = await Mesa.findByPk(mesa_id);
    if (!mesa) return res.status(404).json({ error: 'Mesa no encontrada' });

    const servicio = await Servicio.findByPk(servicio_id);
    if (!servicio) return res.status(404).json({ error: 'Servicio no encontrado' });

    const fecha = new Date(fecha_hora);
    const horaFin = new Date(fecha.getTime() + servicio.duracion * 60000);

    const conflictos = await Reserva.findAll({
      where: {
        mesa_id,
        estado: { [Op.not]: 'cancelada' },
        fecha_hora: { [Op.lt]: horaFin }
      },
      include: [{ model: Servicio, attributes: ['duracion'] }]
    });

    for (const existente of conflictos) {
      const duracionExistente = existente.Servicio ? existente.Servicio.duracion : servicio.duracion;
      const conflictoFin = new Date(existente.fecha_hora.getTime() + duracionExistente * 60000);
      if (fecha < conflictoFin) {
        return res.status(409).json({ error: 'La mesa ya esta reservada en ese horario' });
      }
    }

    const reserva = await Reserva.create({
      usuario_id,
      mesa_id,
      servicio_id,
      fecha_hora: fecha,
      estado: 'confirmada'
    });

    const reservaCompleta = await Reserva.findByPk(reserva.id, {
      include: [
        { model: Mesa, attributes: ['numero', 'capacidad'] },
        { model: Servicio, attributes: ['nombre', 'duracion', 'precio'] },
        { model: Usuario, attributes: ['nombre', 'email'] }
      ]
    });

    res.status(201).json(reservaCompleta);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear la reserva' });
  }
};

const misReservas = async (req, res) => {
  try {
    const reservas = await Reserva.findAll({
      where: { usuario_id: req.usuario.id },
      include: [
        { model: Mesa, attributes: ['numero', 'capacidad'] },
        { model: Servicio, attributes: ['nombre', 'duracion', 'precio'] }
      ],
      order: [['fecha_hora', 'DESC']]
    });
    res.json(reservas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener reservas' });
  }
};

const reservasPorFecha = async (req, res) => {
  try {
    const { fecha } = req.query;
    if (!fecha) return res.status(400).json({ error: 'Fecha es requerida (YYYY-MM-DD)' });

    const inicio = new Date(`${fecha}T00:00:00`);
    const fin = new Date(`${fecha}T23:59:59`);

    const reservas = await Reserva.findAll({
      where: { fecha_hora: { [Op.between]: [inicio, fin] } },
      include: [
        { model: Mesa, attributes: ['numero', 'capacidad'] },
        { model: Servicio, attributes: ['nombre', 'duracion', 'precio'] },
        { model: Usuario, attributes: ['nombre', 'email'] }
      ],
      order: [['fecha_hora', 'ASC']]
    });
    res.json(reservas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener reservas' });
  }
};

const agendaDia = async (req, res) => {
  try {
    const { fecha } = req.query;
    if (!fecha) return res.status(400).json({ error: 'Fecha es requerida (YYYY-MM-DD)' });

    const inicio = new Date(`${fecha}T00:00:00`);
    const fin = new Date(`${fecha}T23:59:59`);

    const reservas = await Reserva.findAll({
      where: { fecha_hora: { [Op.between]: [inicio, fin] }, estado: { [Op.not]: 'cancelada' } },
      include: [
        { model: Mesa, attributes: ['numero', 'capacidad'] },
        { model: Servicio, attributes: ['nombre', 'duracion', 'precio'] },
        { model: Usuario, attributes: ['nombre', 'email'] }
      ],
      order: [['fecha_hora', 'ASC']]
    });
    res.json(reservas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener agenda' });
  }
};

const cancelarReserva = async (req, res) => {
  try {
    const { id } = req.params;
    const reserva = await Reserva.findByPk(id);

    if (!reserva) return res.status(404).json({ error: 'Reserva no encontrada' });

    if (reserva.usuario_id !== req.usuario.id && req.usuario.rol !== 'admin') {
      return res.status(403).json({ error: 'No puedes cancelar una reserva que no te pertenece' });
    }

    if (reserva.estado === 'cancelada') {
      return res.status(400).json({ error: 'La reserva ya esta cancelada' });
    }

    await reserva.update({ estado: 'cancelada' });
    res.json({ mensaje: 'Reserva cancelada exitosamente', reserva });
  } catch (error) {
    res.status(500).json({ error: 'Error al cancelar la reserva' });
  }
};

module.exports = { crearReserva, misReservas, reservasPorFecha, agendaDia, cancelarReserva };
