import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from 'src/database/entities/products.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

import { UsersModule } from 'src/users/users.module';


@Module({
  imports: [TypeOrmModule.forFeature([Products]),
UsersModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
