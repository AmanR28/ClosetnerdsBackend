const express = require('express');
const profile = require('./profile.route');

const router = express.Router();

router.use('/profile', profile);

module.exports = router;
