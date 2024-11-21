// src/jewels/jewels.controller.ts
import { Controller, Get, Post, Param, Body, Delete, Put, Request, UseGuards } from '@nestjs/common';
import { RoleEnum } from 'src/enums/role.enum';
import { CreateJewelDto } from './dto/createJewels.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UpdateJewelDto } from './dto/updateJewels.dto';
import { JewelsService } from './jewels.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AssignJewelDto } from './dto/assign-jewel.dto';


@Controller('jewels')
@UseGuards(AuthGuard, RolesGuard)
export class JewelsController {
  constructor(private readonly jewelsService: JewelsService) {}

  // Criar uma jóia (somente admin)
  @Post()
  @Roles(RoleEnum.admin)
  async create(@Body() createJewelDto: CreateJewelDto): Promise<any> {
    return this.jewelsService.create(createJewelDto);
  }

  // Ver todas as jóias
  @Get()
  async findAll(): Promise<any> {
    return this.jewelsService.findAll();
  }

  // Buscar uma jóia pelo id
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<any> {
    return this.jewelsService.findOne(id);
  }

  // Atribuir uma jóia a um usuário (somente admin)
  @Post(':id/assign')
    @Roles(RoleEnum.admin)
    async assignJewelToUser(
      @Param('id') jewelId: string,
      @Body() assignJewelDto: AssignJewelDto,  // Recebendo o id do usuário no corpo da requisição
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
  // Modificar uma jóia pelo id (somente admin)
  @Put(':id')
  @Roles(RoleEnum.admin)
  async update(
    @Param('id') id: string,
    @Body() updateJewelDto: UpdateJewelDto,
  ): Promise<any> {
    return this.jewelsService.update(id, updateJewelDto);
  }

  // Deletar uma jóia pelo id (opcional, dependendo das suas necessidades)
  @Delete(':id')
  @Roles(RoleEnum.admin)
  async remove(@Param('id') id: string): Promise<any> {
    return this.jewelsService.remove(id);
  }
}
