const router = require('express').Router()
const { authMiddleware } = require('../../middlewares/authMiddleware')
const dashboardController = require('../../controllers/dashboard/dashboardController')


router.get('/seller/get-dashboard-index-data', authMiddleware, dashboardController.get_seller_dashboard_data);

router.get('/admin/get-dashboard-index-data', authMiddleware, dashboardController.get_admin_dashboard_data);


module.exports = router;