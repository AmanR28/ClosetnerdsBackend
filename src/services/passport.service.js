const passport = require('passport');
const { db } = require('../config');
const { authQueries } = require('../queries');
const LocalStrategy = require('passport-local').Strategy;

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const results = await db.query(authQueries.GET_USER_BY_ID, id);
    done(null, results[0]);
  } catch (err) {
    done(err, null);
  }
});

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  const sql = authQueries.GET_USER_BY_ID;
  const results = await db.query(sql, id);
  const user = results[0];
  done(null, user);
});
