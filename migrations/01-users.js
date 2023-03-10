module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },

      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      gender: {
        type: Sequelize.ENUM('male', 'female', 'none'),
        allowNull: false,
        defaultValue: 'none',
      },
      city: {
        type: Sequelize.STRING,
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
        unique: true,
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
        type: Sequelize.STRING(20),
      },
      phoneVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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
        type: Sequelize.UUID,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  },
};
