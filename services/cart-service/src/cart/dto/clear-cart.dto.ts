import { IsInt } from "class-validator";

export class ClearCartDto {
  @IsInt()
  expectedVersion!: number;
}