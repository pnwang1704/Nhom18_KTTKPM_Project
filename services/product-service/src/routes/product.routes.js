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

const multer = require('multer');

// Multer configuration for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'), false);
    }
  }
});

router.get('/', productController.getProducts);
router.get('/reviews/all', productController.getAllReviews);
router.get('/:id', productController.getProduct);

router.post('/upload', upload.single('image'), productController.uploadImage);
router.post('/', validateRequest(productSchema), productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.post('/:id/reviews', productController.createReview);
router.delete('/:productId/reviews/:reviewId', productController.deleteReview);

module.exports = router;
