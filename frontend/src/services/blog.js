import api from './api';

export const blogAPI = {
  // Récupérer tous les posts
  getAll: () => 
    api.get('/blog'),

  // Récupérer mes posts (pour l'auteur)
  getMyPosts: () => 
    api.get('/blog/my-posts'),

  // Récupérer un post spécifique avec tous les détails
  getById: (id) => 
    api.get(`/blog/${id}`),

  // Récupérer les posts populaires (avec le plus de soutiens)
  getPopular: () => 
    api.get('/blog/popular'),

  // Récupérer les posts par catégorie
  getByCategory: (category) => 
    api.get(`/blog/category/${category}`),

  // Créer un nouveau post
  create: (postData) => {
    // Si postData contient un fichier, utiliser FormData
    if (postData.fichier instanceof File) {
      const formData = new FormData();
      formData.append('titre', postData.titre);
      formData.append('contenu', postData.contenu);
      formData.append('organisation_nom', postData.organisation_nom || '');
      formData.append('contact', postData.contact || '');
      formData.append('montant_publication', postData.montant_publication || 0);
      formData.append('categorie', postData.categorie || 'general');
      formData.append('fichier', postData.fichier);
      
      return api.post('/blog', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
    
    // Sinon, envoyer en JSON normal
    return api.post('/blog', postData);
  },

  // Modifier un post
  update: (id, postData) => {
    // Si postData contient un nouveau fichier, utiliser FormData
    if (postData.fichier instanceof File) {
      const formData = new FormData();
      formData.append('titre', postData.titre);
      formData.append('contenu', postData.contenu);
      formData.append('organisation_nom', postData.organisation_nom || '');
      formData.append('contact', postData.contact || '');
      formData.append('montant_publication', postData.montant_publication || 0);
      formData.append('categorie', postData.categorie || 'general');
      formData.append('fichier', postData.fichier);
      formData.append('_method', 'PUT'); // Pour Laravel ou certains frameworks
      
      return api.post(`/blog/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
    
    // Sinon, envoyer en JSON normal
    return api.put(`/blog/${id}`, postData);
  },

  // Supprimer un post
  delete: (id) => 
    api.delete(`/blog/${id}`),

  // Soutenir un post (paiement)
  support: (postId, montant) => 
    api.post(`/blog/${postId}/support`, { montant }),

  // Ajouter un commentaire
  addComment: (postId, commentData) => 
    api.post(`/blog/${postId}/comments`, commentData),

  // Récupérer les commentaires d'un post
  getComments: (postId) => 
    api.get(`/blog/${postId}/comments`),

  // Supprimer un commentaire
  deleteComment: (postId, commentId) => 
    api.delete(`/blog/${postId}/comments/${commentId}`),

  // Marquer comme favori
  addToFavorites: (postId) => 
    api.post(`/blog/${postId}/favorite`),

  // Retirer des favoris
  removeFromFavorites: (postId) => 
    api.delete(`/blog/${postId}/favorite`),

  // Récupérer mes favoris
  getFavorites: () => 
    api.get('/blog/favorites'),

  // Rechercher des posts
  search: (query) => 
    api.get(`/blog/search?q=${encodeURIComponent(query)}`),

  // Filtrer les posts
  filter: (filters) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key, filters[key]);
      }
    });
    return api.get(`/blog/filter?${params.toString()}`);
  },

  // Statistiques des posts (pour l'auteur ou admin)
  getStats: () => 
    api.get('/blog/stats'),

  // Télécharger le fichier d'un post
  downloadFile: (postId) => 
    api.get(`/blog/${postId}/download`, {
      responseType: 'blob' // Important pour les téléchargements de fichiers
    }),

  // Mettre à jour le statut d'un post (admin seulement)
  updateStatus: (postId, status) => 
    api.patch(`/blog/${postId}/status`, { status }),

  // Rapporter un post
  report: (postId, reason) => 
    api.post(`/blog/${postId}/report`, { reason }),

  // Partager un post (incrémente le compteur de partages)
  share: (postId) => 
    api.post(`/blog/${postId}/share`),

  // Vérifier si l'utilisateur a déjà soutenu un post
  hasSupported: (postId) => 
    api.get(`/blog/${postId}/has-supported`),

  // Récupérer les posts similaires
  getSimilar: (postId) => 
    api.get(`/blog/${postId}/similar`),

  // Récupérer les posts de l'utilisateur connecté
  getUserPosts: (userId) => 
    api.get(`/blog/user/${userId}/posts`),
};