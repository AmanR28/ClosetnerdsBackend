const db = require('../db');
const { sequelize, Profile } = require('../db2');
const { ValidationError, DatabaseError } = require('sequelize');
const profileQueries = require('../queries/profile.queries');
const sendgrid = require('../services/sendgrid.service');
const pdfService = require('../services/pdf.service');
const errorMessages = require('../commons/error_messages');
const successMessages = require('../commons/success_messages');
const { SqlError } = require('mariadb');

const sendProfileCompleteMail = async email => {
  try {
    const mailCount = await db.query(profileQueries.GET_MAIL_COUNT, [email]);
    if (mailCount[0].mailCount < 1) {
      const sql = profileQueries.SHOW_PROFILE;

      const results = await db.query(sql, email);
      const user = results[0];

      const pdfDoc = pdfService.profilePdf(user);
      sendgrid.smProfilePDF(user.email, user.name, Buffer.from(pdfDoc.output('arraybuffer')));

      await db.query(profileQueries.ADD_MAIL_COUNT, [email]);
    }
  } catch (error) {
    console.error(error);
  }
};

exports.getProfile = async (req, res) => {
  if (!req.body.email) {
    return res.status(400).send(errorMessages.MISSING_FIELD);
  }
  try {
    const sql = profileQueries.SHOW_PROFILE;

    const results = await db.query(sql, req.body.email);
    const user = results[0];

    if (results.length === 0) return res.status(404).send(errorMessages.NOT_FOUND);

    res.status(200).send({
      ...successMessages.PROFILE_INFO,
      data: user,
    });
  } catch (error) {
    console.error(error);
    if (error instanceof SqlError) {
      res.status(500).send(errorMessages.DATABASE_FAILURE);
    } else {
      res.status(500).send(errorMessages.SYSTEM_FAILURE);
    }
  }
};

exports.createProfile = async (req, res) => {
  const email = req.body.email || '';
  const name = req.body.name || '';
  const phone = req.body.phone || 0;
  const gender = req.body.gender || 'male';

  const sql = profileQueries.CREATE_PROFILE;
  const values = [email, name, phone, gender];

  if (!email || !name) {
    return res.status(400).send(errorMessages.MISSING_FIELD);
  }

  try {
    await db.query(sql, values);

    res.status(200).send(successMessages.PROFILE_CREATED);

    await sendgrid.smProfileRegister(email, name);
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
    return res.status(400).send(errorMessages.MISSING_FIELD);
  }
  const sql = profileQueries.UPDATE_PROFILE_MEASURE;
  const values = [measures, email];

  try {
    const result = await db.query(sql, values);

    if (result.affectedRows === 0) return res.status(404).send(errorMessages.NOT_FOUND);

    return res.status(200).send(successMessages.PROFILE_UPDATED);
  } catch (error) {
    console.error(error);
    if (error instanceof SqlError) {
      res.status(500).send(errorMessages.DATABASE_FAILURE);
    } else {
      res.status(500).send(errorMessages.SYSTEM_FAILURE);
    }
  }
};

exports.updateWears = async (req, res) => {
  const email = req.body.email;
  const wears = req.body.wears || {};
  const subs = req.body.subs || {};

  const sql = profileQueries.UPDATE_PROFILE_WEARS;
  const values = [wears, subs, email];

  if (!email) {
    return res.status(400).send(errorMessages.MISSING_FIELD);
  }
  try {
    const result = await db.query(sql, values);

    if (result.affectedRows === 0) return res.status(404).send(errorMessages.NOT_FOUND);

    return res.status(200).send(successMessages.PROFILE_UPDATED);
  } catch (error) {
    console.error(error);
    if (error instanceof SqlError) {
      res.status(500).send(errorMessages.DATABASE_FAILURE);
    } else {
      res.status(500).send(errorMessages.SYSTEM_FAILURE);
    }
  }
};

exports.updateOccasions = async (req, res) => {
  const email = req.body.email;
  const occasions = req.body.occasions || {};

  const sql = profileQueries.UPDATE_PROFILE_OCCASIONS;
  const values = [occasions, email];

  if (!email) {
    return res.status(400).send(errorMessages.MISSING_FIELD);
  }
  try {
    const result = await db.query(sql, values);

    if (result.affectedRows === 0) return res.status(404).send(errorMessages.NOT_FOUND);

    return res.status(200).send(successMessages.PROFILE_UPDATED);
  } catch (error) {
    console.error(error);
    if (error instanceof SqlError) {
      res.status(500).send(errorMessages.DATABASE_FAILURE);
    } else {
      res.status(500).send(errorMessages.SYSTEM_FAILURE);
    }
  }
};

exports.updatePrices = async (req, res) => {
  const email = req.body.email;
  const prices = req.body.prices || {};

  const sql = profileQueries.UPDATE_PROFILE_PRICES;
  const values = [prices, email];

  if (!email) {
    return res.status(400).send(errorMessages.MISSING_FIELD);
  }
  try {
    const result = await db.query(sql, values);

    if (result.affectedRows === 0) return res.status(404).send(errorMessages.NOT_FOUND);

    return res.status(200).send(successMessages.PROFILE_UPDATED);
  } catch (error) {
    console.error(error);
    if (error instanceof SqlError) {
      res.status(500).send(errorMessages.DATABASE_FAILURE);
    } else {
      res.status(500).send(errorMessages.SYSTEM_FAILURE);
    }
  }
};

exports.updateColors = async (req, res) => {
  const email = req.body.email;
  const colors = req.body.colors || {};

  const sql = profileQueries.UPDATE_PROFILE_COLORS;
  const values = [colors, email];

  if (!email) {
    return res.status(400).send(errorMessages.MISSING_FIELD);
  }
  try {
    const result = await db.query(sql, values);

    if (result.affectedRows === 0) return res.status(404).send(errorMessages.NOT_FOUND);

    return res.status(200).send(successMessages.PROFILE_UPDATED);
  } catch (error) {
    console.error(error);
    if (error instanceof SqlError) {
      res.status(500).send(errorMessages.DATABASE_FAILURE);
    } else {
      res.status(500).send(errorMessages.SYSTEM_FAILURE);
    }
  }
};

exports.updateType = async (req, res) => {
  const email = req.body.email;
  const type = req.body.type || '';

  const sql = profileQueries.UPDATE_PROFILE_TYPE;
  const values = [type, email];

  if (!email) {
    return res.status(400).send(errorMessages.MISSING_FIELD);
  }
  try {
    const result = await db.query(sql, values);

    if (result.affectedRows === 0) return res.status(404).send(errorMessages.NOT_FOUND);

    return res.status(200).send(successMessages.PROFILE_UPDATED);
  } catch (error) {
    console.error(error);
    if (error instanceof SqlError) {
      res.status(500).send(errorMessages.DATABASE_FAILURE);
    } else {
      res.status(500).send(errorMessages.SYSTEM_FAILURE);
    }
  }
};

exports.updateBrands = async (req, res) => {
  const email = req.body.email;
  const brands = req.body.brands || '';

  const sql = profileQueries.UPDATE_PROFILE_BRANDS;
  const values = [brands, email];

  if (!email) {
    return res.status(400).send(errorMessages.MISSING_FIELD);
  }
  try {
    const result = await db.query(sql, values);

    if (result.affectedRows === 0) return res.status(404).send(errorMessages.NOT_FOUND);

    return res.status(200).send(successMessages.PROFILE_UPDATED);
  } catch (error) {
    console.error(error);
    if (error instanceof SqlError) {
      res.status(500).send(errorMessages.DATABASE_FAILURE);
    } else {
      res.status(500).send(errorMessages.SYSTEM_FAILURE);
    }
  }
};

exports.updateCelebrity = async (req, res) => {
  const email = req.body.email;
  const celebrity = req.body.celebrity || '';

  const sql = profileQueries.UPDATE_PROFILE_CELEBRITY;
  const values = [celebrity, email];

  if (!email) {
    return res.status(400).send(errorMessages.MISSING_FIELD);
  }
  try {
    const result = await db.query(sql, values);

    if (result.affectedRows === 0) return res.status(404).send(errorMessages.NOT_FOUND);

    return res.status(200).send(successMessages.PROFILE_UPDATED);
  } catch (error) {
    console.error(error);
    if (error instanceof SqlError) {
      res.status(500).send(errorMessages.DATABASE_FAILURE);
    } else {
      res.status(500).send(errorMessages.SYSTEM_FAILURE);
    }
  }
};

exports.updateSkin = async (req, res) => {
  const email = req.body.email;
  const skin = req.body.skin || '';

  const sql = profileQueries.UPDATE_PROFILE_SKIN;
  const values = [skin, email];

  if (!email) {
    return res.status(400).send(errorMessages.MISSING_FIELD);
  }
  try {
    const result = await db.query(sql, values);

    if (result.affectedRows === 0) return res.status(404).send(errorMessages.NOT_FOUND);

    return res.status(200).send(successMessages.PROFILE_UPDATED);
  } catch (error) {
    console.error(error);
    if (error instanceof SqlError) {
      res.status(500).send(errorMessages.DATABASE_FAILURE);
    } else {
      res.status(500).send(errorMessages.SYSTEM_FAILURE);
    }
  }
};

exports.updatePicture = async (req, res) => {
  const email = req.body.email;
  const picture = req.body.picture || '';

  const sql = profileQueries.UPDATE_PROFILE_PICTURE;
  const values = [picture, email];

  if (!email) {
    return res.status(400).send(errorMessages.MISSING_FIELD);
  }
  try {
    const result = await db.query(sql, values);

    if (result.affectedRows === 0) return res.status(404).send(errorMessages.NOT_FOUND);

    res.status(200).send(successMessages.PROFILE_UPDATED);

    sendProfileCompleteMail(email);
  } catch (error) {
    console.error(error);
    if (error instanceof SqlError) {
      res.status(500).send(errorMessages.DATABASE_FAILURE);
    } else {
      res.status(500).send(errorMessages.SYSTEM_FAILURE);
    }
  }
};
