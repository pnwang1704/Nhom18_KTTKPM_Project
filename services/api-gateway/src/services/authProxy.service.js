const { createProxyMiddleware } = require('http-proxy-middleware');
const { authServiceUrl } = require('../config/env');

function createAuthProxyMiddleware() {
  return createProxyMiddleware({
    target: authServiceUrl,
    changeOrigin: true,
    logLevel: 'silent',
    timeout: 5000,
    proxyTimeout: 5000,
    pathRewrite: (path) => `/auth${path}`,
    onProxyReq: (proxyReq, req) => {
      console.log(`[proxy] ${req.method} ${req.originalUrl} -> ${authServiceUrl}`);
    },
    onError: (err, req, res) => {
      console.error('[proxy error]', err.message);

      if (!res.headersSent) {
        res.status(502).json({
          success: false,
          message: 'Bad Gateway'
        });
      }
    }
  });
}

module.exports = {
  createAuthProxyMiddleware
};