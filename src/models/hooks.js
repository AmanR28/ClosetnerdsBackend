const { User, Profile } = require('../db');
const sendgrid = require('../services/sendgrid.service');

const hooks = {
  ['User']: {
    beforeCreate: async (user, options) => {
      const profile = await Profile.create({
        uid: user.id,
      });
      user.profileId = profile.id;
    },
    afterCreate: (user, options) => {
      sendgrid.smSignUp(user.email);
    },
  },
};

module.exports = hooks;
