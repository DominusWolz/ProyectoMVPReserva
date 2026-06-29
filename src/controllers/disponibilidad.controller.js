const { Disponibilidad } = require('../database');

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
    const { dia_semana, hora_inicio, hora_fin, intervalo_min } = req.body;
    if (!dia_semana || !hora_inicio || !hora_fin) {
      return res.status(400).json({ error: 'dia_semana, hora_inicio y hora_fin son obligatorios' });
    }
    const disp = await Disponibilidad.create({ dia_semana, hora_inicio, hora_fin, intervalo_min: intervalo_min || 60 });
    res.status(201).json(disp);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear disponibilidad' });
  }
};

const actualizarDisponibilidad = async (req, res) => {
  try {
    const { id } = req.params;
    const { dia_semana, hora_inicio, hora_fin, intervalo_min } = req.body;
    const disp = await Disponibilidad.findByPk(id);
    if (!disp) return res.status(404).json({ error: 'Disponibilidad no encontrada' });
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
