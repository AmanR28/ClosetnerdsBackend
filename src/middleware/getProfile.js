const passport = require('passport');
const { User, Profile } = require('../db');
const { DatabaseError } = require('sequelize');
const errorMessages = require('../commons/error_messages');

const getProfile = async (req, res, next) => {
  try {
    const user = req.user;

    if (user.isRegistered) {
      const jwt_user = req.jwt_user;
      if (!jwt_user || jwt_user.id != user.id) {
        return res.status(401).send(errorMessages.UNAUTHORIZED);
      }
    }

    const profile = await user.getProfile();

    req.profile = profile;
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

module.exports = getProfile;
