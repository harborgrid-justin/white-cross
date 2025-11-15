import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  ConflictException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { TokenBlacklistService } from './services/token-blacklist.service';
import { User, UserRole } from '@/database';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthChangePasswordDto } from './dto/change-password.dto';

describe('AuthService', () => {
  let service: AuthService;
  let userModel: {
    findOne: jest.Mock;
    findByPk: jest.Mock;
    create: jest.Mock;
  };
  let jwtService: jest.Mocked<JwtService>;
  let configService: jest.Mocked<ConfigService>;
  let tokenBlacklistService: jest.Mocked<TokenBlacklistService>;

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    password: 'hashedPassword',
    firstName: 'Test',
    lastName: 'User',
    role: UserRole.ADMIN,
    isActive: true,
    isEmailVerified: true,
    emailVerifiedAt: new Date(),
    mfaEnabled: false,
    comparePassword: jest.fn(),
    isAccountLocked: jest.fn(),
    incrementFailedLoginAttempts: jest.fn(),
    resetFailedLoginAttempts: jest.fn(),
    toSafeObject: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    userModel = {
      findOne: jest.fn(),
      findByPk: jest.fn(),
      create: jest.fn(),
    };

    jwtService = {
      sign: jest.fn(),
      verify: jest.fn(),
    } as unknown as jest.Mocked<JwtService>;

    configService = {
      get: jest.fn(),
    } as unknown as jest.Mocked<ConfigService>;

    tokenBlacklistService = {
      blacklistAllUserTokens: jest.fn(),
    } as unknown as jest.Mocked<TokenBlacklistService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(User),
          useValue: userModel,
        },
        {
          provide: JwtService,
          useValue: jwtService,
        },
        {
          provide: ConfigService,
          useValue: configService,
        },
        {
          provide: TokenBlacklistService,
          useValue: tokenBlacklistService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    // Setup default config values
    configService.get.mockImplementation((key: string, defaultValue?: string) => {
      const config: Record<string, string> = {
        BCRYPT_SALT_ROUNDS: '12',
        JWT_SECRET: 'test-jwt-secret',
        JWT_REFRESH_SECRET: 'test-refresh-secret',
      };
      return config[key] || defaultValue;
    });
  });

  describe('constructor', () => {
    it('should initialize with configured salt rounds', () => {
      expect(configService.get).toHaveBeenCalledWith('BCRYPT_SALT_ROUNDS', '12');
    });

    it('should throw error for invalid salt rounds', () => {
      configService.get.mockReturnValue('5');

      expect(() => {
        new AuthService(userModel as never, jwtService, configService, tokenBlacklistService);
      }).toThrow('SECURITY WARNING: bcrypt salt rounds must be between 10 and 14');
    });
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const registerDto: RegisterDto = {
        email: 'newuser@example.com',
        password: 'Test@123',
        firstName: 'New',
        lastName: 'User',
        role: UserRole.ADMIN,
      };

      userModel.findOne.mockResolvedValue(null);
      userModel.create.mockResolvedValue(mockUser as never);
      mockUser.toSafeObject.mockReturnValue({
        id: mockUser.id,
        email: mockUser.email,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        role: mockUser.role,
      });
      jwtService.sign.mockReturnValueOnce('access-token').mockReturnValueOnce('refresh-token');

      const result = await service.register(registerDto);

      expect(userModel.findOne).toHaveBeenCalledWith({ where: { email: registerDto.email } });
      expect(userModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: registerDto.email,
          password: registerDto.password,
          firstName: registerDto.firstName,
          lastName: registerDto.lastName,
          role: registerDto.role,
          emailVerified: true,
          isEmailVerified: true,
          isActive: true,
        })
      );
      expect(result).toEqual({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        user: expect.any(Object),
        tokenType: 'Bearer',
        expiresIn: 900,
      });
    });

    it('should throw ConflictException if user already exists', async () => {
      const registerDto: RegisterDto = {
        email: 'existing@example.com',
        password: 'Test@123',
        firstName: 'Test',
        lastName: 'User',
      };

      userModel.findOne.mockResolvedValue(mockUser as never);

      await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
      await expect(service.register(registerDto)).rejects.toThrow('User with this email already exists');
    });

    it('should throw BadRequestException for invalid email', async () => {
      const registerDto: RegisterDto = {
        email: 'invalid-email',
        password: 'Test@123',
        firstName: 'Test',
        lastName: 'User',
      };

      userModel.findOne.mockResolvedValue(null);

      await expect(service.register(registerDto)).rejects.toThrow(BadRequestException);
      await expect(service.register(registerDto)).rejects.toThrow('Invalid email format');
    });

    it('should throw BadRequestException for weak password', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'weak',
        firstName: 'Test',
        lastName: 'User',
      };

      userModel.findOne.mockResolvedValue(null);

      await expect(service.register(registerDto)).rejects.toThrow(BadRequestException);
      await expect(service.register(registerDto)).rejects.toThrow(
        'Password must be at least 8 characters and include uppercase, lowercase, number, and special character'
      );
    });

    it('should handle database errors during registration', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'Test@123',
        firstName: 'Test',
        lastName: 'User',
      };

      userModel.findOne.mockResolvedValue(null);
      userModel.create.mockRejectedValue(new Error('Database error'));

      await expect(service.register(registerDto)).rejects.toThrow(BadRequestException);
      await expect(service.register(registerDto)).rejects.toThrow('Failed to register user');
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'Test@123',
      };

      userModel.findOne.mockResolvedValue(mockUser as never);
      mockUser.isAccountLocked.mockReturnValue(false);
      mockUser.comparePassword.mockResolvedValue(true);
      mockUser.toSafeObject.mockReturnValue({
        id: mockUser.id,
        email: mockUser.email,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        role: mockUser.role,
      });
      jwtService.sign.mockReturnValueOnce('access-token').mockReturnValueOnce('refresh-token');

      const result = await service.login(loginDto);

      expect(userModel.findOne).toHaveBeenCalledWith({ where: { email: loginDto.email } });
      expect(mockUser.comparePassword).toHaveBeenCalledWith(loginDto.password);
      expect(mockUser.resetFailedLoginAttempts).toHaveBeenCalled();
      expect(result).toEqual({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        user: expect.any(Object),
        tokenType: 'Bearer',
        expiresIn: 900,
      });
    });

    it('should throw UnauthorizedException for non-existent user', async () => {
      const loginDto: LoginDto = {
        email: 'nonexistent@example.com',
        password: 'Test@123',
      };

      userModel.findOne.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      await expect(service.login(loginDto)).rejects.toThrow('Invalid email or password');
    });

    it('should throw UnauthorizedException for locked account', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'Test@123',
      };

      userModel.findOne.mockResolvedValue(mockUser as never);
      mockUser.isAccountLocked.mockReturnValue(true);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      await expect(service.login(loginDto)).rejects.toThrow(
        'Account is temporarily locked due to multiple failed login attempts'
      );
    });

    it('should increment failed attempts on wrong password', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'WrongPassword',
      };

      userModel.findOne.mockResolvedValue(mockUser as never);
      mockUser.isAccountLocked.mockReturnValue(false);
      mockUser.comparePassword.mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      expect(mockUser.incrementFailedLoginAttempts).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException for inactive account', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'Test@123',
      };

      const inactiveUser = { ...mockUser, isActive: false };
      userModel.findOne.mockResolvedValue(inactiveUser as never);
      mockUser.isAccountLocked.mockReturnValue(false);
      mockUser.comparePassword.mockResolvedValue(true);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      await expect(service.login(loginDto)).rejects.toThrow('Account is inactive');
    });
  });

  describe('verifyUser', () => {
    it('should verify user by ID', async () => {
      userModel.findByPk.mockResolvedValue(mockUser as never);

      const result = await service.verifyUser('user-123');

      expect(userModel.findByPk).toHaveBeenCalledWith('user-123');
      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      userModel.findByPk.mockResolvedValue(null);

      await expect(service.verifyUser('non-existent')).rejects.toThrow(UnauthorizedException);
      await expect(service.verifyUser('non-existent')).rejects.toThrow('User not found');
    });
  });

  describe('verifyToken', () => {
    it('should verify valid access token', async () => {
      const token = 'valid-access-token';
      const payload = {
        sub: 'user-123',
        email: 'test@example.com',
        role: UserRole.ADMIN,
        type: 'access',
      };

      jwtService.verify.mockReturnValue(payload as never);
      userModel.findByPk.mockResolvedValue(mockUser as never);
      mockUser.toSafeObject.mockReturnValue({
        id: mockUser.id,
        email: mockUser.email,
      });

      const result = await service.verifyToken(token);

      expect(jwtService.verify).toHaveBeenCalledWith(token, { secret: 'test-jwt-secret' });
      expect(userModel.findByPk).toHaveBeenCalledWith('user-123');
      expect(result).toEqual(expect.objectContaining({ id: mockUser.id }));
    });

    it('should throw UnauthorizedException for invalid token type', async () => {
      const token = 'refresh-token';
      const payload = {
        sub: 'user-123',
        email: 'test@example.com',
        role: UserRole.ADMIN,
        type: 'refresh',
      };

      jwtService.verify.mockReturnValue(payload as never);

      await expect(service.verifyToken(token)).rejects.toThrow(UnauthorizedException);
      await expect(service.verifyToken(token)).rejects.toThrow('Invalid token type');
    });

    it('should throw UnauthorizedException for inactive user', async () => {
      const token = 'valid-access-token';
      const payload = {
        sub: 'user-123',
        email: 'test@example.com',
        role: UserRole.ADMIN,
        type: 'access',
      };

      jwtService.verify.mockReturnValue(payload as never);
      const inactiveUser = { ...mockUser, isActive: false };
      userModel.findByPk.mockResolvedValue(inactiveUser as never);

      await expect(service.verifyToken(token)).rejects.toThrow(UnauthorizedException);
      await expect(service.verifyToken(token)).rejects.toThrow('User account is inactive');
    });

    it('should throw UnauthorizedException for expired token', async () => {
      jwtService.verify.mockImplementation(() => {
        throw new Error('Token expired');
      });

      await expect(service.verifyToken('expired-token')).rejects.toThrow(UnauthorizedException);
      await expect(service.verifyToken('expired-token')).rejects.toThrow('Invalid or expired token');
    });

    it('should throw error if JWT_SECRET not configured', async () => {
      configService.get.mockReturnValue(undefined);

      await expect(service.verifyToken('token')).rejects.toThrow('JWT_SECRET not configured');
    });
  });

  describe('refreshToken', () => {
    it('should refresh access token with valid refresh token', async () => {
      const refreshToken = 'valid-refresh-token';
      const payload = {
        sub: 'user-123',
        email: 'test@example.com',
        role: UserRole.ADMIN,
        type: 'refresh',
      };

      jwtService.verify.mockReturnValue(payload as never);
      userModel.findByPk.mockResolvedValue(mockUser as never);
      mockUser.toSafeObject.mockReturnValue({
        id: mockUser.id,
        email: mockUser.email,
      });
      jwtService.sign.mockReturnValueOnce('new-access-token').mockReturnValueOnce('new-refresh-token');

      const result = await service.refreshToken(refreshToken);

      expect(jwtService.verify).toHaveBeenCalledWith(refreshToken, { secret: 'test-refresh-secret' });
      expect(result).toEqual({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
        user: expect.any(Object),
        tokenType: 'Bearer',
        expiresIn: 900,
      });
    });

    it('should throw UnauthorizedException for invalid refresh token type', async () => {
      const token = 'access-token';
      const payload = {
        sub: 'user-123',
        email: 'test@example.com',
        role: UserRole.ADMIN,
        type: 'access',
      };

      jwtService.verify.mockReturnValue(payload as never);

      await expect(service.refreshToken(token)).rejects.toThrow(UnauthorizedException);
      await expect(service.refreshToken(token)).rejects.toThrow('Invalid token type');
    });

    it('should throw UnauthorizedException for expired refresh token', async () => {
      jwtService.verify.mockImplementation(() => {
        throw new Error('Token expired');
      });

      await expect(service.refreshToken('expired-refresh-token')).rejects.toThrow(UnauthorizedException);
      await expect(service.refreshToken('expired-refresh-token')).rejects.toThrow(
        'Invalid or expired refresh token'
      );
    });
  });

  describe('changePassword', () => {
    it('should change password successfully', async () => {
      const changePasswordDto: AuthChangePasswordDto = {
        currentPassword: 'OldPassword@123',
        newPassword: 'NewPassword@456',
      };

      userModel.findByPk.mockResolvedValue(mockUser as never);
      mockUser.comparePassword.mockResolvedValue(true);
      mockUser.save.mockResolvedValue(undefined);

      const result = await service.changePassword('user-123', changePasswordDto);

      expect(userModel.findByPk).toHaveBeenCalledWith('user-123');
      expect(mockUser.comparePassword).toHaveBeenCalledWith(changePasswordDto.currentPassword);
      expect(mockUser.password).toBe(changePasswordDto.newPassword);
      expect(mockUser.save).toHaveBeenCalled();
      expect(tokenBlacklistService.blacklistAllUserTokens).toHaveBeenCalledWith('user-123');
      expect(result.message).toContain('Password changed successfully');
    });

    it('should throw UnauthorizedException for incorrect current password', async () => {
      const changePasswordDto: AuthChangePasswordDto = {
        currentPassword: 'WrongPassword',
        newPassword: 'NewPassword@456',
      };

      userModel.findByPk.mockResolvedValue(mockUser as never);
      mockUser.comparePassword.mockResolvedValue(false);

      await expect(service.changePassword('user-123', changePasswordDto)).rejects.toThrow(UnauthorizedException);
      await expect(service.changePassword('user-123', changePasswordDto)).rejects.toThrow(
        'Current password is incorrect'
      );
    });

    it('should throw BadRequestException for weak new password', async () => {
      const changePasswordDto: AuthChangePasswordDto = {
        currentPassword: 'OldPassword@123',
        newPassword: 'weak',
      };

      userModel.findByPk.mockResolvedValue(mockUser as never);
      mockUser.comparePassword.mockResolvedValue(true);

      await expect(service.changePassword('user-123', changePasswordDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      const changePasswordDto: AuthChangePasswordDto = {
        currentPassword: 'OldPassword@123',
        newPassword: 'NewPassword@456',
      };

      userModel.findByPk.mockResolvedValue(null);

      await expect(service.changePassword('non-existent', changePasswordDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('resetPassword', () => {
    it('should reset password successfully', async () => {
      userModel.findByPk.mockResolvedValue(mockUser as never);
      mockUser.save.mockResolvedValue(undefined);

      const result = await service.resetPassword('user-123', 'NewPassword@789', 'admin-123');

      expect(userModel.findByPk).toHaveBeenCalledWith('user-123');
      expect(mockUser.password).toBe('NewPassword@789');
      expect(mockUser.mustChangePassword).toBe(true);
      expect(mockUser.save).toHaveBeenCalled();
      expect(result.message).toBe('Password reset successfully');
    });

    it('should throw BadRequestException for weak password', async () => {
      userModel.findByPk.mockResolvedValue(mockUser as never);

      await expect(service.resetPassword('user-123', 'weak')).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if user not found', async () => {
      userModel.findByPk.mockResolvedValue(null);

      await expect(service.resetPassword('non-existent', 'NewPassword@789')).rejects.toThrow(BadRequestException);
      await expect(service.resetPassword('non-existent', 'NewPassword@789')).rejects.toThrow('User not found');
    });
  });

  describe('validateEmail', () => {
    it('should validate correct email formats', () => {
      expect(service.validateEmail('test@example.com')).toBe(true);
      expect(service.validateEmail('user.name@example.co.uk')).toBe(true);
      expect(service.validateEmail('user+tag@example.com')).toBe(true);
    });

    it('should reject invalid email formats', () => {
      expect(service.validateEmail('invalid')).toBe(false);
      expect(service.validateEmail('invalid@')).toBe(false);
      expect(service.validateEmail('@example.com')).toBe(false);
      expect(service.validateEmail('invalid@.com')).toBe(false);
    });
  });

  describe('validatePasswordStrength', () => {
    it('should validate strong passwords', () => {
      expect(service.validatePasswordStrength('Test@123')).toBe(true);
      expect(service.validatePasswordStrength('StrongP@ssw0rd')).toBe(true);
    });

    it('should reject weak passwords', () => {
      expect(service.validatePasswordStrength('short')).toBe(false);
      expect(service.validatePasswordStrength('nouppercase1@')).toBe(false);
      expect(service.validatePasswordStrength('NOLOWERCASE1@')).toBe(false);
      expect(service.validatePasswordStrength('NoNumbers@')).toBe(false);
      expect(service.validatePasswordStrength('NoSpecial1')).toBe(false);
    });
  });

  describe('getOrCreateTestUser', () => {
    it('should return existing test user', async () => {
      userModel.findOne.mockResolvedValue(mockUser as never);

      const result = await service.getOrCreateTestUser(UserRole.NURSE);

      expect(userModel.findOne).toHaveBeenCalledWith({ where: { email: 'test-nurse@whitecross.test' } });
      expect(userModel.create).not.toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it('should create new test user if not exists', async () => {
      userModel.findOne.mockResolvedValue(null);
      userModel.create.mockResolvedValue(mockUser as never);

      const result = await service.getOrCreateTestUser(UserRole.ADMIN);

      expect(userModel.findOne).toHaveBeenCalledWith({ where: { email: 'test-admin@whitecross.test' } });
      expect(userModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'test-admin@whitecross.test',
          password: 'test123',
          firstName: 'Test',
          lastName: 'Admin',
          role: UserRole.ADMIN,
        })
      );
      expect(result).toEqual(mockUser);
    });
  });

  describe('hashPassword', () => {
    it('should hash password with configured salt rounds', async () => {
      const password = 'TestPassword@123';

      const hash = await service.hashPassword(password);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(typeof hash).toBe('string');
    });
  });

  describe('comparePassword', () => {
    it('should return true for matching password', async () => {
      const password = 'TestPassword@123';
      const hash = await service.hashPassword(password);

      const result = await service.comparePassword(password, hash);

      expect(result).toBe(true);
    });

    it('should return false for non-matching password', async () => {
      const password = 'TestPassword@123';
      const hash = await service.hashPassword(password);

      const result = await service.comparePassword('WrongPassword', hash);

      expect(result).toBe(false);
    });
  });
});
