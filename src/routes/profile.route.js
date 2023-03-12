const router = require('express').Router();
const upload = require('../middleware/upload');
const getProfile = require('../middleware/getProfile');
const getUser = require('../middleware/getUser');
const profileController = require('../controllers/profile.controller');

router.get('/', profileController.getProfile);

router.post('/', profileController.createProfile);
router.post('/measures', getUser, getProfile, profileController.updateMeasures);
router.post('/wears', getUser, getProfile, profileController.updateWears);
router.post('/occasions', getUser, getProfile, profileController.updateOccasions);

router.post('/prices', getUser, getProfile, profileController.updatePrices);
router.post('/colors', getUser, getProfile, profileController.updateColors);

router.post('/type', getUser, getProfile, profileController.updateType);
router.post('/brands', getUser, getProfile, profileController.updateBrands);
router.post('/celebrity', getUser, getProfile, profileController.updateCelebrity);
router.post('/skin', getUser, getProfile, profileController.updateSkin);
router.post('/picture', upload.profileImage, getUser, getProfile, profileController.updatePicture);

module.exports = router;
