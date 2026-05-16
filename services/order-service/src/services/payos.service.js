const crypto = require("crypto");
const axios = require("axios");
const {
  payosApiUrl,
  payosSecret,
  payosClientId,
  payosApiKey,
  payosReturnUrl,
} = require("../config/env");

// Minimal PayOS integration abstraction. If PAYOS_API_URL is not provided,
// generate a fake checkout link for local/dev.
// In-memory store for simulated payments (local/dev only)
const _simPayments = new Map();

function log(level, event, meta = {}) {
  const msg = { ts: new Date().toISOString(), level, event, ...meta };
  if (level === "error") console.error(JSON.stringify(msg));
  else if (level === "warn") console.warn(JSON.stringify(msg));
  else console.info(JSON.stringify(msg));
}

async function safeAxiosPost(url, data) {
  try {
    const resp = await axios.post(url, data.body, {
      timeout: 5000,
      headers: data.headers || {},
    });
    return resp;
  } catch (err) {
    const message =
      err && err.response && err.response.data && err.response.data.message
        ? err.response.data.message
        : err.message || "PayOS request failed";
    const clean = new Error(message);
    clean.statusCode =
      err && err.response && err.response.status ? err.response.status : 502;
    log("error", "payos:axios-failure", {
      url,
      error: clean.message,
      statusCode: clean.statusCode,
    });
    throw clean;
  }
}

async function safeAxiosGet(url) {
  try {
    const resp = await axios.get(url, {
      timeout: 5000,
      headers: {
        "x-client-id": payosClientId,
        "x-api-key": payosApiKey,
      },
    });
    return resp;
  } catch (err) {
    const message =
      err && err.response && err.response.data && err.response.data.message
        ? err.response.data.message
        : err.message || "PayOS request failed";
    const clean = new Error(message);
    clean.statusCode =
      err && err.response && err.response.status ? err.response.status : 502;
    log("error", "payos:axios-failure", {
      url,
      error: clean.message,
      statusCode: clean.statusCode,
    });
    throw clean;
  }
}

function createPaymentSignature({
  amount,
  cancelUrl,
  description,
  orderCode,
  returnUrl,
}) {
  const signData = `amount=${amount}&cancelUrl=${cancelUrl}&description=${description}&orderCode=${orderCode}&returnUrl=${returnUrl}`;
  return crypto
    .createHmac("sha256", payosSecret)
    .update(signData)
    .digest("hex");
}

async function createPayment(orderOrOrderId, amount, returnUrl) {
  const orderIdStr =
    typeof orderOrOrderId === "object" && orderOrOrderId !== null
      ? String(
          orderOrOrderId._id || orderOrOrderId.id || orderOrOrderId.orderId,
        )
      : String(orderOrOrderId);
  const finalAmount =
    typeof orderOrOrderId === "object" && orderOrOrderId !== null
      ? Number(orderOrOrderId.totalPrice || amount)
      : Number(amount);
  if (payosApiUrl && payosClientId && payosApiKey && payosSecret) {
    const now = Date.now();
    // Use a numeric orderCode (timestamp slice) to ensure PayOS creates a new
    // payment link/QR reliably. We still include our internal order id in the
    // returnUrl so we can correlate the result.
    const orderCode = Number(String(now).slice(-10));
    const finalReturnUrl =
      returnUrl || payosReturnUrl || "http://localhost:5173/payment/return";
    const cancelUrl = finalReturnUrl;
    const description = `DH ${String(orderIdStr).slice(-8)}`;
    const items =
      typeof orderOrOrderId === "object" && Array.isArray(orderOrOrderId.items)
        ? orderOrOrderId.items.map((item) => ({
            name: String(item.name || "San pham").slice(0, 25),
            quantity: Number(item.quantity || 1),
            price: Number(item.price || 0),
          }))
        : [];

    const roundedAmount = Math.round(finalAmount);
    const body = {
      orderCode,
      // Use the canonical order amount (no demo forcing)
      amount: roundedAmount,
      description,
      items,
      cancelUrl,
      returnUrl: finalReturnUrl,
      signature: createPaymentSignature({
        amount: roundedAmount,
        cancelUrl,
        description,
        orderCode,
        returnUrl: finalReturnUrl,
      }),
    };

    const resp = await safeAxiosPost(`${payosApiUrl}/v2/payment-requests`, {
      body,
      headers: {
        "x-client-id": payosClientId,
        "x-api-key": payosApiKey,
      },
    });

    const payload = resp.data && resp.data.data ? resp.data.data : resp.data;
    // include the final amount that was used / returned by PayOS for later sanity checks
    const usedAmount =
      typeof payload.amount !== "undefined" ? payload.amount : body.amount;
    return {
      paymentId:
        payload.paymentLinkId || String(payload.orderCode || orderCode),
      paymentLinkId:
        payload.paymentLinkId || String(payload.orderCode || orderCode),
      checkoutUrl: payload.checkoutUrl,
      amount: usedAmount,
    };
  }
  // Fallback: simulate payment creation and store metadata for getPaymentStatus
  const paymentId = `pay_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  const checkoutUrl = `https://payos.example/checkout/${paymentId}?return=${encodeURIComponent(returnUrl || "")}`;
  _simPayments.set(paymentId, {
    paymentId,
    status: "pending",
    amount: finalAmount,
    orderId: orderIdStr,
  });
  return {
    paymentId,
    paymentLinkId: paymentId,
    checkoutUrl,
    amount: finalAmount,
  };
}

function verifyWebhookSignature(rawBody, signature) {
  try {
    if (!signature || typeof signature !== "string") return false;
    if (!/^[0-9a-fA-F]+$/.test(signature)) return false;
    const h = crypto
      .createHmac("sha256", payosSecret)
      .update(rawBody)
      .digest("hex");
    const expected = Buffer.from(h, "hex");
    const actual = Buffer.from(signature, "hex");
    if (expected.length !== actual.length) return false;
    return crypto.timingSafeEqual(expected, actual);
  } catch (err) {
    return false;
  }
}

module.exports = { createPayment, verifyWebhookSignature };

// Query payment status from PayOS (if configured)
async function getPaymentStatus(paymentId) {
  if (!payosApiUrl) {
    const r = _simPayments.get(paymentId);
    if (r) {
      return {
        paymentId,
        status: r.status || "pending",
        amount: r.amount,
        orderId: r.orderId,
      };
    }
    return {
      paymentId,
      status: "pending",
      amount: undefined,
      orderId: undefined,
    };
  }
  const resp = await safeAxiosGet(
    `${payosApiUrl}/v2/payment-requests/${paymentId}`,
  );
  const payload = resp.data && resp.data.data ? resp.data.data : resp.data;
  return {
    paymentId: payload.id || paymentId,
    status: payload.status,
    amount: payload.amount,
    orderId: payload.orderCode,
  };
}

module.exports.getPaymentStatus = getPaymentStatus;
