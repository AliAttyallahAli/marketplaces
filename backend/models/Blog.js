const db = require('../config/database');

class Blog {
  static create(blogData, callback) {
    const {
      auteur_id, titre, contenu, organisation_nom, contact,
      fichier_url, images, montant_publication
    } = blogData;

    const sql = `
      INSERT INTO blog_posts (
        auteur_id, titre, contenu, organisation_nom, contact,
        fichier_url, images, montant_publication, is_published
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
    `;

    db.run(sql, [
      auteur_id, titre, contenu, organisation_nom, contact,
      fichier_url, JSON.stringify(images), montant_publication
    ], function(err) {
      callback(err, this.lastID);
    });
  }

  static findAllPublished(callback) {
    const sql = `
      SELECT bp.*, u.nom as auteur_nom, u.prenom as auteur_prenom, u.photo as auteur_photo
      FROM blog_posts bp
      JOIN users u ON bp.auteur_id = u.id
      WHERE bp.is_published = 1
      ORDER BY bp.created_at DESC
    `;
    db.all(sql, callback);
  }

  static findByAuteur(auteurId, callback) {
    const sql = `
      SELECT bp.*, u.nom as auteur_nom, u.prenom as auteur_prenom
      FROM blog_posts bp
      JOIN users u ON bp.auteur_id = u.id
      WHERE bp.auteur_id = ?
      ORDER BY bp.created_at DESC
    `;
    db.all(sql, [auteurId], callback);
  }

  static findById(id, callback) {
    const sql = `
      SELECT bp.*, u.nom as auteur_nom, u.prenom as auteur_prenom, u.photo as auteur_photo
      FROM blog_posts bp
      JOIN users u ON bp.auteur_id = u.id
      WHERE bp.id = ?
    `;
    db.get(sql, [id], callback);
  }

  static update(id, blogData, callback) {
    const { titre, contenu, organisation_nom, contact, fichier_url, images } = blogData;
    
    const sql = `
      UPDATE blog_posts SET 
        titre = ?, contenu = ?, organisation_nom = ?, contact = ?,
        fichier_url = ?, images = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    db.run(sql, [titre, contenu, organisation_nom, contact, fichier_url, JSON.stringify(images), id], callback);
  }

  static delete(id, callback) {
    db.run('DELETE FROM blog_posts WHERE id = ?', [id], callback);
  }
}

module.exports = Blog;