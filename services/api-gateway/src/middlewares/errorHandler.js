function errorHandlerMiddleware(err, req, res, next) {
  console.error('[gateway error]', err.message || err);

  const message = err.status || err.message ? err.message : 'Internal Server Error';

  res.status(err.status || 500).json({
    success: false,
    message
  });
}

module.exports = errorHandlerMiddleware;