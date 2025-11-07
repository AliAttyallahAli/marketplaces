const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { auth, adminAuth } = require('../middleware/auth');

router.get('/', auth, serviceController.getServices);
router.get('/:type', auth, serviceController.getServicesByType);
router.post('/', adminAuth, serviceController.createService);
router.put('/:id', adminAuth, serviceController.updateService);

module.exports = router;