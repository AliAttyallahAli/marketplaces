import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token aux requêtes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API pour l'authentification
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  upgradeToVendeur: (vendeurData) => api.post('/auth/upgrade-vendeur', vendeurData),
};

// API pour les utilisateurs
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (profileData) => api.put('/users/profile', profileData),
  getAllUsers: () => api.get('/users/all'),
  getAllVendeurs: () => api.get('/users/vendeurs'),
  getUserDetails: (id) => api.get(`/users/${id}`),
  verifyKYC: (id) => api.post(`/users/${id}/verify-kyc`),
  verifyKYB: (id) => api.post(`/users/${id}/verify-kyb`),
};
// API pour les produits
export const productsAPI = {
  getAll: (limit = 50) => api.get(`/products?limit=${limit}`),
  getById: (id) => api.get(`/products/${id}`),
  create: (productData) => api.post('/products', productData),
  update: (id, productData) => api.put(`/products/${id}`, productData),
  delete: (id) => api.delete(`/products/${id}`),
  search: (query, categorie) => api.get('/products/search', { params: { q: query, categorie } }),
};


// API pour le wallet et transactions
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

// API pour les services
export const servicesAPI = {
  getAll: () => 
    api.get('/services'),

  getByType: (type) => 
    api.get(`/services/${type}`),

  create: (serviceData) => 
    api.post('/services', serviceData),

  update: (id, serviceData) => 
    api.put(`/services/${id}`, serviceData),
};

// API pour le blog
export const blogAPI = {
  getAll: () => 
    api.get('/blog'),

  getMyPosts: () => 
    api.get('/blog/my-posts'),

  getById: (id) => 
    api.get(`/blog/${id}`),

  create: (blogData) => 
    api.post('/blog', blogData),
};


export default api;