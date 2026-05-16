const cartService = require("../services/cart.service");

async function addItem(req, res, next) {
  try {
    const userId = req.user.userId;
    const { productId, quantity } = req.body;
    const cart = await cartService.addItem(userId, productId, Number(quantity));
    res.status(200).json({ success: true, data: cart });
  } catch (err) {
    next(err);
  }
}

async function getCart(req, res, next) {
  try {
    const userId = req.user.userId;
    const cart = await cartService.getCart(userId);
    res.status(200).json({ success: true, data: cart });
  } catch (err) {
    next(err);
  }
}

async function updateItem(req, res, next) {
  try {
    const userId = req.user.userId;
    const { productId, quantity } = req.body;
    const cart = await cartService.updateItem(
      userId,
      productId,
      Number(quantity),
    );
    res.status(200).json({ success: true, data: cart });
  } catch (err) {
    next(err);
  }
}

async function removeItem(req, res, next) {
  try {
    const userId = req.user.userId;
    const { productId } = req.params;
    const cart = await cartService.removeItem(userId, productId);
    res.status(200).json({ success: true, data: cart });
  } catch (err) {
    next(err);
  }
}

async function clearCart(req, res, next) {
  try {
    const userId = req.user.userId;
    // optional expectedVersion may be provided by internal callers to avoid
    // clearing a cart that has been modified since checkout
    const expectedVersion =
      typeof req.body?.expectedVersion !== "undefined"
        ? Number(req.body.expectedVersion)
        : typeof req.query?.expectedVersion !== "undefined"
          ? Number(req.query.expectedVersion)
          : undefined;
    const cart = await cartService.clearCart(userId, expectedVersion);
    res.status(200).json({ success: true, data: cart });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  addItem,
  getCart,
  updateItem,
  removeItem,
  clearCart,
};
