const { DataTypes } = require('sequelize');

const Usuario = (sequelize) => {
  return sequelize.define('Usuario', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true // No pueden haber dos cuentas con el mismo correo
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    rol: {
      type: DataTypes.ENUM('cliente', 'admin'),
      defaultValue: 'cliente',
      allowNull: false
    }
  }, {
    tableName: 'usuarios',
    timestamps: true // Automáticamente crea las columnas createdAt y updatedAt
  });
};

module.exports = Usuario;