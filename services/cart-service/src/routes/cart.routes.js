const router = require("express").Router();
const userFromHeader = require("../middlewares/userFromHeader");
const controller = require("../controllers/cart.controller");

// All routes require authenticated user via X-User-Payload header
router.use(userFromHeader);

router.post("/add", controller.addItem);
router.get("/", controller.getCart);
router.put("/update", controller.updateItem);
router.delete("/remove/:productId", controller.removeItem);
router.delete("/clear", controller.clearCart);

module.exports = router;
