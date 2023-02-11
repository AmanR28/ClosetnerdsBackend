const router = require('express').Router();
const profileController = require('../controllers/profile.controller');

router.get('/', profileController.getProfile);
router.post('/', profileController.createProfile);
router.post('/measures', profileController.updateMeasures);
router.post('/wears', profileController.updateWears);
router.post('/occasions', profileController.updateOccasions);

router.post('/prices', profileController.updatePrices);
router.post('/colors', profileController.updateColors);

router.post('/type', profileController.updateType);
router.post('/brands', profileController.updateBrands);
router.post('/celebrity', profileController.updateCelebrity);
router.post('/skin', profileController.updateSkin);
router.post('/picture', profileController.updatePicture);

module.exports = router;
