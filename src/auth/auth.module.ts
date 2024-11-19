import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';


import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Users } from 'src/database/entities';
import { jwtConfig } from './jwt.config';


@Module({
  imports:[JwtModule.registerAsync({...jwtConfig, global:true}),
    TypeOrmModule.forFeature([Users])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
