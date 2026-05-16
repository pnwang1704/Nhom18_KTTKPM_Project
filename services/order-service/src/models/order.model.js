const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Product",
  },
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1 },
});

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    items: { type: [orderItemSchema], default: [] },
    totalPrice: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: [
        "PENDING",
        "WAITING_PAYMENT",
        "PAID",
        "COMPLETED",
        "FAILED",
        "CANCELLED",
      ],
      default: "PENDING",
    },
    paymentId: { type: String },
    metadata: { type: mongoose.Schema.Types.Mixed },
    // track processed payment ids / webhook ids to ensure idempotency
    processedPaymentIds: { type: [String], default: [] },
    processedWebhookIds: { type: [String], default: [] },
    // optional idempotency key provided by client on checkout
    idempotencyKey: { type: String, index: true, sparse: true },
    // optimistic locking version - incremented on updates
    lockVersion: { type: Number, default: 0 },
    // whether a payment creation was attempted
    paymentAttemptedAt: { type: Date },
    // payment expiration timestamp (set when payment created)
    paymentExpiresAt: { type: Date },
    // whether the cart has been cleared after successful payment
    cartCleared: { type: Boolean, default: false },
    // the cart.version at the time of order creation - used for conditional clear
    cartVersion: { type: Number, default: 0 },
  },
  { timestamps: true },
);

orderSchema.index({ userId: 1 });
// Unique idempotency key to prevent duplicate orders; sparse so null keys are ignored
orderSchema.index({ idempotencyKey: 1 }, { unique: true, sparse: true });
orderSchema.index({ processedWebhookIds: 1 });
// Prevent more than one active order per user (PENDING or WAITING_PAYMENT)
orderSchema.index(
  { userId: 1, status: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: { $in: ["PENDING", "WAITING_PAYMENT"] },
    },
  },
);

module.exports = mongoose.model("Order", orderSchema);
