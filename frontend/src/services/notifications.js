import api from './api';

export const notificationAPI = {
  getNotifications: (params = {}) => 
    api.get('/notifications', { params }),

  getUnreadCount: () => 
    api.get('/notifications/unread-count'),

  markAsRead: (notificationId) => 
    api.put(`/notifications/${notificationId}/read`),

  markAllAsRead: () => 
    api.put('/notifications/mark-all-read'),

  deleteNotification: (notificationId) => 
    api.delete(`/notifications/${documentId}`),

  getNotificationPreferences: () => 
    api.get('/notifications/preferences'),

  updateNotificationPreferences: (preferences) => 
    api.put('/notifications/preferences', preferences),
};

export default notificationAPI;