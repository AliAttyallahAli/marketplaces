const db = require('../config/database');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const PDFGenerator = require('../utils/pdfGenerator');
const emailService = require('../utils/emailService');

exports.getProfile = (req, res) => {
  const userId = req.user.id;

  const userSql = `
    SELECT 
      id, nni, phone, email, role, nom, prenom, date_naissance, 
      lieu_naissance, province, region, ville, quartier, photo,
      kyc_verified, kyb_verified, created_at, updated_at
    FROM users 
    WHERE id = ?
  `;

  const walletSql = 'SELECT * FROM wallets WHERE user_id = ?';

  db.get(userSql, [userId], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur récupération profil' });
    }
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    db.get(walletSql, [userId], (err, wallet) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur récupération wallet' });
      }

      // Récupérer les statistiques
      getProfileStats(userId, (err, stats) => {
        if (err) {
          console.error('Erreur stats profil:', err);
        }

        res.json({
          user: {
            ...user,
            wallet: wallet || null,
            stats: stats || {}
          }
        });
      });
    });
  });
};

exports.updateProfile = (req, res) => {
  const userId = req.user.id;
  const {
    nom, prenom, date_naissance, lieu_naissance,
    province, region, ville, quartier, photo
  } = req.body;

  const sql = `
    UPDATE users SET 
      nom = ?, prenom = ?, date_naissance = ?, lieu_naissance = ?,
      province = ?, region = ?, ville = ?, quartier = ?, photo = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  db.run(sql, [
    nom, prenom, date_naissance, lieu_naissance,
    province, region, ville, quartier, photo, userId
  ], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Erreur mise à jour profil' });
    }

    res.json({ message: 'Profil mis à jour avec succès' });
  });
};

exports.changePassword = (req, res) => {
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
      return res.status(500).json({ error: 'Erreur vérification mot de passe' });
    }

    if (!bcrypt.compareSync(currentPassword, user.password)) {
      return res.status(400).json({ error: 'Mot de passe actuel incorrect' });
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    db.run('UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', 
      [hashedPassword, userId], function(err) {
        if (err) {
          return res.status(500).json({ error: 'Erreur changement mot de passe' });
        }

        // Envoyer un email de notification
        db.get('SELECT email, nom, prenom FROM users WHERE id = ?', [userId], (err, user) => {
          if (!err && user) {
            emailService.sendPasswordChangeNotification(user);
          }
        });

        res.json({ message: 'Mot de passe changé avec succès' });
      });
  });
};

exports.uploadProfilePhoto = (req, res) => {
  const userId = req.user.id;

  if (!req.file) {
    return res.status(400).json({ error: 'Aucun fichier uploadé' });
  }

  const photoUrl = `/uploads/${req.file.filename}`;

  db.run('UPDATE users SET photo = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', 
    [photoUrl, userId], function(err) {
      if (err) {
        return res.status(500).json({ error: 'Erreur mise à jour photo' });
      }

      res.json({ 
        message: 'Photo de profil mise à jour avec succès',
        photoUrl 
      });
    });
};

exports.submitKYC = (req, res) => {
  const userId = req.user.id;
  const {
    piece_identite_url,
    photo_identite_url, 
    selfie_url,
    justificatif_domicile_url
  } = req.body;

  // Vérifier que les documents requis sont fournis
  if (!piece_identite_url || !photo_identite_url || !selfie_url) {
    return res.status(400).json({ error: 'Documents KYC requis manquants' });
  }

  const kycData = {
    piece_identite_url,
    photo_identite_url,
    selfie_url,
    justificatif_domicile_url,
    submitted_at: new Date().toISOString(),
    status: 'pending'
  };

  const sql = `
    UPDATE users SET 
      kyc_data = ?,
      kyc_verified = 0,
      kyc_submitted_at = CURRENT_TIMESTAMP,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  db.run(sql, [JSON.stringify(kycData), userId], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Erreur soumission KYC' });
    }

    // Notifier l'administration
    notifyAdminKYCSubmission(userId);

    res.json({ 
      message: 'Documents KYC soumis avec succès. Vérification en cours.',
      kycData 
    });
  });
};

exports.submitKYB = (req, res) => {
  const userId = req.user.id;
  const userRole = req.user.role;

  if (userRole !== 'vendeur') {
    return res.status(403).json({ error: 'Réservé aux vendeurs' });
  }

  const {
    registre_commerce_url,
    attestation_fiscale_url,
    identification_chef_url,
    autres_documents_urls = []
  } = req.body;

  if (!registre_commerce_url || !attestation_fiscale_url || !identification_chef_url) {
    return res.status(400).json({ error: 'Documents KYB requis manquants' });
  }

  const kybData = {
    registre_commerce_url,
    attestation_fiscale_url,
    identification_chef_url,
    autres_documents_urls,
    submitted_at: new Date().toISOString(),
    status: 'pending'
  };

  const sql = `
    UPDATE users SET 
      kyb_data = ?,
      kyb_verified = 0,
      kyb_submitted_at = CURRENT_TIMESTAMP,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  db.run(sql, [JSON.stringify(kybData), userId], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Erreur soumission KYB' });
    }

    // Notifier l'administration
    notifyAdminKYBSubmission(userId);

    res.json({ 
      message: 'Documents KYB soumis avec succès. Vérification en cours.',
      kybData 
    });
  });
};

exports.upgradeToVendeur = (req, res) => {
  const userId = req.user.id;
  const {
    nom, prenom, date_naissance, lieu_naissance,
    province, region, ville, quartier
  } = req.body;

  // Vérifier si l'utilisateur a déjà un rôle vendeur
  db.get('SELECT role FROM users WHERE id = ?', [userId], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur vérification rôle' });
    }

    if (user.role === 'vendeur') {
      return res.status(400).json({ error: 'Vous êtes déjà vendeur' });
    }

    const sql = `
      UPDATE users SET 
        nom = ?, prenom = ?, date_naissance = ?, lieu_naissance = ?,
        province = ?, region = ?, ville = ?, quartier = ?,
        role = 'vendeur', updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    db.run(sql, [
      nom, prenom, date_naissance, lieu_naissance,
      province, region, ville, quartier, userId
    ], function(err) {
      if (err) {
        return res.status(500).json({ error: 'Erreur mise à jour profil vendeur' });
      }

      // Créer un abonnement gratuit d'essai
      createTrialSubscription(userId);

      res.json({ 
        message: 'Félicitations ! Vous êtes maintenant vendeur sur ZouDou-Souk.',
        role: 'vendeur'
      });
    });
  });
};

exports.generateVisaCard = (req, res) => {
  const userId = req.user.id;

  // Récupérer les informations utilisateur
  const userSql = `
    SELECT u.*, w.phone as wallet_phone 
    FROM users u 
    LEFT JOIN wallets w ON u.id = w.user_id 
    WHERE u.id = ?
  `;

  db.get(userSql, [userId], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur génération carte' });
    }

    const outputPath = `./uploads/visa_${user.phone}_${Date.now()}.pdf`;

    PDFGenerator.generateVisaCard(user, user, outputPath)
      .then(filePath => {
        const downloadUrl = `/uploads/${filePath.split('/').pop()}`;
        
        res.json({
          message: 'Carte Visa générée avec succès',
          downloadUrl,
          cardInfo: {
            cardNumber: user.wallet_phone.replace(/\D/g, '').padEnd(16, '0'),
            holderName: `${user.prenom} ${user.nom}`.toUpperCase(),
            expiryDate: new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000) // 2 ans
          }
        });
      })
      .catch(error => {
        console.error('Erreur génération PDF:', error);
        res.status(500).json({ error: 'Erreur génération carte Visa' });
      });
  });
};

exports.getActivityHistory = (req, res) => {
  const userId = req.user.id;
  const { limit = 50, offset = 0 } = req.query;

  const sql = `
    SELECT 
      'transaction' as type,
      id as item_id,
      type as sub_type,
      amount,
      created_at,
      status
    FROM transactions 
    WHERE from_user_id = ? OR to_user_id = ?
    
    UNION ALL
    
    SELECT 
      'product_view' as type,
      id as item_id,
      'view' as sub_type,
      NULL as amount,
      viewed_at as created_at,
      NULL as status
    FROM product_views 
    WHERE user_id = ?
    
    UNION ALL
    
    SELECT 
      'login' as type,
      id as item_id,
      'success' as sub_type,
      NULL as amount,
      login_at as created_at,
      NULL as status
    FROM login_history 
    WHERE user_id = ?
    
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
  `;

  db.all(sql, [userId, userId, userId, userId, parseInt(limit), parseInt(offset)], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur récupération historique' });
    }

    res.json({ activities: rows });
  });
};

exports.exportData = (req, res) => {
  const userId = req.user.id;
  const { dataType = 'profile' } = req.query;

  switch (dataType) {
    case 'profile':
      exportProfileData(userId, res);
      break;
    case 'transactions':
      exportTransactionsData(userId, res);
      break;
    case 'products':
      exportProductsData(userId, res);
      break;
    default:
      res.status(400).json({ error: 'Type de données non supporté' });
  }
};

// Fonctions helper
function getProfileStats(userId, callback) {
  const queries = {
    totalTransactions: `
      SELECT COUNT(*) as count FROM transactions 
      WHERE from_user_id = ? OR to_user_id = ?
    `,
    totalProducts: `
      SELECT COUNT(*) as count FROM products 
      WHERE vendeur_id = ? AND is_active = 1
    `,
    totalSpent: `
      SELECT COALESCE(SUM(amount), 0) as total FROM transactions 
      WHERE from_user_id = ? AND status = 'completed'
    `,
    totalEarned: `
      SELECT COALESCE(SUM(amount - fee), 0) as total FROM transactions 
      WHERE to_user_id = ? AND status = 'completed'
    `,
    lastLogin: `
      SELECT MAX(login_at) as last_login FROM login_history 
      WHERE user_id = ?
    `
  };

  const stats = {};
  let completedQueries = 0;
  const totalQueries = Object.keys(queries).length;

  Object.keys(queries).forEach(key => {
    const isUserSpecific = queries[key].includes('?');
    const params = isUserSpecific ? [userId, userId] : [];

    db.get(queries[key], params, (err, row) => {
      if (!err) {
        stats[key] = row?.count || row?.total || row?.last_login || 0;
      }
      completedQueries++;

      if (completedQueries === totalQueries) {
        callback(null, stats);
      }
    });
  });
}

function notifyAdminKYCSubmission(userId) {
  const sql = `
    SELECT u.nom, u.prenom, u.email 
    FROM users u 
    WHERE u.id = ?
  `;

  db.get(sql, [userId], (err, user) => {
    if (!err && user) {
      // Ici, on pourrait envoyer une notification aux administrateurs
      console.log(`KYC soumis par: ${user.prenom} ${user.nom} (${user.email})`);
      
      // Envoyer un email à l'utilisateur
      emailService.sendKYCSubmissionConfirmation(user);
    }
  });
}

function notifyAdminKYBSubmission(userId) {
  const sql = `
    SELECT u.nom, u.prenom, u.email 
    FROM users u 
    WHERE u.id = ?
  `;

  db.get(sql, [userId], (err, user) => {
    if (!err && user) {
      console.log(`KYB soumis par: ${user.prenom} ${user.nom} (${user.email})`);
      emailService.sendKYBSubmissionConfirmation(user);
    }
  });
}

function createTrialSubscription(userId) {
  const trialEndDate = new Date();
  trialEndDate.setDate(trialEndDate.getDate() + 14); // 14 jours d'essai

  const sql = `
    INSERT INTO subscriptions (vendeur_id, type, amount, start_date, end_date, status, is_trial)
    VALUES (?, 'trial', 0, CURRENT_TIMESTAMP, ?, 'active', 1)
  `;

  db.run(sql, [userId, trialEndDate.toISOString()], (err) => {
    if (err) {
      console.error('Erreur création abonnement essai:', err);
    }
  });
}

function exportProfileData(userId, res) {
  const sql = `
    SELECT 
      u.*,
      w.balance,
      w.phone as wallet_phone,
      (SELECT COUNT(*) FROM products WHERE vendeur_id = u.id) as products_count,
      (SELECT COUNT(*) FROM transactions WHERE from_user_id = u.id OR to_user_id = u.id) as transactions_count
    FROM users u
    LEFT JOIN wallets w ON u.id = w.user_id
    WHERE u.id = ?
  `;

  db.get(sql, [userId], (err, userData) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur export données profil' });
    }

    // Générer un PDF avec les données
    const outputPath = `./uploads/profile_export_${userId}_${Date.now()}.pdf`;
    
    PDFGenerator.generateProfileExport(userData, outputPath)
      .then(filePath => {
        const downloadUrl = `/uploads/${filePath.split('/').pop()}`;
        res.json({ downloadUrl });
      })
      .catch(error => {
        console.error('Erreur génération export:', error);
        res.status(500).json({ error: 'Erreur génération export' });
      });
  });
}

function exportTransactionsData(userId, res) {
  const sql = `
    SELECT * FROM transactions 
    WHERE from_user_id = ? OR to_user_id = ?
    ORDER BY created_at DESC
  `;

  db.all(sql, [userId, userId], (err, transactions) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur export transactions' });
    }

    const outputPath = `./uploads/transactions_export_${userId}_${Date.now()}.pdf`;
    
    PDFGenerator.generateTransactionsExport(transactions, outputPath)
      .then(filePath => {
        const downloadUrl = `/uploads/${filePath.split('/').pop()}`;
        res.json({ downloadUrl });
      })
      .catch(error => {
        console.error('Erreur génération export transactions:', error);
        res.status(500).json({ error: 'Erreur génération export transactions' });
      });
  });
}

function exportProductsData(userId, res) {
  const sql = 'SELECT * FROM products WHERE vendeur_id = ? ORDER BY created_at DESC';

  db.all(sql, [userId], (err, products) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur export produits' });
    }

    const outputPath = `./uploads/products_export_${userId}_${Date.now()}.pdf`;
    
    PDFGenerator.generateProductsExport(products, outputPath)
      .then(filePath => {
        const downloadUrl = `/uploads/${filePath.split('/').pop()}`;
        res.json({ downloadUrl });
      })
      .catch(error => {
        console.error('Erreur génération export produits:', error);
        res.status(500).json({ error: 'Erreur génération export produits' });
      });
  });
}