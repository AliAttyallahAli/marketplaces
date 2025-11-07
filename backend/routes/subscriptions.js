const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const { auth } = require('../middleware/auth');

router.get('/plans', subscriptionController.getSubscriptionPlans);
router.post('/subscribe', auth, subscriptionController.subscribe);
router.get('/current', auth, subscriptionController.getCurrentSubscription);
router.post('/cancel', auth, subscriptionController.cancelSubscription);
router.get('/history', auth, subscriptionController.getSubscriptionHistory);

module.exports = router;