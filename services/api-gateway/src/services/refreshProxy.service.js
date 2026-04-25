const { createProxyMiddleware } = require('http-proxy-middleware');
const { authServiceUrl } = require('../config/env');

function createRefreshProxyMiddleware() {
  return createProxyMiddleware({
    target: authServiceUrl,
    changeOrigin: true,
    logLevel: 'silent',
    timeout: 5000,
    proxyTimeout: 5000,
    pathRewrite: (path) => '/auth/refresh-token', // Explicitly map to auth-service's refresh endpoint
    onProxyReq: (proxyReq, req) => {
      if (req.correlationId) {
        proxyReq.setHeader('X-Correlation-ID', req.correlationId);
      }
      console.log(`[proxy] ${req.method} ${req.originalUrl} -> ${authServiceUrl}/auth/refresh-token [Trace: ${req.correlationId || 'N/A'}]`);
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
  createRefreshProxyMiddleware
};
