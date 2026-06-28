const { DataTypes } = require('sequelize');

const Servicio = (sequelize) => {
  return sequelize.define('Servicio', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    duracion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Duración en minutos'
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  }, {
    tableName: 'servicios',
    timestamps: true
  });
};

module.exports = Servicio;