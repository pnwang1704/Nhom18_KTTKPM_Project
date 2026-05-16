const axios = require("axios");
const { productServiceUrl } = require("../config/env");

const client = axios.create({
  baseURL:
    productServiceUrl ||
    process.env.PRODUCT_SERVICE_URL ||
    "http://product-service:3002",
  timeout: 5000,
});

async function getProductById(productId) {
  try {
    const resp = await client.get(`/products/${productId}`);
    if (resp.status === 200 && resp.data && resp.data.data) {
      return resp.data.data;
    }
    // If product service returns success without data, treat as not found
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  } catch (err) {
    if (err.response && err.response.status === 404) {
      const error = new Error("Product not found");
      error.statusCode = 404;
      throw error;
    }
    throw new Error("Failed to fetch product");
  }
}

module.exports = { getProductById };
