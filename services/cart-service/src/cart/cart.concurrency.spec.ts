import "reflect-metadata";
import mongoose, { Model } from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Cart, CartDocument, CartSchema } from "./cart.schema";
import { CartService } from "./cart.service";

jest.setTimeout(120000);

describe("CartService.addItem concurrency", () => {
  let mongo: MongoMemoryServer;
  let cartModel: Model<CartDocument>;
  let service: CartService;

  const userId = "user-concurrency-test";
  const productId = "507f1f77bcf86cd799439011";
  const priceSnapshot = 123456;

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    await mongoose.connect(mongo.getUri(), {
      dbName: "cart-service-concurrency-test",
    });

    cartModel = mongoose.models.Cart
      ? mongoose.models.Cart
      : mongoose.model<CartDocument>(Cart.name, CartSchema);

    service = new CartService(cartModel);
    (service as any).productClient = {
      getProductSnapshot: jest.fn().mockResolvedValue({
        id: productId,
        price: priceSnapshot,
      }),
    };
  });

  beforeEach(async () => {
    await cartModel.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
    if (mongo) await mongo.stop();
  });

  async function runConcurrentAdds(concurrency: number) {
    const requests = Array.from({ length: concurrency }, () =>
      service.addItem(userId, {
        productId,
        quantity: 1,
      }),
    );

    await Promise.all(requests);
  }

  it.each([2, 3, 5, 10])(
    "keeps one cart item and correct quantity with %i concurrent adds",
    async (concurrency: number) => {
      const iterations = 5;

      for (let round = 1; round <= iterations; round += 1) {
        await cartModel.deleteMany({ userId });

        console.log(
          `[cart-concurrency] round=${round} concurrency=${concurrency} start`,
        );

        await runConcurrentAdds(concurrency);

        const cart = await cartModel.findOne({ userId }).lean();

        console.log(
          `[cart-concurrency] round=${round} concurrency=${concurrency} result`,
          JSON.stringify(cart),
        );

        expect(cart).toBeTruthy();
        expect(cart?.userId).toBe(userId);
        expect(cart?.items).toHaveLength(1);
        expect(cart?.items?.[0]?.productId?.toString()).toBe(productId);
        expect(cart?.items?.[0]?.quantity).toBe(concurrency);
        expect(cart?.items?.[0]?.priceSnapshot).toBe(priceSnapshot);
        expect(cart?.version).toBeGreaterThanOrEqual(concurrency);

        if ((cart?.items?.length ?? 0) !== 1) {
          console.error("[cart-concurrency] duplicate items detected", cart);
        }
      }
    },
  );
});