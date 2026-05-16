const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Product",
  },
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1 },
  image: { type: String },
  stock: { type: Number, required: true, min: 0 },
});

const cartSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    items: { type: [itemSchema], default: [] },
    totalPrice: { type: Number, default: 0, min: 0 },
    // Cart mutation version - incremented on every change to support
    // conditional clears and safe idempotent operations from orders/outbox.
    version: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true },
);

// Ensure a user cannot have the same product twice in their cart
// This creates index entries for each array element; the unique constraint
// on (userId, items.productId) prevents duplicate productId per user.
cartSchema.index(
  { userId: 1, "items.productId": 1 },
  { unique: true, sparse: true },
);

module.exports = mongoose.model("Cart", cartSchema);
