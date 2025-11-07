const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
    static create(userData, callback) {
        const {
            nni, phone, email, password, role, nom, prenom, date_naissance,
            lieu_naissance, province, region, ville, quartier
        } = userData;

        console.log('Création utilisateur:', { nni, phone, email, nom, prenom });

        const hashedPassword = bcrypt.hashSync(password, 10);

        const sql = `INSERT INTO users (
            nni, phone, email, password, role, nom, prenom, date_naissance,
            lieu_naissance, province, region, ville, quartier
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        db.run(sql, [
            nni, phone, email, hashedPassword, role, nom, prenom, date_naissance,
            lieu_naissance, province, region, ville, quartier
        ], function(err) {
            if (err) {
                console.error('Erreur SQL création user:', err);
                callback(err, null);
            } else {
                console.log('Utilisateur créé avec ID:', this.lastID);
                callback(null, this.lastID);
            }
        });
    }

    static findByEmail(email, callback) {
        console.log('Recherche par email:', email);
        db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
            if (err) {
                console.error('Erreur recherche email:', err);
                callback(err, null);
            } else {
                console.log('Résultat recherche email:', row ? 'trouvé' : 'non trouvé');
                callback(null, row);
            }
        });
    }

    static findByPhone(phone, callback) {
        db.get('SELECT * FROM users WHERE phone = ?', [phone], callback);
    }

    static findByNNI(nni, callback) {
        db.get('SELECT * FROM users WHERE nni = ?', [nni], callback);
    }

    static findById(id, callback) {
        db.get('SELECT * FROM users WHERE id = ?', [id], callback);
    }

    static updateProfile(id, userData, callback) {
        const { nom, prenom, date_naissance, lieu_naissance, province, region, ville, quartier, photo } = userData;
        
        const sql = `UPDATE users SET 
            nom = ?, prenom = ?, date_naissance = ?, lieu_naissance = ?,
            province = ?, region = ?, ville = ?, quartier = ?, photo = ?,
            updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
        
        db.run(sql, [nom, prenom, date_naissance, lieu_naissance, province, region, ville, quartier, photo, id], callback);
    }

    static upgradeToVendeur(id, vendeurData, callback) {
        const { nom, prenom, date_naissance, lieu_naissance, province, region, ville, quartier } = vendeurData;
        
        const sql = `UPDATE users SET 
            role = 'vendeur', nom = ?, prenom = ?, date_naissance = ?, lieu_naissance = ?,
            province = ?, region = ?, ville = ?, quartier = ?, updated_at = CURRENT_TIMESTAMP 
            WHERE id = ?`;
        
        db.run(sql, [nom, prenom, date_naissance, lieu_naissance, province, region, ville, quartier, id], callback);
    }

    static getAllVendeurs(callback) {
        db.all('SELECT * FROM users WHERE role = "vendeur"', callback);
    }

    static getAllClients(callback) {
        db.all('SELECT * FROM users WHERE role = "client"', callback);
    }

    static verifyKYC(id, callback) {
        db.run('UPDATE users SET kyc_verified = 1 WHERE id = ?', [id], callback);
    }

    static verifyKYB(id, callback) {
        db.run('UPDATE users SET kyb_verified = 1 WHERE id = ?', [id], callback);
    }
}

module.exports = User;