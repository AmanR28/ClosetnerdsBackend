const db = require('../db');
const { authQueries } = require('../queries');
const sendgrid = require('../services/sendgrid.service');

exports.login = async (req, res) => {
  if (!req.body.email) {
    return res.status(400).send('Bad Request');
  }
  try {
    const sql = authQueries.GET_USER;
    const results = await db.query(sql, req.body.email);
    if (results.length === 0) res.status(200).json('Email not Registered');
    else res.status(200).json(results);
  } catch (error) {
    res.status(500).send('Something Went Wrong');
  }
};

exports.signup = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const sql = authQueries.CREATE_PROFILE;
  const values = [email, password];

  if (!email || !password) {
    return res.status(400).send('Bad Request');
  }

  try {
    const result = await db.query(sql, values);
    if (result.affectedRows === 0) return res.status(404).send('Id Not Found');
    res.status(200).send('Done');
    sendgrid.sendSignupMail(email);
  } catch (error) {
    if (error.sqlState === '23000' || error.code === 'ER_DUP_ENTRY') {
      res.status(400).send('EmailId Already Exist');
    } else {
      console.error(error);
      res.status(500).send('Something Went Wrong');
    }
  }
};


exports.logout = async(res,req) => {
  res.status(200).send('Under Development');
}