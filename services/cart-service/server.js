require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");
const cartRoutes = require("./src/routes/cart.routes");
const errorHandler = require("./src/middlewares/errorHandler");

// Connect to MongoDB
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/cart", cartRoutes);

app.get("/health", (req, res) =>
  res.status(200).json({ status: "UP", service: "cart-service" }),
);

app.use(errorHandler);

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Cart Service listening on port ${PORT}`);
});
