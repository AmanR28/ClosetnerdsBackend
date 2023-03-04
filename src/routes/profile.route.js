const router = require('express').Router();
const getUser = require('../middleware/getUser');
const profileController = require('../controllers/profile.controller');

router.get('/', getUser, profileController.getProfile);
router.post('/', getUser, profileController.createProfile);
router.post('/measures', getUser, profileController.updateMeasures);
router.post('/wears', getUser, profileController.updateWears);
router.post('/occasions', getUser, profileController.updateOccasions);

router.post('/prices', getUser, profileController.updatePrices);
router.post('/colors', getUser, profileController.updateColors);

router.post('/type', getUser, profileController.updateType);
router.post('/brands', getUser, profileController.updateBrands);
router.post('/celebrity', getUser, profileController.updateCelebrity);
router.post('/skin', getUser, profileController.updateSkin);
router.post('/picture', getUser, profileController.updatePicture);

module.exports = router;
