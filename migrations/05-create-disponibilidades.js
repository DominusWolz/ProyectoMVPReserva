module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('disponibilidades', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      dia_semana: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      hora_inicio: {
        type: Sequelize.TIME,
        allowNull: false
      },
      hora_fin: {
        type: Sequelize.TIME,
        allowNull: false
      },
      intervalo_min: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 60
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
    await queryInterface.dropTable('disponibilidades');
  }
};
