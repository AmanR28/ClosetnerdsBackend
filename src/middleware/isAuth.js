const passport = require('passport');

const isAuth = (req, res, next) => {
  passport.authenticate('jwt', (err, user) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: 'Something Went Wrong' });
    }
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.user = user;
    next();
  })(req, res, next);
};

module.exports = isAuth;