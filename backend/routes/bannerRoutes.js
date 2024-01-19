const router = require('express').Router();
const bannerControllers = require('../controllers/bannerControllers');
const { authMiddleware } = require('../middlewares/authMiddleware')


router.post('/banner-add', authMiddleware, bannerControllers.banner_add);

router.get('/banner-get/:productId', authMiddleware, bannerControllers.banner_get);

router.get('/banners-get', bannerControllers.banners_get);

router.put('/banner-update/:bannerId', authMiddleware, bannerControllers.banner_update);


module.exports = router;