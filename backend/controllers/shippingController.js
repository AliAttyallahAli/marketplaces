const db = require('../config/database');

const shippingController = {
  // Obtenir toutes les expéditions
  getShipments: (req, res) => {
    const userId = req.user.id;
    const userRole = req.user.role;

    let sql = '';
    let params = [];

    if (userRole === 'vendeur') {
      sql = `
        SELECT s.*, u.nom as customer_nom, u.prenom as customer_prenom
        FROM shipments s
        JOIN users u ON s.customer_phone = u.phone
        WHERE s.vendeur_id = ?
        ORDER BY s.created_at DESC
      `;
      params = [userId];
    } else {
      sql = `
        SELECT s.*, u.nom as vendeur_nom, u.prenom as vendeur_prenom
        FROM shipments s
        JOIN users u ON s.vendeur_id = u.id
        WHERE s.customer_phone = ?
        ORDER BY s.created_at DESC
      `;
      params = [req.user.phone];
    }

    db.all(sql, params, (err, rows) => {
      if (err) {
        console.error('Erreur récupération expéditions:', err);
        return res.status(500).json({ error: 'Erreur récupération expéditions' });
      }
      res.json({ shipments: rows });
    });
  },

  // Obtenir une expédition par ID
  getShipmentById: (req, res) => {
    const shipmentId = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role;

    let sql = '';
    let params = [shipmentId];

    if (userRole === 'vendeur') {
      sql = `
        SELECT s.*, u.nom as customer_nom, u.prenom as customer_prenom
        FROM shipments s
        JOIN users u ON s.customer_phone = u.phone
        WHERE s.id = ? AND s.vendeur_id = ?
      `;
      params = [shipmentId, userId];
    } else {
      sql = `
        SELECT s.*, u.nom as vendeur_nom, u.prenom as vendeur_prenom
        FROM shipments s
        JOIN users u ON s.vendeur_id = u.id
        WHERE s.id = ? AND s.customer_phone = ?
      `;
      params = [shipmentId, req.user.phone];
    }

    db.get(sql, params, (err, row) => {
      if (err) {
        console.error('Erreur récupération expédition:', err);
        return res.status(500).json({ error: 'Erreur récupération expédition' });
      }
      if (!row) {
        return res.status(404).json({ error: 'Expédition non trouvée' });
      }
      res.json({ shipment: row });
    });
  },

  // Obtenir les informations de suivi
  getTrackingInfo: (req, res) => {
    const shipmentId = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Vérifier l'accès à l'expédition
    let checkSql = '';
    let checkParams = [];

    if (userRole === 'vendeur') {
      checkSql = 'SELECT 1 FROM shipments WHERE id = ? AND vendeur_id = ?';
      checkParams = [shipmentId, userId];
    } else {
      checkSql = 'SELECT 1 FROM shipments WHERE id = ? AND customer_phone = ?';
      checkParams = [shipmentId, req.user.phone];
    }

    db.get(checkSql, checkParams, (err, hasAccess) => {
      if (err || !hasAccess) {
        return res.status(403).json({ error: 'Accès non autorisé à cette expédition' });
      }

      const sql = `
        SELECT st.* 
        FROM shipment_tracking st
        WHERE st.shipment_id = ?
        ORDER BY st.created_at ASC
      `;

      db.all(sql, [shipmentId], (err, rows) => {
        if (err) {
          console.error('Erreur récupération suivi:', err);
          return res.status(500).json({ error: 'Erreur récupération informations de suivi' });
        }
        res.json({ tracking: rows });
      });
    });
  },

  // Créer une expédition
  createShipment: (req, res) => {
    const {
      order_id,
      customer_name,
      customer_phone,
      customer_address,
      carrier,
      estimated_delivery
    } = req.body;

    const vendeur_id = req.user.id;

    // Générer un numéro de suivi
    const trackingNumber = 'ZD' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();

    const sql = `
      INSERT INTO shipments (
        order_id, vendeur_id, customer_name, customer_phone,
        customer_address, carrier, tracking_number, estimated_delivery
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(sql, [
      order_id, vendeur_id, customer_name, customer_phone,
      customer_address, carrier, tracking_number, estimated_delivery
    ], function(err) {
      if (err) {
        console.error('Erreur création expédition:', err);
        return res.status(500).json({ error: 'Erreur création expédition' });
      }

      // Ajouter le premier événement de suivi
      const trackingSql = `
        INSERT INTO shipment_tracking (shipment_id, status, description)
        VALUES (?, 'pending', 'Commande préparée pour l\'expédition')
      `;

      db.run(trackingSql, [this.lastID], (err) => {
        if (err) {
          console.error('Erreur création suivi:', err);
        }

        res.status(201).json({
          message: 'Expédition créée avec succès',
          shipmentId: this.lastID,
          trackingNumber: trackingNumber
        });
      });
    });
  },

  // Mettre à jour le statut d'une expédition
  updateStatus: (req, res) => {
    const shipmentId = req.params.id;
    const { status } = req.body;
    const vendeur_id = req.user.id;

    // Vérifier que l'expédition appartient au vendeur
    db.get('SELECT id FROM shipments WHERE id = ? AND vendeur_id = ?', [shipmentId, vendeur_id], (err, shipment) => {
      if (err || !shipment) {
        return res.status(403).json({ error: 'Non autorisé à modifier cette expédition' });
      }

      const sql = 'UPDATE shipments SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
      
      db.run(sql, [status, shipmentId], function(err) {
        if (err) {
          console.error('Erreur mise à jour statut:', err);
          return res.status(500).json({ error: 'Erreur mise à jour statut' });
        }

        // Ajouter un événement de suivi
        let description = '';
        switch (status) {
          case 'confirmed':
            description = 'Commande confirmée et en préparation';
            break;
          case 'in_transit':
            description = 'Colis en cours de transport';
            break;
          case 'out_for_delivery':
            description = 'Colis en cours de livraison';
            break;
          case 'delivered':
            description = 'Colis livré avec succès';
            break;
          case 'cancelled':
            description = 'Expédition annulée';
            break;
        }

        if (description) {
          db.run(
            'INSERT INTO shipment_tracking (shipment_id, status, description) VALUES (?, ?, ?)',
            [shipmentId, status, description]
          );
        }

        res.json({ message: 'Statut mis à jour avec succès' });
      });
    });
  },

  // Mettre à jour les informations de suivi
  updateTracking: (req, res) => {
    const shipmentId = req.params.id;
    const { status, location, description } = req.body;
    const vendeur_id = req.user.id;

    // Vérifier que l'expédition appartient au vendeur
    db.get('SELECT id FROM shipments WHERE id = ? AND vendeur_id = ?', [shipmentId, vendeur_id], (err, shipment) => {
      if (err || !shipment) {
        return res.status(403).json({ error: 'Non autorisé à modifier cette expédition' });
      }

      const sql = `
        INSERT INTO shipment_tracking (shipment_id, status, location, description)
        VALUES (?, ?, ?, ?)
      `;

      db.run(sql, [shipmentId, status, location, description], function(err) {
        if (err) {
          console.error('Erreur mise à jour suivi:', err);
          return res.status(500).json({ error: 'Erreur mise à jour suivi' });
        }

        // Mettre à jour le statut principal de l'expédition
        if (status) {
          db.run('UPDATE shipments SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [status, shipmentId]);
        }

        res.json({ message: 'Informations de suivi mises à jour' });
      });
    });
  }
};

module.exports = shippingController;