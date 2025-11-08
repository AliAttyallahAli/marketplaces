const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth, adminAuth } = require('../middleware/auth');

// Routes publiques
// (Aucune pour l'instant)

// Routes authentifiées
router.get('/profile', auth, userController.getProfile);
router.put('/profile', auth, userController.updateProfile);
router.put('/change-password', auth, userController.changePassword);
router.put('/notification-preferences', auth, userController.updateNotificationPreferences);
router.post('/deactivate', auth, userController.deactivateAccount);

// Routes admin
router.get('/all', adminAuth, userController.getAllUsers);
router.get('/vendeurs', adminAuth, userController.getAllVendeurs);
router.get('/:id', adminAuth, userController.getUserDetails);
router.post('/:id/verify-kyc', adminAuth, userController.verifyKYC);
router.post('/:id/verify-kyb', adminAuth, userController.verifyKYB);

module.exports = router;