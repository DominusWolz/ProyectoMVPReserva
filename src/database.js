const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'reservas_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || 'Catdog10',
  {
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'mysql',
    logging: false 
  }
);

// Importamos el modelo pasándole la instancia de sequelize
const Servicio = require('./models/Servicio')(sequelize);

// PROBADOR DE CONEXIÓN AUTOMÁTICO
sequelize.authenticate()
  .then(() => {
    console.log('✅ Conexión exitosa con la base de datos MySQL (reservas_db).');
  })
  .catch(err => {
    console.error('❌ ERROR CRÍTICO: No se pudo conectar a MySQL. Verifica tu archivo .env o si MySQL está encendido. Detalles:', err.message);
  });

module.exports = { sequelize, Servicio };