import api from './api';

export const chatAPI = {
  // Conversations
  getConversations: () => 
    api.get('/chat/conversations'),

  getMessages: (conversationId, params = {}) => 
    api.get(`/chat/conversations/${conversationId}/messages`, { params }),

  sendMessage: (conversationId, messageData) => 
    api.post(`/chat/conversations/${conversationId}/messages`, messageData),

  createConversation: (conversationData) => 
    api.post('/chat/conversations', conversationData),

  // Utilisateurs
  searchUsers: (params = {}) => 
    api.get('/chat/users/search', { params }),
};

export default chatAPI;