import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { Products } from '../database/entities/products.entity';
import { Users } from '../database/entities/users.entity'; // Importa a entidade Users

import { RedeemProductDto } from './dto/redeemProduct.dto';


@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private readonly productsRepository: Repository<Products>,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>
  ) {}

  async findAllWithFilters(
    page: number,
    limit: number,
    name?: string,
    minPrice?: number,
    maxPrice?: number,
  ): Promise<{ data: Products[]; total: number }> {
    const queryBuilder = this.productsRepository.createQueryBuilder('product');

    if (name) {
      queryBuilder.andWhere('product.name ILIKE :name', { name: `%${name}%` });
    }

    if (minPrice) {
      queryBuilder.andWhere('product.price >= :minPrice', { minPrice });
    }

    if (maxPrice) {
      queryBuilder.andWhere('product.price <= :maxPrice', { maxPrice });
    }

    const [data, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, total };
  }

  async findOne(uniqueId: string): Promise<Products> {
    const product = await this.productsRepository.findOne({ where: { uniqueId } });

    if (!product) {
      throw new NotFoundException(`Product with ID "${uniqueId}" not found.`);
    }

    return product;
  }

  async create(createProductDto: CreateProductDto): Promise<Products> {
    const product = this.productsRepository.create(createProductDto);
    return this.productsRepository.save(product);
  }

  async update(uniqueId: string, updateProductDto: UpdateProductDto): Promise<Products> {
    const product = await this.findOne(uniqueId);

    Object.assign(product, updateProductDto);
    return this.productsRepository.save(product);
  }

  async delete(uniqueId: string): Promise<string> {
    const product = await this.findOne(uniqueId);

    if (!product) {
      throw new NotFoundException(`Product with ID "${uniqueId}" not found.`);
    }

    const result = await this.productsRepository.delete(uniqueId);

    if (result.affected === 0) {
      throw new BadRequestException(`Failed to delete product with ID "${uniqueId}".`);
    }

    return `Product with ID "${uniqueId}" deleted successfully.`;
  }

  // Nova Função: Redeem Product
  async redeemProduct(redeemProductDto: RedeemProductDto): Promise<string> {
    const { userId, productId } = redeemProductDto;
  
    // Busca o usuário e suas jóias
    const user = await this.usersRepository.findOne({
      where: { uniqueId: userId },
      relations: ['jewels', 'products'], // Certifique-se de carregar jóias e produtos do usuário
    });
  
    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found.`);
    }
  
    // Busca o produto
    const product = await this.productsRepository.findOne({ where: { uniqueId: productId } });
  
    if (!product) {
      throw new NotFoundException(`Product with ID "${productId}" not found.`);
    }
  
    if (!product.available) {
      throw new BadRequestException(`Product with ID "${productId}" is not available.`);
    }
  
    // Calcula o total de jóias do usuário
    const totalJewels = user.jewels.reduce((sum, jewel) => sum + jewel.quantity, 0);
  
    if (totalJewels < product.price) {
      throw new BadRequestException('Insufficient jewels to redeem this product.');
    }
  
    // Atualiza a quantidade de jóias
    let remainingPrice = product.price;
    for (const jewel of user.jewels) {
      if (remainingPrice <= 0) break;
      if (jewel.quantity >= remainingPrice) {
        jewel.quantity -= remainingPrice;
        remainingPrice = 0;
      } else {
        remainingPrice -= jewel.quantity;
        jewel.quantity = 0;
      }
    }
  
    // Salva as alterações nas jóias do usuário
    await this.usersRepository.save(user);
  
    // Atualiza o relacionamento Many-to-Many entre o usuário e os produtos
    if (!user.products) {
      user.products = [];
    }
    user.products.push(product);
  
    await this.usersRepository.save(user);
  
    return `Product "${product.name}" successfully redeemed by user "${user.name}".`;
  }
}
