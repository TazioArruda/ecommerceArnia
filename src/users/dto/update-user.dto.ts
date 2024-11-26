import { Transform } from 'class-transformer';
import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true) // Transforma para booleano
  @IsOptional()
  isActive?: boolean; // Renomeado para isActive
}
