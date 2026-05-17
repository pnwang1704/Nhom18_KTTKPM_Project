import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import cors from "cors";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: false,
  });

  app.use(cors());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const port = Number(process.env.PORT || 3003);
  await app.listen(port, "0.0.0.0");
  console.log(`Cart Service listening on port ${port}`);
}

bootstrap().catch((error) => {
  console.error("Failed to start Cart Service", error);
  process.exit(1);
});