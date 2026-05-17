import { IsInt, IsNotEmpty, IsString, Min } from "class-validator";

export class AddItemDto {
  @IsString()
  @IsNotEmpty()
  productId!: string;

  @IsInt()
  @Min(1)
  quantity!: number;
}