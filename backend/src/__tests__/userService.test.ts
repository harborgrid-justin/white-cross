import { UserService } from '../services/userService';

// Mock Prisma
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
      groupBy: jest.fn(),
    },
  })),
}));

describe('UserService', () => {
  test('should have getUserStatistics method', () => {
    expect(typeof UserService.getUserStatistics).toBe('function');
  });

  test('should have createUser method', () => {
    expect(typeof UserService.createUser).toBe('function');
  });

  test('should have getUsers method', () => {
    expect(typeof UserService.getUsers).toBe('function');
  });

  test('should have updateUser method', () => {
    expect(typeof UserService.updateUser).toBe('function');
  });

  test('should have deactivateUser method', () => {
    expect(typeof UserService.deactivateUser).toBe('function');
  });
});