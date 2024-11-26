import { Controller, Get, Post, Body, Param, Patch, Delete, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
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
import { ProductsService } from './products.service';

@ApiTags('Products') // Define o grupo de rotas no Swagger
@ApiBearerAuth() // Indica que as rotas requerem autenticação Bearer
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar produtos com filtros opcionais' })
  @ApiQuery({ name: 'page', required: false, description: 'Número da página' })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Número de itens por página',
  })
  @ApiQuery({ name: 'name', required: false, description: 'Nome do produto' })
  @ApiQuery({
    name: 'minPrice',
    required: false,
    description: 'Preço mínimo do produto',
  })
  @ApiQuery({
    name: 'maxPrice',
    required: false,
    description: 'Preço máximo do produto',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de produtos com filtros aplicados.',
  })
  async findAllWithFilters(
    @Query() filterDto: FilterProductDto,
  ): Promise<{ data: Products[]; total: number }> {
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
  @ApiOperation({ summary: 'Buscar um produto pelo ID único' })
  @ApiParam({ name: 'uniqueId', description: 'ID único do produto' })
  @ApiResponse({ status: 200, description: 'Dados do produto.' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado.' })
  async findOne(@Param('uniqueId') uniqueId: string): Promise<Products> {
    return this.productsService.findOne(uniqueId);
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleEnum.admin)
  @ApiOperation({ summary: 'Criar um novo produto (somente admin)' })
  @ApiResponse({ status: 201, description: 'Produto criado com sucesso.' })
  @ApiResponse({ status: 403, description: 'Permissão negada.' })
  async create(@Body() createProductDto: CreateProductDto): Promise<Products> {
    return this.productsService.create(createProductDto);
  }

  @Post('redeem')
  @ApiOperation({ summary: 'Resgatar um produto' })
  @ApiResponse({ status: 200, description: 'Produto resgatado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Erro ao resgatar o produto.' })
  async redeemProduct(
    @Body() redeemProductDto: RedeemProductDto,
  ): Promise<string> {
    return this.productsService.redeemProduct(redeemProductDto);
  }

  @Patch(':uniqueId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleEnum.admin)
  @ApiOperation({ summary: 'Atualizar um produto (somente admin)' })
  @ApiParam({ name: 'uniqueId', description: 'ID único do produto' })
  @ApiResponse({ status: 200, description: 'Produto atualizado com sucesso.' })
  @ApiResponse({ status: 403, description: 'Permissão negada.' })
  async update(
    @Param('uniqueId') uniqueId: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Products> {
    return this.productsService.update(uniqueId, updateProductDto);
  }

  @Delete(':uniqueId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleEnum.admin)
  @ApiOperation({ summary: 'Deletar um produto (somente admin)' })
  @ApiParam({ name: 'uniqueId', description: 'ID único do produto' })
  @ApiResponse({ status: 200, description: 'Produto deletado com sucesso.' })
  @ApiResponse({ status: 403, description: 'Permissão negada.' })
  async delete(@Param('uniqueId') uniqueId: string): Promise<string> {
    return this.productsService.delete(uniqueId);
  }
}