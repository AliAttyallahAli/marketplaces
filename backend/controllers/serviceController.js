const Service = require('../models/Service');

exports.getServices = (req, res) => {
    Service.findAll((err, services) => {
        if (err) return res.status(500).json({ error: 'Erreur récupération services' });

        res.json({ services });
    });
};

exports.getServicesByType = (req, res) => {
    const type = req.params.type;

    Service.findByType(type, (err, services) => {
        if (err) return res.status(500).json({ error: 'Erreur récupération services' });

        res.json({ services });
    });
};

exports.createService = (req, res) => {
    const { nom, type, entreprise_nom, chef_nom, chef_phone, description, logo } = req.body;

    Service.create({
        nom, type, entreprise_nom, chef_nom, chef_phone, description, logo
    }, (err, serviceId) => {
        if (err) return res.status(500).json({ error: 'Erreur création service' });

        res.status(201).json({ 
            message: 'Service créé avec succès',
            serviceId 
        });
    });
};

exports.updateService = (req, res) => {
    const serviceId = req.params.id;
    const updateData = req.body;

    Service.update(serviceId, updateData, (err) => {
        if (err) return res.status(500).json({ error: 'Erreur mise à jour service' });

        res.json({ message: 'Service mis à jour avec succès' });
    });
};