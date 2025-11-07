const db = require('../config/database');
const qr = require('qr-image');

class Wallet {
    static create(userId, phone, callback) {
        // Générer QR code
        const qrCode = qr.imageSync(`zoudousouk:p2p?phone=${phone}`, { type: 'png' }).toString('base64');
        
        const sql = 'INSERT INTO wallets (user_id, phone, qr_code) VALUES (?, ?, ?)';
        db.run(sql, [userId, phone, qrCode], function(err) {
            callback(err, this.lastID);
        });
    }

    static findByUserId(userId, callback) {
        db.get('SELECT * FROM wallets WHERE user_id = ?', [userId], callback);
    }

    static findByPhone(phone, callback) {
        db.get('SELECT * FROM wallets WHERE phone = ?', [phone], callback);
    }

    static updateBalance(phone, amount, callback) {
        db.run('UPDATE wallets SET balance = balance + ? WHERE phone = ?', [amount, phone], callback);
    }

    static getBalance(phone, callback) {
        db.get('SELECT balance FROM wallets WHERE phone = ?', [phone], callback);
    }
}

module.exports = Wallet;