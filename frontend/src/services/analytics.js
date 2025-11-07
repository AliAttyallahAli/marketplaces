import api from './api';

export const analyticsAPI = {
  getDashboardStats: (period = '30days') => 
    api.get(`/analytics/dashboard?period=${period}`),

  getSalesData: (startDate, endDate) => 
    api.get('/analytics/sales', { params: { start_date: startDate, end_date: endDate } }),

  getUserGrowth: (period = '1year') => 
    api.get(`/analytics/user-growth?period=${period}`),

  getTopProducts: (limit = 10) => 
    api.get(`/analytics/top-products?limit=${limit}`),

  getRevenueData: (period = '6months') => 
    api.get(`/analytics/revenue?period=${period}`),
};