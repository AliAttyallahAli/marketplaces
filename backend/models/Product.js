const db = require('../config/database');

class Product {
    static create(productData, callback) {
        const {
            vendeur_id, nom, description, prix, reduction, etat,
            categorie, livrable, adresse_livraison, photos, quantite
        } = productData;

        const sql = `INSERT INTO products (
            vendeur_id, nom, description, prix, reduction, etat,
            categorie, livrable, adresse_livraison, photos, quantite
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        db.run(sql, [
            vendeur_id, nom, description, prix, reduction, etat,
            categorie, livrable, adresse_livraison, JSON.stringify(photos), quantite
        ], function(err) {
            callback(err, this.lastID);
        });
    }

    static findAll(limit = 50, callback) {
        db.all(`
            SELECT p.*, u.nom as vendeur_nom, u.prenom as vendeur_prenom 
            FROM products p 
            JOIN users u ON p.vendeur_id = u.id 
            WHERE p.is_active = 1 
            ORDER BY p.created_at DESC 
            LIMIT ?
        `, [limit], callback);
    }

    static findByVendeur(vendeurId, callback) {
        db.all('SELECT * FROM products WHERE vendeur_id = ? AND is_active = 1', [vendeurId], callback);
    }

    static findById(id, callback) {
        db.get(`
            SELECT p.*, u.nom as vendeur_nom, u.prenom as vendeur_prenom 
            FROM products p 
            JOIN users u ON p.vendeur_id = u.id 
            WHERE p.id = ?
        `, [id], callback);
    }

    static update(id, productData, callback) {
        const { nom, description, prix, reduction, etat, categorie, livrable, adresse_livraison, photos, quantite } = productData;
        
        const sql = `UPDATE products SET 
            nom = ?, description = ?, prix = ?, reduction = ?, etat = ?,
            categorie = ?, livrable = ?, adresse_livraison = ?, photos = ?, quantite = ?,
            updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
        
        db.run(sql, [nom, description, prix, reduction, etat, categorie, livrable, adresse_livraison, JSON.stringify(photos), quantite, id], callback);
    }

    static delete(id, callback) {
        db.run('UPDATE products SET is_active = 0 WHERE id = ?', [id], callback);
    }

    static search(query, categorie, callback) {
        let sql = `
            SELECT p.*, u.nom as vendeur_nom, u.prenom as vendeur_prenom 
            FROM products p 
            JOIN users u ON p.vendeur_id = u.id 
            WHERE p.is_active = 1 AND (
                p.nom LIKE ? OR p.description LIKE ?
            )
        `;
        let params = [`%${query}%`, `%${query}%`];

        if (categorie) {
            sql += ' AND p.categorie = ?';
            params.push(categorie);
        }

        sql += ' ORDER BY p.created_at DESC';

        db.all(sql, params, callback);
    }
}

module.exports = Product;