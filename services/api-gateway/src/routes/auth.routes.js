const router = require('express').Router();
const { proxyToAuthService } = require('../controllers/authProxy.controller');

router.all('*', proxyToAuthService);

module.exports = router;