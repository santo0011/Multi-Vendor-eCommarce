const router = require('express').Router();
const bannerControllers = require('../controllers/bannerControllers');
const { authMiddleware } = require('../middlewares/authMiddleware')


router.post('/banner-add', bannerControllers.banner_add);


module.exports = router;