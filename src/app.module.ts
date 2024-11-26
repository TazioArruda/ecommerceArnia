import { Module } from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { JewelsModule } from './jewels/jewels.module';


@Module({
  imports: [ConfigModule.forRoot({ isGlobal:true}), DatabaseModule, AuthModule, UsersModule, ProductsModule, JewelsModule,],
  
})
export class AppModule {}
