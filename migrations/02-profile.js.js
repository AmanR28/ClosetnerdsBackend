module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('profs', {
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
      type: {
        type: Sequelize.ENUM(['Triangle', 'Inverted', 'Hourglass', 'Rectangle']),
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
      pictures: {
        type: Sequelize.TEXT,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('profs');
  },
};
