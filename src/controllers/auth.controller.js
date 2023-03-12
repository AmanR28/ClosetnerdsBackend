const jwt = require('jsonwebtoken');
const passport = require('passport');
const { ValidationError, DatabaseError } = require('sequelize');
const { sequelize, User } = require('../db');
const errorMessages = require('../commons/error_messages');
const successMessages = require('../commons/success_messages');
const { BASE_URI, WEB_URI, JWT_TOKEN, sendgrid } = require('../config');
const constants = require('../commons/constants');
const success_messages = require('../commons/success_messages');
const error_messages = require('../commons/error_messages');
const sendgridService = require('../services/sendgrid.service');

const generateToken = (id, type = constants.TOKEN.TYPE_AUTH) => {
  const payload = {
    id,
    type,
    expiry: new Date(Date.now() + JWT_TOKEN.EXPIRE_TIME),
  };
  let token = jwt.sign(payload, JWT_TOKEN.SECRET_KEY);
  return token;
};

const sendVerificationToken = async user => {
  const token = generateToken(user.id, constants.TOKEN.TYPE_VALIDATE);
  console.log('Validity Token', token);

  const uri = WEB_URI + 'validate?token=' + token;

  await sendgridService.smProfileValidate(user.email, user.name, uri);
};

const sendResetToken = async user => {
  const token = generateToken(user.id, constants.TOKEN.TYPE_RESET_PSWD);
  console.log('Reset Password Token', token);

  const uri = BASE_URI + 'auth/reset?token=' + token;

  await sendgridService.smResetPassword(user.email, user.name, uri);
};

module.exports = {
  // Local
  login: async (req, res) => {
    try {
      const email = req.body.email;
      const password = req.body.password;

      if (!email || !password) {
        return res.status(400).send(errorMessages.MISSING_FIELD);
      }

      const user = await User.findOne({ where: { email: email } });

      if (!user) return res.status(404).send(errorMessages.NOT_FOUND);

      if (!user.isRegistered || !user.isPasswordAuth) {
        return res.status(401).send(errorMessages.NOT_REGISTERED);
      }

      if (!user.emailVerified) {
        return res.status(401).send(errorMessages.NOT_VERIFIED);
      }

      const compare = await user.checkPassword(password);

      if (!compare) return res.status(401).send(errorMessages.INVALID_CREDENTIAL);

      const token = generateToken(user.id);
      res.status(200).json({
        ...success_messages.AUTH_SUCCESS,
        token: token,
      });
    } catch (err) {
      console.error(err);
      if (err instanceof DatabaseError) {
        return res.status(500).send(errorMessages.DATABASE_FAILURE);
      }
      return res.status(500).send(errorMessages.SYSTEM_FAILURE);
    }
  },

  signup: async (req, res, next) => {
    const name = req.body.name || '';
    const email = req.body.email;
    const password = req.body.password;
    const phone = req.body.phone;
    const gender = req.body.gender;
    const city = req.body.city;

    if (!name || !email || !password) {
      return res.status(400).send(errorMessages.MISSING_FIELD);
    }

    try {
      let user = await User.findOne({ where: { email } });

      if (user) {
        if (user.isPasswordAuth) {
          if (!user.emailVerified) {
            sendVerificationToken(user);
            return res.status(409).send({
              ...errorMessages.DUPLICATE_FIELD,
              message: 'Email Verification Mail Sent',
            });
          }
          return res.status(409).send(errorMessages.DUPLICATE_FIELD);
        }
      }

      if (!user) {
        user = User.build({
          phone: phone,
          email: email,
        });
      }

      user.isRegistered = true;

      user.isPasswordAuth = true;
      user.password = await User.getPassword(password);

      user.name = name;
      user.gender = gender;
      user.city = city;

      await user.save();
      await sendVerificationToken(user);

      return res.status(200).json({
        ...successMessages.PROFILE_CREATED,
        message: 'Email Verification Mail Sent',
      });
    } catch (e) {
      if (e instanceof ValidationError) {
        if (e.errors[0].message == 'Validation isEmail on email failed') {
          return res.status(400).send(errorMessages.INVALID_EMAIL);
        }
        if (e.errors[0].message == 'Validation isUnique on email failed') {
          return res.status(409).send(errorMessages.DUPLICATE_FIELD);
        }
        if (e.errors[0].message == 'Validation isUnique on phone failed') {
          return res.status(409).send(errorMessages.DUPLICATE_FIELD);
        }
        return res.status(400).send(errorMessages.BAD_REQUEST);
      }
      if (e instanceof DatabaseError) {
        console.error(e);
        return res.status(500).send(errorMessages.DATABASE_FAILURE);
      }

      console.error(e);
      return res.status(500).send(errorMessages.SYSTEM_FAILURE);
    }
  },

  validate: async (req, res) => {
    try {
      const rawToken = req.query.token;

      if (!rawToken) {
        return res.status(400).send(errorMessages.MISSING_FIELD);
      }

      const token = jwt.decode(rawToken);

      if (!token || !token.expiry || !token.type) {
        return res.status(401).send(errorMessages.INVALID_TOKEN);
      }

      if (new Date(token.expiry).getTime() < Date.now()) {
        return res.status(401).send(errorMessages.TOKEN_EXPIRED);
      }

      if (token.type !== constants.TOKEN.TYPE_VALIDATE) {
        return res.status(401).send(errorMessages.INVALID_TOKEN);
      }

      const user = await User.findOne({ where: { id: token.id } });

      if (!user) {
        return res.status(401).send(errorMessages.INVALID_TOKEN);
      }

      if (user.emailVerified) {
        return res.status(409).send(errorMessages.ALREADY_VERIFIED);
      }

      user.emailVerified = true;
      user.save();

      res.status(200).send(successMessages.EMAIL_VERIFIED);
      sendgridService.smSignUp(user.email, user.name);
    } catch (error) {
      console.error(error);
      if (error instanceof DatabaseError) {
        res.status(500).send(errorMessages.DATABASE_FAILURE);
      } else {
        res.status(500).send(errorMessages.SYSTEM_FAILURE);
      }
    }
  },

  recoverPassword: async (req, res) => {
    try {
      const email = req.body.email;

      if (!email) {
        return res.status(400).send(errorMessages.MISSING_FIELD);
      }

      const user = await User.findOne({ where: { email: email } });

      if (!user) {
        return res.status(404).send(errorMessages.NOT_FOUND);
      }

      if (!user.isPasswordAuth) {
        return res.status(401).send(errorMessages.NOT_REGISTERED);
      }

      user.passwordReset = true;
      user.save();

      await sendResetToken(user);
      res.status(200).send(successMessages.AUTH_PSWD_SENT);
    } catch (error) {
      console.error(error);
      if (error instanceof DatabaseError) {
        res.status(500).send(errorMessages.DATABASE_FAILURE);
      } else {
        res.status(500).send(errorMessages.SYSTEM_FAILURE);
      }
    }
  },

  resetPassword: async (req, res) => {
    try {
      const rawToken = req.body.token;
      const password = req.body.password;

      if (!rawToken || !password) {
        return res.status(400).send(errorMessages.MISSING_FIELD);
      }

      const token = jwt.decode(rawToken);

      if (!token || !token.expiry || !token.type) {
        return res.status(401).send(errorMessages.INVALID_TOKEN);
      }

      if (token.type !== constants.TOKEN.TYPE_RESET_PSWD) {
        return res.status(401).send(errorMessages.INVALID_TOKEN);
      }

      if (new Date(token.expiry).getTime() < Date.now()) {
        return res.status(400).send(errorMessages.TOKEN_EXPIRED);
      }

      const user = await User.findOne({ where: { id: token.id } });

      if (!user) {
        return res.status(401).send(errorMessages.INVALID_TOKEN);
      }

      if (!user.passwordReset) {
        return res.status(409).send(errorMessages.ALREADY_RESET_PASSWORD);
      }

      user.password = await User.getPassword(password);
      user.passwordReset = false;
      user.save();

      res.status(200).send(successMessages.AUTH_PSWD_RST);
      await sendgridService.smResetPasswordSuccess(user.email, user.name);
    } catch (error) {
      console.error(error);
      if (error instanceof DatabaseError) {
        res.status(500).send(errorMessages.DATABASE_FAILURE);
      } else {
        res.status(500).send(errorMessages.SYSTEM_FAILURE);
      }
    }
  },

  // Google
  googleAuth: async (req, res) => {
    try {
      let user = await User.findOne({ where: { googleId: req.user.id } });

      if (!user) {
        user = await User.findOne({ where: { email: req.user.email } });

        if (user) {
          user.isRegistered = true;

          user.isGoogleAuth = true;
          user.googleId = req.user.id;

          user.name = req.user.name;
          await user.save();
        }
      }

      if (!user)
        user = await User.create({
          name: req.user.name,

          isRegistered: true,

          email: req.user.email,

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
      let user = await User.findOne({ where: { facebookId: req.user.id } });

      if (!user) {
        user = await User.create({
          name: req.user.name,

          isRegistered: true,

          email: req.user.email,

          facebookId: req.user.id,
          isFacebookAuth: true,
        });
      }

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
};
