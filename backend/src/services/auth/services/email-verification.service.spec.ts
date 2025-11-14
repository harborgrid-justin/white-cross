import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';
import { EmailVerificationService } from './email-verification.service';
import { User } from '@/database/models';

describe('EmailVerificationService', () => {
  let service: EmailVerificationService;
  let userModel: {
    findByPk: jest.Mock;
    findOne: jest.Mock;
  };
  let configService: jest.Mocked<ConfigService>;

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    isEmailVerified: false,
    save: jest.fn(),
  };

  beforeEach(async () => {
    userModel = {
      findByPk: jest.fn(),
      findOne: jest.fn(),
    };

    configService = {
      get: jest.fn(),
    } as unknown as jest.Mocked<ConfigService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailVerificationService,
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

    service = module.get<EmailVerificationService>(EmailVerificationService);

    configService.get.mockReturnValue('http://localhost:3000');

    jest.clearAllMocks();
  });

  describe('sendVerificationEmail', () => {
    it('should send verification email successfully', async () => {
      userModel.findByPk.mockResolvedValue(mockUser as never);

      const result = await service.sendVerificationEmail('user-123');

      expect(userModel.findByPk).toHaveBeenCalledWith('user-123');
      expect(result.success).toBe(true);
      expect(result.message).toContain('Verification email has been sent');
    });

    it('should return success if email already verified', async () => {
      const verifiedUser = { ...mockUser, isEmailVerified: true };
      userModel.findByPk.mockResolvedValue(verifiedUser as never);

      const result = await service.sendVerificationEmail('user-123');

      expect(result.message).toBe('Email is already verified');
    });

    it('should throw BadRequestException if user not found', async () => {
      userModel.findByPk.mockResolvedValue(null);

      await expect(service.sendVerificationEmail('invalid-id')).rejects.toThrow(
        BadRequestException
      );
    });
  });

  describe('resendVerificationEmail', () => {
    it('should resend verification email', async () => {
      userModel.findOne.mockResolvedValue(mockUser as never);
      userModel.findByPk.mockResolvedValue(mockUser as never);

      const result = await service.resendVerificationEmail('test@example.com');

      expect(userModel.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(result.success).toBe(true);
    });

    it('should not reveal if user does not exist', async () => {
      userModel.findOne.mockResolvedValue(null);

      const result = await service.resendVerificationEmail('nonexistent@example.com');

      expect(result.success).toBe(true);
      expect(result.message).toContain('If an account exists');
    });

    it('should return success if email already verified', async () => {
      const verifiedUser = { ...mockUser, isEmailVerified: true };
      userModel.findOne.mockResolvedValue(verifiedUser as never);

      const result = await service.resendVerificationEmail('test@example.com');

      expect(result.message).toBe('Email is already verified');
    });
  });

  describe('verifyEmail', () => {
    it('should verify email with valid token', async () => {
      const token = 'valid-token';
      service['verificationTokens'].set(token, {
        token,
        userId: 'user-123',
        email: 'test@example.com',
        expiresAt: new Date(Date.now() + 3600000),
      });

      userModel.findByPk.mockResolvedValue(mockUser as never);

      const result = await service.verifyEmail(token);

      expect(result.success).toBe(true);
      expect(mockUser.isEmailVerified).toBe(true);
      expect(mockUser.save).toHaveBeenCalled();
      expect(service['verificationTokens'].has(token)).toBe(false);
    });

    it('should throw BadRequestException for invalid token', async () => {
      await expect(service.verifyEmail('invalid-token')).rejects.toThrow(
        BadRequestException
      );
      await expect(service.verifyEmail('invalid-token')).rejects.toThrow(
        'Invalid or expired verification token'
      );
    });

    it('should throw BadRequestException for expired token', async () => {
      const token = 'expired-token';
      service['verificationTokens'].set(token, {
        token,
        userId: 'user-123',
        email: 'test@example.com',
        expiresAt: new Date(Date.now() - 3600000),
      });

      await expect(service.verifyEmail(token)).rejects.toThrow(BadRequestException);
      await expect(service.verifyEmail(token)).rejects.toThrow('Verification token has expired');
    });

    it('should return success if email already verified', async () => {
      const token = 'valid-token';
      service['verificationTokens'].set(token, {
        token,
        userId: 'user-123',
        email: 'test@example.com',
        expiresAt: new Date(Date.now() + 3600000),
      });

      const verifiedUser = { ...mockUser, isEmailVerified: true };
      userModel.findByPk.mockResolvedValue(verifiedUser as never);

      const result = await service.verifyEmail(token);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Email is already verified');
    });
  });

  describe('isEmailVerified', () => {
    it('should return true if email is verified', async () => {
      const verifiedUser = { ...mockUser, isEmailVerified: true };
      userModel.findByPk.mockResolvedValue(verifiedUser as never);

      const result = await service.isEmailVerified('user-123');

      expect(result).toBe(true);
    });

    it('should return false if email is not verified', async () => {
      userModel.findByPk.mockResolvedValue(mockUser as never);

      const result = await service.isEmailVerified('user-123');

      expect(result).toBe(false);
    });

    it('should return false if user not found', async () => {
      userModel.findByPk.mockResolvedValue(null);

      const result = await service.isEmailVerified('invalid-id');

      expect(result).toBe(false);
    });
  });

  describe('cleanupExpiredTokens', () => {
    it('should remove expired tokens', () => {
      const expiredToken = 'expired';
      const validToken = 'valid';

      service['verificationTokens'].set(expiredToken, {
        token: expiredToken,
        userId: 'user-1',
        email: 'test1@example.com',
        expiresAt: new Date(Date.now() - 3600000),
      });

      service['verificationTokens'].set(validToken, {
        token: validToken,
        userId: 'user-2',
        email: 'test2@example.com',
        expiresAt: new Date(Date.now() + 3600000),
      });

      service['cleanupExpiredTokens']();

      expect(service['verificationTokens'].has(expiredToken)).toBe(false);
      expect(service['verificationTokens'].has(validToken)).toBe(true);
    });
  });

  describe('generateVerificationToken', () => {
    it('should generate unique tokens', () => {
      const token1 = service['generateVerificationToken']();
      const token2 = service['generateVerificationToken']();

      expect(token1).not.toBe(token2);
      expect(token1.length).toBe(64); // 32 bytes = 64 hex characters
    });
  });
});
