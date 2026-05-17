const axios = require("axios");
const Payment = require("../models/payment.model");
const {
  createPaymentLink,
  verifyWebhookSignature,
} = require("../integrations/payos.client");
const { orderServiceUrl } = require("../config/env");
const { logPaymentEvent } = require("../utils/logger");

function badRequest(message) {
  const error = new Error(message);
  error.statusCode = 400;
  error.errorCode = "BAD_REQUEST";
  return error;
}

function isTerminalPaymentStatus(status) {
  return ["PAID", "FAILED"].includes(String(status || "").toUpperCase());
}

async function retryWithBackoff(fn, attempts = 2) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt < attempts) {
        await new Promise((resolve) => setTimeout(resolve, 150 * attempt));
      }
    }
  }
  throw lastError;
}

class PaymentService {
  constructor({ paymentModel = Payment } = {}) {
    this.paymentModel = paymentModel;
    this.inFlightCreates = new Map();
  }

  async createPayment({ orderId, amount, description }) {
    if (!orderId || !String(orderId).trim()) {
      throw badRequest("orderId is required");
    }
    if (!Number.isFinite(Number(amount)) || Number(amount) < 0) {
      throw badRequest("amount is required");
    }
    if (typeof description !== "undefined" && typeof description !== "string") {
      throw badRequest("description must be a string");
    }

    const normalizedOrderId = String(orderId).trim();
    const normalizedAmount = Number(amount);
    const normalizedDescription = String(
      description || `Order ${normalizedOrderId}`,
    );

    const existing = await this.paymentModel.findOne({
      orderId: normalizedOrderId,
    });
    if (existing) {
      logPaymentEvent("PAYMENT_CREATED", {
        orderId: normalizedOrderId,
        amount: existing.amount,
        idempotencyHit: true,
      });
      return existing;
    }

    if (this.inFlightCreates.has(normalizedOrderId)) {
      return this.inFlightCreates.get(normalizedOrderId);
    }

    const createPromise = this._createPaymentInternal({
      orderId: normalizedOrderId,
      amount: normalizedAmount,
      description: normalizedDescription,
    });
    this.inFlightCreates.set(normalizedOrderId, createPromise);

    try {
      return await createPromise;
    } finally {
      this.inFlightCreates.delete(normalizedOrderId);
    }
  }

  async _createPaymentInternal({ orderId, amount, description }) {
    const existing = await this.paymentModel.findOne({ orderId });
    if (existing) {
      return existing;
    }

    try {
      const providerResponse = await createPaymentLink({
        orderId,
        amount,
        description,
      });
      const payment = await this.paymentModel.create({
        orderId,
        amount,
        status: "PENDING",
        provider: "PAYOS",
        paymentLinkId: providerResponse.paymentLinkId,
        checkoutUrl: providerResponse.checkoutUrl,
      });

      logPaymentEvent("PAYMENT_CREATED", {
        orderId,
        paymentLinkId: payment.paymentLinkId,
        checkoutUrl: payment.checkoutUrl,
        amount,
      });

      return payment;
    } catch (error) {
      if (error && error.code === 11000) {
        const existingPayment = await this.paymentModel.findOne({ orderId });
        if (existingPayment) {
          return existingPayment;
        }
      }

      logPaymentEvent("PAYMENT_FAILED", {
        orderId,
        amount,
        error: error.message,
      });
      throw error;
    }
  }

  async handleWebhook({ payload, signature }) {
    logPaymentEvent("WEBHOOK_RECEIVED", { provider: "PAYOS" });

    if (!verifyWebhookSignature(payload, signature)) {
      const error = new Error("Invalid signature");
      error.statusCode = 400;
      error.errorCode = "INVALID_SIGNATURE";
      throw error;
    }

    const rawPayload = Buffer.isBuffer(payload)
      ? payload.toString("utf8")
      : payload;
    let data;
    try {
      data =
        typeof rawPayload === "string" ? JSON.parse(rawPayload) : rawPayload;
    } catch (error) {
      const invalid = new Error("Invalid webhook body");
      invalid.statusCode = 400;
      invalid.errorCode = "BAD_REQUEST";
      throw invalid;
    }

    const orderCode = String(data.orderCode || data.paymentLinkId || "").trim();
    const transactionId = String(data.transactionId || data.id || "").trim();
    const status = String(data.status || data.code || "").toUpperCase();

    if (!orderCode || !status) {
      throw badRequest("Invalid webhook payload");
    }

    const paymentLinkId = orderCode;

    const payment = await this.paymentModel.findOne({
      $or: [{ paymentLinkId }, { orderId: paymentLinkId }, { transactionId }],
    });
    if (!payment) {
      console.log("[PAYMENT_SERVICE] [WEBHOOK] [IGNORED] payment not found", {
        orderCode,
        status,
      });
      return { ignored: true };
    }

    if (isTerminalPaymentStatus(payment.status)) {
      console.log("[PAYMENT_SERVICE] [WEBHOOK] [IGNORED] terminal payment", {
        orderId: payment.orderId,
        status: payment.status,
      });
      return payment;
    }

    if (status !== "SUCCESS" && status !== "PAID" && status !== "COMPLETED") {
      const failed = await this.paymentModel.findOneAndUpdate(
        { _id: payment._id },
        {
          $set: {
            status: "FAILED",
            transactionId: transactionId || payment.transactionId,
          },
        },
        { new: true },
      );
      logPaymentEvent("PAYMENT_FAILED", {
        orderId: failed.orderId,
        paymentLinkId: failed.paymentLinkId,
        transactionId: failed.transactionId,
      });
      return failed;
    }

    const updated = await this.paymentModel.findOneAndUpdate(
      { _id: payment._id, status: { $ne: "PAID" } },
      {
        $set: {
          status: "PAID",
          transactionId: transactionId || payment.transactionId,
        },
      },
      { new: true },
    );

    if (!updated) {
      return payment;
    }

    logPaymentEvent("PAYMENT_SUCCESS", {
      orderId: updated.orderId,
      paymentLinkId: updated.paymentLinkId,
      transactionId: updated.transactionId,
    });

    await this.notifyOrderService(updated.orderId, "PAID");
    return updated;
  }

  async notifyOrderService(orderId, status) {
    if (!orderServiceUrl) return;
    console.log("[PAYMENT_SERVICE] [CALL_ORDER_SERVICE] [START]", {
      orderId,
      status,
      url: `${orderServiceUrl}/internal/payment-success`,
    });

    try {
      await retryWithBackoff(
        () =>
          axios.post(
            `${orderServiceUrl}/internal/payment-success`,
            { orderId, status },
            { timeout: 5000 },
          ),
        2,
      );
      console.log("[PAYMENT_SERVICE] [CALL_ORDER_SERVICE] [SUCCESS]", {
        orderId,
        status,
      });
    } catch (error) {
      console.error("[PAYMENT_SERVICE] [CALL_ORDER_SERVICE] [FAILED]", {
        orderId,
        status,
        message: error.message,
      });
      throw error;
    }
  }
}

module.exports = new PaymentService();
module.exports.PaymentService = PaymentService;
