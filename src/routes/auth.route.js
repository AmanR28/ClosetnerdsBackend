const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const passport = require('passport');

router.post('/login', authController.login);
router.post('/signup', authController.signup);
router.post('/reset', authController.recoverPassword);

// router.get('/google', authController.googleConnect);
// router.get('/google/result', authController.googleResult);

router.get(
  '/google',
  passport.authenticate('google', {
    session: false,
    scope: ['profile', 'email'],
  })
);
router.get(
  '/google/result',
  passport.authenticate('google', {
    session: false,
    scope: ['profile', 'email'],
  }),
  authController.googleAuth
);

module.exports = router;
