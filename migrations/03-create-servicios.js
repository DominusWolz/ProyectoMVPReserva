module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('servicios', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      nombre: {
        type: Sequelize.STRING,
        allowNull: false
      },
      duracion: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'Duración en minutos'
      },
      precio: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('servicios');
  }
};