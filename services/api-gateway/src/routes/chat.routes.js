const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const router = express.Router();

const chatProxy = createProxyMiddleware({
  target: process.env.CHAT_SERVICE_URL || 'http://chat-service:3005',
  changeOrigin: true,
  ws: true,
  pathRewrite: {
    '^/api/chat': '', // Loại bỏ /api/chat để gửi tới chat-service
  },
  onProxyReq: (proxyReq, req) => {
    console.log(`[Proxy] Chat: ${req.method} ${req.url} -> ${proxyReq.path}`);
  },
  onError: (err, req, res) => {
    console.error('Chat Proxy Error:', err);
    res.status(500).json({ success: false, message: 'Chat Service unavailable' });
  }
});

router.all('/*', chatProxy);

module.exports = router;
