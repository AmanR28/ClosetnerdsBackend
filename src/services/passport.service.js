const passport = require('passport');
const passportJwt = require('passport-jwt');
const passportLocal = require('passport-local');
const GoogleStrategy = require('passport-google-oauth20');
const FacebookStrategy = require('passport-facebook');
const bcrypt = require('bcrypt');
const db = require('../db');
const { User } = require('../db2');
const { JWT_TOKEN, google, facebook } = require('../config');
const authQueries = require('../queries/auth.queries');
const errorMessages = require('../commons/error_messages');

const LocalStrategy = passportLocal.Strategy;
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

require('dotenv').config();

// Verify Token
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_TOKEN.SECRET_KEY,
      passReqToCallback: true,
    },
    async (req, jwtToken, next) => {
      if (new Date(jwtToken.expiry).getTime() < Date.now()) {
        return next(errorMessages.TOKEN_EXPIRED);
      }

      const user = await User.findOne({ where: { id: jwtToken.id } });

      if (!user) {
        return next(errorMessages.INVALID_TOKEN);
      }

      return next(undefined, user);
    }
  )
);

// Local Auth Strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, next) => {
      try {
        const user = await User.findOne({ where: { email: email } });

        if (!user) return next(errorMessages.NOT_FOUND);

        if (!user.isRegistered || !user.isPasswordAuth) {
          return next(errorMessages.NOT_REGISTERED);
        }

        const compare = await user.checkPassword(password);

        if (!compare) return next(errorMessages.INVALID_CREDENTIAL);

        return next(undefined, user);
      } catch (error) {
        return next(error);
      }
    }
  )
);

passport.use(
  'reset-password',
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromUrlQueryParameter('token'),
      secretOrKey: JWT_TOKEN.SECRET_KEY,
      passReqToCallback: true,
    },
    async (req, token, next) => {
      try {
        const email = token.email;
        const password = await bcrypt.hash(req.body.password, 10);
        if (!token.type === 'reset' || !email || !password) {
          // return next('Bad Request', false);
          throw Error('Invalid token');
        }
        if (new Date(token.expiry).getTime() < Date.now()) return next('Invalid Token', false);

        const user = await db.query(authQueries.GET_USER, [email]);

        if (user.length === 0) return next('INVALID USER', false);

        const result = await db.query(authQueries.UPDATE_PASSWORD, [password, email]);

        if (result.affectedRows === 0) return next('SOMETHING WENT WRONG', false);

        return next(undefined, {
          email: email,
          name: user[0].name,
        });
      } catch (err) {
        console.error(err);
        return next('SOMETHING WENT WRONG', false);
      }
    }
  )
);

// Google OAuth
passport.use(
  'google',
  new GoogleStrategy(
    {
      clientID: google.CLIENT_ID,
      clientSecret: google.CLIENT_SECRET,
      callbackURL: google.CALLBACK,
    },
    function verify(accessToken, rf, tokens, profile, cb) {
      const user = {
        id: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        isRegistered: true,
      };
      console.log(user);
      return cb(null, user);
    }
  )
);

// Facebook OAuth
passport.use(
  'facebook',
  new FacebookStrategy(
    {
      clientID: facebook.CLIENT_ID,
      clientSecret: facebook.CLIENT_SECRET,
      callbackURL: facebook.CALLBACK,
    },
    function verify(accessToken, refreshToken, profile, cb) {
      console.log(profile);
      const user = {
        id: profile.id,
        name: profile.displayName,
        isRegistered: true,
      };
      return cb(null, user);
    }
  )
);
