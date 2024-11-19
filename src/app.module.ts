import { Module } from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';


@Module({
  imports: [ConfigModule.forRoot({ isGlobal:true}), DatabaseModule, AuthModule, UsersModule, ProductsModule],
  
})
export class AppModule {}
