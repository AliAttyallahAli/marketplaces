const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Middleware d'authentification
const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Accès non autorisé' });
  }
  // Vérifier le token (simplifié pour l'exemple)
  next();
};

// Obtenir les notifications de l'utilisateur
router.get('/', authenticate, (req, res) => {
  const userId = req.user.id; // À adapter selon votre système d'auth
  const { page = 1, limit = 20, unread_only = false, category } = req.query;
  const offset = (page - 1) * limit;

  let query = `SELECT * FROM notifications WHERE user_id = ? AND is_archived = 0`;
  let params = [userId];

  if (unread_only === 'true') {
    query += ' AND is_read = 0';
  }

  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }

  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit), offset);

  db.all(query, params, (err, notifications) => {
    if (err) return res.status(500).json({ error: 'Erreur récupération notifications' });

    // Compter les notifications non lues
    db.get('SELECT COUNT(*) as unread_count FROM notifications WHERE user_id = ? AND is_read = 0 AND is_archived = 0', 
      [userId], (err, count) => {
      if (err) return res.status(500).json({ error: 'Erreur comptage notifications' });

      res.json({
        notifications,
        unread_count: count.unread_count,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: notifications.length
        }
      });
    });
  });
});

// Marquer une notification comme lue
router.post('/:id/read', authenticate, (req, res) => {
  const userId = req.user.id;
  const notificationId = req.params.id;

  db.run('UPDATE notifications SET is_read = 1, read_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?',
    [notificationId, userId], function(err) {
    if (err) return res.status(500).json({ error: 'Erreur mise à jour notification' });
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Notification non trouvée' });
    }

    res.json({ message: 'Notification marquée comme lue' });
  });
});

// Marquer toutes les notifications comme lues
router.post('/read-all', authenticate, (req, res) => {
  const userId = req.user.id;

  db.run('UPDATE notifications SET is_read = 1, read_at = CURRENT_TIMESTAMP WHERE user_id = ? AND is_read = 0',
    [userId], function(err) {
    if (err) return res.status(500).json({ error: 'Erreur mise à jour notifications' });

    res.json({ 
      message: 'Toutes les notifications marquées comme lues',
      updated_count: this.changes
    });
  });
});

// Archiver une notification
router.post('/:id/archive', authenticate, (req, res) => {
  const userId = req.user.id;
  const notificationId = req.params.id;

  db.run('UPDATE notifications SET is_archived = 1 WHERE id = ? AND user_id = ?',
    [notificationId, userId], function(err) {
    if (err) return res.status(500).json({ error: 'Erreur archivage notification' });
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Notification non trouvée' });
    }

    res.json({ message: 'Notification archivée' });
  });
});

// Obtenir les préférences de notifications
router.get('/preferences', authenticate, (req, res) => {
  const userId = req.user.id;

  db.get('SELECT * FROM notification_preferences WHERE user_id = ?', [userId], (err, preferences) => {
    if (err) return res.status(500).json({ error: 'Erreur récupération préférences' });

    if (!preferences) {
      // Créer des préférences par défaut
      const defaultPreferences = {
        user_id: userId,
        email_notifications: 1,
        push_notifications: 1,
        sms_notifications: 0,
        categories: JSON.stringify(['transaction', 'security', 'system']),
        quiet_hours_start: '22:00',
        quiet_hours_end: '08:00'
      };

      db.run(`INSERT INTO notification_preferences 
              (user_id, email_notifications, push_notifications, sms_notifications, categories, quiet_hours_start, quiet_hours_end) 
              VALUES (?, ?, ?, ?, ?, ?, ?)`,
        Object.values(defaultPreferences), function(err) {
        if (err) return res.status(500).json({ error: 'Erreur création préférences' });

        res.json({ preferences: defaultPreferences });
      });
    } else {
      preferences.categories = JSON.parse(preferences.categories || '[]');
      res.json({ preferences });
    }
  });
});

// Mettre à jour les préférences
router.put('/preferences', authenticate, (req, res) => {
  const userId = req.user.id;
  const { email_notifications, push_notifications, sms_notifications, categories, quiet_hours_start, quiet_hours_end } = req.body;

  db.run(`UPDATE notification_preferences SET 
          email_notifications = ?, push_notifications = ?, sms_notifications = ?, 
          categories = ?, quiet_hours_start = ?, quiet_hours_end = ?,
          updated_at = CURRENT_TIMESTAMP 
          WHERE user_id = ?`,
    [email_notifications, push_notifications, sms_notifications, 
     JSON.stringify(categories), quiet_hours_start, quiet_hours_end, userId],
    function(err) {
      if (err) return res.status(500).json({ error: 'Erreur mise à jour préférences' });

      res.json({ message: 'Préférences mises à jour avec succès' });
    }
  );
});

// Créer une notification (pour usage interne)
router.post('/', authenticate, (req, res) => {
  const { user_id, title, message, type, category, action_url, action_label, image_url, data, expires_at } = req.body;

  db.run(`INSERT INTO notifications 
          (user_id, title, message, type, category, action_url, action_label, image_url, data, expires_at) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [user_id, title, message, type, category, action_url, action_label, image_url, JSON.stringify(data), expires_at],
    function(err) {
      if (err) return res.status(500).json({ error: 'Erreur création notification' });

      res.status(201).json({ 
        message: 'Notification créée avec succès',
        notificationId: this.lastID 
      });
    }
  );
});

// Statistiques notifications (admin)
router.get('/stats', authenticate, (req, res) => {
  // Vérifier que l'utilisateur est admin
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: 'Accès non autorisé' });
  }

  const statsQuery = `
    SELECT 
      (SELECT COUNT(*) FROM notifications) as total_notifications,
      (SELECT COUNT(*) FROM notifications WHERE is_read = 0) as unread_notifications,
      (SELECT COUNT(*) FROM notifications WHERE created_at >= datetime('now', '-1 day')) as today_notifications,
      (SELECT COUNT(*) FROM notifications WHERE type = 'transaction') as transaction_notifications,
      (SELECT COUNT(*) FROM notifications WHERE type = 'promo') as promo_notifications
  `;

  db.get(statsQuery, (err, stats) => {
    if (err) return res.status(500).json({ error: 'Erreur statistiques' });
    res.json({ stats });
  });
});

module.exports = router;