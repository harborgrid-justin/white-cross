import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';
import { PasswordResetService } from './password-reset.service';
import { User } from '@/database/models';

describe('PasswordResetService', () => {
  let service: PasswordResetService;
  let userModel: {
    findOne: jest.Mock;
    findByPk: jest.Mock;
  };
  let configService: jest.Mocked<ConfigService>;

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    password: 'old-password',
    mustChangePassword: false,
    save: jest.fn(),
  };

  beforeEach(async () => {
    userModel = {
      findOne: jest.fn(),
      findByPk: jest.fn(),
    };

    configService = {
      get: jest.fn(),
    } as unknown as jest.Mocked<ConfigService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PasswordResetService,
        {
          provide: getModelToken(User),
          useValue: userModel,
        },
        {
          provide: ConfigService,
          useValue: configService,
        },
      ],
    }).compile();

    service = module.get<PasswordResetService>(PasswordResetService);

    configService.get.mockReturnValue('http://localhost:3000');

    jest.clearAllMocks();
  });

  describe('initiatePasswordReset', () => {
    it('should initiate password reset for existing user', async () => {
      userModel.findOne.mockResolvedValue(mockUser as never);

      const result = await service.initiatePasswordReset('test@example.com');

      expect(userModel.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(result.success).toBe(true);
      expect(result.message).toContain('If an account exists');
    });

    it('should not reveal if user does not exist', async () => {
      userModel.findOne.mockResolvedValue(null);

      const result = await service.initiatePasswordReset('nonexistent@example.com');

      expect(result.success).toBe(true);
      expect(result.message).toContain('If an account exists');
    });

    it('should generate and store reset token', async () => {
      userModel.findOne.mockResolvedValue(mockUser as never);

      await service.initiatePasswordReset('test@example.com');

      const tokens = service['resetTokens'];
      expect(tokens.size).toBeGreaterThan(0);
    });
  });

  describe('verifyResetToken', () => {
    it('should verify valid token', async () => {
      const token = 'valid-token';
      service['resetTokens'].set(token, {
        token,
        userId: 'user-123',
        expiresAt: new Date(Date.now() + 3600000),
      });

      const result = await service.verifyResetToken(token);

      expect(result.valid).toBe(true);
      expect(result.message).toBe('Token is valid');
    });

    it('should reject invalid token', async () => {
      const result = await service.verifyResetToken('invalid-token');

      expect(result.valid).toBe(false);
      expect(result.message).toBe('Invalid or expired reset token');
    });

    it('should reject expired token', async () => {
      const token = 'expired-token';
      service['resetTokens'].set(token, {
        token,
        userId: 'user-123',
        expiresAt: new Date(Date.now() - 3600000),
      });

      const result = await service.verifyResetToken(token);

      expect(result.valid).toBe(false);
      expect(result.message).toBe('Reset token has expired');
      expect(service['resetTokens'].has(token)).toBe(false);
    });
  });

  describe('resetPassword', () => {
    it('should reset password with valid token', async () => {
      const token = 'valid-token';
      service['resetTokens'].set(token, {
        token,
        userId: 'user-123',
        expiresAt: new Date(Date.now() + 3600000),
      });

      userModel.findByPk.mockResolvedValue(mockUser as never);

      const result = await service.resetPassword(token, 'NewPassword@123');

      expect(mockUser.password).toBe('NewPassword@123');
      expect(mockUser.mustChangePassword).toBe(false);
      expect(mockUser.save).toHaveBeenCalled();
      expect(result.success).toBe(true);
      expect(service['resetTokens'].has(token)).toBe(false);
    });

    it('should throw BadRequestException for invalid token', async () => {
      await expect(service.resetPassword('invalid-token', 'NewPassword@123')).rejects.toThrow(
        BadRequestException
      );
    });

    it('should throw BadRequestException for weak password', async () => {
      const token = 'valid-token';
      service['resetTokens'].set(token, {
        token,
        userId: 'user-123',
        expiresAt: new Date(Date.now() + 3600000),
      });

      userModel.findByPk.mockResolvedValue(mockUser as never);

      await expect(service.resetPassword(token, 'weak')).rejects.toThrow(BadRequestException);
      await expect(service.resetPassword(token, 'weak')).rejects.toThrow(
        'Password must be at least 8 characters'
      );
    });

    it('should throw BadRequestException if user not found', async () => {
      const token = 'valid-token';
      service['resetTokens'].set(token, {
        token,
        userId: 'user-123',
        expiresAt: new Date(Date.now() + 3600000),
      });

      userModel.findByPk.mockResolvedValue(null);

      await expect(service.resetPassword(token, 'NewPassword@123')).rejects.toThrow(
        BadRequestException
      );
    });
  });

  describe('cleanupExpiredTokens', () => {
    it('should remove expired tokens', () => {
      const expiredToken = 'expired';
      const validToken = 'valid';

      service['resetTokens'].set(expiredToken, {
        token: expiredToken,
        userId: 'user-1',
        expiresAt: new Date(Date.now() - 3600000),
      });

      service['resetTokens'].set(validToken, {
        token: validToken,
        userId: 'user-2',
        expiresAt: new Date(Date.now() + 3600000),
      });

      service['cleanupExpiredTokens']();

      expect(service['resetTokens'].has(expiredToken)).toBe(false);
      expect(service['resetTokens'].has(validToken)).toBe(true);
    });
  });

  describe('generateResetToken', () => {
    it('should generate unique tokens', () => {
      const token1 = service['generateResetToken']();
      const token2 = service['generateResetToken']();

      expect(token1).not.toBe(token2);
      expect(token1.length).toBe(64);
    });
  });

  describe('validatePasswordStrength', () => {
    it('should validate strong passwords', () => {
      expect(service['validatePasswordStrength']('Test@123')).toBe(true);
      expect(service['validatePasswordStrength']('StrongP@ssw0rd')).toBe(true);
    });

    it('should reject weak passwords', () => {
      expect(service['validatePasswordStrength']('short')).toBe(false);
      expect(service['validatePasswordStrength']('nouppercase1@')).toBe(false);
      expect(service['validatePasswordStrength']('NOLOWERCASE1@')).toBe(false);
      expect(service['validatePasswordStrength']('NoNumbers@')).toBe(false);
      expect(service['validatePasswordStrength']('NoSpecial1')).toBe(false);
    });
  });
});
