const { User, Profile } = require('../db');
const { ValidationError, DatabaseError, col } = require('sequelize');
const sendgrid = require('../services/sendgrid.service');
const pdfService = require('../services/pdf.service');
const errorMessages = require('../commons/error_messages');
const successMessages = require('../commons/success_messages');

const sendProfileCompleteMail = async email => {
  try {
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      return res.status(404).send(errorMessages.NOT_FOUND);
    }

    const profile = await Profile.findByPk(user.profileId);

    if (!profile) {
      console.error('Profile Not Associated with user ', user.id);
      return res.status(500).send(errorMessages.SYSTEM_FAILURE);
    }

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
    sendgrid.smProfilePDF(data.email, data.name, Buffer.from(pdfDoc.output('arraybuffer')));
  } catch (error) {
    console.error(error);
  }
};

exports.getProfile = async (req, res) => {
  if (!req.body.email) {
    return res.status(400).send(errorMessages.MISSING_FIELD);
  }
  try {
    const user = await User.findOne({ where: { email: req.body.email } });

    if (!user) {
      return res.status(404).send(errorMessages.NOT_FOUND);
    }

    if (user.isRegistered) {
      const jwt_user = req.jwt_user;
      if (!jwt_user || jwt_user.id != user.id) {
        return res.status(401).send(errorMessages.UNAUTHORIZED);
      }
    }

    const profile = await Profile.findByPk(user.profileId);

    if (!profile) {
      console.error('Profile Not Associated with user ', user.id);
      return res.status(500).send(errorMessages.SYSTEM_FAILURE);
    }

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
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).send(errorMessages.BAD_REQUEST);
    }
    console.error(error);
    if (error instanceof DatabaseError) {
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

  try {
    const user = await User.findOne({ where: { email: email } });
    if (!user) return res.status(404).send(errorMessages.NOT_FOUND);

    if (user.isRegistered) {
      const jwt_user = req.jwt_user;
      if (!jwt_user || jwt_user.id != user.id) {
        return res.status(401).send(errorMessages.UNAUTHORIZED);
      }
    }

    const profile = await Profile.findByPk(user.profileId);

    if (!profile) {
      console.error('Profile Not Associated with user ', user.id);
      return res.status(500).send(errorMessages.SYSTEM_FAILURE);
    }

    profile.measures = measures;
    await profile.validate();
    await profile.save();

    return res.status(200).send(successMessages.PROFILE_UPDATED);
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).send(errorMessages.BAD_REQUEST);
    }
    console.error(error);
    if (error instanceof DatabaseError) {
      return res.status(500).send(errorMessages.DATABASE_FAILURE);
    } else {
      return res.status(500).send(errorMessages.SYSTEM_FAILURE);
    }
  }
};

exports.updateWears = async (req, res) => {
  const email = req.body.email;
  const wears = req.body.wears || {};
  const subs = req.body.subs || {};

  if (!email) {
    return res.status(400).send(errorMessages.MISSING_FIELD);
  }
  try {
    const user = await User.findOne({ where: { email: email } });
    if (!user) return res.status(404).send(errorMessages.NOT_FOUND);

    if (user.isRegistered) {
      const jwt_user = req.jwt_user;
      if (!jwt_user || jwt_user.id != user.id) {
        return res.status(401).send(errorMessages.UNAUTHORIZED);
      }
    }

    const profile = await Profile.findByPk(user.profileId);

    if (!profile) {
      console.error('Profile Not Associated with user ', user.id);
      return res.status(500).send(errorMessages.SYSTEM_FAILURE);
    }

    profile.wears = wears;
    profile.subs = subs;
    await profile.validate();
    await profile.save();

    return res.status(200).send(successMessages.PROFILE_UPDATED);
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).send(errorMessages.BAD_REQUEST);
    }
    console.error(error);
    if (error instanceof DatabaseError) {
      res.status(500).send(errorMessages.DATABASE_FAILURE);
    } else {
      res.status(500).send(errorMessages.SYSTEM_FAILURE);
    }
  }
};

exports.updateOccasions = async (req, res) => {
  const email = req.body.email;
  const occasions = req.body.occasions || {};

  if (!email) {
    return res.status(400).send(errorMessages.MISSING_FIELD);
  }
  try {
    const user = await User.findOne({ where: { email: email } });
    if (!user) return res.status(404).send(errorMessages.NOT_FOUND);

    if (user.isRegistered) {
      const jwt_user = req.jwt_user;
      if (!jwt_user || jwt_user.id != user.id) {
        return res.status(401).send(errorMessages.UNAUTHORIZED);
      }
    }

    const profile = await Profile.findByPk(user.profileId);

    if (!profile) {
      console.error('Profile Not Associated with user ', user.id);
      return res.status(500).send(errorMessages.SYSTEM_FAILURE);
    }

    profile.occasions = occasions;
    await profile.validate();
    await profile.save();

    return res.status(200).send(successMessages.PROFILE_UPDATED);
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).send(errorMessages.BAD_REQUEST);
    }
    console.error(error);
    if (error instanceof DatabaseError) {
      res.status(500).send(errorMessages.DATABASE_FAILURE);
    } else {
      res.status(500).send(errorMessages.SYSTEM_FAILURE);
    }
  }
};

exports.updatePrices = async (req, res) => {
  const email = req.body.email;
  const prices = req.body.prices;

  if (!email || !prices) {
    return res.status(400).send(errorMessages.MISSING_FIELD);
  }
  try {
    const user = await User.findOne({ where: { email: email } });
    if (!user) return res.status(404).send(errorMessages.NOT_FOUND);

    if (user.isRegistered) {
      const jwt_user = req.jwt_user;
      if (!jwt_user || jwt_user.id != user.id) {
        return res.status(401).send(errorMessages.UNAUTHORIZED);
      }
    }

    const profile = await Profile.findByPk(user.profileId);

    if (!profile) {
      console.error('Profile Not Associated with user ', user.id);
      return res.status(500).send(errorMessages.SYSTEM_FAILURE);
    }

    profile.prices = prices;
    await profile.validate();
    await profile.save();

    return res.status(200).send(successMessages.PROFILE_UPDATED);
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).send(errorMessages.BAD_REQUEST);
    }
    console.error(error);
    if (error instanceof DatabaseError) {
      return res.status(500).send(errorMessages.DATABASE_FAILURE);
    }
    return res.status(500).send(errorMessages.SYSTEM_FAILURE);
  }
};

exports.updateColors = async (req, res) => {
  const email = req.body.email;
  const colors = req.body.colors;

  if (!email || !colors) {
    return res.status(400).send(errorMessages.MISSING_FIELD);
  }
  try {
    const user = await User.findOne({ where: { email: email } });
    if (!user) return res.status(404).send(errorMessages.NOT_FOUND);

    if (user.isRegistered) {
      const jwt_user = req.jwt_user;
      if (!jwt_user || jwt_user.id != user.id) {
        return res.status(401).send(errorMessages.UNAUTHORIZED);
      }
    }

    const profile = await Profile.findByPk(user.profileId);

    if (!profile) {
      console.error('Profile Not Associated with user ', user.id);
      return res.status(500).send(errorMessages.SYSTEM_FAILURE);
    }

    profile.colors = colors;
    await profile.save();

    return res.status(200).send(successMessages.PROFILE_UPDATED);
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).send(errorMessages.BAD_REQUEST);
    }
    console.error(error);
    if (error instanceof DatabaseError) {
      res.status(500).send(errorMessages.DATABASE_FAILURE);
    } else {
      res.status(500).send(errorMessages.SYSTEM_FAILURE);
    }
  }
};

exports.updateType = async (req, res) => {
  const email = req.body.email;
  const type = req.body.type;

  if (!email || !type) {
    return res.status(400).send(errorMessages.MISSING_FIELD);
  }
  try {
    const user = await User.findOne({ where: { email: email } });
    if (!user) return res.status(404).send(errorMessages.NOT_FOUND);

    if (user.isRegistered) {
      const jwt_user = req.jwt_user;
      if (!jwt_user || jwt_user.id != user.id) {
        return res.status(401).send(errorMessages.UNAUTHORIZED);
      }
    }

    const profile = await Profile.findByPk(user.profileId);

    if (!profile) {
      console.error('Profile Not Associated with user ', user.id);
      return res.status(500).send(errorMessages.SYSTEM_FAILURE);
    }

    profile.type = type;
    await profile.validate();
    await profile.save();

    return res.status(200).send(successMessages.PROFILE_UPDATED);
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).send(errorMessages.BAD_REQUEST);
    }
    console.error(error);
    if (error instanceof DatabaseError) {
      res.status(500).send(errorMessages.DATABASE_FAILURE);
    } else {
      res.status(500).send(errorMessages.SYSTEM_FAILURE);
    }
  }
};

exports.updateBrands = async (req, res) => {
  const email = req.body.email;
  const brands = req.body.brands || '';

  if (!email) {
    return res.status(400).send(errorMessages.MISSING_FIELD);
  }
  try {
    const user = await User.findOne({ where: { email: email } });
    if (!user) return res.status(404).send(errorMessages.NOT_FOUND);

    if (user.isRegistered) {
      const jwt_user = req.jwt_user;
      if (!jwt_user || jwt_user.id != user.id) {
        return res.status(401).send(errorMessages.UNAUTHORIZED);
      }
    }

    const profile = await Profile.findByPk(user.profileId);

    if (!profile) {
      console.error('Profile Not Associated with user ', user.id);
      return res.status(500).send(errorMessages.SYSTEM_FAILURE);
    }

    profile.brands = brands;
    await profile.validate();
    await profile.save();

    return res.status(200).send(successMessages.PROFILE_UPDATED);
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).send(errorMessages.BAD_REQUEST);
    }
    console.error(error);
    if (error instanceof DatabaseError) {
      res.status(500).send(errorMessages.DATABASE_FAILURE);
    } else {
      res.status(500).send(errorMessages.SYSTEM_FAILURE);
    }
  }
};

exports.updateCelebrity = async (req, res) => {
  const email = req.body.email;
  const celebrity = req.body.celebrity || '';

  if (!email) {
    return res.status(400).send(errorMessages.MISSING_FIELD);
  }
  try {
    const user = await User.findOne({ where: { email: email } });
    if (!user) return res.status(404).send(errorMessages.NOT_FOUND);

    if (user.isRegistered) {
      const jwt_user = req.jwt_user;
      if (!jwt_user || jwt_user.id != user.id) {
        return res.status(401).send(errorMessages.UNAUTHORIZED);
      }
    }

    const profile = await Profile.findByPk(user.profileId);

    if (!profile) {
      console.error('Profile Not Associated with user ', user.id);
      return res.status(500).send(errorMessages.SYSTEM_FAILURE);
    }

    profile.celebrity = celebrity;
    await profile.validate();
    await profile.save();

    return res.status(200).send(successMessages.PROFILE_UPDATED);
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).send(errorMessages.BAD_REQUEST);
    }
    console.error(error);
    if (error instanceof DatabaseError) {
      res.status(500).send(errorMessages.DATABASE_FAILURE);
    } else {
      res.status(500).send(errorMessages.SYSTEM_FAILURE);
    }
  }
};

exports.updateSkin = async (req, res) => {
  const email = req.body.email;
  const skin = req.body.skin || '';

  if (!email) {
    return res.status(400).send(errorMessages.MISSING_FIELD);
  }
  try {
    const user = await User.findOne({ where: { email: email } });
    if (!user) return res.status(404).send(errorMessages.NOT_FOUND);

    if (user.isRegistered) {
      const jwt_user = req.jwt_user;
      if (!jwt_user || jwt_user.id != user.id) {
        return res.status(401).send(errorMessages.UNAUTHORIZED);
      }
    }

    const profile = await Profile.findByPk(user.profileId);

    if (!profile) {
      console.error('Profile Not Associated with user ', user.id);
      return res.status(500).send(errorMessages.SYSTEM_FAILURE);
    }

    profile.skin = skin;
    await profile.validate();
    await profile.save();

    return res.status(200).send(successMessages.PROFILE_UPDATED);
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).send(errorMessages.BAD_REQUEST);
    }
    console.error(error);
    if (error instanceof DatabaseError) {
      res.status(500).send(errorMessages.DATABASE_FAILURE);
    } else {
      res.status(500).send(errorMessages.SYSTEM_FAILURE);
    }
  }
};

exports.updatePicture = async (req, res) => {
  const email = req.body.email;
  const picture = req.body.picture;

  if (!email || !picture) {
    return res.status(400).send(errorMessages.MISSING_FIELD);
  }
  try {
    const user = await User.findOne({ where: { email: email } });
    if (!user) return res.status(404).send(errorMessages.NOT_FOUND);

    if (user.isRegistered) {
      const jwt_user = req.jwt_user;
      if (!jwt_user || jwt_user.id != user.id) {
        return res.status(401).send(errorMessages.UNAUTHORIZED);
      }
    }

    const profile = await Profile.findByPk(user.profileId);

    if (!profile) {
      console.error('Profile Not Associated with user ', user.id);
      return res.status(500).send(errorMessages.SYSTEM_FAILURE);
    }

    console.log('asdf', picture);

    profile.pictures = picture;
    await profile.validate();
    await profile.save();

    res.status(200).send(successMessages.PROFILE_UPDATED);

    sendProfileCompleteMail(email);
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).send(errorMessages.BAD_REQUEST);
    }
    console.error(error);
    if (error instanceof DatabaseError) {
      res.status(500).send(errorMessages.DATABASE_FAILURE);
    } else {
      res.status(500).send(errorMessages.SYSTEM_FAILURE);
    }
  }
};
