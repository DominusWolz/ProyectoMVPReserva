module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('reservas', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      nombre_cliente: {
        type: Sequelize.STRING,
        allowNull: false
      },
      fecha_hora: {
        type: Sequelize.DATE,
        allowNull: false
      },
      mesa_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'mesas',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
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
    await queryInterface.dropTable('reservas');
  }
};