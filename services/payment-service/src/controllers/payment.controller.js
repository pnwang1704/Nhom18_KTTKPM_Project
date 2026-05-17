const paymentService = require("../services/payment.service");

async function createPaymentController(req, res, next) {
  try {
    const payment = await paymentService.createPayment(req.body || {});
    res.status(201).json({ success: true, data: payment });
  } catch (error) {
    next(error);
  }
}

async function webhookController(req, res, next) {
  try {
    const result = await paymentService.handleWebhook({
      payload: req.rawBody || req.body,
      signature: req.headers["x-payos-signature"] || "",
    });
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

module.exports = { createPaymentController, webhookController };
