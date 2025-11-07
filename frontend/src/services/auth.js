import api from './api';

// Service d'authentification
export const authAPI = {
  login: (email, password) => 
    api.post('/auth/login', { email, password }),

  register: (userData) => 
    api.post('/auth/register', userData),

  upgradeToVendeur: (vendeurData) => 
    api.post('/auth/upgrade-vendeur', vendeurData),
};

// Service des utilisateurs
export const userAPI = {
  getProfile: () => 
    api.get('/users/profile'),

  updateProfile: (profileData) => 
    api.put('/users/profile', profileData),

  getAllUsers: () => 
    api.get('/users/all'),

  getAllVendeurs: () => 
    api.get('/users/vendeurs'),

  getUserDetails: (id) => 
    api.get(`/users/${id}`),

  verifyKYC: (id) => 
    api.post(`/users/${id}/verify-kyc`),

  verifyKYB: (id) => 
    api.post(`/users/${id}/verify-kyb`),
};

// Service du wallet et transactions
export const walletAPI = {
  getBalance: () => 
    api.get('/wallet/balance'),

  p2pTransfer: (transferData) => 
    api.post('/wallet/transfer', transferData),

  achatProduit: (achatData) => 
    api.post('/transactions/achat', achatData),

  payerFacture: (factureData) => 
    api.post('/transactions/facture', factureData),

  getTransactions: () => 
    api.get('/transactions/history'),

  getVendeurTransactions: () => 
    api.get('/transactions/vendeur/history'),

  searchTransactions: (filters) => 
    api.get('/transactions/search', { params: filters }),
};

// Service des produits
export const productsAPI = {
  getAll: (limit = 50) => 
    api.get(`/products?limit=${limit}`),

  getById: (id) => 
    api.get(`/products/${id}`),

  getByVendeur: (vendeurId) => 
    api.get(`/products/vendeur/${vendeurId}`),

  create: (productData) => 
    api.post('/products', productData),

  update: (id, productData) => 
    api.put(`/products/${id}`, productData),

  delete: (id) => 
    api.delete(`/products/${id}`),

  search: (query, categorie) => 
    api.get('/products/search', { params: { q: query, categorie } }),
};

// Service des services partenaires
export const servicesAPI = {
  getAll: () => 
    api.get('/services'),

  getByType: (type) => 
    api.get(`/services/${type}`),

  create: (serviceData) => 
    api.post('/services', serviceData),

  update: (id, serviceData) => 
    api.put(`/services/${id}`, serviceData),

  delete: (id) => 
    api.delete(`/services/${id}`),
};

// Service du blog
export const blogAPI = {
  getAll: () => 
    api.get('/blog'),

  getMyPosts: () => 
    api.get('/blog/my-posts'),

  getById: (id) => 
    api.get(`/blog/${id}`),

  create: (postData) => 
    api.post('/blog', postData),

  update: (id, postData) => 
    api.put(`/blog/${id}`, postData),

  delete: (id) => 
    api.delete(`/blog/${id}`),
};

// Export par défaut pour les imports globaux
export default {
  authAPI,
  userAPI,
  walletAPI,
  productsAPI,
  servicesAPI,
  blogAPI
};