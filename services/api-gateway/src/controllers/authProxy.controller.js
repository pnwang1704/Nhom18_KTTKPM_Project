const { createAuthProxyMiddleware } = require('../services/authProxy.service');

const proxyToAuthService = createAuthProxyMiddleware();

module.exports = {
  proxyToAuthService
};