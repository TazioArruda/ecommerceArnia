import { Transform } from 'class-transformer';
import { IsString, IsNumber, IsEnum, IsOptional, IsBoolean } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsEnum(['electronics', 'clothing', 'perishable'])
  category: 'electronics' | 'clothing' | 'perishable';
  
//Agora, mesmo se o valor de available for enviado como string ("true" ou "false"), 
//ele será convertido para um valor booleano antes de ser validado
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true) // Transforma para booleano
  available?: boolean
}
