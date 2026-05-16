const axios = require("axios");
const { productServiceUrl } = require("../config/env");

const client = axios.create({ baseURL: productServiceUrl, timeout: 5000 });

async function getProductById(productId) {
  try {
    const resp = await client.get(`/products/${productId}`);
    if (resp.status === 200 && resp.data && resp.data.data)
      return resp.data.data;
    const e = new Error("Product not found");
    e.statusCode = 404;
    throw e;
  } catch (err) {
    if (err.response && err.response.status === 404) {
      const e = new Error("Product not found");
      e.statusCode = 404;
      throw e;
    }
    throw new Error("Failed to fetch product");
  }
}

module.exports = { getProductById };
