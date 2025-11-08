const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');
const { auth } = require('../middleware/auth');

// Routes wallet
router.get('/balance', auth, walletController.getBalance);
router.post('/transfer', auth, walletController.p2pTransfer);
router.get('/transactions', auth, walletController.getTransactions);
router.get('/transactions/vendeur', auth, walletController.getVendeurTransactions);

module.exports = router;