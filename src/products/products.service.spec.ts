import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Products } from '../database/entities/products.entity';
import { Users } from '../database/entities/users.entity';

// Importa os mocks
import { mockProductsRepository, mockUsersRepository } from '../testing/products/products.repository.mock';

describe('ProductsService', () => {
  let service: ProductsService;
  let productsRepository: Repository<Products>;
  let usersRepository: Repository<Users>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Products),
          useValue: mockProductsRepository,
        },
        {
          provide: getRepositoryToken(Users),
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    productsRepository = module.get<Repository<Products>>(getRepositoryToken(Products));
    usersRepository = module.get<Repository<Users>>(getRepositoryToken(Users));
  });

  it('should be defined', () => {
    // Verifica se o serviço foi corretamente injetado e definido
    expect(service).toBeDefined();
  });

  describe('findAllWithFilters', () => {
    it('should return paginated results with filters applied', async () => {
      // Mock do retorno do queryBuilder
      const mockProducts = [{ id: 1, name: 'Product 1', price: 100 }];
      
      // Mock da queryBuilder para garantir que 'getManyAndCount' seja corretamente mockado
      const queryBuilder = {
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(), // Mock do método andWhere
        getManyAndCount: jest.fn().mockResolvedValue([mockProducts, 1]), // Retornando uma tupla [dados, total]
      };
  
      // Garantir que o 'createQueryBuilder' retorne o 'queryBuilder' mockado
      jest.spyOn(mockProductsRepository, 'createQueryBuilder').mockReturnValue(queryBuilder as any);
  
      const page = 1;
      const limit = 10;
      const name = 'Product';
      const minPrice = 50;
      const maxPrice = 200;
  
      // Chama a função findAllWithFilters com os parâmetros
      const result = await service.findAllWithFilters(page, limit, name, minPrice, maxPrice);
  
      // Verifica se os resultados retornados estão corretos
      expect(result.data).toEqual(mockProducts);
      expect(result.total).toBe(1);
  
      // Verifica se o createQueryBuilder foi chamado corretamente
      expect(mockProductsRepository.createQueryBuilder).toHaveBeenCalled();
      expect(queryBuilder.getManyAndCount).toHaveBeenCalled();
      expect(queryBuilder.andWhere).toHaveBeenCalledWith('product.name ILIKE :name', { name: `%${name}%` });
    });
  });

  describe('findOne', () => {
    it('should return a product if found', async () => {
      const mockProduct = { uniqueId: '123', name: 'Product' };
      jest.spyOn(mockProductsRepository, 'findOne').mockResolvedValue(mockProduct);

      const result = await service.findOne('123');

      expect(result).toEqual(mockProduct);
      expect(mockProductsRepository.findOne).toHaveBeenCalledWith({ where: { uniqueId: '123' } });
    });

    it('should throw NotFoundException if product is not found', async () => {
      jest.spyOn(mockProductsRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne('123')).rejects.toThrow();
    });
  });

  describe('create', () => {
    it('should create and save a new product', async () => {
      const createProductDto = { name: 'Product', price: 100 };
      const mockProduct = { ...createProductDto, id: 1 };
      jest.spyOn(mockProductsRepository, 'create').mockReturnValue(mockProduct as any);
      jest.spyOn(mockProductsRepository, 'save').mockResolvedValue(mockProduct);

      const result = await service.create(createProductDto as any);

      expect(result).toEqual(mockProduct);
      expect(mockProductsRepository.create).toHaveBeenCalledWith(createProductDto);
      expect(mockProductsRepository.save).toHaveBeenCalledWith(mockProduct);
    });
  });

  describe('redeemProduct', () => {
    it('should redeem a product for a user with sufficient jewels', async () => {
      const mockUser = {
        uniqueId: 'user123',
        name: 'User',
        jewels: [{ quantity: 50 }],
        products: [],
      };
      const mockProduct = { uniqueId: 'product123', name: 'Product', price: 30, available: true };

      jest.spyOn(mockUsersRepository, 'findOne').mockResolvedValue(mockUser as any);
      jest.spyOn(mockProductsRepository, 'findOne').mockResolvedValue(mockProduct as any);
      jest.spyOn(mockUsersRepository, 'save').mockResolvedValue(null);

      const redeemProductDto = { userId: 'user123', productId: 'product123' };

      const result = await service.redeemProduct(redeemProductDto as any);

      expect(result).toBe('Product "Product" successfully redeemed by user "User".');

      expect(mockUsersRepository.findOne).toHaveBeenCalledWith({
        where: { uniqueId: 'user123' },
        relations: ['jewels', 'products'],
      });
      expect(mockProductsRepository.findOne).toHaveBeenCalledWith({ where: { uniqueId: 'product123' } });
      expect(mockUsersRepository.save).toHaveBeenCalled();
    });
  });
});
