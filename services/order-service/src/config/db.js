const mongoose = require("mongoose");
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://mongodb:27017/order_service";

module.exports = async function connect() {
  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  return mongoose.connection;
};
