const { Op } = require('sequelize');
const { Servicio } = require('../database');

const normalizarServicio = (body) => ({
  nombre: String(body.nombre || '').trim(),
  duracion: Number(body.duracion),
  precio: Number(body.precio)
});

const validarServicio = ({ nombre, duracion, precio }) => {
  if (!nombre) return 'El nombre del servicio es obligatorio';
  if (!Number.isInteger(duracion) || duracion <= 0) return 'La duracion debe ser un numero entero mayor a 0';
  if (!Number.isFinite(precio) || precio < 0) return 'El precio debe ser un numero mayor o igual a 0';
  return null;
};

// Obtener todos los servicios (Read)
const obtenerServicios = async (req, res) => {
  try {
    const servicios = await Servicio.findAll({ order: [['nombre', 'ASC']] });
    res.json(servicios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los servicios' });
  }
};

// Crear un nuevo servicio (Create)
const crearServicio = async (req, res) => {
  try {
    const { nombre, duracion, precio } = normalizarServicio(req.body);
    const errorValidacion = validarServicio({ nombre, duracion, precio });
    if (errorValidacion) return res.status(400).json({ error: errorValidacion });

    const existe = await Servicio.findOne({ where: { nombre } });
    if (existe) return res.status(409).json({ error: 'Ya existe un servicio con ese nombre' });

    const nuevoServicio = await Servicio.create({ nombre, duracion, precio });
    res.status(201).json(nuevoServicio);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el servicio' });
  }
};

// Actualizar un servicio (Update)
const actualizarServicio = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, duracion, precio } = normalizarServicio(req.body);
    const errorValidacion = validarServicio({ nombre, duracion, precio });
    if (errorValidacion) return res.status(400).json({ error: errorValidacion });
    
    const servicio = await Servicio.findByPk(id);
    if (!servicio) return res.status(404).json({ error: 'Servicio no encontrado' });

    const existe = await Servicio.findOne({
      where: {
        nombre,
        id: { [Op.ne]: id }
      }
    });
    if (existe) return res.status(409).json({ error: 'Ya existe un servicio con ese nombre' });
    
    await servicio.update({ nombre, duracion, precio });
    res.json(servicio);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el servicio' });
  }
};

// Eliminar un servicio (Delete)
const eliminarServicio = async (req, res) => {
  try {
    const { id } = req.params;
    const servicio = await Servicio.findByPk(id);
    if (!servicio) return res.status(404).json({ error: 'Servicio no encontrado' });
    
    await servicio.destroy();
    res.json({ mensaje: 'Servicio eliminado correctamente' });
  } catch (error) {
    // Regla de negocio cumplida: Si el servicio tiene reservas activas, 
    // MySQL rechazará la eliminación por la llave foránea y caerá aquí.
    res.status(400).json({ error: 'No se puede eliminar un servicio que tiene reservas asociadas.' });
  }
};

module.exports = { obtenerServicios, crearServicio, actualizarServicio, eliminarServicio };
