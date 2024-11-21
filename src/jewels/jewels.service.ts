// src/jewels/jewels.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Jewels } from 'src/database/entities/jewels.entity';
import { Users } from 'src/database/entities/users.entity';
import { Repository } from 'typeorm';
import { CreateJewelDto } from './dto/createJewels.dto';
import { UpdateJewelDto } from './dto/updateJewels.dto';


@Injectable()
export class JewelsService {
  constructor(
    @InjectRepository(Jewels)
    private jewelsRepository: Repository<Jewels>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  // Criar uma jóia
  async create(createJewelDto: CreateJewelDto): Promise<Jewels> {
    const jewel = this.jewelsRepository.create(createJewelDto);
    return this.jewelsRepository.save(jewel);
  }

  // Ver todas as jóias
  async findAll(): Promise<Jewels[]> {
    return this.jewelsRepository.find();
  }

  // Buscar uma jóia pelo id
  async findOne(id: string): Promise<Jewels> {
    const jewel = await this.jewelsRepository.findOne({ where: { uniqueId: id } });
    if (!jewel) {
      throw new NotFoundException(`Jewel with ID ${id} not found`);
    }
    return jewel;
  }

  // Atribuir uma jóia a um usuário
  async assignJewelToUser(jewelId: string, userId: string): Promise<any> {
    const jewel = await this.jewelsRepository.findOne({
      where: { uniqueId: jewelId },
      relations: ['users'],
    });
  
    if (!jewel) {
      throw new NotFoundException(`Jewel with ID ${jewelId} not found`);
    }
  
    // Garantir que o relacionamento 'users' esteja definido
    if (!jewel.users) {
      jewel.users = []; // Inicializa 'users' se estiver undefined
    }
  
    const user = await this.usersRepository.findOne({ where: { uniqueId: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
  
    if (!jewel.isAvailable) {
      throw new ForbiddenException(`Jewel with ID ${jewelId} is not available`);
    }
  
    jewel.users.push(user);  // Relaciona a jóia com o usuário
    await this.jewelsRepository.save(jewel);  // Atualiza a jóia com o novo relacionamento
  
    return { message: `Jewel with ID ${jewelId} assigned to user with ID ${userId}` };
  }
  
  // Atualizar uma jóia
  async update(id: string, updateJewelDto: UpdateJewelDto): Promise<Jewels> {
    const jewel = await this.findOne(id);
    Object.assign(jewel, updateJewelDto);
    return this.jewelsRepository.save(jewel);
  }

  // Deletar uma jóia
  async remove(id: string): Promise<any> {
    const jewel = await this.findOne(id);
    return this.jewelsRepository.remove(jewel);
  }
}
