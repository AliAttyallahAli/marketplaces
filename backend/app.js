const express = require('express');
const cors = require('cors');
require('dotenv').config();


const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers uploadés
app.use('/uploads', express.static('uploads'));

// Routes

app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/products', require('./routes/products'));
app.use('/api/wallet', require('./routes/wallet'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/services', require('./routes/services'));
app.use('/api/blog', require('./routes/blog'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/subscriptions', require('./routes/subscriptions'));
app.use('/api/shipping', require('./routes/shipping'));
app.use('/api/newsletter', require('./routes/newsletter'));
app.use('/api/notifications', require('./routes/notifications'));

// Route de test
app.get('/api', (req, res) => {
  res.json({ 
    message: 'ZouDou-Souk API is running!',
    version: '1.0.0',
    endpoints: [
      '/api/auth',
      '/api/users', 
      '/api/products',
      '/api/wallet',
      '/api/transactions',
      '/api/services',
      '/api/blog',
      '/api/analytics',
      '/api/chat',
      '/api/subscriptions',
      '/api/shipping'
    ]
  });
});

// Gestion des erreurs 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erreur interne du serveur' });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API URL: http://localhost:${PORT}/api`);
});

module.exports = app;