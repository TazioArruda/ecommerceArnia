import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { Products } from 'src/database/entities/products.entity';


@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private readonly productsRepository: Repository<Products>,
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
    // Verifica se o produto existe antes de tentar excluir
    const product = await this.findOne(uniqueId);

    if (!product) {
      throw new NotFoundException(`Product with ID "${uniqueId}" not found.`);
    }

    // Tentando excluir o produto
    const result = await this.productsRepository.delete(uniqueId);

    if (result.affected === 0) {
      throw new BadRequestException(`Failed to delete product with ID "${uniqueId}".`);
    }

    return `Product with ID "${uniqueId}" deleted successfully.`;
  }
}
