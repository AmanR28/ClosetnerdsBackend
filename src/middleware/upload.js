const multer = require('multer');
const { MULTER } = require('../config');

const PATHS = {
  PROFILE: '/profiles/',
};

let profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, MULTER.UPLOAD_PATH + PATHS.PROFILE);
  },
  filename: (req, file, cb) => {
    if (file.mimetype.split('/')[0] !== 'image') return cb(new Error('MULTER_UNSUPPORTED_FILE'), null);

    const email = req.body.email;
    const date = new Date().getTime();
    const extension = file.mimetype.split('/')[1];

    const fileName = email + '_' + date + '.' + extension;
    req.body.picture = PATHS.PROFILE + fileName;

    cb(null, fileName);
  },
});

module.exports = {
  profileImage: multer({
    storage: profileStorage,
  }).single('picture'),
};
