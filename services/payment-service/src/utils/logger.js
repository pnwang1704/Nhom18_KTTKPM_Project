function logPaymentEvent(event, data = {}) {
  console.log("[PAYMENT]", event, data);
}

module.exports = { logPaymentEvent };
