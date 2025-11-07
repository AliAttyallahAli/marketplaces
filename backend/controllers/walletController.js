const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');

exports.getBalance = (req, res) => {
    const userId = req.user.id;

    Wallet.findByUserId(userId, (err, wallet) => {
        if (err) return res.status(500).json({ error: 'Erreur serveur' });
        if (!wallet) return res.status(404).json({ error: 'Wallet non trouvé' });

        res.json({ 
            balance: wallet.balance,
            phone: wallet.phone,
            qr_code: wallet.qr_code
        });
    });
};

exports.p2pTransfer = (req, res) => {
    const fromUserId = req.user.id;
    const { to_phone, amount } = req.body;

    // Vérifier le solde
    Wallet.findByUserId(fromUserId, (err, fromWallet) => {
        if (err) return res.status(500).json({ error: 'Erreur serveur' });
        if (!fromWallet) return res.status(404).json({ error: 'Wallet expéditeur non trouvé' });

        if (parseFloat(fromWallet.balance) < parseFloat(amount)) {
            return res.status(400).json({ error: 'Solde insuffisant' });
        }

        // Trouver le wallet destinataire
        Wallet.findByPhone(to_phone, (err, toWallet) => {
            if (err) return res.status(500).json({ error: 'Erreur serveur' });
            if (!toWallet) return res.status(404).json({ error: 'Wallet destinataire non trouvé' });

            const fee = amount * 0.01; // 1% de frais
            const netAmount = amount - fee;

            // Début de la transaction
            Transaction.createP2P({
                from_user_id: fromUserId,
                to_user_id: toWallet.user_id,
                from_wallet_phone: fromWallet.phone,
                to_wallet_phone: to_phone,
                amount: amount,
                fee: fee
            }, (err, transactionId) => {
                if (err) return res.status(500).json({ error: 'Erreur création transaction' });

                // Mettre à jour les soldes
                Wallet.updateBalance(fromWallet.phone, -amount, (err) => {
                    if (err) return res.status(500).json({ error: 'Erreur débit wallet' });

                    Wallet.updateBalance(toWallet.phone, netAmount, (err) => {
                        if (err) return res.status(500).json({ error: 'Erreur crédit wallet' });

                        // Mettre à jour le statut de la transaction
                        Transaction.updateStatus(transactionId, 'completed', (err) => {
                            if (err) return res.status(500).json({ error: 'Erreur mise à jour transaction' });

                            res.json({ 
                                message: 'Transfert effectué avec succès',
                                transactionId,
                                amount: amount,
                                fee: fee,
                                netAmount: netAmount
                            });
                        });
                    });
                });
            });
        });
    });
};