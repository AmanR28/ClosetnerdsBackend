const jwt = require('jsonwebtoken');
const passport = require('passport');
const db = require('../db');
const bcrypt = require('bcrypt');
const authQueries = require('../queries/auth.queries');
const errorMessages = require('../commons/error_messages');
const successMessages = require('../commons/success_messages');
const { JWT_TOKEN } = require('../config');
const { SqlError } = require('mariadb');

const generateToken = id => {
  const payload = {
    id,
    expiry: new Date(Date.now() + JWT_TOKEN.EXPIRE_TIME),
  };
  let token = jwt.sign(payload, JWT_TOKEN.SECRET_KEY);
  return token;
};

const sendgrid = require('../services/sendgrid.service');
const success_messages = require('../commons/success_messages');

module.exports = {
  // Local
  login: async (req, res, next) => {
    await passport.authenticate('local', (err, user) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).send(errorMessages.NOT_FOUND);
      } else {
        const token = generateToken(user.email);
        res.status(200).json({
          ...success_messages.AUTH_SUCCESS,
          token: token,
        });
      }
    })(req, res, next);
  },

  signup: async (req, res, next) => {
    const email = req.body.email;
    const password = await bcrypt.hash(req.body.password, 10);
    const name = req.body.name || '';

    if (!email || !password || !name) {
      return res.status(400).send(errorMessages.MISSING_FIELD);
    }

    const sql = authQueries.CREATE_PROFILE_BY_EMAIL;
    const values = [email, password, name];

    try {
      await db.query(sql, values);

      const token = generateToken(email);

      res.status(200).json({
        ...successMessages.AUTH_SUCCESS,
        token: token,
      });

      sendgrid.smSignUp(email);
    } catch (error) {
      if (error instanceof SqlError) {
        if (error.sqlState === '23000' || error.code === 'ER_DUP_ENTRY') {
          res.status(409).send(errorMessages.DUPLICATE_FIELD);
        } else {
          console.error(error);
          res.status(500).send(errorMessages.DATABASE_FAILURE);
        }
      } else {
        console.error(error);
        res.status(500).send(errorMessages.SYSTEM_FAILURE);
      }
    }
  },

  recoverPassword: async (req, res) => {
    const email = req.body.email;

    const sql = authQueries.GET_USER;
    const values = [email];

    if (!email) {
      return res.status(400).send(errorMessages.MISSING_FIELD);
    }
    try {
      const results = await db.query(sql, values);

      const payload = {
        email,
        type: 'reset',
        expiry: Date.now() + JWT_TOKEN.EXPIRE_TIME,
      };
      const name = results[0].name;
      const token = jwt.sign(payload, JWT_TOKEN.SECRET_KEY);
      const uri = `/auth/reset/?token=${token}`;

      await sendgrid.smResetPassword(email, name, uri);
      res.status(200).send(successMessages.AUTH_PSWD_SENT);
    } catch (error) {
      console.error(error);
      if (error instanceof SqlError) {
        res.status(500).send(errorMessages.DATABASE_FAILURE);
      } else {
        res.status(500).send(errorMessages.SYSTEM_FAILURE);
      }
    }
  },

  resetPassword: (req, res) => {
    try {
      passport.authenticate('reset-password', { session: false }, async (err, data) => {
        if (err) {
          return res.status(201).json({ error: err });
        }
        res.status(200).send(successMessages.AUTH_PSWD_RST);
        await sendgrid.smResetPasswordSuccess(data.email, data.name);
      })(req, res);
    } catch (error) {}
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
      return res.status(200).json({
        ...successMessages.AUTH_SUCCESS,
        token,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send(errorMessages.SYSTEM_FAILURE);
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

      return res.status(200).json({
        ...successMessages.AUTH_SUCCESS,
        token,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send(errorMessages.SYSTEM_FAILURE);
    }
  },
};
