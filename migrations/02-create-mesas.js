module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('mesas', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      numero: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true
      },
      capacidad: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('mesas');
  }
};