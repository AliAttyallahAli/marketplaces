const db = require('../config/database');

class Transaction {
    static createP2P(transactionData, callback) {
        const {
            from_user_id, to_user_id, from_wallet_phone, to_wallet_phone,
            amount, fee, type = 'p2p', service_type = null, product_id = null
        } = transactionData;

        const sql = `INSERT INTO transactions (
            from_user_id, to_user_id, from_wallet_phone, to_wallet_phone,
            amount, fee, type, service_type, product_id, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        db.run(sql, [
            from_user_id, to_user_id, from_wallet_phone, to_wallet_phone,
            amount, fee, type, service_type, product_id, 'pending'
        ], function(err) {
            callback(err, this.lastID);
        });
    }

    static createAchat(transactionData, callback) {
        transactionData.type = 'achat';
        this.createP2P(transactionData, callback);
    }

    static createFacture(transactionData, callback) {
        transactionData.type = 'facture';
        this.createP2P(transactionData, callback);
    }

    static updateStatus(transactionId, status, callback) {
        db.run('UPDATE transactions SET status = ? WHERE id = ?', [status, transactionId], callback);
    }

    static findByUserId(userId, callback) {
        db.all(`
            SELECT t.*, 
                   u_from.nom as from_nom, u_from.prenom as from_prenom,
                   u_to.nom as to_nom, u_to.prenom as to_prenom,
                   p.nom as product_nom
            FROM transactions t
            LEFT JOIN users u_from ON t.from_user_id = u_from.id
            LEFT JOIN users u_to ON t.to_user_id = u_to.id
            LEFT JOIN products p ON t.product_id = p.id
            WHERE t.from_user_id = ? OR t.to_user_id = ?
            ORDER BY t.created_at DESC
        `, [userId, userId], callback);
    }

    static findByVendeur(vendeurId, callback) {
        db.all(`
            SELECT t.*, 
                   u_from.nom as from_nom, u_from.prenom as from_prenom,
                   p.nom as product_nom
            FROM transactions t
            JOIN users u_from ON t.from_user_id = u_from.id
            LEFT JOIN products p ON t.product_id = p.id
            WHERE t.to_user_id = ? AND t.type = 'achat'
            ORDER BY t.created_at DESC
        `, [vendeurId], callback);
    }

    static getAllTransactions(limit = 100, callback) {
        db.all(`
            SELECT t.*, 
                   u_from.nom as from_nom, u_from.prenom as from_prenom,
                   u_to.nom as to_nom, u_to.prenom as to_prenom,
                   p.nom as product_nom
            FROM transactions t
            LEFT JOIN users u_from ON t.from_user_id = u_from.id
            LEFT JOIN users u_to ON t.to_user_id = u_to.id
            LEFT JOIN products p ON t.product_id = p.id
            ORDER BY t.created_at DESC
            LIMIT ?
        `, [limit], callback);
    }

    static searchTransactions(filters, callback) {
        let sql = `
            SELECT t.*, 
                   u_from.nom as from_nom, u_from.prenom as from_prenom,
                   u_to.nom as to_nom, u_to.prenom as to_prenom,
                   p.nom as product_nom
            FROM transactions t
            LEFT JOIN users u_from ON t.from_user_id = u_from.id
            LEFT JOIN users u_to ON t.to_user_id = u_to.id
            LEFT JOIN products p ON t.product_id = p.id
            WHERE 1=1
        `;
        let params = [];

        if (filters.vendeur_id) {
            sql += ' AND t.to_user_id = ?';
            params.push(filters.vendeur_id);
        }

        if (filters.date_from) {
            sql += ' AND DATE(t.created_at) >= ?';
            params.push(filters.date_from);
        }

        if (filters.date_to) {
            sql += ' AND DATE(t.created_at) <= ?';
            params.push(filters.date_to);
        }

        if (filters.type) {
            sql += ' AND t.type = ?';
            params.push(filters.type);
        }

        sql += ' ORDER BY t.created_at DESC';

        db.all(sql, params, callback);
    }
}

module.exports = Transaction;