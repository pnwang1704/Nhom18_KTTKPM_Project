const { createProductProxyMiddleware } = require('../services/productProxy.service');

const proxyToProductService = createProductProxyMiddleware();

module.exports = {
  proxyToProductService
};
