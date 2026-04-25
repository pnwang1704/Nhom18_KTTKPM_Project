const router = require('express').Router();
const { proxyToAuthService } = require('../controllers/authProxy.controller');
const { proxyToRefreshEndpoint } = require('../controllers/refreshProxy.controller');

// Refresh token route - must be BEFORE the catch-all
router.post('/refresh', proxyToRefreshEndpoint);

router.all('*', proxyToAuthService);

module.exports = router;