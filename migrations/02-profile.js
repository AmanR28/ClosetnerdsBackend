module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('profiles', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },

      userId: {
        type: Sequelize.UUID,
      },

      measures: {
        type: Sequelize.JSON,
      },
      wears: {
        type: Sequelize.JSON,
      },
      subs: {
        type: Sequelize.JSON,
      },
      occasions: {
        type: Sequelize.JSON,
      },
      prices: {
        type: Sequelize.JSON,
      },
      colors: {
        type: Sequelize.JSON,
      },
      type: {
        type: Sequelize.STRING,
      },
      brands: {
        type: Sequelize.TEXT,
      },
      celebrity: {
        type: Sequelize.TEXT,
      },
      skin: {
        type: Sequelize.TEXT,
      },
      picture: {
        type: Sequelize.TEXT,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('profiles');
  },
};
