const cors = require('cors');

const corsOptions = {
    origin: function (origin, callback) {
        // Autoriser toutes les origines en développement
        if (process.env.NODE_ENV === 'development') {
            callback(null, true);
        } else {
            // En production, spécifier les domaines autorisés
            const allowedOrigins = [
                'http://localhost:3000',
                'https://zoudousouk.td',
                'https://www.zoudousouk.td'
            ];
            if (!origin || allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

module.exports = cors(corsOptions);