import { Transform } from 'class-transformer';
import { IsString, IsInt, IsBoolean, IsOptional } from 'class-validator';

export class UpdateJewelDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsInt()
  @IsOptional()
  quantity?: number;

   //Agora, mesmo se o valor de available for enviado como string ("true" ou "false"), 
//ele será convertido para um valor booleano antes de ser validado
@IsBoolean()
@Transform(({ value }) => value === 'true' || value === true) // Transforma para booleano
isAvailable?: boolean

  @IsString()
  @IsOptional()
  type?: string;
}