import { Controller, Get, Patch, Param, Delete, UseGuards, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RoleEnum } from 'src/enums/role.enum';
import { UpdateUserDto } from './dto/update-user.dto';
import { Users } from 'src/database/entities';

@ApiTags('Users') // Define um grupo para as rotas no Swagger
@ApiBearerAuth() // Indica que a rota requer autenticação via token (Bearer)
@UseGuards(AuthGuard, RolesGuard) // Aplica os guards de autenticação e autorização
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Rota para buscar todos os usuários (somente admin)
  @Roles(RoleEnum.admin)
  @Get()
  @ApiOperation({ summary: 'Buscar todos os usuários (somente admin)' })
  @ApiResponse({ status: 200, description: 'Lista de usuários.' })
  async findAll() {
    return await this.usersService.findAll();
  }

  // Rota para buscar um usuário pelo ID (somente admin)
  @Roles(RoleEnum.admin)
  @Get(':id')
  @ApiOperation({ summary: 'Buscar um usuário pelo ID (somente admin)' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({ status: 200, description: 'Dados do usuário.' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  async findOne(@Param('id') id: string): Promise<Users> {
    return this.usersService.findOne(id);
  }

  // Rota para atualizar o usuário (self update ou admin)
  @Patch(':id')
  @Roles(RoleEnum.admin, RoleEnum.user)
  @ApiOperation({ summary: 'Atualizar usuário (self-update ou admin)' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso.' })
  @ApiResponse({ status: 403, description: 'Permissão negada.' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<Users> {
    return this.usersService.update(id, updateUserDto);
  }

  // Rota para deletar logicamente um usuário (self delete ou admin)
  @Delete(':id')
  @Roles(RoleEnum.admin, RoleEnum.user)
  @ApiOperation({ summary: 'Deletar usuário logicamente (self-delete ou admin)' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({ status: 200, description: 'Usuário deletado logicamente.' })
  @ApiResponse({ status: 403, description: 'Permissão negada.' })
  async softDelete(@Param('id') id: string): Promise<string> {
    return this.usersService.softDelete(id);
  }

  // Rota para retornar o perfil do usuário
  @Get('profile/:id')
  @ApiOperation({ summary: 'Buscar o perfil do usuário (self-view ou admin)' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({ status: 200, description: 'Dados do perfil do usuário.' })
  @ApiResponse({ status: 403, description: 'Permissão negada.' })
  async profile(@Param('id') id: string): Promise<any> {
    const { user, jewelCount, productCount } = await this.usersService.profile(id);

    return {
      message: `Profile data for user with ID: ${id}`,
      user,
      jewelCount,
      productCount,
    };
  }
}
