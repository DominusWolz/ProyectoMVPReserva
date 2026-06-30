const { Op } = require('sequelize');
const { Mesa } = require('../database');

const normalizarMesa = (body) => ({
  numero: Number(body.numero),
  capacidad: Number(body.capacidad)
});

const validarMesa = ({ numero, capacidad }) => {
  if (!Number.isInteger(numero) || numero <= 0) return 'El numero de mesa debe ser un entero mayor a 0';
  if (!Number.isInteger(capacidad) || capacidad <= 0) return 'La capacidad debe ser un entero mayor a 0';
  return null;
};

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
    const { numero, capacidad } = normalizarMesa(req.body);
    const errorValidacion = validarMesa({ numero, capacidad });
    if (errorValidacion) return res.status(400).json({ error: errorValidacion });

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
    const { numero, capacidad } = normalizarMesa(req.body);
    const errorValidacion = validarMesa({ numero, capacidad });
    if (errorValidacion) return res.status(400).json({ error: errorValidacion });

    const mesa = await Mesa.findByPk(id);
    if (!mesa) return res.status(404).json({ error: 'Mesa no encontrada' });

    const existe = await Mesa.findOne({
      where: {
        numero,
        id: { [Op.ne]: id }
      }
    });
    if (existe) return res.status(409).json({ error: 'Ya existe una mesa con ese numero' });

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
