const { Servicio } = require('../database');

// Obtener todos los servicios (Read)
const obtenerServicios = async (req, res) => {
  try {
    const servicios = await Servicio.findAll();
    res.json(servicios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los servicios' });
  }
};

// Crear un nuevo servicio (Create)
const crearServicio = async (req, res) => {
  try {
    const { nombre, duracion, precio } = req.body;
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
    const { nombre, duracion, precio } = req.body;
    
    const servicio = await Servicio.findByPk(id);
    if (!servicio) return res.status(404).json({ error: 'Servicio no encontrado' });
    
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