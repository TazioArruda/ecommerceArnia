import { getRepositoryToken } from "@nestjs/typeorm";
import { Users } from "../../database/entities";



export const UsersServiceMock = {
    findAll: jest.fn().mockResolvedValue([]),
    findOne: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
    profile: jest.fn(),
  };
  