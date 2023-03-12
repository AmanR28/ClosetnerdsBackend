const { User, Profile } = require('../db');
const { ValidationError, DatabaseError } = require('sequelize');
const sendgrid = require('../services/sendgrid.service');
const pdfService = require('../services/pdf.service');
const errorMessages = require('../commons/error_messages');
const successMessages = require('../commons/success_messages');

const sendProfileCompleteMail = async (user, profile) => {
  try {
    delete profile.dataValues.id;
    delete profile.dataValues.userId;
    delete profile.dataValues.createdAt;
    delete profile.dataValues.updatedAt;

    const data = {
      name: user.name,
      email: user.email,
      phone: user.phone,
      gender: user.gender,
      ...profile.dataValues,
    };

    const pdfDoc = pdfService.profilePdf(data);
    await sendgrid.smProfilePDF(data.email, data.name, Buffer.from(pdfDoc.output('arraybuffer')));
  } catch (error) {
    console.error(error);
  }
};

exports.getProfile = async (req, res) => {
  const user = req.user;
  const profile = req.profile;

  delete profile.dataValues.id;
  delete profile.dataValues.userId;
  delete profile.dataValues.createdAt;
  delete profile.dataValues.updatedAt;

  res.status(200).send({
    ...successMessages.PROFILE_INFO,
    data: {
      name: user.name,
      email: user.email,
      phone: user.phone,
      gender: user.gender,
      city: user.city,
      ...profile.dataValues,
    },
  });
};

exports.createProfile = async (req, res) => {
  const email = req.body.email || '';
  const name = req.body.name || '';
  const phone = req.body.phone || 0;
  const gender = req.body.gender;
  const city = req.body.city || '';

  if (!email || !name || !gender) {
    return res.status(400).send(errorMessages.MISSING_FIELD);
  }

  try {
    let user = await User.findOne({ where: { email } });

    if (user) {
      return res.status(409).send(errorMessages.DUPLICATE_FIELD);
    }

    if (!user) {
      user = await User.create({
        name: name,
        gender: gender,
        email: email,
        phone: phone,
        city: city,
      });
    }

    res.status(200).json(successMessages.PROFILE_CREATED);

    sendgrid.smProfileRegister(user.email);
  } catch (e) {
    if (e instanceof ValidationError) {
      if (e.errors[0].message == 'Validation isEmail on email failed') {
        return res.status(401).send(errorMessages.INVALID_EMAIL);
      }
      if (e.errors[0].message == 'Validation isUnique on email failed') {
        return res.status(409).send(errorMessages.DUPLICATE_FIELD);
      }
      if (e.errors[0].message == 'Validation isUnique on phone failed') {
        return res.status(409).send(errorMessages.DUPLICATE_FIELD);
      }
      return res.status(401).send(errorMessages.BAD_REQUEST);
    }
    if (e instanceof DatabaseError) {
      console.error(e);
      return res.status(500).send(errorMessages.DATABASE_FAILURE);
    }

    console.error(e);
    return res.status(500).send(errorMessages.SYSTEM_FAILURE);
  }
};

exports.updateMeasures = async (req, res) => {
  const measures = {
    bust: req.body.bust || 0,
    waist: req.body.waist || 0,
    hip: req.body.hip || 0,
    length: req.body.length || 0,
  };

  const profile = req.profile;

  const result = await profile.update({ measures });
  return res.status(result.status).send(result.msg);
};

exports.updateWears = async (req, res) => {
  const wears = req.body.wears || {};
  const subs = req.body.subs || {};

  const profile = req.profile;

  const result = await profile.update({ wears, subs });
  return res.status(result.status).send(result.msg);
};

exports.updateOccasions = async (req, res) => {
  const occasions = req.body.occasions;
  if (!occasions) {
    return res.status(400).send(errorMessages.MISSING_FIELD);
  }

  const profile = req.profile;

  const result = await profile.update({ occasions });
  return res.status(result.status).send(result.msg);
};

exports.updatePrices = async (req, res) => {
  const prices = req.body.prices;
  if (!prices) {
    return res.status(400).send(errorMessages.MISSING_FIELD);
  }

  const profile = req.profile;

  const result = await profile.update({ prices });
  return res.status(result.status).send(result.msg);
};

exports.updateColors = async (req, res) => {
  const colors = req.body.colors;
  if (!colors) {
    return res.status(400).send(errorMessages.MISSING_FIELD);
  }

  const profile = req.profile;

  profile.colors = colors;
  await profile.save();

  const result = await profile.update({ colors });
  return res.status(result.status).send(result.msg);
};

exports.updateType = async (req, res) => {
  const type = req.body.type;
  if (!type) {
    return res.status(400).send(errorMessages.MISSING_FIELD);
  }

  const profile = req.profile;

  const result = await profile.update({ type });
  return res.status(result.status).send(result.msg);
};

exports.updateBrands = async (req, res) => {
  const brands = req.body.brands;
  if (!brands) {
    return res.status(400).send(errorMessages.MISSING_FIELD);
  }

  const profile = req.profile;

  const result = await profile.update({ brands });
  return res.status(result.status).send(result.msg);
};

exports.updateCelebrity = async (req, res) => {
  const celebrity = req.body.celebrity;
  if (!celebrity) {
    return res.status(400).send(errorMessages.MISSING_FIELD);
  }

  const profile = req.profile;

  const result = await profile.update({ celebrity });
  return res.status(result.status).send(result.msg);
};

exports.updateSkin = async (req, res) => {
  const skin = req.body.skin;
  if (!skin) {
    return res.status(400).send(errorMessages.MISSING_FIELD);
  }

  const profile = req.profile;

  profile.skin = skin;
  await profile.validate();
  await profile.save();

  const result = await profile.update({ skin });
  return res.status(result.status).send(result.msg);
};

exports.updatePicture = async (req, res) => {
  const picture = req.body.picture;

  if (!picture) {
    return res.status(400).send(errorMessages.MISSING_FIELD);
  }

  const profile = req.profile;

  const result = await profile.update({ picture });
  res.status(result.status).send(result.msg);

  await sendProfileCompleteMail(req.user, req.profile);
};
