import { IsUUID, IsNotEmpty } from 'class-validator';

export class AssignJewelDto {
  @IsUUID() // Valida que é um UUID válido
  @IsNotEmpty() // Garante que o campo não está vazio
  userId: string;
}