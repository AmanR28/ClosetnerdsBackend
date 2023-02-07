const db = require('../db');
const bcrypt = require('bcrypt');
const { authQueries } = require('../queries');
const sendgrid = require('../services/sendgrid.service');

exports.login = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).send('Bad Request');
  }
  try {
    const sql = authQueries.GET_USER;
    const results = await db.query(sql, req.body.email);
    
    if (results.length === 0) 
      return res.status(401).send('Invalid Email or Password');
    
    const compare = await bcrypt.compare(password, results[0].password);
    if (!compare)
      return res.status(401).send('Invalid Email or Password');
    
    res.status(200).send(results[0].email);
  } catch (error) {
    res.status(500).send('Something Went Wrong');
    console.error(error)
  }
};

exports.signup = async (req, res) => {
  const email = req.body.email;
  const password = await bcrypt.hash(req.body.password, 10);

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