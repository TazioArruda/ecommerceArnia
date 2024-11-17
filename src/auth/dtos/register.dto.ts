import { Type } from "class-transformer";
import { IsEmail, IsEnum, isNotEmpty, IsNotEmpty, IsString } from "class-validator";
import { RoleEnum } from "src/enums/role.enum";

export class RegisterDto{
   
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsEnum(RoleEnum)
    @IsNotEmpty()
    role: RoleEnum;

    @IsString()
    @IsNotEmpty()
    isActive: boolean;

    @Type(() => Date)
    @IsNotEmpty()
    createdAt: Date;
}