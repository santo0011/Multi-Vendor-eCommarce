const router = require('express').Router();

const orderController = require('../../controllers/order/orderController');

// for customer router
router.post('/order/palce-order', orderController.place_order);
router.get('/customer/get-dashboard-data/:userId', orderController.get_customer_databorad_data);
router.get('/customer/get-orders/:customerId/:status', orderController.get_orders);
router.get('/customer/get-order/:orderId', orderController.get_order);


// for admin router
router.get('/admin/orders', orderController.get_admin_orders);
router.get('/admin/order/:orderId', orderController.get_admin_order)
router.put('/admin/order-status/update/:orderId', orderController.admin_order_status_update)


// for seller router
router.get('/seller/orders/:sellerId', orderController.get_seller_orders)
router.get('/seller/order/:orderId', orderController.get_seller_order)
router.put('/seller/order-status/update/:orderId', orderController.seller_order_status_update)



module.exports = router;