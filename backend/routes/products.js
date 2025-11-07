const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { auth, vendeurAuth } = require('../middleware/auth');

router.get('/', productController.getProducts);
router.get('/search', productController.searchProducts);
router.get('/:id', productController.getProductById);
router.post('/', vendeurAuth, productController.createProduct);
router.put('/:id', vendeurAuth, productController.updateProduct);
router.delete('/:id', vendeurAuth, productController.deleteProduct);

module.exports = router;