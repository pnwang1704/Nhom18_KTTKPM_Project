const crypto = require("crypto");
const axios = require("axios");
const {
  payosClientId,
  payosApiKey,
  payosChecksumKey,
} = require("../config/env");

function buildSignature(payload) {
  return crypto
    .createHmac("sha256", payosChecksumKey || "change-me")
    .update(payload)
    .digest("hex");
}

async function createPaymentLink(data) {
  const body = {
    orderId: String(data.orderId),
    amount: Number(data.amount),
    description: String(data.description || `Order ${data.orderId}`),
  };

  if (payosClientId && payosApiKey && payosChecksumKey) {
    const response = await axios.post(
      "https://api-merchant.payos.vn/v2/payment-requests",
      body,
      {
        headers: {
          "x-client-id": payosClientId,
          "x-api-key": payosApiKey,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      },
    );

    const payload = response.data?.data || response.data || {};
    return {
      paymentLinkId: String(
        payload.paymentLinkId ||
          payload.orderCode ||
          payload.id ||
          body.orderId,
      ),
      checkoutUrl: payload.checkoutUrl || payload.checkout_url || payload.url,
    };
  }

  const paymentLinkId = `payos_${body.orderId}`;
  return {
    paymentLinkId,
    checkoutUrl: `https://payos.example/checkout/${encodeURIComponent(
      paymentLinkId,
    )}?amount=${encodeURIComponent(String(body.amount))}`,
  };
}

function verifyWebhookSignature(rawBody, signature) {
  if (!signature || typeof signature !== "string") return false;
  if (!rawBody) return false;

  const payload = Buffer.isBuffer(rawBody)
    ? rawBody.toString("utf8")
    : typeof rawBody === "string"
      ? rawBody
      : JSON.stringify(rawBody);

  const expected = buildSignature(payload);

  try {
    const expectedBuffer = Buffer.from(expected, "hex");
    const signatureBuffer = Buffer.from(signature, "hex");
    if (expectedBuffer.length !== signatureBuffer.length) return false;
    return crypto.timingSafeEqual(expectedBuffer, signatureBuffer);
  } catch {
    return false;
  }
}

module.exports = {
  createPaymentLink,
  verifyWebhookSignature,
};
