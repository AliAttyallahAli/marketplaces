const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'zoudousouk_secret_key';

const auth = (req, res, next) => {
  // Récupérer le token du header Authorization
  const authHeader = req.header('Authorization');
  
  if (!authHeader) {
    return res.status(401).json({ error: 'Accès refusé, token manquant' });
  }

  // Vérifier le format "Bearer <token>"
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Format de token invalide' });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Ajouter les informations utilisateur à la requête
    req.user = {
      id: decoded.id,
      email: decoded.email,
      phone: decoded.phone,
      role: decoded.role,
      nom: decoded.nom,
      prenom: decoded.prenom,
      nni: decoded.nni,
      date_naissance: decoded.date_naissance,
      lieu_naissance: decoded.lieu_naissance,
      province: decoded.province,
      region: decoded.region,
      ville: decoded.ville,
      quartier: decoded.quartier,
      photo: decoded.photo,
      kyc_verified: decoded.kyc_verified,
      kyb_verified: decoded.kyb_verified,
      created_at: decoded.created_at
    };
    
    next();
  } catch (error) {
    console.error('Erreur vérification token:', error);
    res.status(400).json({ error: 'Token invalide' });
  }
};

const adminAuth = (req, res, next) => {
  auth(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Accès refusé, droits administrateur requis' });
    }
    next();
  });
};

const vendeurAuth = (req, res, next) => {
  auth(req, res, () => {
    if (req.user.role !== 'vendeur' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Accès refusé, droits vendeur requis' });
    }
    next();
  });
};

module.exports = { auth, adminAuth, vendeurAuth };