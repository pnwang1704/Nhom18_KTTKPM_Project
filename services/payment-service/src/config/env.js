require("dotenv").config();

module.exports = {
  port: Number(process.env.PORT || 5003),
  mongoUri: process.env.MONGO_URI || "mongodb://mongodb:27017/payment_service",
  payosClientId: process.env.PAYOS_CLIENT_ID || "",
  payosApiKey: process.env.PAYOS_API_KEY || "",
  payosChecksumKey:
    process.env.PAYOS_CHECKSUM_KEY || process.env.PAYOS_SECRET || "",
  orderServiceUrl: process.env.ORDER_SERVICE_URL || "http://localhost:3010",
};
