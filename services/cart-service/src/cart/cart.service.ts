import {
  BadRequestException,
  Injectable,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AddItemDto } from "./dto/add-item.dto";
import { ClearCartDto } from "./dto/clear-cart.dto";
import { UpdateQuantityDto } from "./dto/update-quantity.dto";
import { Cart, CartDocument } from "./cart.schema";
import { ProductCatalogClient } from "../products/product-catalog.client";

type CartResponse = {
  userId: string;
  status: "ACTIVE" | "CHECKED_OUT";
  items: Array<{
    productId: string;
    quantity: number;
    priceSnapshot: number;
  }>;
  version: number;
  updatedAt: Date | null;
};

@Injectable()
export class CartService {
  private readonly productClient = new ProductCatalogClient();

  constructor(
    @InjectModel(Cart.name) private readonly cartModel: Model<CartDocument>,
  ) {}

  private toResponse(cart: any, userId: string): CartResponse {
    if (!cart) {
      return {
        userId,
        status: "ACTIVE",
        items: [],
        version: 0,
        updatedAt: null,
      };
    }

    const plain = typeof cart.toObject === "function" ? cart.toObject() : cart;
    return {
      userId: String(plain.userId),
      status: plain.status === "CHECKED_OUT" ? "CHECKED_OUT" : "ACTIVE",
      items: Array.isArray(plain.items)
        ? plain.items.map((item: any) => ({
            productId: String(item.productId),
            quantity: Number(item.quantity),
            priceSnapshot: Number(item.priceSnapshot),
          }))
        : [],
      version: Number(plain.version || 0),
      updatedAt: plain.updatedAt ? new Date(plain.updatedAt) : null,
    };
  }

  private isDuplicateKeyError(error: any): boolean {
    return Boolean(error && error.code === 11000);
  }

  private async currentCartState(userId: string) {
    return this.cartModel.findOne({ userId }).lean();
  }

  private async blockedIfCheckedOut(userId: string) {
    const current = await this.currentCartState(userId);
    if (current && current.status === "CHECKED_OUT") {
      return this.toResponse(current, userId);
    }
    return null;
  }

  async getCart(userId: string): Promise<CartResponse> {
    const cart = await this.cartModel.findOne({ userId }).lean();
    return this.toResponse(cart, userId);
  }

  async addItem(userId: string, dto: AddItemDto): Promise<CartResponse | null> {
    if (!dto?.productId) {
      throw new BadRequestException("productId is required");
    }

    if (!Number.isInteger(dto.quantity) || dto.quantity <= 0) {
      throw new BadRequestException("quantity must be greater than 0");
    }

    const snapshot = await this.productClient.getProductSnapshot(dto.productId);
    const now = new Date();

    const matchedExisting = await this.cartModel.updateOne(
      { userId, status: "ACTIVE", "items.productId": dto.productId },
      {
        $inc: {
          "items.$.quantity": dto.quantity,
          version: 1,
        },
        $set: { updatedAt: now },
      },
    );

    if (matchedExisting.matchedCount > 0 || matchedExisting.modifiedCount > 0) {
      const cart = await this.cartModel.findOne({ userId }).lean();
      return this.toResponse(cart, userId);
    }

    try {
      const insertResult = await this.cartModel.updateOne(
        {
          userId,
          status: "ACTIVE",
          "items.productId": { $ne: dto.productId },
        },
        {
          $setOnInsert: { userId, status: "ACTIVE" },
          $push: {
            items: {
              productId: dto.productId,
              quantity: dto.quantity,
              priceSnapshot: snapshot.price,
            },
          },
          $inc: { version: 1 },
          $set: { updatedAt: now },
        },
        { upsert: true },
      );
      if (
        insertResult.matchedCount > 0 ||
        insertResult.modifiedCount > 0 ||
        insertResult.upsertedCount > 0
      ) {
        const cart = await this.cartModel.findOne({ userId }).lean();
        return this.toResponse(cart, userId);
      }
    } catch (error: any) {
      if (this.isDuplicateKeyError(error)) {
        const retryUpdate = await this.cartModel.updateOne(
          { userId, status: "ACTIVE", "items.productId": dto.productId },
          {
            $inc: {
              "items.$.quantity": dto.quantity,
              version: 1,
            },
            $set: { updatedAt: new Date() },
          },
        );
        if (retryUpdate.matchedCount > 0 || retryUpdate.modifiedCount > 0) {
          const cart = await this.cartModel.findOne({ userId }).lean();
          return this.toResponse(cart, userId);
        }

        const blocked = await this.blockedIfCheckedOut(userId);
        if (blocked) {
          console.warn(
            JSON.stringify({
              ts: new Date().toISOString(),
              level: "warn",
              event: "cart:add-blocked-checked-out",
              userId,
              productId: dto.productId,
            }),
          );
          return null;
        }
      }

      const blocked = await this.blockedIfCheckedOut(userId);
      if (blocked) {
        console.warn(
          JSON.stringify({
            ts: new Date().toISOString(),
            level: "warn",
            event: "cart:add-blocked-checked-out",
            userId,
            productId: dto.productId,
          }),
        );
        return null;
      }

      throw new BadRequestException("Unable to add item to cart");
    }

    const cart = await this.cartModel.findOne({ userId }).lean();
    return this.toResponse(cart, userId);
  }

  async updateQuantity(
    userId: string,
    productId: string,
    dto: UpdateQuantityDto,
  ): Promise<CartResponse | null> {
    if (!productId) {
      throw new BadRequestException("productId is required");
    }

    if (!Number.isInteger(dto.quantity) || dto.quantity < 0) {
      throw new BadRequestException("quantity must be zero or greater");
    }

    const now = new Date();

    if (dto.quantity === 0) {
      const result = await this.cartModel.updateOne(
        { userId, status: "ACTIVE", "items.productId": productId },
        {
          $pull: { items: { productId } },
          $inc: { version: 1 },
          $set: { updatedAt: now },
        },
      );
      if (result.matchedCount === 0 && result.modifiedCount === 0) {
        const blocked = await this.blockedIfCheckedOut(userId);
        if (blocked) {
          return null;
        }
      }
      const cart = await this.cartModel.findOne({ userId }).lean();
      return this.toResponse(cart, userId);
    }

    const result = await this.cartModel.updateOne(
      { userId, status: "ACTIVE", "items.productId": productId },
      {
        $set: { "items.$.quantity": dto.quantity, updatedAt: now },
        $inc: { version: 1 },
      },
    );

    if (result.matchedCount === 0 && result.modifiedCount === 0) {
      const blocked = await this.blockedIfCheckedOut(userId);
      if (blocked) {
        return null;
      }
    }

    const cart = await this.cartModel.findOne({ userId }).lean();
    return this.toResponse(cart, userId);
  }

  async removeItem(userId: string, productId: string): Promise<CartResponse | null> {
    if (!productId) {
      throw new BadRequestException("productId is required");
    }

    const result = await this.cartModel.updateOne(
      { userId, status: "ACTIVE" },
      {
        $pull: { items: { productId } },
        $inc: { version: 1 },
        $set: { updatedAt: new Date() },
      },
    );

    if (result.matchedCount === 0 && result.modifiedCount === 0) {
      const blocked = await this.blockedIfCheckedOut(userId);
      if (blocked) {
        return null;
      }
    }

    const cart = await this.cartModel.findOne({ userId }).lean();
    return this.toResponse(cart, userId);
  }

  async clearCart(userId: string, dto: ClearCartDto): Promise<CartResponse | null> {
    if (!Number.isInteger(dto.expectedVersion) || dto.expectedVersion < 0) {
      throw new BadRequestException("expectedVersion must be a non-negative integer");
    }

    const updated = await this.cartModel.findOneAndUpdate(
      { userId, version: dto.expectedVersion, status: "ACTIVE" },
      {
        $set: {
          items: [],
          status: "CHECKED_OUT",
          updatedAt: new Date(),
        },
        $inc: { version: 1 },
      },
      { new: true },
    );

    if (!updated) {
      const current = await this.currentCartState(userId);
      console.warn(
        JSON.stringify({
          ts: new Date().toISOString(),
          level: "warn",
          event: "cart:clear-rejected",
          userId,
          expectedVersion: dto.expectedVersion,
          currentVersion: current?.version,
          currentStatus: current?.status || "ACTIVE",
        }),
      );
      return null;
    }

    return this.toResponse(updated, userId);
  }
}