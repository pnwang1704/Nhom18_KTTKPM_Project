function proxyToAuthService(req, res) {
  res.status(501).json({
    success: false,
    message: 'Auth proxy placeholder. Proxy implementation will be added later.'
  });
}

module.exports = {
  proxyToAuthService
};