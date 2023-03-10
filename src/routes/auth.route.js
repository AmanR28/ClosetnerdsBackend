const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const passport = require('passport');

router.post('/login', authController.login);
router.post('/signup', authController.signup);
router.get('/validate', authController.validate);
// router.get('/reset', authController.recoverPassword);
// router.post('/reset', authController.resetPassword);

router.get(
  '/google',
  passport.authenticate('google', {
    session: false,
    scope: ['profile', 'email'],
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    scope: ['profile', 'email'],
  }),
  authController.googleAuth
);

router.get(
  '/facebook',
  passport.authenticate('facebook', {
    session: false,
    // scope: ['profile', 'email'],
  })
);

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    session: false,
    // scope: ['profile', 'email'],
  }),
  authController.facebookAuth
);

module.exports = router;
