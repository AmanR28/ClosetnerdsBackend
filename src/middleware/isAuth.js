const passport = require('passport');
const { ValidationError, DatabaseError } = require('sequelize');
const error_messages = require('../commons/error_messages');

const isAuth = (req, res, next) => {
  passport.authenticate('jwt', (err, user) => {
    if (err) {
      if (err == error_messages.INVALID_TOKEN) {
        return res.status(404).send(error_messages.INVALID_TOKEN);
      }
      console.error(err);
      return res.status(500).send(errorMessages.SYSTEM_FAILURE);
    }
    req.jwt_user = user;
    next();
  })(req, res, next);
};

module.exports = isAuth;
