const port = process.env.PORT || 3000;
const nodeEnv = process.env.NODE_ENV || 'development';
const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';
const productServiceUrl = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3002';
const jwtSecret = process.env.JWT_SECRET || 'change_me';

module.exports = {
  port,
  nodeEnv,
  authServiceUrl,
  productServiceUrl,
  jwtSecret
};