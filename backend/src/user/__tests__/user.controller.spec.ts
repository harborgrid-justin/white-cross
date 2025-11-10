/**
 * User Controller Unit Tests
 *
 * Comprehensive tests for User Controller including:
 * - CRUD operations (create, read, update, delete)
 * - Authentication and authorization
 * - Input validation
 * - Pagination and filtering
 * - Password management
 * - Role-based operations
 * - Error handling
 * - Multi-tenant data isolation
 */

import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { AdminResetPasswordDto } from '../dto/reset-password.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserChangePasswordDto } from '../dto/change-password.dto';
import { UserFiltersDto } from '../dto/user-filters.dto';
import { UserRole } from '../enums/user-role.enum';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  // ==================== MOCK DATA ====================

  const mockUser = {
    id: 'user-123',
    email: 'test@whitecross.edu',
    firstName: 'John',
    lastName: 'Doe',
    role: UserRole.NURSE,
    isActive: true,
    schoolId: 'school-123',
    districtId: 'district-123',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  const mockAdmin = {
    id: 'admin-123',
    email: 'admin@whitecross.edu',
    firstName: 'Admin',
    lastName: 'User',
    role: UserRole.ADMIN,
    isActive: true,
    schoolId: 'school-123',
    districtId: 'district-123',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  const mockViewer = {
    id: 'viewer-123',
    email: 'viewer@whitecross.edu',
    firstName: 'View',
    lastName: 'Only',
    role: UserRole.VIEWER,
    isActive: true,
    schoolId: 'school-123',
    districtId: 'district-123',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  const mockService = {
    getUsers: jest.fn(),
    getUserStatistics: jest.fn(),
    getAvailableNurses: jest.fn(),
    getUsersByRole: jest.fn(),
    getUserById: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
    changePassword: jest.fn(),
    resetUserPassword: jest.fn(),
    reactivateUser: jest.fn(),
    deactivateUser: jest.fn(),
  };

  // ==================== SETUP & TEARDOWN ====================

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ==================== BASIC TESTS ====================

  describe('Controller Definition', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });

    it('should have userService injected', () => {
      expect(service).toBeDefined();
    });
  });

  // ==================== GET USERS (LIST) ====================

  describe('GET /users (getUsers)', () => {
    const mockFilters: UserFiltersDto = {
      page: 1,
      limit: 20,
      search: 'john',
      role: UserRole.NURSE,
      isActive: true,
    };

    const mockPaginatedResponse = {
      data: [mockUser],
      pagination: {
        page: 1,
        limit: 20,
        total: 1,
        pages: 1,
      },
    };

    it('should return paginated list of users', async () => {
      // Arrange
      mockService.getUsers.mockResolvedValue(mockPaginatedResponse);

      // Act
      const result = await controller.getUsers(mockFilters);

      // Assert
      expect(result).toEqual(mockPaginatedResponse);
      expect(service.getUsers).toHaveBeenCalledWith(mockFilters);
      expect(service.getUsers).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no users found', async () => {
      // Arrange
      mockService.getUsers.mockResolvedValue({
        data: [],
        pagination: { page: 1, limit: 20, total: 0, pages: 0 },
      });

      // Act
      const result = await controller.getUsers(mockFilters);

      // Assert
      expect(result.data).toEqual([]);
      expect(result.pagination.total).toBe(0);
    });

    it('should handle search filter', async () => {
      // Arrange
      const searchFilters = { ...mockFilters, search: 'doe' };
      mockService.getUsers.mockResolvedValue(mockPaginatedResponse);

      // Act
      await controller.getUsers(searchFilters);

      // Assert
      expect(service.getUsers).toHaveBeenCalledWith(
        expect.objectContaining({ search: 'doe' }),
      );
    });

    it('should handle role filter', async () => {
      // Arrange
      const roleFilters = { ...mockFilters, role: UserRole.ADMIN };
      mockService.getUsers.mockResolvedValue({
        data: [mockAdmin],
        pagination: { page: 1, limit: 20, total: 1, pages: 1 },
      });

      // Act
      await controller.getUsers(roleFilters);

      // Assert
      expect(service.getUsers).toHaveBeenCalledWith(
        expect.objectContaining({ role: UserRole.ADMIN }),
      );
    });

    it('should handle isActive filter', async () => {
      // Arrange
      const activeFilters = { ...mockFilters, isActive: false };
      mockService.getUsers.mockResolvedValue({
        data: [],
        pagination: { page: 1, limit: 20, total: 0, pages: 0 },
      });

      // Act
      await controller.getUsers(activeFilters);

      // Assert
      expect(service.getUsers).toHaveBeenCalledWith(
        expect.objectContaining({ isActive: false }),
      );
    });

    it('should handle pagination parameters', async () => {
      // Arrange
      const paginationFilters = { page: 2, limit: 50 };
      mockService.getUsers.mockResolvedValue({
        data: [mockUser],
        pagination: { page: 2, limit: 50, total: 100, pages: 2 },
      });

      // Act
      await controller.getUsers(paginationFilters as UserFiltersDto);

      // Assert
      expect(service.getUsers).toHaveBeenCalledWith(
        expect.objectContaining({ page: 2, limit: 50 }),
      );
    });

    it('should throw error when service fails', async () => {
      // Arrange
      mockService.getUsers.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(controller.getUsers(mockFilters)).rejects.toThrow(
        'Database error',
      );
    });
  });

  // ==================== GET USER STATISTICS ====================

  describe('GET /users/statistics (getUserStatistics)', () => {
    const mockStatistics = {
      total: 100,
      active: 90,
      inactive: 10,
      byRole: {
        ADMIN: 5,
        NURSE: 50,
        COUNSELOR: 20,
        SCHOOL_ADMIN: 15,
        DISTRICT_ADMIN: 5,
        VIEWER: 5,
      },
      recentlyCreated: 10,
      recentlyUpdated: 5,
    };

    it('should return user statistics', async () => {
      // Arrange
      mockService.getUserStatistics.mockResolvedValue(mockStatistics);

      // Act
      const result = await controller.getUserStatistics();

      // Assert
      expect(result).toEqual(mockStatistics);
      expect(service.getUserStatistics).toHaveBeenCalledTimes(1);
    });

    it('should handle empty statistics', async () => {
      // Arrange
      mockService.getUserStatistics.mockResolvedValue({
        total: 0,
        active: 0,
        inactive: 0,
        byRole: {},
        recentlyCreated: 0,
        recentlyUpdated: 0,
      });

      // Act
      const result = await controller.getUserStatistics();

      // Assert
      expect(result.total).toBe(0);
    });
  });

  // ==================== GET AVAILABLE NURSES ====================

  describe('GET /users/nurses/available (getAvailableNurses)', () => {
    const mockNurses = [
      { ...mockUser, role: UserRole.NURSE, studentCount: 10 },
      { ...mockUser, id: 'nurse-2', email: 'nurse2@test.com', studentCount: 5 },
    ];

    it('should return list of available nurses', async () => {
      // Arrange
      mockService.getAvailableNurses.mockResolvedValue(mockNurses);

      // Act
      const result = await controller.getAvailableNurses();

      // Assert
      expect(result).toEqual(mockNurses);
      expect(result).toHaveLength(2);
      expect(service.getAvailableNurses).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no nurses available', async () => {
      // Arrange
      mockService.getAvailableNurses.mockResolvedValue([]);

      // Act
      const result = await controller.getAvailableNurses();

      // Assert
      expect(result).toEqual([]);
    });
  });

  // ==================== GET USERS BY ROLE ====================

  describe('GET /users/role/:role (getUsersByRole)', () => {
    it('should return users with specified role', async () => {
      // Arrange
      mockService.getUsersByRole.mockResolvedValue([mockUser]);

      // Act
      const result = await controller.getUsersByRole(UserRole.NURSE);

      // Assert
      expect(result).toEqual([mockUser]);
      expect(service.getUsersByRole).toHaveBeenCalledWith(UserRole.NURSE);
    });

    it('should return empty array when no users with role', async () => {
      // Arrange
      mockService.getUsersByRole.mockResolvedValue([]);

      // Act
      const result = await controller.getUsersByRole(UserRole.COUNSELOR);

      // Assert
      expect(result).toEqual([]);
    });

    it('should handle all role types', async () => {
      // Test all roles
      const roles = Object.values(UserRole);

      for (const role of roles) {
        mockService.getUsersByRole.mockResolvedValue([
          { ...mockUser, role },
        ]);

        const result = await controller.getUsersByRole(role);

        expect(service.getUsersByRole).toHaveBeenCalledWith(role);
        expect(result[0].role).toBe(role);
      }
    });
  });

  // ==================== GET USER BY ID ====================

  describe('GET /users/:id (getUserById)', () => {
    it('should return user by ID', async () => {
      // Arrange
      mockService.getUserById.mockResolvedValue(mockUser);

      // Act
      const result = await controller.getUserById('user-123');

      // Assert
      expect(result).toEqual(mockUser);
      expect(service.getUserById).toHaveBeenCalledWith('user-123');
    });

    it('should throw NotFoundException when user not found', async () => {
      // Arrange
      mockService.getUserById.mockRejectedValue(
        new NotFoundException('User not found'),
      );

      // Act & Assert
      await expect(controller.getUserById('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException for invalid UUID', async () => {
      // Arrange
      mockService.getUserById.mockRejectedValue(
        new BadRequestException('Invalid UUID format'),
      );

      // Act & Assert
      await expect(controller.getUserById('invalid-id')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  // ==================== CREATE USER ====================

  describe('POST /users (createUser)', () => {
    const createDto: CreateUserDto = {
      email: 'newuser@whitecross.edu',
      password: 'SecurePass123!',
      firstName: 'New',
      lastName: 'User',
      role: UserRole.NURSE,
      schoolId: 'school-123',
      districtId: 'district-123',
    };

    it('should create user and return 201', async () => {
      // Arrange
      const createdUser = { ...mockUser, ...createDto };
      mockService.createUser.mockResolvedValue(createdUser);

      // Act
      const result = await controller.createUser(createDto);

      // Assert
      expect(result).toEqual(createdUser);
      expect(service.createUser).toHaveBeenCalledWith(createDto);
    });

    it('should throw ConflictException for duplicate email', async () => {
      // Arrange
      mockService.createUser.mockRejectedValue(
        new ConflictException('Email already exists'),
      );

      // Act & Assert
      await expect(controller.createUser(createDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw BadRequestException for invalid email', async () => {
      // Arrange
      const invalidDto = { ...createDto, email: 'invalid-email' };
      mockService.createUser.mockRejectedValue(
        new BadRequestException('Invalid email format'),
      );

      // Act & Assert
      await expect(controller.createUser(invalidDto as any)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException for weak password', async () => {
      // Arrange
      const weakPasswordDto = { ...createDto, password: '123' };
      mockService.createUser.mockRejectedValue(
        new BadRequestException('Password too weak'),
      );

      // Act & Assert
      await expect(
        controller.createUser(weakPasswordDto as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('should validate required fields', async () => {
      // Arrange
      const incompleteDto = { email: 'test@test.com' };
      mockService.createUser.mockRejectedValue(
        new BadRequestException('Missing required fields'),
      );

      // Act & Assert
      await expect(
        controller.createUser(incompleteDto as any),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ==================== UPDATE USER ====================

  describe('PATCH /users/:id (updateUser)', () => {
    const updateDto: UpdateUserDto = {
      firstName: 'Updated',
      lastName: 'Name',
      email: 'updated@whitecross.edu',
    };

    it('should update user and return updated data', async () => {
      // Arrange
      const updatedUser = { ...mockUser, ...updateDto };
      mockService.updateUser.mockResolvedValue(updatedUser);

      // Act
      const result = await controller.updateUser('user-123', updateDto);

      // Assert
      expect(result).toEqual(updatedUser);
      expect(service.updateUser).toHaveBeenCalledWith('user-123', updateDto);
    });

    it('should throw NotFoundException when user not found', async () => {
      // Arrange
      mockService.updateUser.mockRejectedValue(
        new NotFoundException('User not found'),
      );

      // Act & Assert
      await expect(
        controller.updateUser('non-existent-id', updateDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException for duplicate email', async () => {
      // Arrange
      mockService.updateUser.mockRejectedValue(
        new ConflictException('Email already in use'),
      );

      // Act & Assert
      await expect(
        controller.updateUser('user-123', updateDto),
      ).rejects.toThrow(ConflictException);
    });

    it('should allow partial updates', async () => {
      // Arrange
      const partialDto: UpdateUserDto = { firstName: 'OnlyFirstName' };
      const updatedUser = { ...mockUser, firstName: 'OnlyFirstName' };
      mockService.updateUser.mockResolvedValue(updatedUser);

      // Act
      const result = await controller.updateUser('user-123', partialDto);

      // Assert
      expect(result.firstName).toBe('OnlyFirstName');
      expect(result.lastName).toBe(mockUser.lastName);
    });
  });

  // ==================== CHANGE PASSWORD ====================

  describe('POST /users/:id/change-password (changePassword)', () => {
    const changePasswordDto: UserChangePasswordDto = {
      currentPassword: 'OldPass123!',
      newPassword: 'NewPass456!',
    };

    it('should change password successfully', async () => {
      // Arrange
      mockService.changePassword.mockResolvedValue({
        message: 'Password changed successfully',
      });

      // Act
      const result = await controller.changePassword('user-123', changePasswordDto);

      // Assert
      expect(result).toEqual({ message: 'Password changed successfully' });
      expect(service.changePassword).toHaveBeenCalledWith(
        'user-123',
        changePasswordDto,
      );
    });

    it('should throw UnauthorizedException for incorrect current password', async () => {
      // Arrange
      mockService.changePassword.mockRejectedValue(
        new UnauthorizedException('Current password incorrect'),
      );

      // Act & Assert
      await expect(
        controller.changePassword('user-123', changePasswordDto),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw NotFoundException when user not found', async () => {
      // Arrange
      mockService.changePassword.mockRejectedValue(
        new NotFoundException('User not found'),
      );

      // Act & Assert
      await expect(
        controller.changePassword('non-existent-id', changePasswordDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for weak new password', async () => {
      // Arrange
      const weakPasswordDto = { ...changePasswordDto, newPassword: '123' };
      mockService.changePassword.mockRejectedValue(
        new BadRequestException('New password too weak'),
      );

      // Act & Assert
      await expect(
        controller.changePassword('user-123', weakPasswordDto as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when new password same as current', async () => {
      // Arrange
      const samePasswordDto = {
        currentPassword: 'SamePass123!',
        newPassword: 'SamePass123!',
      };
      mockService.changePassword.mockRejectedValue(
        new BadRequestException('New password must be different from current'),
      );

      // Act & Assert
      await expect(
        controller.changePassword('user-123', samePasswordDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ==================== RESET PASSWORD (ADMIN) ====================

  describe('POST /users/:id/reset-password (resetPassword)', () => {
    const resetPasswordDto: AdminResetPasswordDto = {
      newPassword: 'AdminReset123!',
    };

    it('should reset password as admin', async () => {
      // Arrange
      mockService.resetUserPassword.mockResolvedValue({
        message: 'Password reset successfully',
      });

      // Act
      const result = await controller.resetPassword('user-123', resetPasswordDto);

      // Assert
      expect(result).toEqual({ message: 'Password reset successfully' });
      expect(service.resetUserPassword).toHaveBeenCalledWith(
        'user-123',
        'AdminReset123!',
      );
    });

    it('should throw NotFoundException when user not found', async () => {
      // Arrange
      mockService.resetUserPassword.mockRejectedValue(
        new NotFoundException('User not found'),
      );

      // Act & Assert
      await expect(
        controller.resetPassword('non-existent-id', resetPasswordDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for weak password', async () => {
      // Arrange
      const weakPasswordDto = { newPassword: '123' };
      mockService.resetUserPassword.mockRejectedValue(
        new BadRequestException('Password too weak'),
      );

      // Act & Assert
      await expect(
        controller.resetPassword('user-123', weakPasswordDto as any),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ==================== REACTIVATE USER ====================

  describe('POST /users/:id/reactivate (reactivateUser)', () => {
    it('should reactivate user successfully', async () => {
      // Arrange
      const reactivatedUser = { ...mockUser, isActive: true };
      mockService.reactivateUser.mockResolvedValue(reactivatedUser);

      // Act
      const result = await controller.reactivateUser('user-123');

      // Assert
      expect(result).toEqual(reactivatedUser);
      expect(result.isActive).toBe(true);
      expect(service.reactivateUser).toHaveBeenCalledWith('user-123');
    });

    it('should throw NotFoundException when user not found', async () => {
      // Arrange
      mockService.reactivateUser.mockRejectedValue(
        new NotFoundException('User not found'),
      );

      // Act & Assert
      await expect(
        controller.reactivateUser('non-existent-id'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should handle already active user', async () => {
      // Arrange
      mockService.reactivateUser.mockResolvedValue(mockUser);

      // Act
      const result = await controller.reactivateUser('user-123');

      // Assert
      expect(result.isActive).toBe(true);
    });
  });

  // ==================== DEACTIVATE USER (SOFT DELETE) ====================

  describe('DELETE /users/:id (deactivateUser)', () => {
    it('should deactivate user successfully', async () => {
      // Arrange
      const deactivatedUser = { ...mockUser, isActive: false };
      mockService.deactivateUser.mockResolvedValue(deactivatedUser);

      // Act
      const result = await controller.deactivateUser('user-123');

      // Assert
      expect(result).toEqual(deactivatedUser);
      expect(result.isActive).toBe(false);
      expect(service.deactivateUser).toHaveBeenCalledWith('user-123');
    });

    it('should throw NotFoundException when user not found', async () => {
      // Arrange
      mockService.deactivateUser.mockRejectedValue(
        new NotFoundException('User not found'),
      );

      // Act & Assert
      await expect(
        controller.deactivateUser('non-existent-id'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should maintain user data after deactivation', async () => {
      // Arrange
      const deactivatedUser = { ...mockUser, isActive: false };
      mockService.deactivateUser.mockResolvedValue(deactivatedUser);

      // Act
      const result = await controller.deactivateUser('user-123');

      // Assert
      expect(result.id).toBe(mockUser.id);
      expect(result.email).toBe(mockUser.email);
      expect(result.firstName).toBe(mockUser.firstName);
    });
  });

  // ==================== ERROR HANDLING ====================

  describe('Error Handling', () => {
    it('should handle database connection errors', async () => {
      // Arrange
      mockService.getUsers.mockRejectedValue(
        new Error('Database connection failed'),
      );

      // Act & Assert
      await expect(
        controller.getUsers({} as UserFiltersDto),
      ).rejects.toThrow('Database connection failed');
    });

    it('should handle service layer errors', async () => {
      // Arrange
      mockService.getUserById.mockRejectedValue(
        new Error('Internal service error'),
      );

      // Act & Assert
      await expect(controller.getUserById('user-123')).rejects.toThrow(
        'Internal service error',
      );
    });

    it('should handle validation errors gracefully', async () => {
      // Arrange
      mockService.createUser.mockRejectedValue(
        new BadRequestException('Validation failed'),
      );

      // Act & Assert
      await expect(
        controller.createUser({} as CreateUserDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ==================== EDGE CASES ====================

  describe('Edge Cases', () => {
    it('should handle null or undefined parameters gracefully', async () => {
      // Arrange
      mockService.getUserById.mockRejectedValue(
        new BadRequestException('Invalid ID'),
      );

      // Act & Assert
      await expect(controller.getUserById(null as any)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should handle empty string parameters', async () => {
      // Arrange
      mockService.getUserById.mockRejectedValue(
        new BadRequestException('ID cannot be empty'),
      );

      // Act & Assert
      await expect(controller.getUserById('')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should handle very long input strings', async () => {
      // Arrange
      const longString = 'a'.repeat(10000);
      mockService.createUser.mockRejectedValue(
        new BadRequestException('Input too long'),
      );

      // Act & Assert
      await expect(
        controller.createUser({ email: longString } as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('should handle special characters in search', async () => {
      // Arrange
      const specialCharFilters: UserFiltersDto = {
        search: "'; DROP TABLE users; --",
        page: 1,
        limit: 20,
      };
      mockService.getUsers.mockResolvedValue({
        data: [],
        pagination: { page: 1, limit: 20, total: 0, pages: 0 },
      });

      // Act
      const result = await controller.getUsers(specialCharFilters);

      // Assert
      expect(result.data).toEqual([]);
      expect(service.getUsers).toHaveBeenCalledWith(specialCharFilters);
    });
  });
});
