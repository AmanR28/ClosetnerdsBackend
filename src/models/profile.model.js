const { Sequelize, DataTypes, Model } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = sequelize => {
  class Profile extends Model {
    async checkPassword(password) {}
    static async getPassword(password) {
      return bcrypt.hash(password, 10);
    }
  }

  Profile.init(
    {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },

      uid: {
        type: Sequelize.UUID,
      },

      measures: {
        type: DataTypes.JSON,
      },
      wears: {
        type: DataTypes.JSON,
      },
      subs: {
        type: DataTypes.JSON,
      },
      occasions: {
        type: DataTypes.JSON,
      },
      prices: {
        type: DataTypes.JSON,
      },
      type: {
        type: DataTypes.ENUM(['Triangle', 'Inverted', 'Hourglass', 'Rectangle']),
      },
      prices: {
        type: DataTypes.TEXT,
      },
      celebrity: {
        type: DataTypes.TEXT,
      },
      skin: {
        type: DataTypes.TEXT,
      },
      pictures: {
        type: DataTypes.TEXT,
      },
    },
    {
      sequelize,
      modelName: 'profs',
    }
  );

  return Profile;
};
