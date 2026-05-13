const { createProductProxyMiddleware } = require('../services/productProxy.service');

const proxyToProductService = createProductProxyMiddleware('/products');
const proxyToCategoryService = createProductProxyMiddleware('/categories');

module.exports = {
  proxyToProductService,
  proxyToCategoryService
};
