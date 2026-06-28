const { Sequelize } = require('sequelize');
require('dotenv').config();

// Inicializamos Sequelize con las variables de tu .env
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false // Para no llenar la consola de mensajes SQL
  }
);

// Importamos el modelo de Servicio que ya habías creado
const Servicio = require('./models/Servicio')(sequelize);
// (Más adelante importaremos Mesa, Reserva y Usuario aquí mismo)

module.exports = { sequelize, Servicio };