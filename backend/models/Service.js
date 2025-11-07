const db = require('../config/database');

class Service {
    static create(serviceData, callback) {
        const { nom, type, entreprise_nom, chef_nom, chef_phone, description, logo } = serviceData;

        const sql = `INSERT INTO services (
            nom, type, entreprise_nom, chef_nom, chef_phone, description, logo
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`;

        db.run(sql, [nom, type, entreprise_nom, chef_nom, chef_phone, description, logo], function(err) {
            callback(err, this.lastID);
        });
    }

    static findAll(callback) {
        db.all('SELECT * FROM services WHERE is_active = 1 ORDER BY nom', callback);
    }

    static findByType(type, callback) {
        db.all('SELECT * FROM services WHERE type = ? AND is_active = 1', [type], callback);
    }

    static findById(id, callback) {
        db.get('SELECT * FROM services WHERE id = ?', [id], callback);
    }

    static update(id, serviceData, callback) {
        const { nom, type, entreprise_nom, chef_nom, chef_phone, description, logo } = serviceData;
        
        const sql = `UPDATE services SET 
            nom = ?, type = ?, entreprise_nom = ?, chef_nom = ?, 
            chef_phone = ?, description = ?, logo = ?
            WHERE id = ?`;
        
        db.run(sql, [nom, type, entreprise_nom, chef_nom, chef_phone, description, logo, id], callback);
    }

    static delete(id, callback) {
        db.run('UPDATE services SET is_active = 0 WHERE id = ?', [id], callback);
    }
}

module.exports = Service;