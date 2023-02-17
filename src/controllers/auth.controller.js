const jwt = require('jsonwebtoken');
const passport = require('passport');
const db = require('../db');
const bcrypt = require('bcrypt');
const authQueries = require('../queries/auth.queries');
const { JWT_TOKEN } = require('../config');

const generateToken = id => {
  const payload = {
    id,
    expiry: new Date(Date.now() + JWT_TOKEN.EXPIRE_TIME),
  };
  let token = jwt.sign(payload, JWT_TOKEN.SECRET_KEY);
  return token;
};

const sendgrid = require('../services/sendgrid.service');

module.exports = {
  // Local
  login: async (req, res, next) => {
    await passport.authenticate('local', (err, user) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).send('Invalid email or password');
      } else {
        const token = generateToken(user.email);
        res.status(200).json({ token: token });
      }
    })(req, res, next);
  },

  signup: async (req, res, next) => {
    const email = req.body.email;
    const password = await bcrypt.hash(req.body.password, 10);
    const name = req.body.name || '';

    if (!email || !password || !name) {
      return res.status(400).send('Bad Request');
    }

    const sql = authQueries.CREATE_PROFILE_BY_EMAIL;
    const values = [email, password, name];

    try {
      const results = await db.query(sql, values);
      if (results.affectedRows === 0) return res.status(404).send('Id Not Found');

      const token = generateToken(email);
      res.status(200).json({ token: token });
      sendgrid.smSignUp(email);
    } catch (error) {
      if (error.sqlState === '23000' || error.code === 'ER_DUP_ENTRY') {
        res.status(400).send('EmailId Already Exist');
      } else {
        console.error(error);
        res.status(500).send('Something Went Wrong');
      }
    }
  },

  recoverPassword: async (req, res) => {
    const email = req.body.email;

    const sql = authQueries.GET_USER;
    const values = [email];

    if (!email) {
      return res.status(400).send('Bad Request');
    }
    try {
      const results = await db.query(sql, values);
      console.log();
      if (results.length === 0) return res.status(404).send('Id Not Found');

      const payload = {
        email,
        type: 'reset',
        expiry: Date.now() + JWT_TOKEN.EXPIRE_TIME,
      };
      const name = results[0].name;
      const token = jwt.sign(payload, JWT_TOKEN.SECRET_KEY);
      const uri = `/auth/reset/?token=${token}`;

      res.status(200).send('Reset Password Email Sent');
      await sendgrid.smResetPassword(email, name, uri);
    } catch (error) {
      console.error(error);
      res.status(500).send('Something Went Wrong');
    }
  },

  resetPassword: (req, res) => {
    passport.authenticate('reset-password', { session: false }, async (err, data) => {
      if (err) {
        return res.status(201).json({ error: err });
      }
      res.status(200).send('Password Reset Successfully');
      await sendgrid.smResetPasswordSuccess(data.email, data.name);
    })(req, res);
  },

  // Google
  googleAuth: async (req, res) => {
    try {
      const { user } = req;
      const id = user.id;
      const name = user.name;

      const search = await db.query(authQueries.GET_USER_BY_GOOGLE, [id]);
      if (search.length === 0) {
        await db.query(authQueries.CREATE_PROFILE_BY_GOOGLE, [id, name]);
      }

      const token = generateToken(id);
      return res.status(200).json({ token });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error });
    }
  },

  // Facebook
  facebookAuth: async (req, res) => {
    try {
      const { user } = req;
      const id = user.id;
      const name = user.name;

      const search = await db.query(authQueries.GET_USER_BY_FACEBOOK, [id]);
      if (search.length === 0) {
        await db.query(authQueries.CREATE_PROFILE_BY_FACEBOOK, [id, name]);
      }

      const token = generateToken(id);
      return res.status(200).json({ token });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error });
    }
  },
};
