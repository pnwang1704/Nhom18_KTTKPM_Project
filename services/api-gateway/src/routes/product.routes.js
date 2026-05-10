const router = require('express').Router();
const { proxyToProductService } = require('../controllers/productProxy.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Public routes
router.get('/', proxyToProductService);
router.get('/:id', proxyToProductService);

// Protected routes (admin only)
router.post('/upload', authMiddleware(['admin']), proxyToProductService);
router.post('/', authMiddleware(['admin']), proxyToProductService);
router.put('/:id', authMiddleware(['admin']), proxyToProductService);
router.delete('/:id', authMiddleware(['admin']), proxyToProductService);

module.exports = router;
