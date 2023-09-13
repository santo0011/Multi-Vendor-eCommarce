const router = require('express').Router()
const paymentController = require('../../controllers/payment/paymentcontroller');
const { authMiddleware } = require('../../middlewares/authMiddleware');

router.get('/create-stripe-connect-account', authMiddleware, paymentController.create_stripe_connect_account)

router.put('/active-stripe-connect-account/:activeCode', authMiddleware, paymentController.active_stripe_connect_account)

router.get('/seller-payment-details/:sellerId', authMiddleware, paymentController.get_seller_payemt_details)

router.post('/withdrowal-request', authMiddleware, paymentController.withdrowal_request)

router.get('/request', authMiddleware, paymentController.get_payment_request)

router.post('/request-confirm', authMiddleware, paymentController.payment_request_confirm)


module.exports = router;