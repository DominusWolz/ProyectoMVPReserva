const { DataTypes } = require('sequelize');

const Disponibilidad = (sequelize) => {
  return sequelize.define('Disponibilidad', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    dia_semana: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: '1=Domingo, 2=Lunes ... 7=Sabado'
    },
    hora_inicio: {
      type: DataTypes.TIME,
      allowNull: false
    },
    hora_fin: {
      type: DataTypes.TIME,
      allowNull: false
    },
    intervalo_min: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 60
    }
  }, {
    tableName: 'disponibilidades',
    timestamps: true
  });
};

module.exports = Disponibilidad;
