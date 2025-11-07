import api from './api';

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