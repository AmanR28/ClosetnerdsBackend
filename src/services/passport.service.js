const passport = require('passport');
const passportJwt = require('passport-jwt');
const passportLocal = require('passport-local');
const GoogleStrategy = require('passport-google-oauth20');
const bcrypt = require('bcrypt');
const db = require('../db');
const { JWT_TOKEN } = require('../config');
const authQueries = require('../queries/auth.queries');

const LocalStrategy = passportLocal.Strategy;
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

require('dotenv').config();

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

        const compare = await bcrypt.compare(password, results[0].password);

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
      secretOrKey: JWT_TOKEN.SECRET_KEY,
      passReqToCallback: true
    },
    async (req, jwtToken, next) => {
      if (new Date(jwtToken.expiry).getTime() < Date.now()) return next(undefined, false);

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

passport.use(
  'google',
  new GoogleStrategy(
    {
      clientID: process.env.GC_CLIENT_ID,
      clientSecret: process.env.GC_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/google/callback',
    },
    function verify(accessToken, rf, tokens, profile, cb) {
      return cb(null, profile);
    }
  ),

  passport.use(
    'reset-password',
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromUrlQueryParameter('token'),
        secretOrKey: JWT_TOKEN.SECRET_KEY,
        passReqToCallback: true
      },
        async (req, token, next) => {
          try {
            const email = token.email;
            const password = await bcrypt.hash(req.body.password, 10);
            if (!token.type === 'reset' || !email || !password) {
              return next('Bad Request', false)
            }

            const user = await db.query(authQueries.GET_USER, [email]);

            if (user.length===0) 
              return next('INVALID USER', false);
            
            const result = await db.query(authQueries.UPDATE_PASSWORD, [password, email]);

            if (result.affectedRows===0) return next('SOMETHING WENT WRONG', false);

            return next(undefined, {
              email:email, name: user[0].name
            });
          } catch (err) {
            console.error(err);
            return next('SOMETHING WENT WRONG', false);
          }
        }
      )
  )
);
