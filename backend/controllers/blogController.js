const db = require('../config/database');

const blogController = {
  // Récupérer toutes les publications
  getAllPosts: (req, res) => {
    const sql = `
      SELECT 
        bp.*,
        u.nom as auteur_nom,
        u.prenom as auteur_prenom,
        u.photo as auteur_photo
      FROM blog_posts bp
      JOIN users u ON bp.auteur_id = u.id
      WHERE bp.is_published = 1
      ORDER BY bp.created_at DESC
    `;

    db.all(sql, [], (err, rows) => {
      if (err) {
        console.error('Erreur récupération publications:', err);
        return res.status(500).json({ error: 'Erreur récupération publications' });
      }
      res.json({ posts: rows });
    });
  },

  // Récupérer mes publications
  getMyPosts: (req, res) => {
    const auteur_id = req.user.id;

    const sql = `
      SELECT 
        bp.*,
        u.nom as auteur_nom,
        u.prenom as auteur_prenom
      FROM blog_posts bp
      JOIN users u ON bp.auteur_id = u.id
      WHERE bp.auteur_id = ?
      ORDER BY bp.created_at DESC
    `;

    db.all(sql, [auteur_id], (err, rows) => {
      if (err) {
        console.error('Erreur récupération mes publications:', err);
        return res.status(500).json({ error: 'Erreur récupération publications' });
      }
      res.json({ posts: rows });
    });
  },

  // Récupérer une publication par ID
  getPostById: (req, res) => {
    const postId = req.params.id;

    const sql = `
      SELECT 
        bp.*,
        u.nom as auteur_nom,
        u.prenom as auteur_prenom,
        u.photo as auteur_photo
      FROM blog_posts bp
      JOIN users u ON bp.auteur_id = u.id
      WHERE bp.id = ? AND bp.is_published = 1
    `;

    db.get(sql, [postId], (err, row) => {
      if (err) {
        console.error('Erreur récupération publication:', err);
        return res.status(500).json({ error: 'Erreur récupération publication' });
      }
      if (!row) {
        return res.status(404).json({ error: 'Publication non trouvée' });
      }
      res.json({ post: row });
    });
  },

  // Créer une publication
  createPost: (req, res) => {
    const {
      titre,
      contenu,
      organisation_nom,
      contact,
      montant_publication = 0,
      fichier_url
    } = req.body;

    const auteur_id = req.user.id;

    // Vérifier si paiement requis
    if (montant_publication > 0) {
      // Vérifier le solde du wallet
      db.get('SELECT balance FROM wallets WHERE user_id = ?', [auteur_id], (err, wallet) => {
        if (err) {
          console.error('Erreur vérification solde:', err);
          return res.status(500).json({ error: 'Erreur vérification solde' });
        }

        if (!wallet || wallet.balance < montant_publication) {
          return res.status(400).json({ error: 'Solde insuffisant pour la publication' });
        }

        // Débiter le montant
        createPostWithPayment();
      });
    } else {
      createPostWithPayment();
    }

    function createPostWithPayment() {
      const sql = `
        INSERT INTO blog_posts (
          auteur_id, titre, contenu, organisation_nom, 
          contact, montant_publication, fichier_url, is_published
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 1)
      `;

      db.run(sql, [
        auteur_id, titre, contenu, organisation_nom,
        contact, montant_publication, fichier_url
      ], function(err) {
        if (err) {
          console.error('Erreur création publication:', err);
          return res.status(500).json({ error: 'Erreur création publication' });
        }

        if (montant_publication > 0) {
          // Débiter le wallet et créditer le marketplace
          debitWallet();
        } else {
          res.status(201).json({ 
            message: 'Publication créée avec succès',
            postId: this.lastID 
          });
        }
      });
    }

    function debitWallet() {
      const transactionData = {
        from_user_id: auteur_id,
        to_user_id: 1, // Admin/system
        from_wallet_phone: req.user.phone,
        to_wallet_phone: '+235600000001', // Wallet marketplace
        amount: parseFloat(montant_publication),
        fee: 0,
        type: 'publication',
        service_type: 'blog'
      };

      // Créer la transaction
      const sql = `
        INSERT INTO transactions (
          from_user_id, to_user_id, from_wallet_phone, to_wallet_phone,
          amount, fee, type, service_type, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'completed')
      `;

      db.run(sql, [
        transactionData.from_user_id,
        transactionData.to_user_id,
        transactionData.from_wallet_phone,
        transactionData.to_wallet_phone,
        transactionData.amount,
        transactionData.fee,
        transactionData.type,
        transactionData.service_type
      ], function(err) {
        if (err) {
          console.error('Erreur transaction publication:', err);
          return res.status(500).json({ error: 'Erreur transaction publication' });
        }

        // Mettre à jour les soldes
        db.run('UPDATE wallets SET balance = balance - ? WHERE user_id = ?', 
          [montant_publication, auteur_id]);
        
        db.run('UPDATE wallets SET balance = balance + ? WHERE user_id = ?', 
          [montant_publication, 1]);

        res.status(201).json({ 
          message: 'Publication créée avec succès',
          postId: this.lastID 
        });
      });
    }
  },

  // Mettre à jour une publication
  updatePost: (req, res) => {
    const postId = req.params.id;
    const auteur_id = req.user.id;
    const { titre, contenu, organisation_nom, contact, fichier_url } = req.body;

    // Vérifier que l'utilisateur est l'auteur
    db.get('SELECT auteur_id FROM blog_posts WHERE id = ?', [postId], (err, post) => {
      if (err) {
        console.error('Erreur vérification publication:', err);
        return res.status(500).json({ error: 'Erreur vérification publication' });
      }
      if (!post) {
        return res.status(404).json({ error: 'Publication non trouvée' });
      }
      if (post.auteur_id !== auteur_id && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Non autorisé à modifier cette publication' });
      }

      const sql = `
        UPDATE blog_posts SET 
          titre = ?, contenu = ?, organisation_nom = ?, 
          contact = ?, fichier_url = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;

      db.run(sql, [titre, contenu, organisation_nom, contact, fichier_url, postId], function(err) {
        if (err) {
          console.error('Erreur mise à jour publication:', err);
          return res.status(500).json({ error: 'Erreur mise à jour publication' });
        }
        res.json({ message: 'Publication mise à jour avec succès' });
      });
    });
  },

  // Supprimer une publication
  deletePost: (req, res) => {
    const postId = req.params.id;
    const auteur_id = req.user.id;

    // Vérifier que l'utilisateur est l'auteur ou admin
    db.get('SELECT auteur_id FROM blog_posts WHERE id = ?', [postId], (err, post) => {
      if (err) {
        console.error('Erreur vérification publication:', err);
        return res.status(500).json({ error: 'Erreur vérification publication' });
      }
      if (!post) {
        return res.status(404).json({ error: 'Publication non trouvée' });
      }
      if (post.auteur_id !== auteur_id && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Non autorisé à supprimer cette publication' });
      }

      db.run('DELETE FROM blog_posts WHERE id = ?', [postId], function(err) {
        if (err) {
          console.error('Erreur suppression publication:', err);
          return res.status(500).json({ error: 'Erreur suppression publication' });
        }
        res.json({ message: 'Publication supprimée avec succès' });
      });
    });
  }
};

module.exports = blogController;