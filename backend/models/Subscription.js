const db = require('../config/database');

class Subscription {
  static create(subscriptionData, callback) {
    const { vendeur_id, type, amount, start_date, end_date } = subscriptionData;

    const sql = `
      INSERT INTO subscriptions (vendeur_id, type, amount, start_date, end_date, status)
      VALUES (?, ?, ?, ?, ?, 'active')
    `;

    db.run(sql, [vendeur_id, type, amount, start_date, end_date], function(err) {
      callback(err, this.lastID);
    });
  }

  static findByVendeur(vendeurId, callback) {
    db.get(
      'SELECT * FROM subscriptions WHERE vendeur_id = ? AND status = "active" ORDER BY created_at DESC LIMIT 1',
      [vendeurId],
      callback
    );
  }

  static updateStatus(subscriptionId, status, callback) {
    db.run('UPDATE subscriptions SET status = ? WHERE id = ?', [status, subscriptionId], callback);
  }

  static getExpiredSubscriptions(callback) {
    const sql = `
      SELECT s.*, u.nom, u.prenom, u.email 
      FROM subscriptions s
      JOIN users u ON s.vendeur_id = u.id
      WHERE s.status = 'active' AND s.end_date < datetime('now')
    `;
    db.all(sql, callback);
  }
}

module.exports = Subscription;