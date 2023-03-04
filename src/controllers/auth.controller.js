const jwt = require('jsonwebtoken');
const passport = require('passport');
const { ValidationError, DatabaseError } = require('sequelize');
const db = require('../db');
const { sequelize, User } = require('../db2');
const bcrypt = require('bcrypt');
const authQueries = require('../queries/auth.queries');
const errorMessages = require('../commons/error_messages');
const successMessages = require('../commons/success_messages');
const { JWT_TOKEN } = require('../config');
const { SqlError } = require('mariadb');
const sendgrid = require('../services/sendgrid.service');
const success_messages = require('../commons/success_messages');
const error_messages = require('../commons/error_messages');

const generateToken = id => {
  const payload = {
    id,
    expiry: new Date(Date.now() + JWT_TOKEN.EXPIRE_TIME),
  };
  let token = jwt.sign(payload, JWT_TOKEN.SECRET_KEY);
  return token;
};

module.exports = {
  // Local
  login: async (req, res) => {
    await passport.authenticate('local', (err, user) => {
      if (err) {
        if (err == error_messages.NOT_FOUND) {
          return res.status(404).send(errorMessages.NOT_FOUND);
        }

        if (err == error_messages.INVALID_CREDENTIAL) {
          return res.status(401).send(errorMessages.INVALID_CREDENTIAL);
        }

        if (err instanceof DatabaseError) {
          console.error(err);
          return res.status(500).send(errorMessages.DATABASE_FAILURE);
        }

        console.error(err);
        return res.status(500).send(errorMessages.SYSTEM_FAILURE);
      }

      const token = generateToken(user.id);
      res.status(200).json({
        ...success_messages.AUTH_SUCCESS,
        token: token,
      });
    })(req, res);
  },

  signup: async (req, res, next) => {
    const email = req.body.email;
    const gender = req.body.gender || 'none';
    const password = await bcrypt.hash(req.body.password, 10);
    const name = req.body.name || '';
    const phone = req.body.phone || null;

    if (!name || !email || !password) {
      return res.status(400).send(errorMessages.MISSING_FIELD);
    }

    try {
      let user = await User.findOne({ where: { email } });

      if (user) {
        if (user.isPasswordAuth) {
          return res.status(409).send(errorMessages.DUPLICATE_FIELD);
        }

        user.gender = gender;
        user.password = await User.getPassword(password);
        user.isPasswordAuth = true;
        await user.save();
      }

      if (!user) {
        user = await User.create({
          name: name,
          gender: gender,

          isRegistered: true,

          email: email,

          password: password,
          isPasswordAuth: true,

          phone: phone,
        });
      }

      const token = generateToken(user.id);

      return res.status(200).json({
        ...successMessages.AUTH_SUCCESS,
        token: token,
      });
    } catch (e) {
      if (e instanceof ValidationError) {
        if (e.errors[0].message == 'Validation isEmail on email failed') {
          return res.status(409).send(errorMessages.INVALID_EMAIL);
        }
        if (e.errors[0].message == 'Validation isUnique on email failed') {
          return res.status(409).send(errorMessages.DUPLICATE_FIELD);
        }
        if (e.errors[0].message == 'Validation isUnique on phone failed') {
          return res.status(409).send(errorMessages.DUPLICATE_FIELD);
        }
      }
      if (e instanceof DatabaseError) {
        console.error(e);
        return res.status(500).send(errorMessages.DATABASE_FAILURE);
      }

      console.error(e);
      return res.status(500).send(errorMessages.SYSTEM_FAILURE);
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
      let user = await User.findOne({ where: { googleId: req.user.id } });

      if (!user) {
        user = await User.findOne({ where: { email: req.user.email } });

        if (user) {
          user.name = req.user.name;
          user.isRegistered = true;
          user.emailVerified = true;
          user.googleId = req.user.id;
          user.isGoogleAuth = true;
          await user.save();
        }
      }

      if (!user)
        user = await User.create({
          name: req.user.name,

          isRegistered: true,

          email: req.user.email,
          emailVerified: true,

          googleId: req.user.id,
          isGoogleAuth: true,
        });

      const token = generateToken(user.id);
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

      await User.create({
        name: user.name,

        isRegistered: true,

        facebookId: user.id,
        isFacebookAuth: true,
      });

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
