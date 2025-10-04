import { UserService } from '../services/userService';
import bcrypt from 'bcryptjs';
import { testPrisma, createTestUser, cleanupDatabase } from './setup';

// Mock Prisma
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => testPrisma),
}));

// Mock bcrypt
jest.mock('bcryptjs');
const bcryptMock = bcrypt as jest.Mocked<typeof bcrypt>;

// Mock logger
jest.mock('../utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  },
}));

describe('UserService', () => {
  beforeEach(async () => {
    await cleanupDatabase();
    jest.clearAllMocks();
  });

  describe('getUsers', () => {
    it('should return paginated users without filters', async () => {
      const mockUsers = [
        createTestUser({ id: '1', firstName: 'John', lastName: 'Doe' }),
        createTestUser({ id: '2', firstName: 'Jane', lastName: 'Smith' }),
      ];

      testPrisma.user.findMany = jest.fn().mockResolvedValue(mockUsers);
      testPrisma.user.count = jest.fn().mockResolvedValue(2);

      const result = await UserService.getUsers(1, 10);

      expect(testPrisma.user.findMany).toHaveBeenCalledWith({
        where: {},
        skip: 0,
        take: 10,
        select: expect.any(Object),
        orderBy: { createdAt: 'desc' }
      });
      expect(result.users).toHaveLength(2);
      expect(result.pagination.total).toBe(2);
      expect(result.pagination.page).toBe(1);
    });

    it('should apply search filter correctly', async () => {
      const filters = { search: 'john' };
      testPrisma.user.findMany = jest.fn().mockResolvedValue([]);
      testPrisma.user.count = jest.fn().mockResolvedValue(0);

      await UserService.getUsers(1, 10, filters);

      expect(testPrisma.user.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { firstName: { contains: 'john', mode: 'insensitive' } },
            { lastName: { contains: 'john', mode: 'insensitive' } },
            { email: { contains: 'john', mode: 'insensitive' } }
          ]
        },
        skip: 0,
        take: 10,
        select: expect.any(Object),
        orderBy: { createdAt: 'desc' }
      });
    });

    it('should apply role filter correctly', async () => {
      const filters = { role: 'ADMIN' as const };
      testPrisma.user.findMany = jest.fn().mockResolvedValue([]);
      testPrisma.user.count = jest.fn().mockResolvedValue(0);

      await UserService.getUsers(1, 10, filters);

      expect(testPrisma.user.findMany).toHaveBeenCalledWith({
        where: { role: 'ADMIN' },
        skip: 0,
        take: 10,
        select: expect.any(Object),
        orderBy: { createdAt: 'desc' }
      });
    });

    it('should apply active status filter correctly', async () => {
      const filters = { isActive: true };
      testPrisma.user.findMany = jest.fn().mockResolvedValue([]);
      testPrisma.user.count = jest.fn().mockResolvedValue(0);

      await UserService.getUsers(1, 10, filters);

      expect(testPrisma.user.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        skip: 0,
        take: 10,
        select: expect.any(Object),
        orderBy: { createdAt: 'desc' }
      });
    });
  });

  describe('getUserById', () => {
    it('should return user with full details when found', async () => {
      const mockUser = createTestUser({
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        nurseManagedStudents: [],
        _count: {
          appointments: 5,
          incidentReports: 2,
          medicationLogs: 10,
          inventoryTransactions: 3
        }
      });

      testPrisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);

      const result = await UserService.getUserById('1');

      expect(testPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        select: expect.any(Object)
      });
      expect(result.firstName).toBe('John');
      expect(result.lastName).toBe('Doe');
    });

    it('should throw error when user not found', async () => {
      testPrisma.user.findUnique = jest.fn().mockResolvedValue(null);

      await expect(UserService.getUserById('nonexistent')).rejects.toThrow('User not found');
    });
  });

  describe('createUser', () => {
    it('should create user with hashed password', async () => {
      const userData = {
        email: 'newuser@example.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User',
        role: 'NURSE' as const
      };

      const hashedPassword = 'hashed-password';
      mockBcrypt.hash.mockResolvedValue(hashedPassword);

      testPrisma.user.findUnique = jest.fn().mockResolvedValue(null);
      testPrisma.user.create = jest.fn().mockResolvedValue({
        id: 'new-id',
        ...userData,
        password: hashedPassword,
        isActive: true,
        createdAt: new Date()
      });

      const result = await UserService.createUser(userData);

      expect(bcryptMock.hash).toHaveBeenCalledWith('password123', 12);
      expect(testPrisma.user.create).toHaveBeenCalledWith({
        data: {
          ...userData,
          password: hashedPassword
        },
        select: expect.any(Object)
      });
      expect(result.email).toBe(userData.email);
    });

    it('should throw error when user already exists', async () => {
      const userData = {
        email: 'existing@example.com',
        password: 'password123',
        firstName: 'Existing',
        lastName: 'User',
        role: 'NURSE' as const
      };

      testPrisma.user.findUnique = jest.fn().mockResolvedValue(createTestUser());

      await expect(UserService.createUser(userData)).rejects.toThrow('User already exists with this email');
    });
  });

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      const existingUser = createTestUser({ id: '1', email: 'old@example.com' });
      const updateData = {
        firstName: 'Updated',
        lastName: 'Name'
      };

      testPrisma.user.findUnique = jest.fn()
        .mockResolvedValueOnce(existingUser)
        .mockResolvedValueOnce(null); // Email check
      testPrisma.user.update = jest.fn().mockResolvedValue({
        id: '1',
        ...existingUser,
        ...updateData,
        updatedAt: new Date()
      });

      const result = await UserService.updateUser('1', updateData);

      expect(testPrisma.user.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateData,
        select: expect.any(Object)
      });
      expect(result.firstName).toBe('Updated');
    });

    it('should throw error when user not found', async () => {
      testPrisma.user.findUnique = jest.fn().mockResolvedValue(null);

      await expect(UserService.updateUser('nonexistent', { firstName: 'Test' }))
        .rejects.toThrow('User not found');
    });

    it('should throw error when email is already taken by another user', async () => {
      const existingUser = createTestUser({ id: '1', email: 'old@example.com' });
      const anotherUser = createTestUser({ id: '2', email: 'taken@example.com' });

      testPrisma.user.findUnique = jest.fn()
        .mockResolvedValueOnce(existingUser)
        .mockResolvedValueOnce(anotherUser); // Email taken

      await expect(UserService.updateUser('1', { email: 'taken@example.com' }))
        .rejects.toThrow('Email address is already in use');
    });
  });

  describe('changePassword', () => {
    it('should change password successfully', async () => {
      const user = createTestUser({ id: '1', password: 'hashed-old-password' });
      const passwordData = {
        currentPassword: 'old-password',
        newPassword: 'new-password'
      };

      testPrisma.user.findUnique = jest.fn().mockResolvedValue(user);
      bcryptMock.compare.mockResolvedValue(true);
      bcryptMock.hash.mockResolvedValue('hashed-new-password');
      testPrisma.user.update = jest.fn().mockResolvedValue(user);

      const result = await UserService.changePassword('1', passwordData);

      expect(bcryptMock.compare).toHaveBeenCalledWith('old-password', 'hashed-old-password');
      expect(bcryptMock.hash).toHaveBeenCalledWith('new-password', 12);
      expect(testPrisma.user.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { password: 'hashed-new-password' }
      });
      expect(result.success).toBe(true);
    });

    it('should throw error for incorrect current password', async () => {
      const user = createTestUser({ id: '1', password: 'hashed-password' });

      testPrisma.user.findUnique = jest.fn().mockResolvedValue(user);
      bcryptMock.compare.mockResolvedValue(false);

      await expect(UserService.changePassword('1', {
        currentPassword: 'wrong-password',
        newPassword: 'new-password'
      })).rejects.toThrow('Current password is incorrect');
    });
  });

  describe('deactivateUser', () => {
    it('should deactivate user successfully', async () => {
      const user = createTestUser({ id: '1', isActive: true });

      testPrisma.user.update = jest.fn().mockResolvedValue({
        ...user,
        isActive: false
      });

      const result = await UserService.deactivateUser('1');

      expect(testPrisma.user.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { isActive: false },
        select: expect.any(Object)
      });
      expect(result.isActive).toBe(false);
    });
  });

  describe('reactivateUser', () => {
    it('should reactivate user successfully', async () => {
      const user = createTestUser({ id: '1', isActive: false });

      testPrisma.user.update = jest.fn().mockResolvedValue({
        ...user,
        isActive: true
      });

      const result = await UserService.reactivateUser('1');

      expect(testPrisma.user.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { isActive: true },
        select: expect.any(Object)
      });
      expect(result.isActive).toBe(true);
    });
  });

  describe('getUserStatistics', () => {
    it('should return comprehensive user statistics', async () => {
      testPrisma.user.count = jest.fn()
        .mockResolvedValueOnce(10) // total
        .mockResolvedValueOnce(8)  // active
        .mockResolvedValueOnce(2)  // inactive
        .mockResolvedValueOnce(5); // recent logins

      testPrisma.user.groupBy = jest.fn().mockResolvedValue([
        { role: 'NURSE', _count: { role: 6 } },
        { role: 'ADMIN', _count: { role: 2 } },
        { role: 'SCHOOL_ADMIN', _count: { role: 2 } }
      ]);

      const result = await UserService.getUserStatistics();

      expect(result.total).toBe(10);
      expect(result.active).toBe(8);
      expect(result.inactive).toBe(2);
      expect(result.recentLogins).toBe(5);
      expect(result.byRole.NURSE).toBe(6);
      expect(result.byRole.ADMIN).toBe(2);
      expect(result.byRole.SCHOOL_ADMIN).toBe(2);
    });
  });

  describe('getUsersByRole', () => {
    it('should return users filtered by role', async () => {
      const mockUsers = [
        createTestUser({ id: '1', firstName: 'Nurse', lastName: 'One' }),
        createTestUser({ id: '2', firstName: 'Nurse', lastName: 'Two' })
      ];

      testPrisma.user.findMany = jest.fn().mockResolvedValue(mockUsers);

      const result = await UserService.getUsersByRole('NURSE');

      expect(testPrisma.user.findMany).toHaveBeenCalledWith({
        where: {
          role: 'NURSE',
          isActive: true
        },
        select: expect.any(Object),
        orderBy: { lastName: 'asc' }
      });
      expect(result).toHaveLength(2);
    });
  });

  describe('resetUserPassword', () => {
    it('should reset user password successfully', async () => {
      const user = createTestUser({ id: '1' });
      const newPassword = 'new-password';

      testPrisma.user.findUnique = jest.fn().mockResolvedValue(user);
      mockBcrypt.hash.mockResolvedValue('hashed-password');
      testPrisma.user.update = jest.fn().mockResolvedValue(user);

      const result = await UserService.resetUserPassword('1', newPassword);

      expect(mockBcrypt.hash).toHaveBeenCalledWith(newPassword, 12);
      expect(testPrisma.user.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { password: 'hashed-password' }
      });
      expect(result.success).toBe(true);
    });

    it('should throw error when user not found', async () => {
      testPrisma.user.findUnique = jest.fn().mockResolvedValue(null);

      await expect(UserService.resetUserPassword('nonexistent', 'password'))
        .rejects.toThrow('User not found');
    });
  });

  describe('getAvailableNurses', () => {
    it('should return available nurses with student counts', async () => {
      const mockNurses = [
        {
          id: '1',
          firstName: 'Nurse',
          lastName: 'One',
          email: 'nurse1@example.com',
          _count: { nurseManagedStudents: 5 }
        },
        {
          id: '2',
          firstName: 'Nurse',
          lastName: 'Two',
          email: 'nurse2@example.com',
          _count: { nurseManagedStudents: 3 }
        }
      ];

      testPrisma.user.findMany = jest.fn().mockResolvedValue(mockNurses);

      const result = await UserService.getAvailableNurses();

      expect(testPrisma.user.findMany).toHaveBeenCalledWith({
        where: {
          role: 'NURSE',
          isActive: true
        },
        select: expect.any(Object),
        orderBy: { lastName: 'asc' }
      });
      expect(result).toHaveLength(2);
      expect(result[0].currentStudentCount).toBe(5);
      expect(result[1].currentStudentCount).toBe(3);
    });
  });
});
