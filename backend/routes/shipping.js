const express = require('express');
const router = express.Router();
const shippingController = require('../controllers/shippingController');
const { auth, vendeurAuth } = require('../middleware/auth');

router.get('/', auth, shippingController.getShipments);
router.get('/:id', auth, shippingController.getShipmentById);
router.get('/:id/tracking', auth, shippingController.getTrackingInfo);
router.post('/', vendeurAuth, shippingController.createShipment);
router.put('/:id/status', vendeurAuth, shippingController.updateStatus);
router.put('/:id/tracking', vendeurAuth, shippingController.updateTracking);

module.exports = router;