const { v4: uuidv4 } = require('uuid');

const correlationMiddleware = (req, res, next) => {
  const headerName = 'X-Correlation-ID';
  const correlationId = req.headers[headerName.toLowerCase()] || uuidv4();

  // Set the correlation ID in the request object for easy access
  req.correlationId = correlationId;

  // Ensure it's in the response headers too
  res.set(headerName, correlationId);

  next();
};

module.exports = correlationMiddleware;
