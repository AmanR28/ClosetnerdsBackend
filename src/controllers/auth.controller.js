const jwt = require('jsonwebtoken');
const passport = require('passport');
const db = require('../db');
const bcrypt = require('bcrypt');
const { authQueries } = require('../queries');
const { secretKey } = require('../config');
const sendgrid = require('../services/sendgrid.service');

exports.login = async (req, res, next) => {
  await passport.authenticate('local', (err, user) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).send('Invalid email or password');
    } else {
      const token = jwt.sign({ email: user.email }, secretKey);
      res.status(200).json({ token: token });
    }
  })(req, res, next);
};

exports.signup = async (req, res, next) => {
  const email = req.body.email;
  const password = await bcrypt.hash(req.body.password, 10);

  const sql = authQueries.CREATE_PROFILE;
  const values = [email, password];

  if (!email || !password) {
    return res.status(400).send('Bad Request');
  }

  try {
    const results = await db.query(sql, values);
    if (results.affectedRows === 0) return res.status(404).send('Id Not Found');

    const token = jwt.sign({ email }, secretKey);
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
};
