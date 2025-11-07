const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');
const { auth } = require('../middleware/auth');

router.get('/balance', auth, walletController.getBalance);
router.post('/transfer', auth, walletController.p2pTransfer);

module.exports = router;