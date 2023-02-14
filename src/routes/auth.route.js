const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const passport = require('passport');

router.post('/login', authController.login);
router.post('/signup', authController.signup);
router.get('/reset', authController.recoverPassword);
router.post('/reset', authController.resetPassword);

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

module.exports = router;
