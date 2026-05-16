const mongoose = require("mongoose");

const outboxSchema = new mongoose.Schema(
  {
    topic: { type: String, required: true, index: true },
    payload: { type: mongoose.Schema.Types.Mixed, required: true },
    status: {
      type: String,
      enum: ["PENDING", "DELIVERED", "FAILED", "DEAD"],
      default: "PENDING",
      index: true,
    },
    attempts: { type: Number, default: 0 },
    nextAttemptAt: { type: Date, default: Date.now },
    lastError: { type: String },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Outbox", outboxSchema);
