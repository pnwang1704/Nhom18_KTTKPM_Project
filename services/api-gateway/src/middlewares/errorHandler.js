function errorHandlerMiddleware(err, req, res, next) {
  console.error('[gateway error]', err.message || err);

  const message = err.status || err.message ? err.message : 'Internal Server Error';

  res.status(err.status || 500).json({
    success: false,
    message,
    data: null,
    errorCode: err.errorCode || 'INTERNAL_SERVER_ERROR'
  });
}

module.exports = errorHandlerMiddleware;