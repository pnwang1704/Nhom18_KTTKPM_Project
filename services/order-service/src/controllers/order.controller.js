const orderService = require("../services/order.service");

async function createOrder(req, res, next) {
  try {
    const userId = req.body && req.body.userId;
    const items = Array.isArray(req.body && req.body.items) ? req.body.items : [];

    if (items.length > 0) {
      const checkout = await orderService.createOrderFromCart(
        userId,
        req.body && req.body.returnUrl,
        req.body && req.body.idempotencyKey,
        {
          items,
          correlationId: req.correlationId,
        },
      );
      return res.status(201).json({ success: true, data: checkout });
    }

    const order = await orderCheckoutService.createOrder(userId);
    res.status(201).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
}

async function checkout(req, res, next) {
  return createOrder(req, res, next);
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

// External payment webhooks are handled by Payment Service. Order Service only accepts internal callbacks.

async function internalPaymentSuccess(req, res, next) {
  try {
    console.log("[ORDER_SERVICE] [CALLBACK] [RECEIVED]", {
      orderId: req.body && req.body.orderId,
      status: req.body && req.body.status,
    });
    const logger = require("../utils/logger");
    logger.info("internalPaymentSuccess:received", {
      orderId: req.body && req.body.orderId,
      status: req.body && req.body.status,
    });
    await orderService.applyPaymentResult({
      orderId: req.body.orderId,
      status: req.body.status,
      paymentId: req.body.paymentId,
    });
    logger.info("internalPaymentSuccess:handled", {
      orderId: req.body.orderId,
      status: req.body.status,
      paymentId: req.body.paymentId,
    });
    return res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

async function confirmPaymentReturn(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user && req.user.userId;
    const order = await orderService.getOrderById(id, userId);

    const status = req.body?.status;
    const paymentId =
      req.body?.paymentId || req.body?.paymentLookupId || order?.paymentId;

    const updated = await orderService.applyPaymentResult({
      orderId: order._id,
      status,
      paymentId,
    });

    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createOrder,
  checkout,
  getOrder,
  getMyOrders,
  getAllOrders,
  internalPaymentSuccess,
  confirmPaymentReturn,
};
