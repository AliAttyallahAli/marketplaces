import api from './api';

export const productsAPI = {
  getAll: (limit = 50) => 
    api.get(`/products?limit=${limit}`),

  getById: (id) => 
    api.get(`/products/${id}`),

  create: (productData) => 
    api.post('/products', productData),

  update: (id, productData) => 
    api.put(`/products/${id}`, productData),

  delete: (id) => 
    api.delete(`/products/${id}`),

  search: (query, categorie) => 
    api.get('/products/search', { params: { q: query, categorie } }),

  // AJOUT: Route pour les produits d'un vendeur spécifique
  getByVendeur: (vendeurId) => 
    api.get(`/products/vendeur/${vendeurId}`),
};