const { DataTypes } = require('sequelize');
// Nota: Aquí se importará la conexión a la base de datos más adelante
const sequelize = require('../index.js'); 

const Mesa = (sequelize) => {
  return sequelize.define('Mesa', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    numero: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    capacidad: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'mesas',
    timestamps: false
  });
};

module.exports = Mesa;