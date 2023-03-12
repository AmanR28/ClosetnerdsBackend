const passport = require('passport');

const currentUser = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return next();

  passport.authenticate('jwt', (err, user) => {
    if (!err) req.jwt_user = user;
    return next();
  })(req, res, next);
};

module.exports = currentUser;
