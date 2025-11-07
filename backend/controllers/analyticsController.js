const db = require('../config/database');

const analyticsController = {
  // Obtenir les statistiques du tableau de bord
  getDashboardStats: (req, res) => {
    const { period = '30days' } = req.query;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Calculer la date de début selon la période
    const startDate = new Date();
    switch (period) {
      case '7days':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30days':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90days':
        startDate.setDate(startDate.getDate() - 90);
        break;
      case '1year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
    }

    if (userRole === 'admin') {
      // Statistiques administrateur
      const queries = [
        // Total utilisateurs
        new Promise((resolve) => {
          db.get('SELECT COUNT(*) as total FROM users', (err, row) => {
            if (err) {
              console.error('Erreur total utilisateurs:', err);
              resolve(0);
            } else {
              resolve(row?.total || 0);
            }
          });
        }),
        // Total vendeurs
        new Promise((resolve) => {
          db.get('SELECT COUNT(*) as total FROM users WHERE role = "vendeur"', (err, row) => {
            if (err) {
              console.error('Erreur total vendeurs:', err);
              resolve(0);
            } else {
              resolve(row?.total || 0);
            }
          });
        }),
        // Total transactions
        new Promise((resolve) => {
          db.get('SELECT COUNT(*) as total FROM transactions WHERE created_at >= ?', [startDate.toISOString()], (err, row) => {
            if (err) {
              console.error('Erreur total transactions:', err);
              resolve(0);
            } else {
              resolve(row?.total || 0);
            }
          });
        }),
        // Revenus plateforme
        new Promise((resolve) => {
          db.get('SELECT SUM(fee) as total FROM transactions WHERE created_at >= ?', [startDate.toISOString()], (err, row) => {
            if (err) {
              console.error('Erreur revenus plateforme:', err);
              resolve(0);
            } else {
              resolve(row?.total || 0);
            }
          });
        })
      ];

      Promise.all(queries).then(([totalUsers, totalVendeurs, totalTransactions, platformRevenue]) => {
        res.json({
          totalUsers,
          totalVendeurs,
          totalTransactions,
          platformRevenue: platformRevenue || 0
        });
      });
    } else if (userRole === 'vendeur') {
      // Statistiques vendeur
      const queries = [
        // Produits actifs
        new Promise((resolve) => {
          db.get('SELECT COUNT(*) as total FROM products WHERE vendeur_id = ? AND is_active = 1', [userId], (err, row) => {
            if (err) {
              console.error('Erreur produits actifs:', err);
              resolve(0);
            } else {
              resolve(row?.total || 0);
            }
          });
        }),
        // Ventes totales
        new Promise((resolve) => {
          db.get('SELECT COUNT(*) as total FROM transactions WHERE to_user_id = ? AND type = "achat" AND created_at >= ?', [userId, startDate.toISOString()], (err, row) => {
            if (err) {
              console.error('Erreur ventes totales:', err);
              resolve(0);
            } else {
              resolve(row?.total || 0);
            }
          });
        }),
        // Chiffre d'affaires
        new Promise((resolve) => {
          db.get('SELECT SUM(amount - fee) as total FROM transactions WHERE to_user_id = ? AND type = "achat" AND created_at >= ?', [userId, startDate.toISOString()], (err, row) => {
            if (err) {
              console.error('Erreur chiffre affaires:', err);
              resolve(0);
            } else {
              resolve(row?.total || 0);
            }
          });
        })
      ];

      Promise.all(queries).then(([totalProducts, totalSales, totalRevenue]) => {
        res.json({
          totalProducts,
          totalSales,
          totalRevenue: totalRevenue || 0
        });
      });
    } else {
      // Statistiques client
      const queries = [
        // Total dépensé
        new Promise((resolve) => {
          db.get('SELECT SUM(amount) as total FROM transactions WHERE from_user_id = ? AND created_at >= ?', [userId, startDate.toISOString()], (err, row) => {
            if (err) {
              console.error('Erreur total dépensé:', err);
              resolve(0);
            } else {
              resolve(row?.total || 0);
            }
          });
        }),
        // Nombre de transactions
        new Promise((resolve) => {
          db.get('SELECT COUNT(*) as total FROM transactions WHERE from_user_id = ? AND created_at >= ?', [userId, startDate.toISOString()], (err, row) => {
            if (err) {
              console.error('Erreur nombre transactions:', err);
              resolve(0);
            } else {
              resolve(row?.total || 0);
            }
          });
        })
      ];

      Promise.all(queries).then(([totalSpent, transactionsCount]) => {
        res.json({
          totalSpent: totalSpent || 0,
          transactionsCount
        });
      });
    }
  },

  // Obtenir les produits les plus populaires
  getTopProducts: (req, res) => {
    const { limit = 10 } = req.query;

    const sql = `
      SELECT 
        p.id,
        p.nom,
        p.categorie,
        COUNT(t.id) as sales,
        SUM(t.amount - t.fee) as revenue
      FROM products p
      LEFT JOIN transactions t ON p.id = t.product_id AND t.type = 'achat'
      WHERE p.is_active = 1
      GROUP BY p.id
      ORDER BY sales DESC
      LIMIT ?
    `;

    db.all(sql, [parseInt(limit)], (err, rows) => {
      if (err) {
        console.error('Erreur produits populaires:', err);
        return res.status(500).json({ error: 'Erreur lors de la récupération des produits' });
      }
      res.json({ products: rows });
    });
  },

  // Obtenir les données de vente
  getSalesData: (req, res) => {
    const { start_date, end_date } = req.query;
    const userId = req.user.id;

    const sql = `
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as transactions,
        SUM(amount) as amount,
        SUM(fee) as fees
      FROM transactions 
      WHERE created_at BETWEEN ? AND ?
      AND (from_user_id = ? OR to_user_id = ?)
      GROUP BY DATE(created_at)
      ORDER BY date
    `;

    const startDate = start_date || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const endDate = end_date || new Date().toISOString();

    db.all(sql, [startDate, endDate, userId, userId], (err, rows) => {
      if (err) {
        console.error('Erreur données vente:', err);
        return res.status(500).json({ error: 'Erreur lors de la récupération des données de vente' });
      }
      res.json({ salesData: rows });
    });
  },

  // Obtenir la croissance des utilisateurs
  getUserGrowth: (req, res) => {
    const { period = '1year' } = req.query;

    let interval = '1 month';
    switch (period) {
      case '7days':
        interval = '1 day';
        break;
      case '30days':
        interval = '1 day';
        break;
      case '90days':
        interval = '1 week';
        break;
      case '1year':
        interval = '1 month';
        break;
    }

    const sql = `
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as new_users
      FROM users 
      WHERE created_at >= datetime('now', '-${period}')
      GROUP BY DATE(created_at)
      ORDER BY date
    `;

    db.all(sql, [], (err, rows) => {
      if (err) {
        console.error('Erreur croissance utilisateurs:', err);
        return res.status(500).json({ error: 'Erreur récupération croissance utilisateurs' });
      }
      res.json({ userGrowth: rows });
    });
  },

  // Obtenir les données de revenus
  getRevenueData: (req, res) => {
    const { period = '6months' } = req.query;

    const sql = `
      SELECT 
        strftime('%Y-%m', created_at) as month,
        SUM(amount) as total_revenue,
        SUM(fee) as total_fees
      FROM transactions 
      WHERE created_at >= datetime('now', '-${period}')
      GROUP BY strftime('%Y-%m', created_at)
      ORDER BY month
    `;

    db.all(sql, [], (err, rows) => {
      if (err) {
        console.error('Erreur données revenus:', err);
        return res.status(500).json({ error: 'Erreur récupération données revenus' });
      }
      res.json({ revenueData: rows });
    });
  }
};

module.exports = analyticsController;