const router = require("express").Router();
const {
  createPaymentProxyMiddleware,
} = require("../services/orderProxy.service");

const proxyToPayment = createPaymentProxyMiddleware();

router.post("/payments", proxyToPayment);
router.post("/payments/webhook", proxyToPayment);

module.exports = router;
