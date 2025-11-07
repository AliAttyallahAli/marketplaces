import api from './api';

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