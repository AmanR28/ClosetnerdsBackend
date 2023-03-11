const { Sequelize, Model } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = sequelize => {
  class User extends Model {
    async checkPassword(password) {
      return bcrypt.compare(password, this.password);
    }
    static async getPassword(password) {
      return bcrypt.hash(password, 10);
    }
  }

  User.init(
    {
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
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'none',
        validate: {
          isValid(type) {
            return type in ['male', 'female', 'none'] ? true : false;
          },
        },
      },
      city: {
        type: Sequelize.STRING,
      },

      role: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'client',
        validate: {
          isValid(type) {
            return type in ['client', 'admin'] ? true : false;
          },
        },
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
    },
    {
      sequelize,
      modelName: 'users',
      timestamps: false,
    }
  );

  return User;
};
