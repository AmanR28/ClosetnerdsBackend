const { Sequelize, Model } = require('sequelize');
const errorMessages = require('../commons/error_messages');
const successMessages = require('../commons/success_messages');
const { ValidationError, DatabaseError } = require('sequelize');

module.exports = sequelize => {
  class Profile extends Model {
    async update(data) {
      try {
        for (const key of Object.keys(data)) {
          this[key] = data[key];
        }
        await this.validate();
        await this.save();

        return { status: 200, msg: successMessages.PROFILE_UPDATED };
      } catch (error) {
        if (error instanceof ValidationError) {
          return { status: 400, msg: errorMessages.BAD_REQUEST };
        }
        console.error(error);
        if (error instanceof DatabaseError) {
          return { status: 500, msg: errorMessages.DATABASE_FAILURE };
        } else {
          return { status: 500, msg: errorMessages.SYSTEM_FAILURE };
        }
      }
    }
  }

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
      picture: {
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
