import api from './api';

export const statisticsAPI = {
  getUserStats: () => 
    api.get('/statistics/user'),

  getRecentTransactions: () => 
    api.get('/statistics/transactions'),

  getSalesData: (period = 'month') => 
    api.get(`/statistics/sales?period=${period}`),

  getCustomerStats: () => 
    api.get('/statistics/customers'),

  getRevenueStats: () => 
    api.get('/statistics/revenue'),
};

export default statisticsAPI;