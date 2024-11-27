import { getRepositoryToken } from "@nestjs/typeorm";
import { CreateJewelDto } from "src/jewels/dto/createJewels.dto";

// Ajuste o caminho se necessário

export const JewelsRepositoryMock = {
  create: jest.fn((dto: CreateJewelDto) => ({
    ...dto,
    uniqueId: 'mock-id', // Adiciona o uniqueId
    quantity: dto.quantity || 10, // Garante que a quantidade seja fornecida ou use o valor padrão
    isAvailable: dto.isAvailable !== undefined ? dto.isAvailable : true, // Valor booleano para isAvailable
    type: dto.type || 'Necklace', // Usa o tipo fornecido ou um valor default
    createdAt: new Date(), // Adiciona a data de criação
    updatedAt: new Date(), // Adiciona a data de atualização
  })),
  save: jest.fn((jewel) => Promise.resolve(jewel)), // O save retorna o objeto jewel completo
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
};

export const UsersRepositoryMock = {
  findOne: jest.fn(),
};

  
