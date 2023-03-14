const passport = require('passport');
const passportJwt = require('passport-jwt');
const GoogleStrategy = require('passport-google-oauth20');
const FacebookStrategy = require('passport-facebook');
const { User } = require('../db');
const { JWT_TOKEN, GOOGLE, FACEBOOK } = require('../config');
const constants = require('../commons/constants');
const errorMessages = require('../commons/error_messages');

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
      if (!jwtToken.expiry || new Date(jwtToken.expiry).getTime() < Date.now()) {
        return next(errorMessages.TOKEN_EXPIRED);
      }

      if (jwtToken.type !== constants.TOKEN.TYPE_AUTH) {
        return next(errorMessages.INVALID_TOKEN);
      }

      const user = await User.findOne({ where: { id: jwtToken.id } });

      if (!user) {
        return next(errorMessages.INVALID_TOKEN);
      }

      return next(undefined, user);
    }
  )
);

// Google OAuth
passport.use(
  'google',
  new GoogleStrategy(
    {
      clientID: GOOGLE.CLIENT_ID,
      clientSecret: GOOGLE.CLIENT_SECRET,
      callbackURL: GOOGLE.CALLBACK,
    },
    function verify(accessToken, rf, tokens, profile, cb) {
      const user = {
        id: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
      };
      return cb(null, user);
    }
  )
);

// Facebook OAuth
passport.use(
  'facebook',
  new FacebookStrategy(
    {
      clientID: FACEBOOK.CLIENT_ID,
      clientSecret: FACEBOOK.CLIENT_SECRET,
      callbackURL: FACEBOOK.CALLBACK,
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
