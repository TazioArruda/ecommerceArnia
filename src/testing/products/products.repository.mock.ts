import { getRepositoryToken } from "@nestjs/typeorm";
import { Users } from "../../database/entities";


export const mockProductsRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      andWhere: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn(),
    })),
  };
  
  export const mockUsersRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
  };
  