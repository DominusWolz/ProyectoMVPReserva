const { Op } = require('sequelize');
const { Disponibilidad } = require('../database');

const horaRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

const normalizarHora = (hora) => String(hora || '').trim().slice(0, 5);

const horaAMinutos = (hora) => {
  const [horas, minutos] = normalizarHora(hora).split(':').map(Number);
  return horas * 60 + minutos;
};

const normalizarDisponibilidad = (body) => ({
  dia_semana: Number(body.dia_semana),
  hora_inicio: normalizarHora(body.hora_inicio),
  hora_fin: normalizarHora(body.hora_fin),
  intervalo_min: body.intervalo_min === undefined || body.intervalo_min === '' ? 60 : Number(body.intervalo_min)
});

const validarDisponibilidad = ({ dia_semana, hora_inicio, hora_fin, intervalo_min }) => {
  if (!Number.isInteger(dia_semana) || dia_semana < 1 || dia_semana > 7) {
    return 'El dia de semana debe estar entre 1 y 7';
  }
  if (!horaRegex.test(hora_inicio) || !horaRegex.test(hora_fin)) {
    return 'Las horas deben tener formato HH:mm';
  }
  if (horaAMinutos(hora_inicio) >= horaAMinutos(hora_fin)) {
    return 'La hora de inicio debe ser menor que la hora de fin';
  }
  if (!Number.isInteger(intervalo_min) || intervalo_min <= 0) {
    return 'El intervalo debe ser un entero mayor a 0';
  }
  if (intervalo_min > horaAMinutos(hora_fin) - horaAMinutos(hora_inicio)) {
    return 'El intervalo no puede ser mayor que la franja horaria';
  }
  return null;
};

const existeSolape = async ({ dia_semana, hora_inicio, hora_fin, excluirId = null }) => {
  const where = {
    dia_semana,
    hora_inicio: { [Op.lt]: hora_fin },
    hora_fin: { [Op.gt]: hora_inicio }
  };

  if (excluirId) {
    where.id = { [Op.ne]: excluirId };
  }

  return Disponibilidad.findOne({ where });
};

const obtenerDisponibilidades = async (req, res) => {
  try {
    const disp = await Disponibilidad.findAll({ order: [['dia_semana', 'ASC'], ['hora_inicio', 'ASC']] });
    res.json(disp);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener disponibilidades' });
  }
};

const crearDisponibilidad = async (req, res) => {
  try {
    const { dia_semana, hora_inicio, hora_fin, intervalo_min } = normalizarDisponibilidad(req.body);
    const errorValidacion = validarDisponibilidad({ dia_semana, hora_inicio, hora_fin, intervalo_min });
    if (errorValidacion) return res.status(400).json({ error: errorValidacion });

    const solape = await existeSolape({ dia_semana, hora_inicio, hora_fin });
    if (solape) return res.status(409).json({ error: 'Ya existe una franja horaria que se solapa con ese horario' });

    const disp = await Disponibilidad.create({ dia_semana, hora_inicio, hora_fin, intervalo_min });
    res.status(201).json(disp);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear disponibilidad' });
  }
};

const actualizarDisponibilidad = async (req, res) => {
  try {
    const { id } = req.params;
    const { dia_semana, hora_inicio, hora_fin, intervalo_min } = normalizarDisponibilidad(req.body);
    const errorValidacion = validarDisponibilidad({ dia_semana, hora_inicio, hora_fin, intervalo_min });
    if (errorValidacion) return res.status(400).json({ error: errorValidacion });

    const disp = await Disponibilidad.findByPk(id);
    if (!disp) return res.status(404).json({ error: 'Disponibilidad no encontrada' });

    const solape = await existeSolape({ dia_semana, hora_inicio, hora_fin, excluirId: id });
    if (solape) return res.status(409).json({ error: 'Ya existe una franja horaria que se solapa con ese horario' });

    await disp.update({ dia_semana, hora_inicio, hora_fin, intervalo_min });
    res.json(disp);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar disponibilidad' });
  }
};

const eliminarDisponibilidad = async (req, res) => {
  try {
    const { id } = req.params;
    const disp = await Disponibilidad.findByPk(id);
    if (!disp) return res.status(404).json({ error: 'Disponibilidad no encontrada' });
    await disp.destroy();
    res.json({ mensaje: 'Disponibilidad eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar disponibilidad' });
  }
};

module.exports = { obtenerDisponibilidades, crearDisponibilidad, actualizarDisponibilidad, eliminarDisponibilidad };
