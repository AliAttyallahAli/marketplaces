const db = require('../config/database');

const serviceController = {
  // Obtenir tous les services
  getServices: (req, res) => {
    db.all('SELECT * FROM services WHERE is_active = 1 ORDER BY nom', (err, services) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur récupération services' });
      }

      // Parser les champs JSON
      const formattedServices = services.map(service => ({
        ...service,
        categories: service.categories ? JSON.parse(service.categories) : [],
        zones_couvertes: service.zones_couvertes ? JSON.parse(service.zones_couvertes) : [],
        documents: service.documents ? JSON.parse(service.documents) : []
      }));

      res.json({ services: formattedServices });
    });
  },

  // Obtenir les services par type
  getServicesByType: (req, res) => {
    const { type } = req.params;

    db.all('SELECT * FROM services WHERE type = ? AND is_active = 1 ORDER BY nom', [type], (err, services) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur récupération services' });
      }

      const formattedServices = services.map(service => ({
        ...service,
        categories: service.categories ? JSON.parse(service.categories) : [],
        zones_couvertes: service.zones_couvertes ? JSON.parse(service.zones_couvertes) : []
      }));

      res.json({ services: formattedServices });
    });
  },

  // Créer un nouveau service
  createService: (req, res) => {
    const {
      nom, type, entreprise_nom, chef_nom, chef_phone, chef_email,
      description, logo, website, api_endpoint, commission_rate,
      categories, zones_couvertes, documents
    } = req.body;

    const created_by = req.user.id;

    db.run(
      `INSERT INTO services (
        nom, type, entreprise_nom, chef_nom, chef_phone, chef_email,
        description, logo, website, api_endpoint, commission_rate,
        categories, zones_couvertes, documents, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nom, type, entreprise_nom, chef_nom, chef_phone, chef_email,
        description, logo, website, api_endpoint, commission_rate || 0,
        JSON.stringify(categories || []),
        JSON.stringify(zones_couvertes || []),
        JSON.stringify(documents || []),
        created_by
      ],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Erreur création service' });
        }

        res.status(201).json({ 
          message: 'Service créé avec succès',
          serviceId: this.lastID 
        });
      }
    );
  },

  // Mettre à jour un service
  updateService: (req, res) => {
    const serviceId = req.params.id;
    const {
      nom, type, entreprise_nom, chef_nom, chef_phone, chef_email,
      description, logo, website, api_endpoint, commission_rate,
      categories, zones_couvertes, documents, is_active
    } = req.body;

    db.run(
      `UPDATE services SET 
        nom = ?, type = ?, entreprise_nom = ?, chef_nom = ?, chef_phone = ?, chef_email = ?,
        description = ?, logo = ?, website = ?, api_endpoint = ?, commission_rate = ?,
        categories = ?, zones_couvertes = ?, documents = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        nom, type, entreprise_nom, chef_nom, chef_phone, chef_email,
        description, logo, website, api_endpoint, commission_rate,
        JSON.stringify(categories || []),
        JSON.stringify(zones_couvertes || []),
        JSON.stringify(documents || []),
        is_active, serviceId
      ],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Erreur mise à jour service' });
        }

        if (this.changes === 0) {
          return res.status(404).json({ error: 'Service non trouvé' });
        }

        res.json({ message: 'Service mis à jour avec succès' });
      }
    );
  },

  // Supprimer un service (soft delete)
  deleteService: (req, res) => {
    const serviceId = req.params.id;

    db.run(
      'UPDATE services SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [serviceId],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Erreur suppression service' });
        }

        if (this.changes === 0) {
          return res.status(404).json({ error: 'Service non trouvé' });
        }

        res.json({ message: 'Service supprimé avec succès' });
      }
    );
  }
};

module.exports = serviceController;