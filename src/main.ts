
import 'reflect-metadata'
import { ValidationPipe } from '@nestjs/common/pipes';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = new ConfigService();

  const docConfig = new DocumentBuilder()
  .setTitle('Ecommerce')
  .setDescription('Api for Ecommerce')
  .setVersion('0.1')
  .build()

  const documentFactory = SwaggerModule.createDocument(app, docConfig)
  SwaggerModule.setup('v1/docs', app, documentFactory)

  app.setGlobalPrefix('v1/')
  app.useGlobalPipes(new ValidationPipe())
  await app.listen( configService.get('PORT') ||3000);
}
bootstrap();
