const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { auth } = require('../middleware/auth');

router.get('/dashboard', auth, analyticsController.getDashboardStats);
router.get('/top-products', auth, analyticsController.getTopProducts);
router.get('/sales', auth, analyticsController.getSalesData);
router.get('/user-growth', auth, analyticsController.getUserGrowth);
router.get('/revenue', auth, analyticsController.getRevenueData);

module.exports = router;