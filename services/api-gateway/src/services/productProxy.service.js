const { createProxyMiddleware } = require('http-proxy-middleware');
const { productServiceUrl } = require('../config/env');

function createProductProxyMiddleware() {
  return createProxyMiddleware({
    target: productServiceUrl,
    changeOrigin: true,
    logLevel: 'silent',
    timeout: 5000,
    proxyTimeout: 5000,
    pathRewrite: (path) => `/products${path}`,
    onProxyReq: (proxyReq, req) => {
      // Forward Correlation ID
      if (req.correlationId) {
        proxyReq.setHeader('X-Correlation-ID', req.correlationId);
      }

      if (req.user) {
        proxyReq.setHeader('X-User-Payload', JSON.stringify(req.user));
      }

      console.log(`[proxy] ${req.method} ${req.originalUrl} -> ${productServiceUrl} [Trace: ${req.correlationId || 'N/A'}]`);
    },
    onError: (err, req, res) => {
      console.error('[proxy error]', err.message);

      if (!res.headersSent) {
        res.status(503).json({
          success: false,
          message: 'Service Unavailable',
          data: null,
          errorCode: 'SERVICE_UNAVAILABLE'
        });
      }
    }
  });
}

module.exports = {
  createProductProxyMiddleware
};
