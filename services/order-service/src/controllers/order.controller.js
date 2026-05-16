const orderService = require("../services/order.service");

async function checkout(req, res, next) {
  try {
    const userId = req.user && req.user.userId;
    const { returnUrl, idempotencyKey, items } = req.body;
    const result = await orderService.createOrderFromCart(
      userId,
      returnUrl,
      idempotencyKey,
      { items, correlationId: req.correlationId },
    );
    res.status(200).json({
      success: true,
      data: {
        orderId: result.orderId,
        checkoutUrl: result.checkoutUrl,
        returnUrl: result.returnUrl,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function getOrder(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user && req.user.userId;
    const order = await orderService.getOrderById(id, userId);
    res.status(200).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
}

async function getMyOrders(req, res, next) {
  try {
    const userId = req.user && req.user.userId;
    const orders = await orderService.getMyOrders(userId);
    res.status(200).json({ success: true, data: orders });
  } catch (err) {
    next(err);
  }
}

async function getAllOrders(req, res, next) {
  try {
    const user = req.user || {};
    if (!user.role || user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }
    const orders = await orderService.getAllOrders();
    res.status(200).json({ success: true, data: orders });
  } catch (err) {
    next(err);
  }
}

const payosService = require("../services/payos.service");

async function payosWebhook(req, res, next) {
  try {
    const signature = req.headers["x-payos-signature"] || "";
    const raw = req.rawBody || Buffer.from(JSON.stringify(req.body));

    const isValid = payosService.verifyWebhookSignature(raw, signature);
    if (!isValid) {
      console.warn(
        JSON.stringify({
          ts: new Date().toISOString(),
          level: "warn",
          event: "webhook:invalid-signature",
        }),
      );
      return res
        .status(401)
        .json({ success: false, message: "Invalid signature" });
    }

    res.status(200).json({ success: true, message: "Webhook received" });

    orderService.handlePayOsWebhook(raw, signature).catch((err) => {
      console.error(
        JSON.stringify({
          ts: new Date().toISOString(),
          level: "error",
          event: "webhook:background-processing-failed",
          error: err.message,
        }),
      );
    });
  } catch (err) {
    if (!res.headersSent) {
      next(err);
    } else {
      console.error(
        JSON.stringify({
          ts: new Date().toISOString(),
          level: "error",
          event: "webhook:unexpected-error",
          error: err.message,
        }),
      );
    }
  }
}

module.exports = {
  checkout,
  getOrder,
  getMyOrders,
  getAllOrders,
  payosWebhook,
};
