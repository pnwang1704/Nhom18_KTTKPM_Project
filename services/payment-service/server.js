const mongoose = require("mongoose");
const createApp = require("./src/app");
const { port, mongoUri } = require("./src/config/env");

async function bootstrap() {
  await mongoose.connect(mongoUri);
  const app = createApp();

  app.listen(port, () => {
    console.log(`Payment Service listening on ${port}`);
  });
}

bootstrap().catch((error) => {
  console.error("Failed to start Payment Service", error);
  process.exit(1);
});
