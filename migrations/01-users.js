module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('usr', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      gender: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'male',
      },

      role: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'client',
      },

      isRegistered: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      email: {
        type: Sequelize.STRING,
      },
      emailVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },

      password: {
        type: Sequelize.STRING,
      },
      isPasswordAuth: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      passwordReset: {
        type: Sequelize.INTEGER,
      },

      phone: {
        type: Sequelize.STRING,
      },
      isPhoneAuth: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      phoneOTP: {
        type: Sequelize.INTEGER,
      },

      googleId: {
        type: Sequelize.STRING,
      },
      isGoogleAuth: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },

      facebookId: {
        type: Sequelize.STRING,
      },
      isFacebookAuth: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },

      profileId: {
        type: Sequelize.STRING,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('usr');
  },
};
