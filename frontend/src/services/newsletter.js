import api from './api';

export const newsletterAPI = {
  // Abonnements
  subscribe: (subscriberData) => 
    api.post('/newsletter/subscribe', subscriberData),

  unsubscribe: (email) => 
    api.post('/newsletter/unsubscribe', { email }),

  // Statistiques (admin)
  getStats: () => 
    api.get('/newsletter/stats'),

  getSubscribers: (params = {}) => 
    api.get('/newsletter/subscribers', { params }),

  // Campagnes (admin)
  createCampaign: (campaignData) => 
    api.post('/newsletter/campaigns', campaignData),

  getCampaigns: (params = {}) => 
    api.get('/newsletter/campaigns', { params }),

  updateCampaign: (id, campaignData) => 
    api.put(`/newsletter/campaigns/${id}`, campaignData),

  sendCampaign: (id) => 
    api.post(`/newsletter/campaigns/${id}/send`),
};

export default newsletterAPI; // ✅ Export default ajouté