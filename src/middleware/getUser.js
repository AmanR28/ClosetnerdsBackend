const passport = require('passport');
const { User, Profile } = require('../db');
const errorMessages = require('../commons/error_messages');
const { DatabaseError } = require('sequelize');

const getUser = async (req, res, next) => {
  try {
    const email = req.body.email;

    if (!email) {
      return res.status(404).send(errorMessages.NOT_FOUND);
    }

    const user = await User.findOne({ where: { email: req.body.email } });

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
