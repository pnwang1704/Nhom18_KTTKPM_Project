const router = require("express").Router();
const userFromHeader = require("../middlewares/userFromHeader");
const ctrl = require("../controllers/order.controller");

router.post("/checkout", userFromHeader, ctrl.checkout);
router.get("/", userFromHeader, ctrl.getAllOrders);
router.get("/me", userFromHeader, ctrl.getMyOrders);
router.get("/:id", userFromHeader, ctrl.getOrder);
router.post(["/webhook/payos", "/payos"], ctrl.payosWebhook);

module.exports = router;
