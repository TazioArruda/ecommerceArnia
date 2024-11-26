import { Controller, Get, Post, Body, Param, Patch, Delete, Query } from '@nestjs/common';
import { ProductsService } from './products.service';

import { Products } from 'src/database/entities/products.entity';
import { FilterProductDto } from './dto/filterProduct.dto';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';

import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RoleEnum } from 'src/enums/role.enum';
import { RedeemProductDto } from './dto/redeemProduct.dto';


@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAllWithFilters(@Query() filterDto: FilterProductDto): Promise<{ data: Products[]; total: number }> {
    const { page, limit, name, minPrice, maxPrice } = filterDto;
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;

    return this.productsService.findAllWithFilters(
      pageNumber,
      limitNumber,
      name,
      minPrice,
      maxPrice,
    );
  }

  @Get(':uniqueId')
  async findOne(@Param('uniqueId') uniqueId: string): Promise<Products> {
    return this.productsService.findOne(uniqueId);
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard) // Adicionando guards de autenticação e roles
  @Roles(RoleEnum.admin) // Somente administradores podem criar produtos
  async create(@Body() createProductDto: CreateProductDto): Promise<Products> {
    return this.productsService.create(createProductDto);
  }
  
  @Post('redeem')
  async redeemProduct(@Body() redeemProductDto: RedeemProductDto): Promise<string> {
    return this.productsService.redeemProduct(redeemProductDto);
  }

  @Patch(':uniqueId')
  @UseGuards(AuthGuard, RolesGuard) // Adicionando guards de autenticação e roles
  @Roles(RoleEnum.admin) // Somente administradores podem atualizar produtos
  async update(
    @Param('uniqueId') uniqueId: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Products> {
    return this.productsService.update(uniqueId, updateProductDto);
  }

  @Delete(':uniqueId')
  @UseGuards(AuthGuard, RolesGuard) // Adicionando guards de autenticação e roles
  @Roles(RoleEnum.admin) // Somente administradores podem deletar produtos
  async delete(@Param('uniqueId') uniqueId: string): Promise<string> {
    return this.productsService.delete(uniqueId);
  }
}
