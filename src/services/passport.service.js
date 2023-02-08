const passport = require('passport');
const passportJwt = require('passport-jwt');
const passportLocal = require('passport-local');
const bcrypt = require('bcrypt');
const db = require('../db');
const { secretKey } = require('../config');
const { authQueries } = require('../queries');

const LocalStrategy = passportLocal.Strategy;
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, next) => {
      try {
        const sql = authQueries.GET_USER;
        const results = await db.query(sql, email);
        if (results.length === 0) return next(undefined, false);

        const compare = bcrypt.compare(password, results[0].password);
        if (!compare) return next(undefined, false);

        return next(undefined, results[0]);
      } catch (error) {
        console.error(error);
        return next(error);
      }
    }
  )
);

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secretKey,
    },
    async (jwtToken, next) => {
      const sql = authQueries.GET_USER;
      const results = await db.query(sql, jwtToken.email);

      if (results.length) {
        return next(undefined, results[0], jwtToken);
      } else {
        return next(undefined, false);
      }
    }
  )
);
