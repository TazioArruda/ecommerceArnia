import { Transform } from 'class-transformer';
import { IsString, IsInt, IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateJewelDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  quantity: number;

  //Agora, mesmo se o valor de available for enviado como string ("true" ou "false"), 
//ele será convertido para um valor booleano antes de ser validado
@IsBoolean()
@Transform(({ value }) => value === 'true' || value === true) // Transforma para booleano
isAvailable: boolean

  @IsString()
  @IsNotEmpty()
  type: string;
}
