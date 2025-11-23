import api from './api';

export const chatAPI = {
  // Récupérer toutes les conversations
  getConversations: () => 
    api.get('/chat/conversations'),

  // Récupérer une conversation spécifique
  getConversation: (conversationId) => 
    api.get(`/chat/conversations/${conversationId}`),

  // Récupérer les messages d'une conversation
  getMessages: (conversationId) => 
    api.get(`/chat/conversations/${conversationId}/messages`),

  // Envoyer un message
  sendMessage: (conversationId, content) => 
    api.post(`/chat/conversations/${conversationId}/messages`, { content }),

  // Créer une nouvelle conversation
  createConversation: (userId) => 
    api.post('/chat/conversations', { user_id: userId }),

  // Marquer les messages comme lus
  markAsRead: (conversationId) => 
    api.put(`/chat/conversations/${conversationId}/read`),

  // Supprimer une conversation
  deleteConversation: (conversationId) => 
    api.delete(`/chat/conversations/${conversationId}`),

  // Récupérer les utilisateurs
  getUsers: (search = '') => 
    api.get(`/chat/users?search=${encodeURIComponent(search)}`)
};