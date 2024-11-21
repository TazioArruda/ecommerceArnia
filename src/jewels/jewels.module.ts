// src/jewels/jewels.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JewelsService } from './jewels.service';
import { JewelsController } from './jewels.controller';
import { Jewels } from 'src/database/entities/jewels.entity';
import { Users } from 'src/database/entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Jewels, Users])],
  controllers: [JewelsController],
  providers: [JewelsService],
})
export class JewelsModule {}
