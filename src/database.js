const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'reservas_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || 'Catdog10',
  {
    host: process.env.DB_HOST || 'localhost',
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
