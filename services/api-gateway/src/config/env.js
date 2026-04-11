const port = process.env.PORT || 3000;
const nodeEnv = process.env.NODE_ENV || 'development';
const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';

module.exports = {
  port,
  nodeEnv,
  authServiceUrl
};