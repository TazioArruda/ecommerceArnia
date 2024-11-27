import { Test, TestingModule } from '@nestjs/testing';
import { JewelsService } from './jewels.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Jewels } from '../database/entities/jewels.entity';
import { Users } from '../database/entities/users.entity';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { JewelsRepositoryMock, UsersRepositoryMock } from '../testing/jewels/jewels.repository.mock';
import { CreateJewelDto } from './dto/createJewels.dto';

describe('JewelsService', () => {
    let service: JewelsService;
  
    beforeAll(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          JewelsService,
          { provide: getRepositoryToken(Jewels), useValue: JewelsRepositoryMock },
          { provide: getRepositoryToken(Users), useValue: UsersRepositoryMock },
        ],
      }).compile();
  
      service = module.get<JewelsService>(JewelsService);
    });
  
    beforeAll(() => {
      jest.clearAllMocks();
    });
  
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  
    // Teste do método create
    it('should create a jewel', async () => {
        // Instanciando o DTO corretamente
        const createJewelDto = new CreateJewelDto();
        createJewelDto.name = 'Diamond Ring';
        createJewelDto.quantity = 10; // A quantidade deve ser fornecida também, conforme o DTO
        createJewelDto.isAvailable = true; // Garantindo que isAvailable seja definido
        createJewelDto.type = 'Necklace';
      
        const mockJewel = { uniqueId: 'mock-id', ...createJewelDto, createdAt: new Date(), updatedAt: new Date() };
      
        JewelsRepositoryMock.create.mockReturnValue(mockJewel);
        JewelsRepositoryMock.save.mockResolvedValue(mockJewel);
      
        const result = await service.create(createJewelDto);
      
        // Verificando os resultados
        expect(result).toEqual(mockJewel);
        expect(JewelsRepositoryMock.create).toHaveBeenCalledWith(createJewelDto);
        expect(JewelsRepositoryMock.save).toHaveBeenCalledWith(mockJewel);
      });
      
  
    // Teste do método findAll
    it('should return all jewels', async () => {
      const mockJewels = [{ uniqueId: '1', name: 'Gold Necklace' }];
      JewelsRepositoryMock.find.mockResolvedValue(mockJewels);
  
      const result = await service.findAll();
      expect(result).toEqual(mockJewels);
      expect(JewelsRepositoryMock.find).toHaveBeenCalled();
    });
  
    // Testes do método findOne
    it('should throw NotFoundException if jewel is not found', async () => {
      JewelsRepositoryMock.findOne.mockResolvedValue(null);
  
      await expect(service.findOne('invalid-id')).rejects.toThrow(NotFoundException);
      expect(JewelsRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { uniqueId: 'invalid-id' },
      });
    });
  
    it('should return a jewel if found', async () => {
      const mockJewel = { uniqueId: '1', name: 'Diamond Ring' };
      JewelsRepositoryMock.findOne.mockResolvedValue(mockJewel);
  
      const result = await service.findOne('1');
      expect(result).toEqual(mockJewel);
      expect(JewelsRepositoryMock.findOne).toHaveBeenCalledWith({
        where: { uniqueId: '1' },
      });
    });
  
    // Testes do método assignJewelToUser
    it('should assign a jewel to a user', async () => {
      const mockJewel = { uniqueId: 'jewel-id', isAvailable: true, users: [] };
      const mockUser = { uniqueId: 'user-id' };
  
      JewelsRepositoryMock.findOne.mockResolvedValueOnce(mockJewel); // Jewel found
  
      const result = await service.assignJewelToUser('jewel-id', 'user-id');
      expect(result).toEqual({ message: `Jewel with ID jewel-id assigned to user with ID user-id` });
      expect(JewelsRepositoryMock.save).toHaveBeenCalledWith({
        ...mockJewel,
        users: [mockUser],
      });
    });
    
  
    it('should throw NotFoundException if jewel is not found', async () => {
      JewelsRepositoryMock.findOne.mockResolvedValue(null);
  
      await expect(service.assignJewelToUser('jewel-id', 'user-id')).rejects.toThrow(NotFoundException);
    });
  
    it('should throw ForbiddenException if jewel is not available', async () => {
      const mockJewel = { uniqueId: 'jewel-id', isAvailable: false, users: [] };
      JewelsRepositoryMock.findOne.mockResolvedValue(mockJewel);
  
      await expect(service.assignJewelToUser('jewel-id', 'user-id')).rejects.toThrow(ForbiddenException);
    });
  
    // Teste do método update
    it('should update a jewel', async () => {
        const mockJewel = {
            uniqueId: '1',
            name: 'Gold Necklace',
            quantity: 10,        // Adiciona a quantidade
            isAvailable: true,    // Adiciona isAvailable
            type: 'Necklace',     // Adiciona o tipo
            createdAt: new Date(), // Adiciona createdAt
            updatedAt: new Date(), // Adiciona updatedAt
            users: [] 
          };
      const updateJewelDto = { name: 'Platinum Necklace' };
  
      jest.spyOn(service, 'findOne').mockResolvedValue(mockJewel);
      JewelsRepositoryMock.save.mockResolvedValue({ ...mockJewel, ...updateJewelDto });
  
      const result = await service.update('1', updateJewelDto);
      expect(result).toEqual({ ...mockJewel, ...updateJewelDto });
      expect(JewelsRepositoryMock.save).toHaveBeenCalledWith({
        ...mockJewel,
        ...updateJewelDto,
      });
    });
  
    // Teste do método remove
    it('should remove a jewel', async () => {
      const mockJewel = {
        uniqueId: '1',
        name: 'Gold Necklace',
        quantity: 10,        // A quantidade
        isAvailable: true,    // Disponibilidade
        type: 'Necklace',     // Tipo
        createdAt: new Date(), // Data de criação
        updatedAt: new Date(), // Data de atualização
        users: []             // Adiciona a propriedade users, pode ser um array vazio
      };
  
      jest.spyOn(service, 'findOne').mockResolvedValue(mockJewel);
      JewelsRepositoryMock.remove.mockResolvedValue(mockJewel);
  
      const result = await service.remove('1');
      expect(result).toEqual(mockJewel);
      expect(JewelsRepositoryMock.remove).toHaveBeenCalledWith(mockJewel);
    });
  });