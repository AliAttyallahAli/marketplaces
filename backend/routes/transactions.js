const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { auth, vendeurAuth, adminAuth } = require('../middleware/auth');

router.post('/achat', auth, transactionController.achatProduit);
router.post('/facture', auth, transactionController.payerFacture);
router.get('/history', auth, transactionController.getUserTransactions);
router.get('/vendeur/history', vendeurAuth, transactionController.getVendeurTransactions);
router.get('/search', adminAuth, transactionController.searchTransactions);

module.exports = router;