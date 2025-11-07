const { body, validationResult } = require('express-validator');

// Validation pour la création de produit
const validateProduct = [
  body('nom')
    .notEmpty()
    .withMessage('Le nom du produit est requis')
    .isLength({ min: 3, max: 100 })
    .withMessage('Le nom doit contenir entre 3 et 100 caractères'),
  
  body('prix')
    .isFloat({ min: 1 })
    .withMessage('Le prix doit être un nombre positif'),
  
  body('categorie')
    .notEmpty()
    .withMessage('La catégorie est requise'),
  
  body('etat')
    .isIn(['neuf', 'occasion', 'sur_commande'])
    .withMessage('L\'état doit être neuf, occasion ou sur_commande')
];

// Validation pour le transfert P2P
const validateP2PTransfer = [
  body('to_phone')
    .notEmpty()
    .withMessage('Le numéro du destinataire est requis')
    .matches(/^\+?[0-9\s\-\(\)]{8,}$/)
    .withMessage('Numéro de téléphone invalide'),
  
  body('amount')
    .isFloat({ min: 1 })
    .withMessage('Le montant doit être supérieur à 0')
];

// Validation pour le paiement de facture
const validateBillPayment = [
  body('reference')
    .notEmpty()
    .withMessage('La référence est requise'),
  
  body('amount')
    .isFloat({ min: 1 })
    .withMessage('Le montant doit être supérieur à 0'),
  
  body('service_type')
    .isIn(['ZIZ', 'STE', 'TAXE'])
    .withMessage('Type de service invalide')
];

// Validation pour la création de publication blog
const validateBlogPost = [
  body('titre')
    .notEmpty()
    .withMessage('Le titre est requis')
    .isLength({ min: 5, max: 200 })
    .withMessage('Le titre doit contenir entre 5 et 200 caractères'),
  
  body('contenu')
    .notEmpty()
    .withMessage('Le contenu est requis')
    .isLength({ min: 10 })
    .withMessage('Le contenu doit contenir au moins 10 caractères')
];
const validatePasswordChange = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Le mot de passe actuel est requis'),
  
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('Le nouveau mot de passe doit contenir au moins 6 caractères')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre')
];

// Validation soumission KYC
const validateKYCSubmission = [
  body('piece_identite_url')
    .notEmpty()
    .withMessage('La pièce d\'identité est requise'),
  
  body('photo_identite_url')
    .notEmpty()
    .withMessage('La photo de la pièce d\'identité est requise'),
  
  body('selfie_url')
    .notEmpty()
    .withMessage('Le selfie avec pièce d\'identité est requis')
];

// Validation soumission KYB
const validateKYBSubmission = [
  body('registre_commerce_url')
    .notEmpty()
    .withMessage('Le registre de commerce est requis'),
  
  body('attestation_fiscale_url')
    .notEmpty()
    .withMessage('L\'attestation fiscale est requise'),
  
  body('identification_chef_url')
    .notEmpty()
    .withMessage('L\'identification du chef d\'entreprise est requise')
];

// Middleware de gestion des erreurs de validation
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Erreur de validation',
      details: errors.array()
    });
  }
  next();
};

module.exports = {
  validateProduct,
  validateP2PTransfer,
  validateBillPayment,
  validateBlogPost,
   validatePasswordChange,
  validateKYCSubmission,
  validateKYBSubmission,
  handleValidationErrors
};