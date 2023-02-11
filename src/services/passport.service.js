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
      secretOrKey: JWT_TOKEN.SECRET_KEY,
    },
    async (jwtToken, next) => {
      if (new Date(jwtToken.expiry).getTime() < Date.now())
        return next(undefined, false);

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
  new GoogleStrategy(
    {
      clientID: process.env.GC_CLIENT_ID,
      clientSecret: process.env.GC_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/google/result',
    },
    function verify(accessToken, rf, tokens, profile, cb) {
      console.log('accessToken', accessToken);
      console.log('rf', rf);
      console.log('profile', profile);
      console.log('tokens', tokens);
      return cb(null, profile);
    }
  ),


// passport.use(
//   'reset-password',
//   new LocalStrategy(
//     {
//       usernameField: 'email',
//       passwordField: 'password',
//     },
//     async (req, email, password, next) => {
//       try {
//         const token = req.params.token;
//         console.log(token)

//         const sql = authQueries.UPDATE_PASSWORD;
//         const password = await bcrypt.hash(req.body.password, 10);
//         const values = ['', '']
//         const results = await db.query(sql, email);
//         if (results.length === 0) return next(undefined, false);

//         const compare = bcrypt.compare(password, results[0].password);
//         if (!compare) return next(undefined, false);

//       const sql = authQueries.GET_USER_BY_RESET_JWT_TOKEN;
//       const user = await User.findOne({
//         resetPasswordToken: token,
//         resetPasswordExpires: { $gt: Date.now() },
//       }).exec();

//       if (!user) {
//         return cb(null, false, {
//           message: 'Password reset token is invalid or has expired.',
//         });
//       }

//       user.password = password;
//       user.resetPasswordToken = undefined;
//       user.resetPasswordExpires = undefined;

//       await user.save();
//         return next(undefined, true);
//       } catch (error) {
//         console.error(error);
//         return next(error);
//       }
//     }
//   )
// )

);
