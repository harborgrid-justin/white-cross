/**
 * USERS CONTROLLER UNIT TESTS
 * Test suite for user management controller
 */

import { UsersController } from '../core/controllers/users.controller';
import { UserService } from '../../../services';

// Mock dependencies
jest.mock('../../../services');

describe('UsersController', () => {
  let mockRequest: any;
  let mockH: any;

  beforeEach(() => {
    // Setup mock request
    mockRequest = {
      query: {},
      params: {},
      payload: {},
      auth: {
        credentials: {
          userId: 'admin-123',
          email: 'admin@example.com',
          role: 'ADMIN'
        }
      }
    };

    // Setup mock response toolkit
    mockH = {
      response: jest.fn().mockReturnThis(),
      code: jest.fn().mockReturnThis()
    };

    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('list', () => {
    it('should return paginated users list', async () => {
      // Arrange
      mockRequest.query = { page: '1', limit: '20' };

      (UserService.getUsers as jest.Mock).mockResolvedValue({
        users: [
          { id: '1', email: 'user1@example.com', role: 'NURSE' },
          { id: '2', email: 'user2@example.com', role: 'ADMIN' }
        ],
        total: 50
      });

      // Act
      await UsersController.list(mockRequest, mockH);

      // Assert
      expect(UserService.getUsers).toHaveBeenCalledWith(1, 20, {});
      expect(mockH.response).toHaveBeenCalledWith({
        success: true,
        data: expect.arrayContaining([
          expect.objectContaining({ email: 'user1@example.com' })
        ]),
        pagination: {
          page: 1,
          limit: 20,
          total: 50,
          totalPages: 3
        }
      });
    });

    it('should apply filters when provided', async () => {
      // Arrange
      mockRequest.query = {
        page: '1',
        limit: '10',
        role: 'NURSE',
        isActive: 'true',
        search: 'John'
      };

      (UserService.getUsers as jest.Mock).mockResolvedValue({
        users: [],
        total: 0
      });

      // Act
      await UsersController.list(mockRequest, mockH);

      // Assert
      expect(UserService.getUsers).toHaveBeenCalledWith(1, 10, {
        role: 'NURSE',
        isActive: true,
        search: 'John'
      });
    });
  });

  describe('create', () => {
    it('should create new user when admin', async () => {
      // Arrange
      mockRequest.payload = {
        email: 'new@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        role: 'NURSE'
      };

      (UserService.createUser as jest.Mock).mockResolvedValue({
        id: '123',
        email: 'new@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'NURSE'
      });

      // Act
      await UsersController.create(mockRequest, mockH);

      // Assert
      expect(UserService.createUser).toHaveBeenCalledWith(mockRequest.payload);
      expect(mockH.response).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({
          user: expect.objectContaining({ email: 'new@example.com' })
        })
      });
      expect(mockH.code).toHaveBeenCalledWith(201);
    });

    it('should return 403 when non-admin tries to create user', async () => {
      // Arrange
      mockRequest.auth.credentials.role = 'NURSE';

      // Act
      await UsersController.create(mockRequest, mockH);

      // Assert
      expect(UserService.createUser).not.toHaveBeenCalled();
      expect(mockH.response).toHaveBeenCalledWith({
        success: false,
        error: expect.objectContaining({
          message: 'Insufficient permissions to create users'
        })
      });
      expect(mockH.code).toHaveBeenCalledWith(403);
    });
  });

  describe('update', () => {
    it('should allow admin to update any user', async () => {
      // Arrange
      mockRequest.params = { id: 'user-456' };
      mockRequest.payload = {
        firstName: 'Jane',
        role: 'COUNSELOR'
      };

      (UserService.updateUser as jest.Mock).mockResolvedValue({
        id: 'user-456',
        firstName: 'Jane',
        role: 'COUNSELOR'
      });

      // Act
      await UsersController.update(mockRequest, mockH);

      // Assert
      expect(UserService.updateUser).toHaveBeenCalledWith('user-456', {
        firstName: 'Jane',
        role: 'COUNSELOR'
      });
      expect(mockH.response).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({
          user: expect.any(Object)
        })
      });
    });

    it('should allow user to update own profile', async () => {
      // Arrange
      mockRequest.auth.credentials = {
        userId: 'user-789',
        role: 'NURSE'
      };
      mockRequest.params = { id: 'user-789' };
      mockRequest.payload = {
        firstName: 'Updated',
        role: 'ADMIN' // Should be removed for non-admin
      };

      (UserService.updateUser as jest.Mock).mockResolvedValue({
        id: 'user-789',
        firstName: 'Updated'
      });

      // Act
      await UsersController.update(mockRequest, mockH);

      // Assert
      expect(UserService.updateUser).toHaveBeenCalledWith('user-789', {
        firstName: 'Updated'
        // role should be stripped out
      });
    });

    it('should return 403 when user tries to update another user', async () => {
      // Arrange
      mockRequest.auth.credentials = {
        userId: 'user-789',
        role: 'NURSE'
      };
      mockRequest.params = { id: 'different-user-id' };

      // Act
      await UsersController.update(mockRequest, mockH);

      // Assert
      expect(UserService.updateUser).not.toHaveBeenCalled();
      expect(mockH.code).toHaveBeenCalledWith(403);
    });
  });

  describe('deactivate', () => {
    it('should deactivate user when admin', async () => {
      // Arrange
      mockRequest.params = { id: 'user-to-deactivate' };

      (UserService.deactivateUser as jest.Mock).mockResolvedValue({
        id: 'user-to-deactivate',
        isActive: false
      });

      // Act
      await UsersController.deactivate(mockRequest, mockH);

      // Assert
      expect(UserService.deactivateUser).toHaveBeenCalledWith('user-to-deactivate');
      expect(mockH.response).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({
          user: expect.objectContaining({ isActive: false })
        })
      });
    });

    it('should return 403 when non-admin tries to deactivate', async () => {
      // Arrange
      mockRequest.auth.credentials.role = 'NURSE';
      mockRequest.params = { id: 'user-to-deactivate' };

      // Act
      await UsersController.deactivate(mockRequest, mockH);

      // Assert
      expect(UserService.deactivateUser).not.toHaveBeenCalled();
      expect(mockH.code).toHaveBeenCalledWith(403);
    });

    it('should return 400 when trying to deactivate self', async () => {
      // Arrange
      mockRequest.auth.credentials.userId = 'admin-123';
      mockRequest.params = { id: 'admin-123' };

      // Act
      await UsersController.deactivate(mockRequest, mockH);

      // Assert
      expect(UserService.deactivateUser).not.toHaveBeenCalled();
      expect(mockH.response).toHaveBeenCalledWith({
        success: false,
        error: expect.objectContaining({
          message: 'You cannot deactivate your own account'
        })
      });
      expect(mockH.code).toHaveBeenCalledWith(400);
    });
  });

  describe('changePassword', () => {
    it('should allow user to change own password', async () => {
      // Arrange
      mockRequest.auth.credentials = {
        userId: 'user-123',
        role: 'NURSE'
      };
      mockRequest.params = { id: 'user-123' };
      mockRequest.payload = {
        currentPassword: 'oldpassword',
        newPassword: 'newpassword123'
      };

      (UserService.changePassword as jest.Mock).mockResolvedValue({
        message: 'Password changed successfully'
      });

      // Act
      await UsersController.changePassword(mockRequest, mockH);

      // Assert
      expect(UserService.changePassword).toHaveBeenCalledWith('user-123', mockRequest.payload);
      expect(mockH.response).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({
          message: 'Password changed successfully'
        })
      });
    });

    it('should return 400 when current password is incorrect', async () => {
      // Arrange
      mockRequest.auth.credentials.userId = 'user-123';
      mockRequest.params = { id: 'user-123' };
      mockRequest.payload = {
        currentPassword: 'wrongpassword',
        newPassword: 'newpassword123'
      };

      (UserService.changePassword as jest.Mock).mockRejectedValue(
        new Error('Current password is incorrect')
      );

      // Act
      await UsersController.changePassword(mockRequest, mockH);

      // Assert
      expect(mockH.response).toHaveBeenCalledWith({
        success: false,
        error: expect.objectContaining({
          message: 'Current password is incorrect'
        })
      });
      expect(mockH.code).toHaveBeenCalledWith(400);
    });

    it('should return 403 when non-admin tries to change another user password', async () => {
      // Arrange
      mockRequest.auth.credentials = {
        userId: 'user-123',
        role: 'NURSE'
      };
      mockRequest.params = { id: 'different-user' };

      // Act
      await UsersController.changePassword(mockRequest, mockH);

      // Assert
      expect(UserService.changePassword).not.toHaveBeenCalled();
      expect(mockH.code).toHaveBeenCalledWith(403);
    });
  });

  describe('getStatistics', () => {
    it('should return statistics for admin', async () => {
      // Arrange
      (UserService.getUserStatistics as jest.Mock).mockResolvedValue({
        total: 150,
        active: 140,
        inactive: 10,
        byRole: {
          ADMIN: 5,
          NURSE: 80,
          COUNSELOR: 30,
          VIEWER: 35
        }
      });

      // Act
      await UsersController.getStatistics(mockRequest, mockH);

      // Assert
      expect(UserService.getUserStatistics).toHaveBeenCalled();
      expect(mockH.response).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({
          total: 150,
          active: 140
        })
      });
    });

    it('should return 403 for non-admin/school-admin', async () => {
      // Arrange
      mockRequest.auth.credentials.role = 'NURSE';

      // Act
      await UsersController.getStatistics(mockRequest, mockH);

      // Assert
      expect(UserService.getUserStatistics).not.toHaveBeenCalled();
      expect(mockH.code).toHaveBeenCalledWith(403);
    });
  });
});
