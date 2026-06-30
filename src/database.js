const { Sequelize } = require('sequelize');
require('dotenv').config({ quiet: true });

const requiredEnv = ['DB_HOST', 'DB_USER', 'DB_NAME', 'JWT_SECRET'];
const missingEnv = requiredEnv.filter((key) => !process.env[key] || process.env[key].trim() === '');

if (missingEnv.length > 0) {
  throw new Error('Faltan variables de entorno requeridas: ' + missingEnv.join(', '));
}

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false
  }
);

const Usuario = require('./models/Usuario')(sequelize);
const Mesa = require('./models/Mesa')(sequelize);
const Servicio = require('./models/Servicio')(sequelize);
const Reserva = require('./models/Reserva')(sequelize);
const Disponibilidad = require('./models/Disponibilidad')(sequelize);

Usuario.hasMany(Reserva, { foreignKey: 'usuario_id' });
Reserva.belongsTo(Usuario, { foreignKey: 'usuario_id' });

Mesa.hasMany(Reserva, { foreignKey: 'mesa_id' });
Reserva.belongsTo(Mesa, { foreignKey: 'mesa_id' });

Servicio.hasMany(Reserva, { foreignKey: 'servicio_id' });
Reserva.belongsTo(Servicio, { foreignKey: 'servicio_id' });

sequelize.authenticate()
  .then(() => {
    console.log('Conexion exitosa con la base de datos MySQL (reservas_db).');
  })
  .catch(err => {
    console.error('ERROR CRITICO: No se pudo conectar a MySQL.', err.message);
  });

module.exports = { sequelize, Usuario, Mesa, Servicio, Reserva, Disponibilidad };
