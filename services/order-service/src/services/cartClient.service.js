const axios = require("axios");
const { cartServiceUrl } = require("../config/env");

const client = axios.create({ baseURL: cartServiceUrl, timeout: 5000 });

async function getCartByUser(userId) {
  const resp = await client.get("/cart", {
    headers: { "X-User-Payload": JSON.stringify({ userId }) },
  });
  if (resp.status === 200 && resp.data) return resp.data.data || resp.data;
  throw new Error("Failed to fetch cart");
}

async function clearCart(userId, expectedVersion) {
  const opts = {
    headers: { "X-User-Payload": JSON.stringify({ userId }) },
    // axios allows body in DELETE via `data`
    data: expectedVersion !== undefined ? { expectedVersion } : undefined,
  };
  const resp = await client.delete("/cart/clear", opts);
  if (resp.status === 200 && resp.data) {
    if (resp.data.cleared === false || resp.data.data === null) return null;
    return resp.data.data || resp.data;
  }
  return null;
}

module.exports = { getCartByUser, clearCart };
