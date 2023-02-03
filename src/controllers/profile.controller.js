const db = require('../db');
const { profileQueries } = require('../queries');
const { sendgrid } = require('../services');

exports.getProfile = async (req, res) => {
  if (!req.body.email) {
    return res.status(400).send('Bad Request');
  }
  try {
    const sql = profileQueries.SHOW_PROFILE;
    const results = await db.query(sql, req.body.email);
    if (results.length === 0) res.status(200).json('Email not Registered');
    else res.status(200).json(results);
  } catch (error) {
    res.status(500).send('Something Went Wrong');
  }
};

exports.createProfile = async (req, res) => {
  const email = req.body.email || '';
  const name = req.body.name || '';
  const phone = req.body.phone || 0;
  const gender = req.body.gender || 'male';

  const sql = profileQueries.CREATE_PROFILE;
  const values = [email, name, phone, gender];

  if (!email) {
    return res.status(400).send('Bad Request');
  }
  try {
    const result = await db.query(sql, values);
    if (result.affectedRows === 0) return res.status(404).send('Id Not Found');
    sendgrid.sendMail(
      'arastogi2810@gmail.com',
      'New',
      'hi trial',
      '<strong>and easy to do anywhere, even with Node.js</strong>',
    );
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

exports.updateMeasures = async (req, res) => {
  const email = req.body.email;
  const measures = {
    bust: req.body.bust || 0,
    waist: req.body.waist || 0,
    hip: req.body.hip || 0,
    length: req.body.length || 0,
  };

  if (!email) {
    return res.status(400).send('Bad Request');
  }
  const sql = profileQueries.UPDATE_PROFILE_MEASURE;
  const values = [measures, email];

  try {
    const result = await db.query(sql, values);
    if (result.affectedRows === 0) return res.status(404).send('Id Not Found');
    return res.status(200).send('Done');
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.updateWears = async (req, res) => {
  const email = req.body.email;
  const wears = req.body.wears || {};
  const subs = req.body.subs || {};

  const sql = profileQueries.UPDATE_PROFILE_WEARS;
  const values = [wears, subs, email];

  if (!email) {
    return res.status(400).send('Bad Request');
  }
  try {
    const result = await db.query(sql, values);
    if (result.affectedRows === 0) return res.status(404).send('Id Not Found');
    return res.status(200).send('Done');
  } catch (error) {
    console.error(error);
    res.status(500).send('Something Went Wrong');
  }
};

exports.updateOccasions = async (req, res) => {
  const email = req.body.email;
  const occasions = req.body.occasions || {};

  const sql = profileQueries.UPDATE_PROFILE_OCCASIONS;
  const values = [occasions, email];

  if (!email) {
    return res.status(400).send('Bad Request');
  }
  try {
    const result = await db.query(sql, values);
    if (result.affectedRows === 0) return res.status(404).send('Id Not Found');
    return res.status(200).send('Done');
  } catch (error) {
    console.error(error);
    res.status(500).send('Something Went Wrong');
  }
};

exports.updatePrices = async (req, res) => {
  const email = req.body.email;
  const prices = req.body.prices || {};

  const sql = profileQueries.UPDATE_PROFILE_PRICES;
  const values = [prices, email];

  if (!email) {
    return res.status(400).send('Bad Request');
  }
  try {
    const result = await db.query(sql, values);
    if (result.affectedRows === 0) return res.status(404).send('Id Not Found');
    return res.status(200).send('Done');
  } catch (error) {
    console.error(error);
    res.status(500).send('Something Went Wrong');
  }
};

exports.updateColors = async (req, res) => {
  const email = req.body.email;
  const colors = req.body.colors || {};

  const sql = profileQueries.UPDATE_PROFILE_COLORS;
  const values = [colors, email];

  if (!email) {
    return res.status(400).send('Bad Request');
  }
  try {
    const result = await db.query(sql, values);
    if (result.affectedRows === 0) return res.status(404).send('Id Not Found');
    return res.status(200).send('Done');
  } catch (error) {
    console.error(error);
    res.status(500).send('Something Went Wrong');
  }
};

exports.updateType = async (req, res) => {
  const email = req.body.email;
  const type = req.body.type || '';

  const sql = profileQueries.UPDATE_PROFILE_TYPE;
  const values = [type, email];

  if (!email) {
    return res.status(400).send('Bad Request');
  }
  try {
    const result = await db.query(sql, values);
    if (result.affectedRows === 0) return res.status(404).send('Id Not Found');
    return res.status(200).send('Done');
  } catch (error) {
    console.error(error);
    res.status(500).send('Something Went Wrong');
  }
};

exports.updateBrands = async (req, res) => {
  const email = req.body.email;
  const brands = req.body.brands || '';

  const sql = profileQueries.UPDATE_PROFILE_BRANDS;
  const values = [brands, email];

  if (!email) {
    return res.status(400).send('Bad Request');
  }
  try {
    const result = await db.query(sql, values);
    if (result.affectedRows === 0) return res.status(404).send('Id Not Found');
    return res.status(200).send('Done');
  } catch (error) {
    console.error(error);
    res.status(500).send('Something Went Wrong');
  }
};

exports.updateCelebrity = async (req, res) => {
  const email = req.body.email;
  const celebrity = req.body.celebrity || '';

  const sql = profileQueries.UPDATE_PROFILE_CELEBRITY;
  const values = [celebrity, email];

  if (!email) {
    return res.status(400).send('Bad Request');
  }
  try {
    const result = await db.query(sql, values);
    if (result.affectedRows === 0) return res.status(404).send('Id Not Found');
    return res.status(200).send('Done');
  } catch (error) {
    console.error(error);
    res.status(500).send('Something Went Wrong');
  }
};

exports.updateSkin = async (req, res) => {
  const email = req.body.email;
  const skin = req.body.skin || '';

  const sql = profileQueries.UPDATE_PROFILE_SKIN;
  const values = [skin, email];

  if (!email) {
    return res.status(400).send('Bad Request');
  }
  try {
    const result = await db.query(sql, values);
    if (result.affectedRows === 0) return res.status(404).send('Id Not Found');
    return res.status(200).send('Done');
  } catch (error) {
    console.error(error);
    res.status(500).send('Something Went Wrong');
  }
};

exports.updatePicture = async (req, res) => {
  const email = req.body.email;
  const picture = req.body.picture || '';

  const sql = profileQueries.UPDATE_PROFILE_PICTURE;
  const values = [picture, email];

  if (!email) {
    return res.status(400).send('Bad Request');
  }
  try {
    const result = await db.query(sql, values);
    if (result.affectedRows === 0) return res.status(404).send('Id Not Found');
    return res.status(200).send('Done');
  } catch (error) {
    console.error(error);
    res.status(500).send('Something Went Wrong');
  }
};
