module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('usrs', {
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

      role: {
        type: Sequelize.ENUM('client', 'admin'),
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
        validate: {
          isEmail: true,
          async isUnique(email) {
            const user = await User.findOne({ where: { email } });
            if (user) {
              throw new Error('Validation isUnique on email failed');
            }
          },
        },
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
        async isUnique(email) {
          const user = await User.findOne({ where: { email } });
          if (user) {
            throw new Error('Validation isUnique on phone failed');
          }
        },
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
    await queryInterface.dropTable('usrs');
  },
};
