const { DataTypes } = require('sequelize');

const Reserva = (sequelize) => {
  return sequelize.define('Reserva', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre_cliente: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fecha_hora: {
      type: DataTypes.DATE,
      allowNull: false
    },
    mesa_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'reservas',
    timestamps: true
  });
};

module.exports = Reserva;