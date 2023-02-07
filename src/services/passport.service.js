const passport = require('passport');
const passportJwt = require('passport-jwt');
const passportLocal = require('passport-local');
const bcrypt = require('bcrypt');
const db = require('../db');
const {secretKey} = require('../config');
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
    async (email, password, done) => {
      try {
        const sql = authQueries.GET_USER;
        const results = await db.query(sql, email);
        if (results.length === 0) return done(undefined, false);

        const compare = bcrypt.compare(password, results[0].password);
        if (!compare) return done(undefined, false);

        return done(undefined, results[0]);
      } catch (error) {
        console.error(error);
        return done(error);
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
    async (jwtToken, done) => {
      const sql = authQueries.GET_USER;
      const results = await db.query(sql, jwtToken.email);

      console.log(results);

      if (results.length) {
        return done(undefined, results[0], jwtToken);
      } else {
        return done(undefined, false);
      }
    }
  )
);
