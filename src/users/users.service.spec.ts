import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersServiceMock } from '../testing/users/users.repository.mock';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Users } from '../database/entities';
import { Repository } from 'typeorm';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<Users>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(Users), useClass: Repository }, // Mock da Repository
        { provide: UsersService, useValue: UsersServiceMock }, // Mock do serviço
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<Users>>(getRepositoryToken(Users));
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('deve retornar todos os usuários ativos', async () => {
      jest.spyOn(repository, 'find').mockResolvedValueOnce([]);
      const result = await service.findAll();
      expect(result).toEqual([]);
      expect(repository.find).toHaveBeenCalledWith({
        where: { deletedAt: null },
      });
    });
  });

  describe('findOne', () => {
    it('deve lançar uma exceção se o usuário não for encontrado', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);
      await expect(service.findOne('invalid-id')).rejects.toThrowError(
        `User with ID "invalid-id" not found.`,
      );
    });

    it('deve retornar o usuário se encontrado', async () => {
      const mockUser = { uniqueId: 'valid-id', deletedAt: null } as Users;
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(mockUser);
      const result = await service.findOne('valid-id');
      expect(result).toEqual(mockUser);
    });
  });

  // Outros testes para update, softDelete e profile...
});
