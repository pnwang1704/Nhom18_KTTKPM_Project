const Cart = require("../models/cart.model");
const { getProductById } = require("./productClient.service");
const mongoose = require("mongoose");

class CartService {
  // Helper to recalculate totalPrice atomically using an aggregation update pipeline
  async _recalculateTotal(userId) {
    // Use aggregation pipeline update to compute sum(items.price * items.quantity)
    const updated = await Cart.findOneAndUpdate(
      { userId },
      [
        {
          $set: {
            totalPrice: {
              $reduce: {
                input: "$items",
                initialValue: 0,
                in: {
                  $add: [
                    "$$value",
                    { $multiply: ["$$this.price", "$$this.quantity"] },
                  ],
                },
              },
            },
          },
        },
      ],
      { new: true },
    );
    return updated;
  }

  // Add item: atomic increment if exists (with stock guard), otherwise atomic push (if not exists)
  async addItem(userId, productId, quantity) {
    if (!productId) {
      const e = new Error("productId is required");
      e.statusCode = 400;
      throw e;
    }
    if (!Number.isInteger(quantity) || quantity <= 0) {
      const e = new Error("Invalid quantity");
      e.statusCode = 400;
      throw e;
    }

    const product = await getProductById(productId);
    if (!product) {
      const e = new Error("Product not found");
      e.statusCode = 404;
      throw e;
    }

    // Try to increment existing item only if resulting quantity <= stock
    const incResult = await Cart.findOneAndUpdate(
      {
        userId,
        items: {
          $elemMatch: {
            productId: mongoose.Types.ObjectId(productId),
            quantity: { $lte: product.stock - quantity },
          },
        },
      },
      {
        $inc: {
          "items.$.quantity": quantity,
          totalPrice: product.price * quantity,
          version: 1,
        },
        $set: {
          "items.$.price": product.price,
          "items.$.name": product.name,
          "items.$.image": product.image || product.images?.[0] || "",
          "items.$.stock": product.stock,
        },
      },
      { new: true },
    );

    if (incResult) {
      // Ensure consistency by recalculating totalPrice (defense against drift)
      return this._recalculateTotal(userId);
    }

    // If increment didn't happen, ensure item doesn't already exist (meaning stock insufficient)
    const exists = await Cart.exists({
      userId,
      "items.productId": mongoose.Types.ObjectId(productId),
    });
    if (exists) {
      const e = new Error("Out of stock");
      e.statusCode = 400;
      throw e;
    }

    // Push new item atomically only if it does not exist
    const pushResult = await Cart.findOneAndUpdate(
      {
        userId,
        "items.productId": { $ne: mongoose.Types.ObjectId(productId) },
      },
      {
        $setOnInsert: { userId },
        $push: {
          items: {
            productId: mongoose.Types.ObjectId(productId),
            name: product.name,
            price: product.price,
            quantity,
            image: product.image || product.images?.[0] || "",
            stock: product.stock,
          },
        },
        $inc: { totalPrice: product.price * quantity, version: 1 },
      },
      { new: true, upsert: true },
    );

    if (pushResult) {
      return this._recalculateTotal(userId);
    }

    const e = new Error("Unable to add item");
    e.statusCode = 500;
    throw e;
  }

  // Update item quantity (set). If quantity === 0, remove it. Re-check stock on every update.
  async updateItem(userId, productId, quantity) {
    if (!productId) {
      const e = new Error("productId is required");
      e.statusCode = 400;
      throw e;
    }
    if (!Number.isInteger(quantity) || quantity <= 0) {
      const e = new Error("Invalid quantity");
      e.statusCode = 400;
      throw e;
    }

    const product = await getProductById(productId);
    if (!product) {
      const e = new Error("Product not found");
      e.statusCode = 404;
      throw e;
    }

    // Ensure requested quantity does not exceed stock
    if (quantity > product.stock) {
      const e = new Error("Out of stock");
      e.statusCode = 400;
      throw e;
    }

    const updated = await Cart.findOneAndUpdate(
      { userId, "items.productId": mongoose.Types.ObjectId(productId) },
      {
        $set: {
          "items.$.quantity": quantity,
          "items.$.price": product.price,
          "items.$.stock": product.stock,
          "items.$.name": product.name,
          "items.$.image": product.image || product.images?.[0] || "",
        },
        $inc: { version: 1 },
      },
      { new: true },
    );

    if (!updated) {
      const e = new Error("Item not in cart");
      e.statusCode = 404;
      throw e;
    }

    return this._recalculateTotal(userId);
  }

  async removeItem(userId, productId) {
    const updated = await Cart.findOneAndUpdate(
      { userId },
      {
        $pull: { items: { productId: mongoose.Types.ObjectId(productId) } },
        $inc: { version: 1 },
      },
      { new: true },
    );
    if (!updated) {
      const e = new Error("Cart not found");
      e.statusCode = 404;
      throw e;
    }
    return this._recalculateTotal(userId);
  }

  // Conditional clearCart: if expectedVersion is provided, only clear when
  // cart.version === expectedVersion. If expectedVersion is undefined,
  // fall back to unconditional clear (upsert) for backward compatibility.
  async clearCart(userId, expectedVersion) {
    if (typeof expectedVersion === "undefined") {
      const updated = await Cart.findOneAndUpdate(
        { userId },
        { $set: { items: [], totalPrice: 0 }, $inc: { version: 1 } },
        { new: true, upsert: true },
      );
      return updated;
    }

    const updated = await Cart.findOneAndUpdate(
      { userId, version: expectedVersion },
      { $set: { items: [], totalPrice: 0 }, $inc: { version: 1 } },
      { new: true },
    );
    // if null -> version mismatch, do nothing (caller can interpret null)
    return updated;
  }

  async getCart(userId) {
    const cart = await Cart.findOne({ userId });
    if (!cart) return { userId, items: [], totalPrice: 0 };
    return cart;
  }

  // Bonus: validateCart - re-check each item against product service and fix price/stock/quantity
  async validateCart(userId) {
    const cart = await Cart.findOne({ userId });
    if (!cart || !cart.items || cart.items.length === 0) return cart;

    const items = cart.items;

    // Fetch product data in parallel
    const checks = await Promise.all(
      items.map(async (it) => {
        try {
          const p = await getProductById(it.productId.toString());
          return { ok: true, product: p, item: it };
        } catch (err) {
          return { ok: false, product: null, item: it };
        }
      }),
    );

    // Build new items array
    const newItems = [];
    for (const c of checks) {
      if (!c.ok) {
        // skip removed product
        continue;
      }
      const p = c.product;
      const desiredQty = Math.min(c.item.quantity, p.stock);
      if (desiredQty <= 0) continue;
      newItems.push({
        productId: mongoose.Types.ObjectId(p._id),
        name: p.name,
        price: p.price,
        quantity: desiredQty,
        image: p.image || p.images?.[0] || "",
        stock: p.stock,
      });
    }

    const totalPrice = newItems.reduce(
      (s, it) => s + it.price * it.quantity,
      0,
    );

    const updated = await Cart.findOneAndUpdate(
      { userId },
      {
        $set: { items: newItems, totalPrice },
        $inc: { version: 1 },
        $setOnInsert: { userId, version: 0 },
      },
      { new: true, upsert: true },
    );

    return updated;
  }
}

module.exports = new CartService();
