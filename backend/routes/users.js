const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth, adminAuth } = require('../middleware/auth');

// Route pour obtenir le profil de l'utilisateur connecté
router.get('/profile', auth, (req, res) => {
  // Retourner directement les données de l'utilisateur depuis le token
  res.json({
    user: {
      id: req.user.id,
      nni: req.user.nni,
      phone: req.user.phone,
      email: req.user.email,
      role: req.user.role,
      nom: req.user.nom,
      prenom: req.user.prenom,
      date_naissance: req.user.date_naissance,
      lieu_naissance: req.user.lieu_naissance,
      province: req.user.province,
      region: req.user.region,
      ville: req.user.ville,
      quartier: req.user.quartier,
      photo: req.user.photo,
      kyc_verified: req.user.kyc_verified,
      kyb_verified: req.user.kyb_verified,
      created_at: req.user.created_at
    }
  });
});

// Autres routes existantes...
router.get('/all', adminAuth, userController.getAllUsers);
router.get('/vendeurs', adminAuth, userController.getAllVendeurs);
router.get('/:id', adminAuth, userController.getUserDetails);
router.put('/profile', auth, userController.updateProfile);
router.post('/:id/verify-kyc', adminAuth, userController.verifyKYC);
router.post('/:id/verify-kyb', adminAuth, userController.verifyKYB);

module.exports = router;