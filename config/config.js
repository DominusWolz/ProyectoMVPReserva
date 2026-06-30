require('dotenv').config({ quiet: true });

const requiredEnv = ['DB_HOST', 'DB_USER', 'DB_NAME'];
const missingEnv = requiredEnv.filter((key) => !process.env[key] || process.env[key].trim() === '');

if (missingEnv.length > 0) {
  throw new Error('Faltan variables de entorno requeridas para Sequelize CLI: ' + missingEnv.join(', '));
}

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'mysql'
  }
};
