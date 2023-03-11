'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('profiles', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'fk_profile_user',
      references: {
        table: 'users',
        field: 'id',
      },
      onDelete: 'CASCADE',
    });
    await queryInterface.addIndex('profiles', ['userId']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('profiles', ['userId']);
    await queryInterface.removeConstraint('profiles', 'fk_profile_user');
  },
};
