const router = require('express').Router();
const upload = require('../middleware/upload');
const getJwtUser = require('../middleware/getJwtUser');
const profileController = require('../controllers/profile.controller');

router.get('/', getJwtUser, profileController.getProfile);

router.post('/', getJwtUser, profileController.createProfile);
router.post('/measures', getJwtUser, profileController.updateMeasures);
router.post('/wears', getJwtUser, profileController.updateWears);
router.post('/occasions', getJwtUser, profileController.updateOccasions);

router.post('/prices', getJwtUser, profileController.updatePrices);
router.post('/colors', getJwtUser, profileController.updateColors);

router.post('/type', getJwtUser, profileController.updateType);
router.post('/brands', getJwtUser, profileController.updateBrands);
router.post('/celebrity', getJwtUser, profileController.updateCelebrity);
router.post('/skin', getJwtUser, profileController.updateSkin);
router.post('/picture', getJwtUser, upload.profileImage, profileController.updatePicture);

module.exports = router;
