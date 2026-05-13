const router = require('express').Router();
const { proxyToCategoryService } = require('../controllers/productProxy.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Public routes
router.get('/', proxyToCategoryService);

// Protected routes (admin only)
router.post('/', authMiddleware(['admin']), proxyToCategoryService);
router.put('/:id', authMiddleware(['admin']), proxyToCategoryService);
router.delete('/:id', authMiddleware(['admin']), proxyToCategoryService);

module.exports = router;
