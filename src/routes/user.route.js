const router = require('express').Router();
const { userController } = require('../controllers');

router.get('/', userController.getUser);
router.post('/', userController.createUser);

module.exports = router;
