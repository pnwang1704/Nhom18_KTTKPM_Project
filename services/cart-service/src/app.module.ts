import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CartModule } from "./cart/cart.module";
import { HealthController } from "./health.controller";
import { UserPayloadMiddleware } from "./common/user-payload.middleware";

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGO_URI || "mongodb://mongodb:27017/cart_service",
    ),
    CartModule,
  ],
  controllers: [HealthController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserPayloadMiddleware).forRoutes(
      { path: "cart", method: RequestMethod.ALL },
      { path: "cart/(.*)", method: RequestMethod.ALL },
    );
  }
}