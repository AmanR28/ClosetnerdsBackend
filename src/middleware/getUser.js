const passport = require('passport');
const { User, Profile } = require('../db');
const errorMessages = require('../commons/error_messages');
const { DatabaseError } = require('sequelize');

const getUser = async (req, res, next) => {
  try {
    const email = req.body.email;
    const mobile = req.body.mobile;
    const googleId = req.body.googleId;
    const facebookId = req.body.facebookId;

    let user;

    if (email) {
      user = await User.findOne({ where: { email: req.body.email } });
    } else if (mobile) {
      user = await User.findOne({ where: { mobile: req.body.mobile } });
    } else if (googleId) {
      user = await User.findOne({ where: { googleId: req.body.googleId } });
    } else if (facebookId) {
      user = await User.findOne({ where: { facebookId: req.body.facebookId } });
    } else {
      return res.status(400).send(errorMessages.MISSING_FIELD);
    }

    if (!user) {
      return res.status(404).send(errorMessages.NOT_FOUND);
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    if (error instanceof DatabaseError) {
      return res.status(500).send(errorMessages.DATABASE_FAILURE);
    } else {
      return res.status(500).send(errorMessages.SYSTEM_FAILURE);
    }
  }
};

module.exports = getUser;
