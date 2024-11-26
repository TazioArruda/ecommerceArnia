import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/database/entities';

@Module({
  imports:[TypeOrmModule.forFeature([Users])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, TypeOrmModule.forFeature([Users])]  // Adicione exportação do UsersRepository
})
export class UsersModule {}
