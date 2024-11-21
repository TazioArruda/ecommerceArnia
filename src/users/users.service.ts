import { HttpException, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/database/entities';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>
  ) {}

  // Buscar todos os usuários (somente admin)
  async findAll() {
    try {
      return await this.usersRepository.find({
        where: { deletedAt: null }, // Exclui usuários deletados logicamente
      });
    } catch (error) {
      throw new HttpException(error.message, error.statusCode);
    }
  }

  // Buscar um usuário pelo id (somente admin)
  async findOne(id: string): Promise<Users> {
    const user = await this.usersRepository.findOne({
      where: { uniqueId: id, deletedAt: null }, // Exclui usuários deletados logicamente
    });

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found.`);
    }

    return user;
  }

  // Atualizar o usuário (self update ou admin)
  async update(id: string, updateUserDto: UpdateUserDto): Promise<Users> {
    // Verifica se o usuário existe
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found.`);
    }

    // Verifica se a atualização é para o próprio usuário ou admin
    if (user.uniqueId !== id) {
      throw new ForbiddenException('You can only update your own profile.');
    }

    // Atualiza os dados do usuário
    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  // Soft delete (exclusão lógica) do usuário (self delete ou admin)
  async softDelete(id: string): Promise<string> {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found.`);
    }

    // Lógica de soft delete (apenas define o campo "deletedAt")
    user.deletedAt = new Date();
    await this.usersRepository.save(user);

    return `User with ID "${id}" deleted successfully.`;
  }

  // Retornar o perfil do usuário (todos os dados exceto a senha)
  async profile(id: string): Promise<{ user: Users; jewelCount: number; productCount: number }> {
    // Buscar o usuário com os relacionamentos necessários
    const user = await this.usersRepository.findOne({
      where: { uniqueId: id },
      relations: ['jewels', 'products'], // Relacionamentos para jewels e products
    });
  
    // Verificar se o usuário foi encontrado
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found.`);
    }
  
    // Remover a senha do objeto do usuário
    delete user.password;
  
    // Calcular as contagens de jewels e products
    const jewelCount = user.jewels ? user.jewels.length : 0;
    const productCount = user.products ? user.products.length : 0;
  
    return {
      user,
      jewelCount,
      productCount,
    };
  }
  
}
