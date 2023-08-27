const router = require('express').Router();
const chatController = require('../controllers/ChatController');
const { authMiddleware } = require('../middlewares/authMiddleware')


router.post('/chat/customer/add-customer-friend', chatController.add_customer_friend);

router.post('/chat/customer/send-message-to-seller', chatController.customer_message_add);

router.get('/chat/seller/get-customers/:sellerId', chatController.get_customers);

router.get('/chat/seller/get-customer-message/:customerId', authMiddleware, chatController.get_customer_seller_message)

router.post('/chat/seller/send-message-to-customer', authMiddleware, chatController.seller_message_add)


module.exports = router;