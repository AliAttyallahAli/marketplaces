const db = require('../config/database');

const subscriptionPlans = {
  monthly: {
    id: 'monthly',
    name: 'Mensuel',
    duration_days: 30,
    price: 5000,
    features: ['publication_illimitee', 'dashboard_vendeur', 'statistiques_vente']
  },
  quarterly: {
    id: 'quarterly', 
    name: 'Trimestriel',
    duration_days: 90,
    price: 12000,
    features: ['publication_illimitee', 'dashboard_vendeur', 'statistiques_vente', 'badge_certifie']
  },
  semester: {
    id: 'semester',
    name: 'Semestriel', 
    duration_days: 180,
    price: 20000,
    features: ['publication_illimitee', 'dashboard_vendeur', 'statistiques_vente', 'badge_certifie', 'page_boutique']
  },
  annual: {
    id: 'annual',
    name: 'Annuel',
    duration_days: 365,
    price: 35000,
    features: ['publication_illimitee', 'dashboard_vendeur', 'statistiques_vente', 'badge_certifie', 'page_boutique', 'formation_offerte']
  }
};

exports.getSubscriptionPlans = (req, res) => {
  res.json({ plans: Object.values(subscriptionPlans) });
};

exports.subscribe = (req, res) => {
  const { plan_id } = req.body;
  const userId = req.user.id;

  const plan = subscriptionPlans[plan_id];
  if (!plan) {
    return res.status(400).json({ error: 'Plan d\'abonnement invalide' });
  }

  // Vérifier le solde
  db.get('SELECT balance FROM wallets WHERE user_id = ?', [userId], (err, wallet) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur vérification solde' });
    }

    if (!wallet || wallet.balance < plan.price) {
      return res.status(400).json({ error: 'Solde insuffisant pour cet abonnement' });
    }

    // Calculer les dates
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.duration_days);

    // Créer la transaction
    const transactionSql = `
      INSERT INTO transactions (
        from_user_id, to_user_id, from_wallet_phone, to_wallet_phone,
        amount, fee, type, service_type, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'completed')
    `;

    db.run(transactionSql, [
      userId,
      1, // Admin/system
      req.user.phone,
      '+235600000001', // Wallet marketplace
      plan.price,
      0,
      'abonnement',
      'subscription'
    ], function(err) {
      if (err) {
        return res.status(500).json({ error: 'Erreur création transaction' });
      }

      // Mettre à jour les soldes
      db.run('UPDATE wallets SET balance = balance - ? WHERE user_id = ?', [plan.price, userId]);
      db.run('UPDATE wallets SET balance = balance + ? WHERE user_id = ?', [plan.price, 1]);

      // Créer l'abonnement
      const subscriptionSql = `
        INSERT INTO subscriptions (
          vendeur_id, type, amount, start_date, end_date, status
        ) VALUES (?, ?, ?, ?, ?, 'active')
      `;

      db.run(subscriptionSql, [
        userId,
        plan.id,
        plan.price,
        startDate.toISOString(),
        endDate.toISOString()
      ], function(err) {
        if (err) {
          return res.status(500).json({ error: 'Erreur création abonnement' });
        }

        // Mettre à jour le rôle de l'utilisateur
        db.run('UPDATE users SET role = "vendeur" WHERE id = ?', [userId], (err) => {
          if (err) {
            return res.status(500).json({ error: 'Erreur mise à jour rôle' });
          }

          res.status(201).json({ 
            message: `Abonnement ${plan.name} activé avec succès`,
            subscriptionId: this.lastID,
            endDate: endDate.toISOString()
          });
        });
      });
    });
  });
};

exports.getCurrentSubscription = (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT s.*, sp.name as plan_name
    FROM subscriptions s
    LEFT JOIN subscription_plans sp ON s.type = sp.id
    WHERE s.vendeur_id = ? AND s.status = 'active'
    ORDER BY s.created_at DESC
    LIMIT 1
  `;

  db.get(sql, [userId], (err, subscription) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur récupération abonnement' });
    }

    if (!subscription) {
      return res.status(404).json({ error: 'Aucun abonnement actif' });
    }

    res.json({ subscription });
  });
};

exports.cancelSubscription = (req, res) => {
  const userId = req.user.id;

  const sql = 'UPDATE subscriptions SET status = "cancelled" WHERE vendeur_id = ? AND status = "active"';

  db.run(sql, [userId], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Erreur annulation abonnement' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Aucun abonnement actif trouvé' });
    }

    res.json({ message: 'Abonnement annulé avec succès' });
  });
};

exports.getSubscriptionHistory = (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT s.*, sp.name as plan_name
    FROM subscriptions s
    LEFT JOIN subscription_plans sp ON s.type = sp.id
    WHERE s.vendeur_id = ?
    ORDER BY s.created_at DESC
  `;

  db.all(sql, [userId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur récupération historique' });
    }
    res.json({ subscriptions: rows });
  });
};