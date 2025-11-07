import api from './api';

export const documentsAPI = {
  getUserDocuments: () => 
    api.get('/documents'),

  uploadDocument: (formData) => 
    api.post('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  downloadDocument: (documentId) => 
    api.get(`/documents/${documentId}/download`, {
      responseType: 'blob'
    }),

  deleteDocument: (documentId) => 
    api.delete(`/documents/${documentId}`),

  getDocumentTypes: () => 
    api.get('/documents/types'),
};

export default documentsAPI;