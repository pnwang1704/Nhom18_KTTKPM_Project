const port = process.env.PORT || 3003;
const nodeEnv = process.env.NODE_ENV || "development";
const productServiceUrl =
  process.env.PRODUCT_SERVICE_URL || "http://product-service:3002";

module.exports = {
  port,
  nodeEnv,
  productServiceUrl,
};
