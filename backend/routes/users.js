const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth, adminAuth } = require('../middleware/auth');

// Route pour obtenir le profil de l'utilisateur connecté
router.get('/profile', auth, userController.getProfile);

// Autres routes existantes...
router.get('/all', adminAuth, userController.getAllUsers);
router.get('/vendeurs', adminAuth, userController.getAllVendeurs);
router.get('/:id', adminAuth, userController.getUserDetails);
router.put('/profile', auth, userController.updateProfile);
router.post('/:id/verify-kyc', adminAuth, userController.verifyKYC);
router.post('/:id/verify-kyb', adminAuth, userController.verifyKYB);

module.exports = router;