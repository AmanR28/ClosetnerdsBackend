const errorMessages = require('../commons/error_messages');

const isAuth = (req, res, next) => {
  console.log('ia', req.jwt_error);
  if (req.jwt_error || !req.jwt_user) {
    const err = req.jwt_error;
    if (err == errorMessages.INVALID_TOKEN) {
      return res.status(404).send(errorMessages.INVALID_TOKEN);
    }
    if (!req.user) {
      return res.status(401).send(errorMessages.UNAUTHORIZED);
    }
    console.error(err);
    return res.status(500).send(errorMessages.SYSTEM_FAILURE);
  }
  next();
};

module.exports = isAuth;
