import api from './api';

export const walletAPI = {
  getBalance: () => 
    api.get('/wallet/balance'),

  p2pTransfer: (transferData) => 
    api.post('/wallet/transfer', transferData),

  achatProduit: (achatData) => 
    api.post('/transactions/achat', achatData),

  payerFacture: (factureData) => 
    api.post('/transactions/facture', factureData),

  getTransactions: () => 
    api.get('/transactions/history'),

  getVendeurTransactions: () => 
    api.get('/transactions/vendeur/history'),

  searchTransactions: (filters) => 
    api.get('/transactions/search', { params: filters }),
};