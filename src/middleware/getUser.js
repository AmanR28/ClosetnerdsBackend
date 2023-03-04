const passport = require('passport');
const error_messages = require('../commons/error_messages');

const getUser = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return next();

  passport.authenticate('jwt', (err, user) => {
    if (err) {
      return next();
    }
    req.jwt_user = user;
    return next();
  })(req, res, next);
};

module.exports = getUser;
