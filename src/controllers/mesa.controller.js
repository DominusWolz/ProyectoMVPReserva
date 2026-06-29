const { Mesa } = require('../database');

const obtenerMesas = async (req, res) => {
  try {
    const mesas = await Mesa.findAll({ order: [['numero', 'ASC']] });
    res.json(mesas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las mesas' });
  }
};

const crearMesa = async (req, res) => {
  try {
    const { numero, capacidad } = req.body;
    if (!numero || !capacidad) {
      return res.status(400).json({ error: 'Numero y capacidad son obligatorios' });
    }
    const existe = await Mesa.findOne({ where: { numero } });
    if (existe) {
      return res.status(409).json({ error: 'Ya existe una mesa con ese numero' });
    }
    const mesa = await Mesa.create({ numero, capacidad });
    res.status(201).json(mesa);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la mesa' });
  }
};

const actualizarMesa = async (req, res) => {
  try {
    const { id } = req.params;
    const { numero, capacidad } = req.body;
    const mesa = await Mesa.findByPk(id);
    if (!mesa) return res.status(404).json({ error: 'Mesa no encontrada' });
    await mesa.update({ numero, capacidad });
    res.json(mesa);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la mesa' });
  }
};

const eliminarMesa = async (req, res) => {
  try {
    const { id } = req.params;
    const mesa = await Mesa.findByPk(id);
    if (!mesa) return res.status(404).json({ error: 'Mesa no encontrada' });
    await mesa.destroy();
    res.json({ mensaje: 'Mesa eliminada correctamente' });
  } catch (error) {
    res.status(400).json({ error: 'No se puede eliminar una mesa con reservas asociadas' });
  }
};

module.exports = { obtenerMesas, crearMesa, actualizarMesa, eliminarMesa };
