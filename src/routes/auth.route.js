const router = require('express').Router();
const { authController } = require('../controllers');
const passport = require('passport');

router.get('/login', authController.login);
router.post('/signup', authController.signup);

router.get('/google', passport.authenticate('google'));
router.get(
  '/google/result',
  passport.authenticate('google', { session: false, scope: ['openid', 'profile', 'email'] }),
  function (req, res) {
    res.status(200).send('success');
  }
);

module.exports = router;
