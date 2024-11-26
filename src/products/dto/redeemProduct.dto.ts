import { IsNotEmpty, IsString } from 'class-validator';

export class RedeemProductDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  productId: string;
}
