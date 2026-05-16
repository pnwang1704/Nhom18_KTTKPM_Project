module.exports = {
  port: process.env.PORT || 3010,
  nodeEnv: process.env.NODE_ENV || "development",
  productServiceUrl:
    process.env.PRODUCT_SERVICE_URL || "http://product-service:3002",
  cartServiceUrl: process.env.CART_SERVICE_URL || "http://cart-service:3003",
  payosApiUrl: process.env.PAYOS_API_URL || "",
  payosClientId: process.env.PAYOS_CLIENT_ID || "",
  payosApiKey: process.env.PAYOS_API_KEY || "",
  payosSecret:
    process.env.PAYOS_SECRET || process.env.PAYOS_CHECKSUM_KEY || "change-me",
  payosReturnUrl: process.env.PAYOS_RETURN_URL || "",
};
