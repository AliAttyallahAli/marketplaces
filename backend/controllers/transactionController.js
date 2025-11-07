const Transaction = require('../models/Transaction');
const Product = require('../models/Product');
const Wallet = require('../models/Wallet');

exports.achatProduit = (req, res) => {
    const from_user_id = req.user.id;
    const { product_id, quantity = 1 } = req.body;

    // Récupérer le produit
    Product.findById(product_id, (err, product) => {
        if (err) return res.status(500).json({ error: 'Erreur serveur' });
        if (!product) return res.status(404).json({ error: 'Produit non trouvé' });
        if (!product.is_active) return res.status(400).json({ error: 'Produit non disponible' });

        const totalAmount = product.prix * quantity;

        // Vérifier le solde de l'acheteur
        Wallet.findByUserId(from_user_id, (err, wallet) => {
            if (err) return res.status(500).json({ error: 'Erreur serveur' });
            if (parseFloat(wallet.balance) < totalAmount) {
                return res.status(400).json({ error: 'Solde insuffisant' });
            }

            const fee = totalAmount * 0.01; // 1% de frais
            const netAmount = totalAmount - fee;

            // Créer la transaction
            Transaction.createAchat({
                from_user_id: from_user_id,
                to_user_id: product.vendeur_id,
                from_wallet_phone: wallet.phone,
                to_wallet_phone: product.vendeur_phone, // À récupérer du vendeur
                amount: totalAmount,
                fee: fee,
                product_id: product_id
            }, (err, transactionId) => {
                if (err) return res.status(500).json({ error: 'Erreur création transaction' });

                // Mettre à jour les soldes
                Wallet.updateBalance(wallet.phone, -totalAmount, (err) => {
                    if (err) return res.status(500).json({ error: 'Erreur débit wallet' });

                    // Créditer le vendeur (net amount)
                    Wallet.findByUserId(product.vendeur_id, (err, vendeurWallet) => {
                        if (err) return res.status(500).json({ error: 'Erreur récupération wallet vendeur' });

                        Wallet.updateBalance(vendeurWallet.phone, netAmount, (err) => {
                            if (err) return res.status(500).json({ error: 'Erreur crédit wallet vendeur' });

                            // Mettre à jour le statut
                            Transaction.updateStatus(transactionId, 'completed', (err) => {
                                if (err) return res.status(500).json({ error: 'Erreur mise à jour transaction' });

                                res.json({ 
                                    message: 'Achat effectué avec succès',
                                    transactionId,
                                    amount: totalAmount,
                                    fee: fee,
                                    product: product.nom
                                });
                            });
                        });
                    });
                });
            });
        });
    });
};

exports.payerFacture = (req, res) => {
    const from_user_id = req.user.id;
    const { service_type, service_id, amount, reference } = req.body;

    // Vérifier le solde
    Wallet.findByUserId(from_user_id, (err, wallet) => {
        if (err) return res.status(500).json({ error: 'Erreur serveur' });
        if (parseFloat(wallet.balance) < parseFloat(amount)) {
            return res.status(400).json({ error: 'Solde insuffisant' });
        }

        const fee = amount * 0.01;
        const netAmount = amount - fee;

        // Trouver le wallet du service
        Wallet.findByPhone('+235600000001', (err, serviceWallet) => { // Wallet marketplace pour services
            if (err) return res.status(500).json({ error: 'Erreur serveur' });

            Transaction.createFacture({
                from_user_id: from_user_id,
                to_user_id: serviceWallet.user_id, // Admin/system
                from_wallet_phone: wallet.phone,
                to_wallet_phone: serviceWallet.phone,
                amount: amount,
                fee: fee,
                service_type: service_type
            }, (err, transactionId) => {
                if (err) return res.status(500).json({ error: 'Erreur création transaction' });

                // Mettre à jour les soldes
                Wallet.updateBalance(wallet.phone, -amount, (err) => {
                    if (err) return res.status(500).json({ error: 'Erreur débit wallet' });

                    Wallet.updateBalance(serviceWallet.phone, netAmount, (err) => {
                        if (err) return res.status(500).json({ error: 'Erreur crédit wallet service' });

                        Transaction.updateStatus(transactionId, 'completed', (err) => {
                            if (err) return res.status(500).json({ error: 'Erreur mise à jour transaction' });

                            res.json({ 
                                message: 'Facture payée avec succès',
                                transactionId,
                                service: service_type,
                                amount: amount,
                                reference: reference
                            });
                        });
                    });
                });
            });
        });
    });
};

exports.getUserTransactions = (req, res) => {
    const userId = req.user.id;

    Transaction.findByUserId(userId, (err, transactions) => {
        if (err) return res.status(500).json({ error: 'Erreur récupération transactions' });

        res.json({ transactions });
    });
};

exports.getVendeurTransactions = (req, res) => {
    const vendeurId = req.user.id;

    Transaction.findByVendeur(vendeurId, (err, transactions) => {
        if (err) return res.status(500).json({ error: 'Erreur récupération transactions' });

        res.json({ transactions });
    });
};

exports.searchTransactions = (req, res) => {
    const filters = req.query;

    Transaction.searchTransactions(filters, (err, transactions) => {
        if (err) return res.status(500).json({ error: 'Erreur recherche transactions' });

        res.json({ transactions });
    });
};