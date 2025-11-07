const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { auth } = require('../middleware/auth');
const { uploadSingle } = require('../middleware/upload');
const { 
  validatePasswordChange, 
  validateKYCSubmission,
  validateKYBSubmission,
  handleValidationErrors 
} = require('../middleware/validation');

// Routes de profil
router.get('/', auth, profileController.getProfile);
router.put('/', auth, profileController.updateProfile);
router.post('/password', auth, validatePasswordChange, handleValidationErrors, profileController.changePassword);
router.post('/photo', auth, uploadSingle, profileController.uploadProfilePhoto);

// Routes KYC/KYB
router.post('/kyc', auth, validateKYCSubmission, handleValidationErrors, profileController.submitKYC);
router.post('/kyb', auth, validateKYBSubmission, handleValidationErrors, profileController.submitKYB);

// Upgrade vendeur
router.post('/upgrade-vendeur', auth, profileController.upgradeToVendeur);

// Génération documents
router.post('/generate-visa-card', auth, profileController.generateVisaCard);
router.get('/export-data', auth, profileController.exportData);

// Historique d'activité
router.get('/activity', auth, profileController.getActivityHistory);

module.exports = router;