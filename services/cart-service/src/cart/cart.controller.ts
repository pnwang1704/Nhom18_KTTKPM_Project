import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from "@nestjs/common";
import { AddItemDto } from "./dto/add-item.dto";
import { ClearCartDto } from "./dto/clear-cart.dto";
import { UpdateQuantityDto } from "./dto/update-quantity.dto";
import { CartService } from "./cart.service";
import { RequestWithUser } from "../common/request-with-user.interface";

@Controller("cart")
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@Req() req: RequestWithUser) {
    return { success: true, data: await this.cartService.getCart(req.user!.userId) };
  }

  @Post("items")
  @Post("add")
  async addItem(@Req() req: RequestWithUser, @Body() body: AddItemDto) {
    return { success: true, data: await this.cartService.addItem(req.user!.userId, body) };
  }

  @Patch("items/:productId")
  @Post("update")
  async updateQuantity(
    @Req() req: RequestWithUser,
    @Param("productId") paramProductId: string,
    @Body() body: UpdateQuantityDto & { productId?: string },
  ) {
    const productId = paramProductId || body.productId || "";
    return {
      success: true,
      data: await this.cartService.updateQuantity(req.user!.userId, productId, body),
    };
  }

  @Delete("items/:productId")
  @Delete("remove/:productId")
  async removeItem(@Req() req: RequestWithUser, @Param("productId") productId: string) {
    return { success: true, data: await this.cartService.removeItem(req.user!.userId, productId) };
  }

  @Post("clear")
  @Delete("clear")
  async clearCart(@Req() req: RequestWithUser, @Body() body: ClearCartDto) {
    const clearedCart = await this.cartService.clearCart(req.user!.userId, body);
    return {
      success: true,
      cleared: Boolean(clearedCart),
      data: clearedCart,
    };
  }
}