const db = require('../db');
const { userQueries } = require('../queries');

exports.getUser = async (req, res) => {
  if (!req.body.email) {
    return res.status(400).send('Bad Request');
  }
  try {
    const sql = userQueries.GET_USER;
    const results = await db.query(sql, req.body.email);
    if (results.length === 0) res.status(200).json('Email not Registered');
    else res.status(200).json(results);
  } catch (error) {
    res.status(500).send('Something Went Wrong');
  }
};

exports.createUser = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const sql = userQueries.CREATE_PROFILE;
  const values = [email, password];

  if (!email || !password) {
    return res.status(400).send('Bad Request');
  }

  try {
    const result = await db.query(sql, values);
    if (result.affectedRows === 0) return res.status(404).send('Id Not Found');
    return res.status(200).send('Done');
  } catch (error) {
    if (error.sqlState === '23000' || error.code === 'ER_DUP_ENTRY') {
      res.status(400).send('EmailId Already Exist');
    } else {
      console.error(error);
      res.status(500).send('Something Went Wrong');
    }
  }
};
