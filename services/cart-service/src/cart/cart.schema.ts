import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

@Schema({ _id: false })
export class CartItem {
  @Prop({ type: String, required: true })
  productId!: string;

  @Prop({ type: Number, required: true, min: 1 })
  quantity!: number;

  @Prop({ type: Number, required: true, min: 0 })
  priceSnapshot!: number;
}

export const CartItemSchema = SchemaFactory.createForClass(CartItem);

@Schema({
  collection: "carts",
  timestamps: { createdAt: false, updatedAt: true },
  versionKey: false,
})
export class Cart {
  @Prop({ type: String, required: true, unique: true })
  userId!: string;

  @Prop({
    type: String,
    enum: ["ACTIVE", "CHECKED_OUT"],
    default: "ACTIVE",
    index: true,
  })
  status!: "ACTIVE" | "CHECKED_OUT";

  @Prop({ type: [CartItemSchema], default: [] })
  items!: CartItem[];

  @Prop({ type: Number, required: true, default: 0, min: 0 })
  version!: number;

  @Prop({ type: Date })
  updatedAt?: Date;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
CartSchema.index({ userId: 1, "items.productId": 1 }, { unique: true, sparse: true });

export type CartDocument = HydratedDocument<Cart>;