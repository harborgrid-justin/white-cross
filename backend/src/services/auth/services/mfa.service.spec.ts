import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import { MfaService } from './mfa.service';
import { User } from '@/database/models';
import * as speakeasy from 'speakeasy';

jest.mock('speakeasy');
jest.mock('qrcode');

describe('MfaService', () => {
  let service: MfaService;
  let userModel: {
    findByPk: jest.Mock;
  };
  let configService: jest.Mocked<ConfigService>;

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    mfaEnabled: false,
    mfaSecret: null,
    mfaBackupCodes: null,
    comparePassword: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    userModel = {
      findByPk: jest.fn(),
    };

    configService = {
      get: jest.fn(),
    } as unknown as jest.Mocked<ConfigService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MfaService,
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

    service = module.get<MfaService>(MfaService);

    jest.clearAllMocks();
  });

  describe('setupMfa', () => {
    it('should setup MFA successfully', async () => {
      userModel.findByPk.mockResolvedValue(mockUser as never);
      (speakeasy.generateSecret as jest.Mock).mockReturnValue({
        base32: 'TEST-SECRET-BASE32',
        otpauth_url: 'otpauth://totp/Test',
      });

      const QRCode = require('qrcode');
      QRCode.toDataURL = jest.fn().mockResolvedValue('data:image/png;base64,mock-qr-code');

      const result = await service.setupMfa('user-123');

      expect(result).toMatchObject({
        secret: 'TEST-SECRET-BASE32',
        qrCode: expect.any(String),
        backupCodes: expect.any(Array),
        manualEntryKey: expect.any(String),
      });
      expect(result.backupCodes).toHaveLength(10);
      expect(mockUser.save).toHaveBeenCalled();
    });

    it('should throw BadRequestException if MFA already enabled', async () => {
      const enabledUser = { ...mockUser, mfaEnabled: true };
      userModel.findByPk.mockResolvedValue(enabledUser as never);

      await expect(service.setupMfa('user-123')).rejects.toThrow(BadRequestException);
      await expect(service.setupMfa('user-123')).rejects.toThrow('MFA is already enabled');
    });

    it('should throw UnauthorizedException if user not found', async () => {
      userModel.findByPk.mockResolvedValue(null);

      await expect(service.setupMfa('invalid-id')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('enableMfa', () => {
    it('should enable MFA with valid code', async () => {
      const user = { ...mockUser, mfaSecret: 'TEST-SECRET' };
      userModel.findByPk.mockResolvedValue(user as never);
      (speakeasy.totp.verify as jest.Mock).mockReturnValue(true);

      const result = await service.enableMfa('user-123', '123456', 'TEST-SECRET');

      expect(result.success).toBe(true);
      expect(user.mfaEnabled).toBe(true);
      expect(user.save).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException for invalid code', async () => {
      const user = { ...mockUser, mfaSecret: 'TEST-SECRET' };
      userModel.findByPk.mockResolvedValue(user as never);
      (speakeasy.totp.verify as jest.Mock).mockReturnValue(false);

      await expect(service.enableMfa('user-123', '000000', 'TEST-SECRET')).rejects.toThrow(
        UnauthorizedException
      );
    });

    it('should throw BadRequestException if MFA already enabled', async () => {
      const user = { ...mockUser, mfaEnabled: true };
      userModel.findByPk.mockResolvedValue(user as never);

      await expect(service.enableMfa('user-123', '123456', 'SECRET')).rejects.toThrow(
        BadRequestException
      );
    });
  });

  describe('verifyMfa', () => {
    it('should verify TOTP code successfully', async () => {
      const user = { ...mockUser, mfaEnabled: true, mfaSecret: 'TEST-SECRET' };
      userModel.findByPk.mockResolvedValue(user as never);
      (speakeasy.totp.verify as jest.Mock).mockReturnValue(true);

      const result = await service.verifyMfa('user-123', '123456', false);

      expect(result).toBe(true);
    });

    it('should verify backup code successfully', async () => {
      const hashedCode = await service['hashBackupCode']('12345678');
      const user = {
        ...mockUser,
        mfaEnabled: true,
        mfaSecret: 'TEST-SECRET',
        mfaBackupCodes: JSON.stringify([hashedCode]),
        save: jest.fn(),
      };
      userModel.findByPk.mockResolvedValue(user as never);

      const result = await service.verifyMfa('user-123', '12345678', true);

      expect(result).toBe(true);
      expect(user.save).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException for invalid TOTP', async () => {
      const user = { ...mockUser, mfaEnabled: true, mfaSecret: 'TEST-SECRET' };
      userModel.findByPk.mockResolvedValue(user as never);
      (speakeasy.totp.verify as jest.Mock).mockReturnValue(false);

      await expect(service.verifyMfa('user-123', '000000', false)).rejects.toThrow(
        UnauthorizedException
      );
    });

    it('should throw BadRequestException if MFA not enabled', async () => {
      userModel.findByPk.mockResolvedValue(mockUser as never);

      await expect(service.verifyMfa('user-123', '123456', false)).rejects.toThrow(
        BadRequestException
      );
    });
  });

  describe('disableMfa', () => {
    it('should disable MFA with valid password', async () => {
      const user = { ...mockUser, mfaEnabled: true, mfaSecret: 'SECRET', comparePassword: jest.fn() };
      userModel.findByPk.mockResolvedValue(user as never);
      user.comparePassword.mockResolvedValue(true);

      const result = await service.disableMfa('user-123', 'ValidPassword@123');

      expect(result.success).toBe(true);
      expect(user.mfaEnabled).toBe(false);
      expect(user.mfaSecret).toBeNull();
      expect(user.save).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      const user = { ...mockUser, mfaEnabled: true, comparePassword: jest.fn() };
      userModel.findByPk.mockResolvedValue(user as never);
      user.comparePassword.mockResolvedValue(false);

      await expect(service.disableMfa('user-123', 'WrongPassword')).rejects.toThrow(
        UnauthorizedException
      );
    });

    it('should verify MFA code if provided', async () => {
      const user = {
        ...mockUser,
        mfaEnabled: true,
        mfaSecret: 'SECRET',
        comparePassword: jest.fn(),
      };
      userModel.findByPk.mockResolvedValue(user as never);
      user.comparePassword.mockResolvedValue(true);
      (speakeasy.totp.verify as jest.Mock).mockReturnValue(true);

      const result = await service.disableMfa('user-123', 'ValidPassword@123', '123456');

      expect(result.success).toBe(true);
    });
  });

  describe('getMfaStatus', () => {
    it('should return MFA status', async () => {
      const user = {
        ...mockUser,
        mfaEnabled: true,
        mfaBackupCodes: JSON.stringify(['code1', 'code2', 'code3']),
        mfaEnabledAt: new Date(),
      };
      userModel.findByPk.mockResolvedValue(user as never);

      const result = await service.getMfaStatus('user-123');

      expect(result).toEqual({
        enabled: true,
        hasBackupCodes: true,
        backupCodesRemaining: 3,
        enabledAt: expect.any(Date),
      });
    });

    it('should return disabled status', async () => {
      userModel.findByPk.mockResolvedValue(mockUser as never);

      const result = await service.getMfaStatus('user-123');

      expect(result.enabled).toBe(false);
      expect(result.backupCodesRemaining).toBe(0);
    });
  });

  describe('regenerateBackupCodes', () => {
    it('should regenerate backup codes', async () => {
      const user = {
        ...mockUser,
        mfaEnabled: true,
        mfaSecret: 'SECRET',
        comparePassword: jest.fn(),
      };
      userModel.findByPk.mockResolvedValue(user as never);
      user.comparePassword.mockResolvedValue(true);
      (speakeasy.totp.verify as jest.Mock).mockReturnValue(true);

      const result = await service.regenerateBackupCodes('user-123', 'ValidPassword@123', '123456');

      expect(result.backupCodes).toHaveLength(10);
      expect(user.save).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      const user = {
        ...mockUser,
        mfaEnabled: true,
        comparePassword: jest.fn(),
      };
      userModel.findByPk.mockResolvedValue(user as never);
      user.comparePassword.mockResolvedValue(false);

      await expect(
        service.regenerateBackupCodes('user-123', 'WrongPassword', '123456')
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('generateBackupCodes', () => {
    it('should generate unique backup codes', () => {
      const codes = service['generateBackupCodes'](10);

      expect(codes).toHaveLength(10);
      expect(new Set(codes).size).toBe(10); // All codes should be unique
      codes.forEach((code) => {
        expect(code.length).toBe(8);
        expect(/^\d+$/.test(code)).toBe(true);
      });
    });
  });
});
