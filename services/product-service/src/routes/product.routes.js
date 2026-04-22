const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const validateRequest = require('../middlewares/validateRequest');

// Schema-like validation simple objects
const productSchema = {
  name: { required: true },
  price: { required: true, type: 'number' },
  category: { required: true }
};

router.get('/', productController.getProducts);
router.get('/:id', productController.getProduct);

router.post('/', validateRequest(productSchema), productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
