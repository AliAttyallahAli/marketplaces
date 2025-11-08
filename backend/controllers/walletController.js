const db = require('../config/database');

const walletController = {
  // Obtenir le solde du wallet
  getBalance: (req, res) => {
    const userId = req.user.id;

    db.get('SELECT * FROM wallets WHERE user_id = ?', [userId], (err, wallet) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur récupération solde' });
      }

      if (!wallet) {
        return res.status(404).json({ error: 'Wallet non trouvé' });
      }

      res.json({
        balance: wallet.balance,
        phone: wallet.phone,
        qr_code: wallet.qr_code
      });
    });
  },

  // Transfert P2P
  p2pTransfer: (req, res) => {
    const fromUserId = req.user.id;
    const { to_phone, amount } = req.body;

    if (!to_phone || !amount) {
      return res.status(400).json({ error: 'Numéro destinataire et montant requis' });
    }

    if (amount <= 0) {
      return res.status(400).json({ error: 'Montant doit être positif' });
    }

    // Commencer une transaction
    db.serialize(() => {
      db.run('BEGIN TRANSACTION');

      // Vérifier le solde de l'expéditeur
      db.get('SELECT * FROM wallets WHERE user_id = ?', [fromUserId], (err, fromWallet) => {
        if (err) {
          db.run('ROLLBACK');
          return res.status(500).json({ error: 'Erreur vérification solde' });
        }

        if (!fromWallet) {
          db.run('ROLLBACK');
          return res.status(404).json({ error: 'Wallet expéditeur non trouvé' });
        }

        if (parseFloat(fromWallet.balance) < parseFloat(amount)) {
          db.run('ROLLBACK');
          return res.status(400).json({ error: 'Solde insuffisant' });
        }

        // Trouver le wallet destinataire
        db.get('SELECT * FROM wallets WHERE phone = ?', [to_phone], (err, toWallet) => {
          if (err) {
            db.run('ROLLBACK');
            return res.status(500).json({ error: 'Erreur recherche destinataire' });
          }

          if (!toWallet) {
            db.run('ROLLBACK');
            return res.status(404).json({ error: 'Destinataire non trouvé' });
          }

          const fee = amount * 0.01; // 1% de frais
          const netAmount = amount - fee;

          // Créer la transaction
          db.run(
            `INSERT INTO transactions (
              from_user_id, to_user_id, from_wallet_phone, to_wallet_phone,
              amount, fee, type, status
            ) VALUES (?, ?, ?, ?, ?, ?, 'p2p', 'completed')`,
            [fromUserId, toWallet.user_id, fromWallet.phone, to_phone, amount, fee],
            function(err) {
              if (err) {
                db.run('ROLLBACK');
                return res.status(500).json({ error: 'Erreur création transaction' });
              }

              // Débiter l'expéditeur
              db.run(
                'UPDATE wallets SET balance = balance - ? WHERE user_id = ?',
                [amount, fromUserId],
                function(err) {
                  if (err) {
                    db.run('ROLLBACK');
                    return res.status(500).json({ error: 'Erreur débit wallet' });
                  }

                  // Créditer le destinataire
                  db.run(
                    'UPDATE wallets SET balance = balance + ? WHERE user_id = ?',
                    [netAmount, toWallet.user_id],
                    function(err) {
                      if (err) {
                        db.run('ROLLBACK');
                        return res.status(500).json({ error: 'Erreur crédit wallet' });
                      }

                      // Créditer les frais au wallet marketplace
                      db.run(
                        'UPDATE wallets SET balance = balance + ? WHERE phone = "+235600000001"',
                        [fee],
                        function(err) {
                          if (err) {
                            db.run('ROLLBACK');
                            return res.status(500).json({ error: 'Erreur frais marketplace' });
                          }

                          db.run('COMMIT');
                          res.json({
                            message: 'Transfert effectué avec succès',
                            transactionId: this.lastID,
                            amount: amount,
                            fee: fee,
                            netAmount: netAmount
                          });
                        }
                      );
                    }
                  );
                }
              );
            }
          );
        });
      });
    });
  },

  // Obtenir l'historique des transactions
  getTransactions: (req, res) => {
    const userId = req.user.id;

    db.all(
      `SELECT t.*, 
              u_from.nom as from_nom, u_from.prenom as from_prenom,
              u_to.nom as to_nom, u_to.prenom as to_prenom,
              p.nom as product_nom
       FROM transactions t
       LEFT JOIN users u_from ON t.from_user_id = u_from.id
       LEFT JOIN users u_to ON t.to_user_id = u_to.id
       LEFT JOIN products p ON t.product_id = p.id
       WHERE t.from_user_id = ? OR t.to_user_id = ?
       ORDER BY t.created_at DESC
       LIMIT 50`,
      [userId, userId],
      (err, transactions) => {
        if (err) {
          return res.status(500).json({ error: 'Erreur récupération transactions' });
        }

        res.json({ transactions });
      }
    );
  },

  // Obtenir les transactions vendeur
  getVendeurTransactions: (req, res) => {
    const vendeurId = req.user.id;

    db.all(
      `SELECT t.*, 
              u_from.nom as from_nom, u_from.prenom as from_prenom,
              p.nom as product_nom
       FROM transactions t
       JOIN users u_from ON t.from_user_id = u_from.id
       LEFT JOIN products p ON t.product_id = p.id
       WHERE t.to_user_id = ? AND t.type = 'achat'
       ORDER BY t.created_at DESC`,
      [vendeurId],
      (err, transactions) => {
        if (err) {
          return res.status(500).json({ error: 'Erreur récupération transactions vendeur' });
        }

        res.json({ transactions });
      }
    );
  }
};

module.exports = walletController;