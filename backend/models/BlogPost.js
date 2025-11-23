const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const BlogPost = sequelize.define('BlogPost', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  titre: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  contenu: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  organisation_nom: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  contact: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  montant_publication: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  fichier_url: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  auteur_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  statut: {
    type: DataTypes.ENUM('actif', 'inactif', 'en_attente'),
    defaultValue: 'actif'
  },
  soutiens_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'blog_posts',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Associations
BlogPost.belongsTo(User, {
  foreignKey: 'auteur_id',
  as: 'auteur'
});

User.hasMany(BlogPost, {
  foreignKey: 'auteur_id',
  as: 'blog_posts'
});

module.exports = BlogPost;