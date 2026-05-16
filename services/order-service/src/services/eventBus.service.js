const Outbox = require("../models/outbox.model");
const { getCartByUser, clearCart } = require("./cartClient.service");
const Order = require("../models/order.model");

// Simple broker abstraction: persist events to Outbox and a worker delivers them.
const DEFAULT_MAX_ATTEMPTS = 5;

async function publish(topic, payload) {
  const doc = await Outbox.create({ topic, payload });
  return doc;
}

async function processOutbox(batchSize = 20, opts = {}) {
  const now = new Date();
  const docs = await Outbox.find({
    status: { $in: ["PENDING", "FAILED"] },
    nextAttemptAt: { $lte: now },
  })
    .limit(batchSize)
    .sort({ nextAttemptAt: 1 });
  for (const d of docs) {
    try {
      if (d.topic === "ClearCart") {
        const { userId, orderId, cartVersion } = d.payload || {};
        // Attempt to clear cart conditionally using expected cartVersion.
        try {
          const cleared = await clearCart(userId, cartVersion);
          // If cleared is non-null, the cart was cleared; otherwise it was a version mismatch
          d.status = "DELIVERED";
          await d.save();
          if (cleared) {
            // mark order.cartCleared true
            await Order.findOneAndUpdate(
              { _id: orderId },
              { $set: { cartCleared: true } },
            );
            log("info", "outbox:clear-cart-success", {
              orderId,
              userId,
              cartVersion,
            });
          } else {
            // version mismatch; do not retry, do not clear cart
            log("info", "outbox:clear-cart-version-mismatch", {
              orderId,
              userId,
              cartVersion,
            });
          }
        } catch (err) {
          d.attempts = (d.attempts || 0) + 1;
          d.lastError = err.message || String(err);
          if (d.attempts >= (opts.maxAttempts || DEFAULT_MAX_ATTEMPTS)) {
            d.status = "DEAD";
          } else {
            d.status = "FAILED";
            d.nextAttemptAt = new Date(
              Date.now() + Math.pow(2, d.attempts) * 1000,
            );
          }
          await d.save();
        }
      } else if (d.topic === "OrderPaid" || d.topic === "OrderFailed") {
        // Placeholder: in a real system we'd publish to Kafka/RabbitMQ here.
        // For now, mark delivered.
        d.status = "DELIVERED";
        await d.save();
      } else {
        // Unknown topic - mark dead
        d.status = "DEAD";
        d.lastError = "Unknown topic";
        await d.save();
      }
    } catch (err) {
      console.error("Outbox processing error", err);
      // best-effort: increment attempts
      d.attempts = (d.attempts || 0) + 1;
      d.lastError = err.message || String(err);
      if (d.attempts >= (opts.maxAttempts || DEFAULT_MAX_ATTEMPTS))
        d.status = "DEAD";
      else {
        d.status = "FAILED";
        d.nextAttemptAt = new Date(Date.now() + Math.pow(2, d.attempts) * 1000);
      }
      await d.save();
    }
  }
  return docs.length;
}

module.exports = { publish, processOutbox };
