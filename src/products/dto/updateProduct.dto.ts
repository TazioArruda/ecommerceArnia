import { Transform } from 'class-transformer';
import { IsString, IsNumber, IsEnum, IsOptional, IsBoolean } from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsEnum(['electronics', 'clothing', 'perishable'])
  category?: 'electronics' | 'clothing' | 'perishable';

    //Agora, mesmo se o valor de available for enviado como string ("true" ou "false"), 
//ele será convertido para um valor booleano antes de ser validado

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true) // Transforma para booleano
  available?: boolean
}