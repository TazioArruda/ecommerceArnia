
import { IsString, IsNumber, IsEnum, IsOptional, IsBoolean } from 'class-validator';


export class FilterProductDto {
    @IsOptional()
    @IsString()
    name?: string;
  
    @IsOptional()
    @IsNumber()
    minPrice?: number;
  
    @IsOptional()
    @IsNumber()
    maxPrice?: number;
  
    @IsOptional()
    @IsNumber()
    page?: number;
  
    @IsOptional()
    @IsNumber()
    limit?: number;
  }