// src/jewels/jewels.controller.ts
import { Controller, Get, Post, Param, Body, Delete, Put, Request, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';

import { RoleEnum } from 'src/enums/role.enum';
import { CreateJewelDto } from './dto/createJewels.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UpdateJewelDto } from './dto/updateJewels.dto';
import { JewelsService } from './jewels.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AssignJewelDto } from './dto/assign-jewel.dto';


@ApiTags('Jewels') // Define o grupo de rotas
@ApiBearerAuth() // Indica autenticação com Bearer token
@UseGuards(AuthGuard, RolesGuard) // Proteção com AuthGuard e RolesGuard
@Controller('jewels')
export class JewelsController {
  constructor(private readonly jewelsService: JewelsService) {}

  @Post()
  @Roles(RoleEnum.admin) // Apenas administradores podem criar jóias
  @ApiOperation({ summary: 'Criar uma jóia (somente admin)' })
  @ApiResponse({ status: 201, description: 'Jóia criada com sucesso.' })
  @ApiResponse({ status: 403, description: 'Permissão negada.' })
  async create(@Body() createJewelDto: CreateJewelDto): Promise<any> {
    return this.jewelsService.create(createJewelDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as jóias' })
  @ApiResponse({ status: 200, description: 'Lista de jóias retornada com sucesso.' })
  async findAll(): Promise<any> {
    return this.jewelsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma jóia pelo ID' })
  @ApiParam({ name: 'id', description: 'ID da jóia' })
  @ApiResponse({ status: 200, description: 'Jóia retornada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Jóia não encontrada.' })
  async findOne(@Param('id') id: string): Promise<any> {
    return this.jewelsService.findOne(id);
  }

  @Post('assign/:id')
  @Roles(RoleEnum.admin) // Apenas administradores podem atribuir jóias
  @ApiOperation({ summary: 'Atribuir uma jóia a um usuário (somente admin)' })
  @ApiParam({ name: 'id', description: 'ID da jóia' })
  @ApiResponse({ status: 200, description: 'Jóia atribuída com sucesso.' })
  @ApiResponse({ status: 400, description: 'Erro na atribuição da jóia.' })
  @ApiResponse({ status: 403, description: 'Permissão negada.' })
  async assignJewelToUser(
    @Param('id') jewelId: string,
    @Body() assignJewelDto: AssignJewelDto,
  ): Promise<any> {
    try {
      console.log(`Request to assign jewel started`);
      console.log(`Jewel ID from param: ${jewelId}`);
      console.log(`Request body: ${JSON.stringify(assignJewelDto)}`);

      const { userId } = assignJewelDto; // Extrai o userId do DTO
      console.log(`Extracted User ID from body: ${userId}`);

      const result = await this.jewelsService.assignJewelToUser(jewelId, userId);
      console.log(`Jewel assigned successfully: ${JSON.stringify(result)}`);

      return result;
    } catch (error) {
      console.error(`Error in assignJewelToUser: ${error.message}`, error);
      throw error; // Relança o erro para que o Nest.js trate conforme necessário
    }
  }

  @Put(':id')
  @Roles(RoleEnum.admin) // Apenas administradores podem atualizar jóias
  @ApiOperation({ summary: 'Atualizar uma jóia pelo ID (somente admin)' })
  @ApiParam({ name: 'id', description: 'ID da jóia' })
  @ApiResponse({ status: 200, description: 'Jóia atualizada com sucesso.' })
  @ApiResponse({ status: 403, description: 'Permissão negada.' })
  async update(
    @Param('id') id: string,
    @Body() updateJewelDto: UpdateJewelDto,
  ): Promise<any> {
    return this.jewelsService.update(id, updateJewelDto);
  }

  @Delete(':id')
  @Roles(RoleEnum.admin) // Apenas administradores podem deletar jóias
  @ApiOperation({ summary: 'Deletar uma jóia pelo ID (somente admin)' })
  @ApiParam({ name: 'id', description: 'ID da jóia' })
  @ApiResponse({ status: 200, description: 'Jóia deletada com sucesso.' })
  @ApiResponse({ status: 403, description: 'Permissão negada.' })
  @ApiResponse({ status: 404, description: 'Jóia não encontrada.' })
  async remove(@Param('id') id: string): Promise<any> {
    return this.jewelsService.remove(id);
  }
}
