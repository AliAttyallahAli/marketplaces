const express = require('express');
const router = express.Router();
const db = require('../config/database');

// S'abonner à la newsletter
router.post('/subscribe', async (req, res) => {
  const { email, nom, phone, user_id, preferences } = req.body;

  try {
    // Vérifier si déjà abonné
    db.get('SELECT * FROM newsletter_subscribers WHERE email = ?', [email], (err, existing) => {
      if (err) return res.status(500).json({ error: 'Erreur base de données' });
      
      if (existing) {
        if (existing.status === 'unsubscribed') {
          // Réactiver l'abonnement
          db.run('UPDATE newsletter_subscribers SET status = "active", unsubscribe_date = NULL WHERE email = ?', 
            [email], function(err) {
            if (err) return res.status(500).json({ error: 'Erreur réactivation' });
            res.json({ message: 'Abonnement réactivé avec succès' });
          });
        } else {
          res.status(400).json({ error: 'Email déjà abonné' });
        }
      } else {
        // Nouvel abonnement
        db.run(`INSERT INTO newsletter_subscribers 
                (email, nom, phone, user_id, preferences) 
                VALUES (?, ?, ?, ?, ?)`,
          [email, nom, phone, user_id, JSON.stringify(preferences || {})],
          function(err) {
            if (err) return res.status(500).json({ error: 'Erreur inscription' });
            res.status(201).json({ 
              message: 'Inscription à la newsletter réussie',
              id: this.lastID 
            });
          }
        );
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Se désabonner
router.post('/unsubscribe', (req, res) => {
  const { email } = req.body;

  db.run('UPDATE newsletter_subscribers SET status = "unsubscribed", unsubscribe_date = CURRENT_TIMESTAMP WHERE email = ?',
    [email], function(err) {
    if (err) return res.status(500).json({ error: 'Erreur désabonnement' });
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Email non trouvé' });
    }
    
    res.json({ message: 'Désabonnement réussi' });
  });
});

// Obtenir les statistiques (admin)
router.get('/stats', (req, res) => {
  const statsQuery = `
    SELECT 
      (SELECT COUNT(*) FROM newsletter_subscribers WHERE status = 'active') as total_subscribers,
      (SELECT COUNT(*) FROM newsletter_subscribers WHERE status = 'unsubscribed') as total_unsubscribed,
      (SELECT COUNT(*) FROM newsletter_campaigns) as total_campaigns,
      (SELECT COUNT(*) FROM newsletter_campaigns WHERE status = 'sent') as sent_campaigns,
      (SELECT AVG(opened_count * 100.0 / total_recipients) FROM newsletter_campaigns WHERE status = 'sent' AND total_recipients > 0) as avg_open_rate
  `;

  db.get(statsQuery, (err, stats) => {
    if (err) return res.status(500).json({ error: 'Erreur statistiques' });
    res.json({ stats });
  });
});

// Lister les abonnés (admin)
router.get('/subscribers', (req, res) => {
  const { status = 'active', page = 1, limit = 50 } = req.query;
  const offset = (page - 1) * limit;

  db.all(`SELECT * FROM newsletter_subscribers 
          WHERE status = ? 
          ORDER BY subscription_date DESC 
          LIMIT ? OFFSET ?`,
    [status, limit, offset], (err, subscribers) => {
    if (err) return res.status(500).json({ error: 'Erreur liste abonnés' });
    
    // Compter le total
    db.get('SELECT COUNT(*) as total FROM newsletter_subscribers WHERE status = ?', 
      [status], (err, count) => {
      if (err) return res.status(500).json({ error: 'Erreur count' });
      
      res.json({
        subscribers,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count.total,
          totalPages: Math.ceil(count.total / limit)
        }
      });
    });
  });
});

// Créer une campagne (admin)
router.post('/campaigns', (req, res) => {
  const { title, subject, content, template, scheduled_for, created_by } = req.body;

  db.run(`INSERT INTO newsletter_campaigns 
          (title, subject, content, template, scheduled_for, created_by) 
          VALUES (?, ?, ?, ?, ?, ?)`,
    [title, subject, content, template, scheduled_for, created_by],
    function(err) {
      if (err) return res.status(500).json({ error: 'Erreur création campagne' });
      res.status(201).json({ 
        message: 'Campagne créée avec succès',
        campaignId: this.lastID 
      });
    }
  );
});

// Lister les campagnes (admin)
router.get('/campaigns', (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;

  let query = `SELECT nc.*, u.nom as created_by_name 
               FROM newsletter_campaigns nc 
               LEFT JOIN users u ON nc.created_by = u.id`;
  let params = [];

  if (status) {
    query += ' WHERE nc.status = ?';
    params.push(status);
  }

  query += ' ORDER BY nc.created_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  db.all(query, params, (err, campaigns) => {
    if (err) return res.status(500).json({ error: 'Erreur liste campagnes' });
    
    // Compter le total
    let countQuery = 'SELECT COUNT(*) as total FROM newsletter_campaigns';
    let countParams = [];
    
    if (status) {
      countQuery += ' WHERE status = ?';
      countParams.push(status);
    }

    db.get(countQuery, countParams, (err, count) => {
      if (err) return res.status(500).json({ error: 'Erreur count campagnes' });
      
      res.json({
        campaigns,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count.total,
          totalPages: Math.ceil(count.total / limit)
        }
      });
    });
  });
});

module.exports = router;