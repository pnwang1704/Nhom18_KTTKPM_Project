const express = require("express");
const paymentRoutes = require("./routes/payment.routes");

function createApp() {
  const app = express();

  app.use((req, res, next) => {
    const startedAt = Date.now();
    console.log(
      `[PAYMENT_SERVICE] [REQUEST] [START] method=${req.method} path=${req.originalUrl}`,
    );
    res.on("finish", () => {
      console.log(
        `[PAYMENT_SERVICE] [REQUEST] [DONE] method=${req.method} path=${req.originalUrl} status=${res.statusCode} durationMs=${Date.now() - startedAt}`,
      );
    });
    next();
  });

  app.use(
    express.json({
      verify: (req, res, buf) => {
        req.rawBody = buf ? Buffer.from(buf) : Buffer.alloc(0);
      },
    }),
  );
  app.use(express.urlencoded({ extended: true }));

  app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", service: "payment-service" });
  });

  app.use(paymentRoutes);

  app.use((err, req, res, next) => {
    const status = err.statusCode || err.status || 500;
    res.status(status).json({
      success: false,
      message: err.message || "Internal Server Error",
      ...(err.errorCode ? { errorCode: err.errorCode } : {}),
    });
  });

  return app;
}

module.exports = createApp;
