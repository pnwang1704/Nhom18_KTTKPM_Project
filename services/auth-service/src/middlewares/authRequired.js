function authRequired(req, res, next) {
  return res.status(501).json({
    success: false,
    message: 'JWT auth middleware is reserved for the next iteration.'
  });
}

module.exports = authRequired;