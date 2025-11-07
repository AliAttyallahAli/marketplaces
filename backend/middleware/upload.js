const multer = require('multer');
const path = require('path');

// Configuration du stockage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Filtrage des fichiers
const fileFilter = (req, file, cb) => {
  // Autoriser seulement les images et PDF
  if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Type de fichier non supporté. Seules les images et PDF sont autorisés.'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
  fileFilter: fileFilter
});

// Middleware pour upload multiple
const uploadMultiple = upload.fields([
  { name: 'photos', maxCount: 5 },
  { name: 'documents', maxCount: 3 }
]);

// Middleware pour upload simple
const uploadSingle = upload.single('file');

module.exports = {
  uploadMultiple,
  uploadSingle
};