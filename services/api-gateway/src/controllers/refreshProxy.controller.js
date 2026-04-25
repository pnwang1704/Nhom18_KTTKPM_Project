const { createRefreshProxyMiddleware } = require('../services/refreshProxy.service');

const proxyToRefreshEndpoint = createRefreshProxyMiddleware();

module.exports = {
  proxyToRefreshEndpoint
};
