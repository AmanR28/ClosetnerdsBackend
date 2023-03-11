const { Sequelize, Model } = require('sequelize');

module.exports = sequelize => {
  class Profile extends Model {}

  Profile.init(
    {
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
        validate: {
          isValid(type) {
            const r = ['Triangle', 'Inverted', 'Hourglass', 'Rectangle', 'Diamond', 'Rounded'].includes(type)
              ? true
              : false;

            if (!r) {
              throw new Error('Validation valid on type failed');
            }
          },
        },
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
    },
    {
      sequelize,
      modelName: 'profiles',
      timestamps: false,
    }
  );

  return Profile;
};
