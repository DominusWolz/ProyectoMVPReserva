const { Op, Transaction } = require('sequelize');
const { sequelize, Reserva, Mesa, Servicio, Usuario, Disponibilidad } = require('../database');

const fechaReservaRegex = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/;
const fechaDiaRegex = /^(\d{4})-(\d{2})-(\d{2})$/;

const pad = (value) => String(value).padStart(2, '0');

const esIdValido = (value) => {
  const numero = Number(value);
  return Number.isInteger(numero) && numero > 0;
};

const parseFechaReserva = (value) => {
  const match = String(value || '').match(fechaReservaRegex);
  if (!match) return null;

  const [, rawYear, rawMonth, rawDay, rawHour, rawMinute, rawSecond] = match;
  const year = Number(rawYear);
  const month = Number(rawMonth);
  const day = Number(rawDay);
  const hour = Number(rawHour);
  const minute = Number(rawMinute);
  const second = Number(rawSecond || 0);
  const fecha = new Date(year, month - 1, day, hour, minute, second, 0);

  if (
    fecha.getFullYear() !== year ||
    fecha.getMonth() !== month - 1 ||
    fecha.getDate() !== day ||
    fecha.getHours() !== hour ||
    fecha.getMinutes() !== minute
  ) {
    return null;
  }

  return fecha;
};

const parseFechaDia = (value) => {
  const match = String(value || '').match(fechaDiaRegex);
  if (!match) return null;

  const [, year, month, day] = match.map(Number);
  const fecha = new Date(year, month - 1, day, 0, 0, 0, 0);

  if (
    fecha.getFullYear() !== year ||
    fecha.getMonth() !== month - 1 ||
    fecha.getDate() !== day
  ) {
    return null;
  }

  return fecha;
};

const formatearFechaDia = (fecha) => {
  return `${fecha.getFullYear()}-${pad(fecha.getMonth() + 1)}-${pad(fecha.getDate())}`;
};

const rangoDia = (fecha) => {
  const inicio = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate(), 0, 0, 0, 0);
  const fin = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate(), 23, 59, 59, 999);
  return { inicio, fin };
};

const horaAMinutos = (hora) => {
  const [horas, minutos] = String(hora).slice(0, 5).split(':').map(Number);
  return horas * 60 + minutos;
};

const minutosDesdeMedianoche = (fecha) => fecha.getHours() * 60 + fecha.getMinutes();

const formatearHora = (minutosTotales) => {
  const horas = Math.floor(minutosTotales / 60);
  const minutos = minutosTotales % 60;
  return `${pad(horas)}:${pad(minutos)}`;
};

const obtenerDisponibilidadesDelDia = (fecha, transaction = null) => {
  return Disponibilidad.findAll({
    where: { dia_semana: fecha.getDay() + 1 },
    order: [['hora_inicio', 'ASC']],
    transaction
  });
};

const estaDentroDeDisponibilidad = async (fechaInicio, duracionMin, transaction = null) => {
  const inicioMin = minutosDesdeMedianoche(fechaInicio);
  const finMin = inicioMin + duracionMin;
  const disponibilidades = await obtenerDisponibilidadesDelDia(fechaInicio, transaction);

  return disponibilidades.some((disp) => {
    const dispInicio = horaAMinutos(disp.hora_inicio);
    const dispFin = horaAMinutos(disp.hora_fin);
    const intervalo = Number(disp.intervalo_min);

    return (
      inicioMin >= dispInicio &&
      finMin <= dispFin &&
      (inicioMin - dispInicio) % intervalo === 0
    );
  });
};

const hayConflictoReserva = (inicioNuevo, duracionNueva, reservasExistentes) => {
  const finNuevo = new Date(inicioNuevo.getTime() + duracionNueva * 60000);

  return reservasExistentes.some((reserva) => {
    const inicioExistente = new Date(reserva.fecha_hora);
    const duracionExistente = Number(reserva.Servicio ? reserva.Servicio.duracion : duracionNueva);
    const finExistente = new Date(inicioExistente.getTime() + duracionExistente * 60000);

    return inicioNuevo < finExistente && inicioExistente < finNuevo;
  });
};

const crearReserva = async (req, res) => {
  try {
    const { mesa_id, servicio_id, fecha_hora } = req.body;
    const usuario_id = req.usuario.id;
    const mesaId = Number(mesa_id);
    const servicioId = Number(servicio_id);

    if (!esIdValido(mesaId) || !esIdValido(servicioId) || !fecha_hora) {
      return res.status(400).json({ error: 'mesa_id, servicio_id y fecha_hora validos son obligatorios' });
    }

    const fecha = parseFechaReserva(fecha_hora);
    if (!fecha) {
      return res.status(400).json({ error: 'fecha_hora debe tener formato YYYY-MM-DDTHH:mm' });
    }

    if (fecha <= new Date()) {
      return res.status(400).json({ error: 'No se pueden crear reservas en fechas u horas pasadas' });
    }

    const resultado = await sequelize.transaction(
      { isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE },
      async (transaction) => {
        const mesa = await Mesa.findByPk(mesaId, { transaction });
        if (!mesa) return { status: 404, body: { error: 'Mesa no encontrada' } };

        const servicio = await Servicio.findByPk(servicioId, { transaction });
        if (!servicio) return { status: 404, body: { error: 'Servicio no encontrado' } };

        const duracion = Number(servicio.duracion);
        const dentroDisponibilidad = await estaDentroDeDisponibilidad(fecha, duracion, transaction);
        if (!dentroDisponibilidad) {
          return { status: 400, body: { error: 'El horario seleccionado esta fuera de la disponibilidad configurada' } };
        }

        const horaFin = new Date(fecha.getTime() + duracion * 60000);
        const reservasEnRango = await Reserva.findAll({
          where: {
            mesa_id: mesaId,
            estado: { [Op.not]: 'cancelada' },
            fecha_hora: { [Op.lt]: horaFin }
          },
          include: [{ model: Servicio, attributes: ['duracion'] }],
          transaction,
          lock: true
        });

        if (hayConflictoReserva(fecha, duracion, reservasEnRango)) {
          return { status: 409, body: { error: 'La mesa ya esta reservada en ese horario' } };
        }

        const reserva = await Reserva.create({
          usuario_id,
          mesa_id: mesaId,
          servicio_id: servicioId,
          fecha_hora: fecha,
          estado: 'confirmada'
        }, { transaction });

        const reservaCompleta = await Reserva.findByPk(reserva.id, {
          include: [
            { model: Mesa, attributes: ['numero', 'capacidad'] },
            { model: Servicio, attributes: ['nombre', 'duracion', 'precio'] },
            { model: Usuario, attributes: ['nombre', 'email'] }
          ],
          transaction
        });

        return { status: 201, body: reservaCompleta };
      }
    );

    res.status(resultado.status).json(resultado.body);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear la reserva' });
  }
};

const slotsDisponibles = async (req, res) => {
  try {
    const { fecha, mesa_id, servicio_id } = req.query;
    const mesaId = Number(mesa_id);
    const servicioId = Number(servicio_id);

    if (!fecha || !esIdValido(mesaId) || !esIdValido(servicioId)) {
      return res.status(400).json({ error: 'fecha, mesa_id y servicio_id son obligatorios' });
    }

    const fechaBase = parseFechaDia(fecha);
    if (!fechaBase) {
      return res.status(400).json({ error: 'Fecha invalida. Usa formato YYYY-MM-DD' });
    }

    const mesa = await Mesa.findByPk(mesaId);
    if (!mesa) return res.status(404).json({ error: 'Mesa no encontrada' });

    const servicio = await Servicio.findByPk(servicioId);
    if (!servicio) return res.status(404).json({ error: 'Servicio no encontrado' });

    const duracion = Number(servicio.duracion);
    const disponibilidades = await obtenerDisponibilidadesDelDia(fechaBase);
    const { inicio, fin } = rangoDia(fechaBase);

    const reservasDelDia = await Reserva.findAll({
      where: {
        mesa_id: mesaId,
        estado: { [Op.not]: 'cancelada' },
        fecha_hora: { [Op.between]: [inicio, fin] }
      },
      include: [{ model: Servicio, attributes: ['duracion'] }]
    });

    const ahora = new Date();
    const slots = [];

    disponibilidades.forEach((disp) => {
      const inicioDisp = horaAMinutos(disp.hora_inicio);
      const finDisp = horaAMinutos(disp.hora_fin);
      const intervalo = Number(disp.intervalo_min);

      for (let min = inicioDisp; min + duracion <= finDisp; min += intervalo) {
        const slotFecha = new Date(
          fechaBase.getFullYear(),
          fechaBase.getMonth(),
          fechaBase.getDate(),
          Math.floor(min / 60),
          min % 60,
          0,
          0
        );

        if (slotFecha <= ahora) continue;
        if (!hayConflictoReserva(slotFecha, duracion, reservasDelDia)) {
          slots.push(formatearHora(min));
        }
      }
    });

    res.json({
      fecha: formatearFechaDia(fechaBase),
      slots: [...new Set(slots)].sort()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener horarios disponibles' });
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
    const fecha = parseFechaDia(req.query.fecha);
    if (!fecha) return res.status(400).json({ error: 'Fecha es requerida con formato YYYY-MM-DD' });

    const { inicio, fin } = rangoDia(fecha);

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
    const fecha = parseFechaDia(req.query.fecha);
    if (!fecha) return res.status(400).json({ error: 'Fecha es requerida con formato YYYY-MM-DD' });

    const { inicio, fin } = rangoDia(fecha);

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

module.exports = { crearReserva, slotsDisponibles, misReservas, reservasPorFecha, agendaDia, cancelarReserva };
