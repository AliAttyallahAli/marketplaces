const db = require('../config/database');
const bcrypt = require('bcryptjs');

const userController = {
  // Obtenir le profil de l'utilisateur connecté
  getProfile: (req, res) => {
    const userId = req.user.id;

    db.get('SELECT * FROM users WHERE id = ?', [userId], (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur base de données' });
      }
      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }

      // Ne pas renvoyer le mot de passe
      delete user.password;

      // Récupérer le wallet de l'utilisateur
      db.get('SELECT * FROM wallets WHERE user_id = ?', [userId], (err, wallet) => {
        if (err) {
          return res.status(500).json({ error: 'Erreur récupération wallet' });
        }

        res.json({
          user: {
            ...user,
            wallet: wallet || null
          }
        });
      });
    });
  },

  // Mettre à jour le profil
  updateProfile: (req, res) => {
    const userId = req.user.id;
    const {
      nom, prenom, date_naissance, lieu_naissance,
      province, region, ville, quartier, photo
    } = req.body;

    db.run(
      `UPDATE users SET 
        nom = ?, prenom = ?, date_naissance = ?, lieu_naissance = ?,
        province = ?, region = ?, ville = ?, quartier = ?, photo = ?,
        updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [nom, prenom, date_naissance, lieu_naissance, province, region, ville, quartier, photo, userId],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Erreur mise à jour profil' });
        }

        res.json({ message: 'Profil mis à jour avec succès' });
      }
    );
  },

  // Changer le mot de passe
  changePassword: (req, res) => {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 6 caractères' });
    }

    // Vérifier l'ancien mot de passe
    db.get('SELECT password FROM users WHERE id = ?', [userId], (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur base de données' });
      }

      if (!bcrypt.compareSync(currentPassword, user.password)) {
        return res.status(400).json({ error: 'Mot de passe actuel incorrect' });
      }

      // Hasher le nouveau mot de passe
      const hashedPassword = bcrypt.hashSync(newPassword, 10);

      db.run(
        'UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [hashedPassword, userId],
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Erreur changement mot de passe' });
          }

          res.json({ message: 'Mot de passe changé avec succès' });
        }
      );
    });
  },

  // Obtenir tous les utilisateurs (admin)
  getAllUsers: (req, res) => {
    db.all('SELECT id, nni, phone, email, role, nom, prenom, kyc_verified, kyb_verified, created_at FROM users ORDER BY created_at DESC', 
      (err, users) => {
        if (err) {
          return res.status(500).json({ error: 'Erreur récupération utilisateurs' });
        }

        res.json({ users });
      }
    );
  },

  // Obtenir tous les vendeurs
  getAllVendeurs: (req, res) => {
    db.all(`SELECT id, nni, phone, email, role, nom, prenom, province, ville, 
                   kyc_verified, kyb_verified, created_at 
            FROM users WHERE role = 'vendeur' ORDER BY created_at DESC`, 
      (err, vendeurs) => {
        if (err) {
          return res.status(500).json({ error: 'Erreur récupération vendeurs' });
        }

        res.json({ vendeurs });
      }
    );
  },

  // Obtenir les détails d'un utilisateur (admin)
  getUserDetails: (req, res) => {
    const userId = req.params.id;

    db.get(`SELECT u.*, w.balance, w.phone as wallet_phone
            FROM users u 
            LEFT JOIN wallets w ON u.id = w.user_id 
            WHERE u.id = ?`, [userId], (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur base de données' });
      }
      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }

      delete user.password;
      res.json({ user });
    });
  },

  // Vérifier KYC (admin)
  verifyKYC: (req, res) => {
    const userId = req.params.id;

    db.run('UPDATE users SET kyc_verified = 1 WHERE id = ?', [userId], function(err) {
      if (err) {
        return res.status(500).json({ error: 'Erreur vérification KYC' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }

      res.json({ message: 'KYC vérifié avec succès' });
    });
  },

  // Vérifier KYB (admin)
  verifyKYB: (req, res) => {
    const userId = req.params.id;

    db.run('UPDATE users SET kyb_verified = 1 WHERE id = ?', [userId], function(err) {
      if (err) {
        return res.status(500).json({ error: 'Erreur vérification KYB' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }

      res.json({ message: 'KYB vérifié avec succès' });
    });
  },

  // Mettre à jour les préférences de notification
  updateNotificationPreferences: (req, res) => {
    const userId = req.user.id;
    const { preferences } = req.body;

    db.run(
      'UPDATE users SET notification_preferences = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [JSON.stringify(preferences), userId],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Erreur mise à jour préférences' });
        }

        res.json({ message: 'Préférences mises à jour avec succès' });
      }
    );
  },

  // Désactiver le compte
  deactivateAccount: (req, res) => {
    const userId = req.user.id;
    const { reason } = req.body;

    db.run(
      'UPDATE users SET is_active = 0, deactivation_reason = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [reason, userId],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Erreur désactivation compte' });
        }

        res.json({ message: 'Compte désactivé avec succès' });
      }
    );
  }
};

module.exports = userController;