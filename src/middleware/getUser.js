const passport = require('passport');
const error_messages = require('../commons/error_messages');

const getUser = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return next();

  passport.authenticate('jwt', (err, user) => {
    if (err) {
      if (err == error_messages.INVALID_TOKEN) {
        return res.status(404).send(error_messages.INVALID_TOKEN);
      }
      console.error(err);
      return res.status(500).send(errorMessages.SYSTEM_FAILURE);
    }
    req.user = user;
    return next();
  })(req, res, next);
};

module.exports = getUser;
