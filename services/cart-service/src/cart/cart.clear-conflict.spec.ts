import "reflect-metadata";
import mongoose, { Model } from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { Cart, CartDocument, CartSchema } from "./cart.schema";
import { CartService } from "./cart.service";

jest.setTimeout(120000);

describe("CartService.clearCart version conflict", () => {
  let mongo: MongoMemoryServer;
  let cartModel: Model<CartDocument>;
  let service: CartService;

  const userId = "user-clear-conflict-test";
  const productId = "507f1f77bcf86cd799439022";
  const initialPrice = 199000;
  const updatedPrice = 249000;

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    await mongoose.connect(mongo.getUri(), {
      dbName: "cart-service-clear-conflict-test",
    });

    cartModel = mongoose.models.Cart
      ? mongoose.models.Cart
      : mongoose.model<CartDocument>(Cart.name, CartSchema);

    service = new CartService(cartModel);
    (service as any).productClient = {
      getProductSnapshot: jest.fn().mockResolvedValue({
        id: productId,
        price: updatedPrice,
      }),
    };
  });

  beforeEach(async () => {
    await seedCart();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    if (mongo) await mongo.stop();
  });

  async function seedCart() {
    await cartModel.deleteMany({ userId });
    await cartModel.create({
      userId,
      status: "ACTIVE",
      items: [
        {
          productId,
          quantity: 1,
          priceSnapshot: initialPrice,
        },
      ],
      version: 1,
      updatedAt: new Date(),
    });
  }

  it("rejects stale clearCart or leaves a fully consistent cart state", async () => {
    const iterations = 8;

    for (let round = 1; round <= iterations; round += 1) {
      await seedCart();

      const seeded = await cartModel.findOne({ userId }).lean();
      const expectedVersion = Number(seeded?.version || 0);

      console.log(
        `[cart-clear-conflict] round=${round} expectedVersion=${expectedVersion} start`,
      );

      const clearPromise = service.clearCart(userId, { expectedVersion });
      const addPromise = service.addItem(userId, {
        productId,
        quantity: 1,
      });

      const [clearResult, addResult] = await Promise.all([
        clearPromise,
        addPromise,
      ]);

      const finalCart = await cartModel.findOne({ userId }).lean();

      console.log(
        `[cart-clear-conflict] round=${round} clearResult=${JSON.stringify(clearResult)} addResult=${JSON.stringify(addResult)} final=${JSON.stringify(finalCart)}`,
      );

      expect(finalCart).toBeTruthy();
      expect(finalCart?.userId).toBe(userId);

      const clearFailed = clearResult === null;
      const clearSucceeded = clearResult !== null;

      if (clearFailed) {
        expect(addResult).not.toBeNull();
        expect(finalCart?.status).toBe("ACTIVE");
        expect(finalCart?.items).toHaveLength(1);
        expect(finalCart?.items?.[0]?.productId?.toString()).toBe(productId);
        expect(finalCart?.items?.[0]?.quantity).toBe(2);
        expect(finalCart?.version).toBeGreaterThanOrEqual(expectedVersion + 1);
      } else if (clearSucceeded) {
        expect(addResult).toBeNull();
        expect(clearResult?.status).toBe("CHECKED_OUT");
        expect(finalCart?.items).toHaveLength(0);
        expect(finalCart?.status).toBe("CHECKED_OUT");
        expect(finalCart?.version).toBe(expectedVersion + 1);
      } else {
        throw new Error("Unexpected clearCart result state");
      }

      const corruptionDetected =
        finalCart?.status === "CHECKED_OUT" && (finalCart?.items?.length ?? 0) !== 0;

      if (corruptionDetected) {
        console.error("[cart-clear-conflict] dirty write detected", {
          round,
          expectedVersion,
          clearResult,
          addResult,
          finalCart,
        });
      }
    }
  });
});