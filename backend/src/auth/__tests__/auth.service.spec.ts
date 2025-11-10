/**
 * AUTH SERVICE TESTS (CRITICAL SECURITY)
 *
 * Tests critical authentication and authorization functionality including:
 * - User registration with validation
 * - Login with password verification
 * - JWT token generation and validation
 * - Account lockout after failed login attempts
 * - Password strength requirements
 * - Token refresh mechanisms
 * - Password change operations
 */

import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';
import { User, UserRole } from '../../database/models/user.model';

describe('AuthService (CRITICAL SECURITY)', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let configService: ConfigService;
  let userModel: typeof User;

  // Mock user data
  const mockUser = {
    id: 'test-user-id-123',
    email: 'test@whitecross.edu',
    password: '$2b$10$hashedPassword',
    firstName: 'Test',
    lastName: 'User',
    role: UserRole.NURSE,
    isActive: true,
    failedLoginAttempts: 0,
    lockoutUntil: null,
    lastLogin: new Date(),
    comparePassword: jest.fn(),
    isAccountLocked: jest.fn().mockReturnValue(false),
    incrementFailedLoginAttempts: jest.fn(),
    resetFailedLoginAttempts: jest.fn(),
    toSafeObject: jest.fn().mockReturnValue({
      id: 'test-user-id-123',
      email: 'test@whitecross.edu',
      firstName: 'Test',
      lastName: 'User',
      role: UserRole.NURSE,
      isActive: true,
    }),
    save: jest.fn(),
  };

  const mockUserModel = {
    findOne: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      const config = {
        JWT_SECRET: 'test-secret-key',
        JWT_REFRESH_SECRET: 'test-refresh-secret-key',
      };
      return config[key];
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(User),
          useValue: mockUserModel,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
    userModel = module.get<typeof User>(getModelToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ==================== REGISTRATION TESTS ====================

  describe('register', () => {
    const validRegisterDto = {
      email: 'newuser@whitecross.edu',
      password: 'SecurePass123!',
      firstName: 'New',
      lastName: 'User',
      role: UserRole.NURSE,
    };

    it('should successfully register a new user with valid credentials', async () => {
      mockUserModel.findOne.mockResolvedValue(null);
      mockUserModel.create.mockResolvedValue({
        ...mockUser,
        email: validRegisterDto.email,
        toSafeObject: jest.fn().mockReturnValue({
          id: mockUser.id,
          email: validRegisterDto.email,
          firstName: validRegisterDto.firstName,
          lastName: validRegisterDto.lastName,
          role: validRegisterDto.role,
        }),
      });
      mockJwtService.sign
        .mockReturnValueOnce('mock-access-token')
        .mockReturnValueOnce('mock-refresh-token');

      const result = await service.register(validRegisterDto);

      expect(result).toHaveProperty('accessToken', 'mock-access-token');
      expect(result).toHaveProperty('refreshToken', 'mock-refresh-token');
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('tokenType', 'Bearer');
      expect(result).toHaveProperty('expiresIn', 900);
      expect(mockUserModel.findOne).toHaveBeenCalledWith({ where: { email: validRegisterDto.email } });
      expect(mockUserModel.create).toHaveBeenCalled();
    });

    it('should reject registration if email already exists', async () => {
      mockUserModel.findOne.mockResolvedValue(mockUser);

      await expect(service.register(validRegisterDto))
        .rejects.toThrow(ConflictException);
      await expect(service.register(validRegisterDto))
        .rejects.toThrow('User with this email already exists');
    });

    it('should reject invalid email format', async () => {
      const invalidEmailDto = { ...validRegisterDto, email: 'invalid-email' };

      await expect(service.register(invalidEmailDto))
        .rejects.toThrow(BadRequestException);
      await expect(service.register(invalidEmailDto))
        .rejects.toThrow('Invalid email format');
    });

    it('should reject weak passwords (less than 8 characters)', async () => {
      const weakPasswordDto = { ...validRegisterDto, password: 'Weak1!' };
      mockUserModel.findOne.mockResolvedValue(null);

      await expect(service.register(weakPasswordDto))
        .rejects.toThrow(BadRequestException);
    });

    it('should reject passwords without uppercase letters', async () => {
      const noUppercaseDto = { ...validRegisterDto, password: 'password123!' };
      mockUserModel.findOne.mockResolvedValue(null);

      await expect(service.register(noUppercaseDto))
        .rejects.toThrow(BadRequestException);
    });

    it('should reject passwords without lowercase letters', async () => {
      const noLowercaseDto = { ...validRegisterDto, password: 'PASSWORD123!' };
      mockUserModel.findOne.mockResolvedValue(null);

      await expect(service.register(noLowercaseDto))
        .rejects.toThrow(BadRequestException);
    });

    it('should reject passwords without numbers', async () => {
      const noNumberDto = { ...validRegisterDto, password: 'Password!!!' };
      mockUserModel.findOne.mockResolvedValue(null);

      await expect(service.register(noNumberDto))
        .rejects.toThrow(BadRequestException);
    });

    it('should reject passwords without special characters', async () => {
      const noSpecialCharDto = { ...validRegisterDto, password: 'Password123' };
      mockUserModel.findOne.mockResolvedValue(null);

      await expect(service.register(noSpecialCharDto))
        .rejects.toThrow(BadRequestException);
    });

    it('should default role to NURSE if not specified', async () => {
      const { role, ...dtoWithoutRole } = validRegisterDto;
      mockUserModel.findOne.mockResolvedValue(null);
      const createdUser = {
        ...mockUser,
        role: UserRole.NURSE,
        toSafeObject: jest.fn().mockReturnValue({
          ...mockUser.toSafeObject(),
          role: UserRole.NURSE,
        }),
      };
      mockUserModel.create.mockResolvedValue(createdUser);
      mockJwtService.sign
        .mockReturnValueOnce('mock-access-token')
        .mockReturnValueOnce('mock-refresh-token');

      const result = await service.register(dtoWithoutRole);

      expect(result.user.role).toBe(UserRole.NURSE);
    });
  });

  // ==================== LOGIN TESTS ====================

  describe('login', () => {
    const validLoginDto = {
      email: 'test@whitecross.edu',
      password: 'CorrectPassword123!',
    };

    it('should successfully login with valid credentials', async () => {
      mockUserModel.findOne.mockResolvedValue(mockUser);
      mockUser.comparePassword.mockResolvedValue(true);
      mockJwtService.sign
        .mockReturnValueOnce('mock-access-token')
        .mockReturnValueOnce('mock-refresh-token');

      const result = await service.login(validLoginDto);

      expect(result).toHaveProperty('accessToken', 'mock-access-token');
      expect(result).toHaveProperty('refreshToken', 'mock-refresh-token');
      expect(result).toHaveProperty('user');
      expect(mockUser.resetFailedLoginAttempts).toHaveBeenCalled();
    });

    it('should reject login with non-existent email', async () => {
      mockUserModel.findOne.mockResolvedValue(null);

      await expect(service.login(validLoginDto))
        .rejects.toThrow(UnauthorizedException);
      await expect(service.login(validLoginDto))
        .rejects.toThrow('Invalid email or password');
    });

    it('should reject login with incorrect password', async () => {
      mockUserModel.findOne.mockResolvedValue(mockUser);
      mockUser.comparePassword.mockResolvedValue(false);

      await expect(service.login(validLoginDto))
        .rejects.toThrow(UnauthorizedException);
      expect(mockUser.incrementFailedLoginAttempts).toHaveBeenCalled();
    });

    it('should reject login if account is locked', async () => {
      const lockedUser = {
        ...mockUser,
        isAccountLocked: jest.fn().mockReturnValue(true),
      };
      mockUserModel.findOne.mockResolvedValue(lockedUser);

      await expect(service.login(validLoginDto))
        .rejects.toThrow(UnauthorizedException);
      await expect(service.login(validLoginDto))
        .rejects.toThrow('Account is temporarily locked due to multiple failed login attempts');
    });

    it('should reject login if account is inactive', async () => {
      const inactiveUser = {
        ...mockUser,
        isActive: false,
        comparePassword: jest.fn().mockResolvedValue(true),
      };
      mockUserModel.findOne.mockResolvedValue(inactiveUser);

      await expect(service.login(validLoginDto))
        .rejects.toThrow(UnauthorizedException);
      await expect(service.login(validLoginDto))
        .rejects.toThrow('Account is inactive');
    });

    it('should increment failed login attempts on wrong password', async () => {
      mockUserModel.findOne.mockResolvedValue(mockUser);
      mockUser.comparePassword.mockResolvedValue(false);

      await expect(service.login(validLoginDto))
        .rejects.toThrow(UnauthorizedException);

      expect(mockUser.incrementFailedLoginAttempts).toHaveBeenCalled();
    });

    it('should reset failed login attempts on successful login', async () => {
      mockUserModel.findOne.mockResolvedValue(mockUser);
      mockUser.comparePassword.mockResolvedValue(true);
      mockJwtService.sign
        .mockReturnValueOnce('mock-access-token')
        .mockReturnValueOnce('mock-refresh-token');

      await service.login(validLoginDto);

      expect(mockUser.resetFailedLoginAttempts).toHaveBeenCalled();
    });
  });

  // ==================== JWT TOKEN TESTS ====================

  describe('verifyToken', () => {
    const validToken = 'valid-jwt-token';

    it('should verify valid access token and return user', async () => {
      const tokenPayload = {
        sub: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
        type: 'access',
      };
      mockJwtService.verify.mockReturnValue(tokenPayload);
      mockUserModel.findByPk.mockResolvedValue(mockUser);

      const result = await service.verifyToken(validToken);

      expect(result).toEqual(mockUser.toSafeObject());
      expect(mockJwtService.verify).toHaveBeenCalledWith(validToken, {
        secret: 'test-secret-key',
      });
    });

    it('should reject expired tokens', async () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('TokenExpiredError');
      });

      await expect(service.verifyToken(validToken))
        .rejects.toThrow(UnauthorizedException);
      await expect(service.verifyToken(validToken))
        .rejects.toThrow('Invalid or expired token');
    });

    it('should reject invalid token signatures', async () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('JsonWebTokenError');
      });

      await expect(service.verifyToken('invalid-token'))
        .rejects.toThrow(UnauthorizedException);
    });

    it('should reject refresh tokens when expecting access tokens', async () => {
      const refreshPayload = {
        sub: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
        type: 'refresh',
      };
      mockJwtService.verify.mockReturnValue(refreshPayload);

      await expect(service.verifyToken(validToken))
        .rejects.toThrow(UnauthorizedException);
      await expect(service.verifyToken(validToken))
        .rejects.toThrow('Invalid token type');
    });

    it('should reject tokens for inactive users', async () => {
      const tokenPayload = {
        sub: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
        type: 'access',
      };
      mockJwtService.verify.mockReturnValue(tokenPayload);
      const inactiveUser = { ...mockUser, isActive: false };
      mockUserModel.findByPk.mockResolvedValue(inactiveUser);

      await expect(service.verifyToken(validToken))
        .rejects.toThrow(UnauthorizedException);
      await expect(service.verifyToken(validToken))
        .rejects.toThrow('User account is inactive');
    });

    it('should reject tokens for non-existent users', async () => {
      const tokenPayload = {
        sub: 'non-existent-user-id',
        email: 'test@test.com',
        role: UserRole.NURSE,
        type: 'access',
      };
      mockJwtService.verify.mockReturnValue(tokenPayload);
      mockUserModel.findByPk.mockResolvedValue(null);

      await expect(service.verifyToken(validToken))
        .rejects.toThrow(UnauthorizedException);
    });
  });

  // ==================== TOKEN REFRESH TESTS ====================

  describe('refreshToken', () => {
    const validRefreshToken = 'valid-refresh-token';

    it('should refresh access token with valid refresh token', async () => {
      const refreshPayload = {
        sub: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
        type: 'refresh',
      };
      mockJwtService.verify.mockReturnValue(refreshPayload);
      mockUserModel.findByPk.mockResolvedValue(mockUser);
      mockJwtService.sign
        .mockReturnValueOnce('new-access-token')
        .mockReturnValueOnce('new-refresh-token');

      const result = await service.refreshToken(validRefreshToken);

      expect(result).toHaveProperty('accessToken', 'new-access-token');
      expect(result).toHaveProperty('refreshToken', 'new-refresh-token');
      expect(result).toHaveProperty('user');
    });

    it('should reject expired refresh tokens', async () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('TokenExpiredError');
      });

      await expect(service.refreshToken(validRefreshToken))
        .rejects.toThrow(UnauthorizedException);
      await expect(service.refreshToken(validRefreshToken))
        .rejects.toThrow('Invalid or expired refresh token');
    });

    it('should reject access tokens when expecting refresh tokens', async () => {
      const accessPayload = {
        sub: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
        type: 'access',
      };
      mockJwtService.verify.mockReturnValue(accessPayload);

      await expect(service.refreshToken(validRefreshToken))
        .rejects.toThrow(UnauthorizedException);
      await expect(service.refreshToken(validRefreshToken))
        .rejects.toThrow('Invalid token type');
    });

    it('should reject refresh tokens for inactive users', async () => {
      const refreshPayload = {
        sub: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
        type: 'refresh',
      };
      mockJwtService.verify.mockReturnValue(refreshPayload);
      const inactiveUser = { ...mockUser, isActive: false };
      mockUserModel.findByPk.mockResolvedValue(inactiveUser);

      await expect(service.refreshToken(validRefreshToken))
        .rejects.toThrow(UnauthorizedException);
      await expect(service.refreshToken(validRefreshToken))
        .rejects.toThrow('User account is inactive');
    });
  });

  // ==================== PASSWORD CHANGE TESTS ====================

  describe('changePassword', () => {
    const changePasswordDto = {
      currentPassword: 'OldPassword123!',
      newPassword: 'NewPassword123!',
    };

    it('should successfully change password with valid current password', async () => {
      mockUserModel.findByPk.mockResolvedValue(mockUser);
      mockUser.comparePassword.mockResolvedValue(true);

      const result = await service.changePassword(mockUser.id, changePasswordDto);

      expect(result).toHaveProperty('message', 'Password changed successfully');
      expect(mockUser.save).toHaveBeenCalled();
    });

    it('should reject password change with incorrect current password', async () => {
      mockUserModel.findByPk.mockResolvedValue(mockUser);
      mockUser.comparePassword.mockResolvedValue(false);

      await expect(service.changePassword(mockUser.id, changePasswordDto))
        .rejects.toThrow(UnauthorizedException);
      await expect(service.changePassword(mockUser.id, changePasswordDto))
        .rejects.toThrow('Current password is incorrect');
    });

    it('should reject weak new passwords', async () => {
      const weakPasswordDto = {
        currentPassword: 'OldPassword123!',
        newPassword: 'weak',
      };
      mockUserModel.findByPk.mockResolvedValue(mockUser);
      mockUser.comparePassword.mockResolvedValue(true);

      await expect(service.changePassword(mockUser.id, weakPasswordDto))
        .rejects.toThrow(BadRequestException);
    });

    it('should reject password change for non-existent user', async () => {
      mockUserModel.findByPk.mockResolvedValue(null);

      await expect(service.changePassword('non-existent-id', changePasswordDto))
        .rejects.toThrow(UnauthorizedException);
      await expect(service.changePassword('non-existent-id', changePasswordDto))
        .rejects.toThrow('User not found');
    });
  });

  // ==================== PASSWORD VALIDATION TESTS ====================

  describe('validateEmail', () => {
    it('should validate correct email formats', () => {
      expect(service.validateEmail('user@example.com')).toBe(true);
      expect(service.validateEmail('user.name@example.com')).toBe(true);
      expect(service.validateEmail('user+tag@example.co.uk')).toBe(true);
    });

    it('should reject invalid email formats', () => {
      expect(service.validateEmail('invalid')).toBe(false);
      expect(service.validateEmail('invalid@')).toBe(false);
      expect(service.validateEmail('@example.com')).toBe(false);
      expect(service.validateEmail('user@')).toBe(false);
      expect(service.validateEmail('user@example')).toBe(false);
    });
  });

  describe('validatePasswordStrength', () => {
    it('should validate strong passwords', () => {
      expect(service.validatePasswordStrength('SecurePass123!')).toBe(true);
      expect(service.validatePasswordStrength('Anoth3rS3cure!')).toBe(true);
      expect(service.validatePasswordStrength('C0mpl3x!ty')).toBe(true);
    });

    it('should reject passwords without uppercase', () => {
      expect(service.validatePasswordStrength('password123!')).toBe(false);
    });

    it('should reject passwords without lowercase', () => {
      expect(service.validatePasswordStrength('PASSWORD123!')).toBe(false);
    });

    it('should reject passwords without numbers', () => {
      expect(service.validatePasswordStrength('PasswordOnly!')).toBe(false);
    });

    it('should reject passwords without special characters', () => {
      expect(service.validatePasswordStrength('Password123')).toBe(false);
    });

    it('should reject passwords shorter than 8 characters', () => {
      expect(service.validatePasswordStrength('Pas1!')).toBe(false);
      expect(service.validatePasswordStrength('Abc123!')).toBe(false);
    });
  });

  // ==================== ACCOUNT LOCKOUT TESTS ====================

  describe('Account Lockout Mechanism', () => {
    it('should lock account after 5 failed login attempts', async () => {
      const lockedUser = {
        ...mockUser,
        failedLoginAttempts: 5,
        lockoutUntil: new Date(Date.now() + 30 * 60 * 1000),
        isAccountLocked: jest.fn().mockReturnValue(true),
      };
      mockUserModel.findOne.mockResolvedValue(lockedUser);

      await expect(service.login({
        email: 'test@whitecross.edu',
        password: 'WrongPassword',
      })).rejects.toThrow(UnauthorizedException);
    });

    it('should prevent login during lockout period', async () => {
      const lockedUser = {
        ...mockUser,
        failedLoginAttempts: 5,
        lockoutUntil: new Date(Date.now() + 1000 * 60 * 30), // 30 minutes in future
        isAccountLocked: jest.fn().mockReturnValue(true),
      };
      mockUserModel.findOne.mockResolvedValue(lockedUser);

      await expect(service.login({
        email: 'test@whitecross.edu',
        password: 'CorrectPassword123!',
      })).rejects.toThrow('Account is temporarily locked');
    });
  });

  // ==================== SECURITY EDGE CASES ====================

  describe('Security Edge Cases', () => {
    it('should handle SQL injection attempts in email', async () => {
      mockUserModel.findOne.mockResolvedValue(null);

      await expect(service.login({
        email: "admin'--",
        password: 'password',
      })).rejects.toThrow(UnauthorizedException);
    });

    it('should handle extremely long passwords', async () => {
      const longPassword = 'A' + '1'.repeat(1000) + '!';
      mockUserModel.findOne.mockResolvedValue(null);

      await expect(service.register({
        email: 'test@test.com',
        password: longPassword,
        firstName: 'Test',
        lastName: 'User',
        role: UserRole.NURSE,
      })).rejects.toThrow(BadRequestException);
    });

    it('should handle empty password attempts', async () => {
      await expect(service.login({
        email: 'test@test.com',
        password: '',
      })).rejects.toThrow(UnauthorizedException);
    });
  });
});
