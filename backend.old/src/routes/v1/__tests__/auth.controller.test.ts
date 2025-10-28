/**
 * AUTH CONTROLLER UNIT TESTS
 * Example test template for controller testing
 */

import { AuthController } from '../core/controllers/auth.controller';
import { User } from '../../../database/models/core/User';
import { hashPassword, comparePassword, generateToken } from '../../../shared';

// Mock dependencies
jest.mock('../../../database/models/core/User');
jest.mock('../../../shared');

describe('AuthController', () => {
  let mockRequest: any;
  let mockH: any;

  beforeEach(() => {
    // Setup mock request
    mockRequest = {
      payload: {},
      headers: {},
      auth: { credentials: null }
    };

    // Setup mock response toolkit
    mockH = {
      response: jest.fn().mockReturnThis(),
      code: jest.fn().mockReturnThis()
    };

    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should create new user and return 201', async () => {
      // Arrange
      mockRequest.payload = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        role: 'NURSE'
      };

      (User.findOne as jest.Mock).mockResolvedValue(null);
      (hashPassword as jest.Mock).mockResolvedValue('hashed_password');
      (User.create as jest.Mock).mockResolvedValue({
        id: '123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'NURSE',
        toSafeObject: () => ({
          id: '123',
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          role: 'NURSE'
        })
      });

      // Act
      const result = await AuthController.register(mockRequest, mockH);

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(hashPassword).toHaveBeenCalledWith('password123');
      expect(User.create).toHaveBeenCalled();
      expect(mockH.response).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({
          user: expect.objectContaining({
            email: 'test@example.com'
          })
        })
      });
      expect(mockH.code).toHaveBeenCalledWith(201);
    });

    it('should return 409 if user already exists', async () => {
      // Arrange
      mockRequest.payload = {
        email: 'existing@example.com',
        password: 'password123',
        firstName: 'Jane',
        lastName: 'Doe',
        role: 'NURSE'
      };

      (User.findOne as jest.Mock).mockResolvedValue({ id: '123' });

      // Act
      const result = await AuthController.register(mockRequest, mockH);

      // Assert
      expect(mockH.response).toHaveBeenCalledWith({
        success: false,
        error: expect.objectContaining({
          message: 'User already exists with this email'
        })
      });
      expect(mockH.code).toHaveBeenCalledWith(409);
      expect(User.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should return token and user for valid credentials', async () => {
      // Arrange
      mockRequest.payload = {
        email: 'test@example.com',
        password: 'password123'
      };

      const mockUser = {
        id: '123',
        email: 'test@example.com',
        password: 'hashed_password',
        isActive: true,
        update: jest.fn().mockResolvedValue(true),
        toSafeObject: () => ({
          id: '123',
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          role: 'NURSE'
        })
      };

      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (comparePassword as jest.Mock).mockResolvedValue(true);
      (generateToken as jest.Mock).mockReturnValue('mock.jwt.token');

      // Act
      const result = await AuthController.login(mockRequest, mockH);

      // Assert
      expect(comparePassword).toHaveBeenCalledWith('password123', 'hashed_password');
      expect(mockUser.update).toHaveBeenCalledWith({ lastLogin: expect.any(Date) });
      expect(generateToken).toHaveBeenCalled();
      expect(mockH.response).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({
          token: 'mock.jwt.token',
          user: expect.any(Object)
        })
      });
    });

    it('should return 401 for invalid credentials', async () => {
      // Arrange
      mockRequest.payload = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      (User.findOne as jest.Mock).mockResolvedValue({
        password: 'hashed_password',
        isActive: true
      });
      (comparePassword as jest.Mock).mockResolvedValue(false);

      // Act
      const result = await AuthController.login(mockRequest, mockH);

      // Assert
      expect(mockH.response).toHaveBeenCalledWith({
        success: false,
        error: expect.objectContaining({
          message: 'Invalid credentials'
        })
      });
      expect(mockH.code).toHaveBeenCalledWith(401);
    });

    it('should return 401 for inactive user', async () => {
      // Arrange
      mockRequest.payload = {
        email: 'test@example.com',
        password: 'password123'
      };

      (User.findOne as jest.Mock).mockResolvedValue({
        isActive: false
      });

      // Act
      const result = await AuthController.login(mockRequest, mockH);

      // Assert
      expect(mockH.code).toHaveBeenCalledWith(401);
      expect(comparePassword).not.toHaveBeenCalled();
    });
  });

  describe('me', () => {
    it('should return current user if authenticated', async () => {
      // Arrange
      mockRequest.auth.credentials = {
        userId: '123',
        email: 'test@example.com',
        role: 'NURSE'
      };

      // Act
      const result = await AuthController.me(mockRequest, mockH);

      // Assert
      expect(mockH.response).toHaveBeenCalledWith({
        success: true,
        data: mockRequest.auth.credentials
      });
    });

    it('should return 401 if not authenticated', async () => {
      // Arrange
      mockRequest.auth.credentials = null;

      // Act
      const result = await AuthController.me(mockRequest, mockH);

      // Assert
      expect(mockH.response).toHaveBeenCalledWith({
        success: false,
        error: expect.objectContaining({
          message: 'Not authenticated'
        })
      });
      expect(mockH.code).toHaveBeenCalledWith(401);
    });
  });
});
