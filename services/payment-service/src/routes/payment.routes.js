const router = require("express").Router();
const controller = require("../controllers/payment.controller");

router.post("/payments", controller.createPaymentController);
router.post("/payments/webhook", controller.webhookController);

module.exports = router;
