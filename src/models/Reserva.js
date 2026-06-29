const { DataTypes } = require('sequelize');

const Reserva = (sequelize) => {
  return sequelize.define('Reserva', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    mesa_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    servicio_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fecha_hora: {
      type: DataTypes.DATE,
      allowNull: false
    },
    estado: {
      type: DataTypes.ENUM('pendiente', 'confirmada', 'cancelada'),
      defaultValue: 'confirmada',
      allowNull: false
    }
  }, {
    tableName: 'reservas',
    timestamps: true
  });
};

module.exports = Reserva;