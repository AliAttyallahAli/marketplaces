import api from './api';

export const chatAPI = {
  // Récupérer les conversations
  getConversations: () => 
    api.get('/chat/conversations'),

  // Récupérer les messages d'une conversation
  getMessages: (conversationId) => 
    api.get(`/chat/conversations/${conversationId}/messages`),

  // Envoyer un message
  sendMessage: (conversationId, messageData) => 
    api.post(`/chat/conversations/${conversationId}/messages`, messageData),

  // Créer une nouvelle conversation
  createConversation: (conversationData) => 
    api.post('/chat/conversations', conversationData),

  // Marquer les messages comme lus
  markAsRead: (conversationId) => 
    api.put(`/chat/conversations/${conversationId}/read`),
};