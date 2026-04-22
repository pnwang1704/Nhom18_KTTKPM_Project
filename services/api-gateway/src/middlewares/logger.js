function loggerMiddleware(req, res, next) {
  const startedAt = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startedAt;
    const logData = {
      timestamp: new Date().toISOString(),
      correlationId: req.correlationId || 'N/A',
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    };
    
    console.log(JSON.stringify(logData));
  });

  next();
}

module.exports = loggerMiddleware;