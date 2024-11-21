import { Controller, Get, Patch, Param, Delete, UseGuards, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RoleEnum } from 'src/enums/role.enum';
import { UpdateUserDto } from './dto/update-user.dto';
import { Users } from 'src/database/entities';

@UseGuards(AuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Rota para buscar todos os usuários (somente admin)
  @Roles(RoleEnum.admin)
  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  // Rota para buscar um usuário pelo id (somente admin)
  @Roles(RoleEnum.admin)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Users> {
    return this.usersService.findOne(id);
  }

  // Rota para atualizar o usuário (self update ou admin)
  @Patch(':id')
  @Roles(RoleEnum.admin, RoleEnum.user) // Admin pode atualizar qualquer usuário, e o usuário pode atualizar o seu próprio
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<Users> {
    return this.usersService.update(id, updateUserDto);
  }

  // Rota para soft delete (self delete ou admin)
  @Delete(':id')
  @Roles(RoleEnum.admin, RoleEnum.user) // Admin pode deletar qualquer usuário, e o usuário pode excluir o seu próprio
  async softDelete(@Param('id') id: string): Promise<string> {
    return this.usersService.softDelete(id);
  }

  // Rota para retornar o perfil do usuário (todos os dados exceto a senha)
  @Get('profile/:id')
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
