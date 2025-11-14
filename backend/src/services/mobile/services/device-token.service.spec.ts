import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { NotFoundException } from '@nestjs/common';
import { DeviceTokenService } from './device-token.service';
import { DeviceToken } from '../../../database/models/device-token.model';
import { RegisterDeviceDto, MobileUpdatePreferencesDto } from '../dto';
import { NotificationPlatform } from '../enums';

describe('DeviceTokenService', () => {
  let service: DeviceTokenService;
  let deviceTokenModel: jest.Mocked<typeof DeviceToken>;

  const mockDeviceTokenModel = {
    create: jest.fn(),
    update: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
    destroy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeviceTokenService,
        {
          provide: getModelToken(DeviceToken),
          useValue: mockDeviceTokenModel,
        },
      ],
    }).compile();

    service = module.get<DeviceTokenService>(DeviceTokenService);
    deviceTokenModel = module.get(getModelToken(DeviceToken));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('registerDeviceToken', () => {
    it('should register a new device token', async () => {
      const userId = 'user-123';
      const registerDto: RegisterDeviceDto = {
        deviceId: 'device-456',
        platform: NotificationPlatform.FCM,
        token: 'fcm-token-789',
        deviceName: 'iPhone 13',
        deviceModel: 'iPhone14,3',
        osVersion: '15.0',
        appVersion: '1.0.0',
      };

      const mockToken = {
        id: 'token-123',
        userId,
        ...registerDto,
        isActive: true,
        isValid: true,
        allowNotifications: true,
        createdAt: new Date(),
      };

      mockDeviceTokenModel.update.mockResolvedValue([1]);
      mockDeviceTokenModel.create.mockResolvedValue(mockToken as never);

      const result = await service.registerDeviceToken(userId, registerDto);

      expect(result).toEqual(mockToken);
      expect(mockDeviceTokenModel.update).toHaveBeenCalledWith(
        { isActive: false },
        { where: { userId, deviceId: registerDto.deviceId } },
      );
      expect(mockDeviceTokenModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId,
          deviceId: registerDto.deviceId,
          platform: registerDto.platform,
          token: registerDto.token,
          isActive: true,
          isValid: true,
        }),
      );
    });

    it('should deactivate existing tokens for the same device', async () => {
      const userId = 'user-123';
      const registerDto: RegisterDeviceDto = {
        deviceId: 'device-456',
        platform: NotificationPlatform.FCM,
        token: 'new-token',
      };

      mockDeviceTokenModel.update.mockResolvedValue([1]);
      mockDeviceTokenModel.create.mockResolvedValue({} as never);

      await service.registerDeviceToken(userId, registerDto);

      expect(mockDeviceTokenModel.update).toHaveBeenCalledWith(
        { isActive: false },
        { where: { userId, deviceId: registerDto.deviceId } },
      );
    });

    it('should set default preferences on registration', async () => {
      const userId = 'user-123';
      const registerDto: RegisterDeviceDto = {
        deviceId: 'device-456',
        platform: NotificationPlatform.FCM,
        token: 'token-789',
      };

      mockDeviceTokenModel.update.mockResolvedValue([0]);
      mockDeviceTokenModel.create.mockResolvedValue({} as never);

      await service.registerDeviceToken(userId, registerDto);

      expect(mockDeviceTokenModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          allowNotifications: true,
          allowSound: true,
          allowBadge: true,
        }),
      );
    });

    it('should handle registration errors', async () => {
      const userId = 'user-123';
      const registerDto: RegisterDeviceDto = {
        deviceId: 'device-456',
        platform: NotificationPlatform.FCM,
        token: 'token-789',
      };

      const error = new Error('Database error');
      mockDeviceTokenModel.update.mockRejectedValue(error);

      await expect(
        service.registerDeviceToken(userId, registerDto),
      ).rejects.toThrow('Database error');
    });

    it('should register APNS platform device', async () => {
      const userId = 'user-123';
      const registerDto: RegisterDeviceDto = {
        deviceId: 'device-456',
        platform: NotificationPlatform.APNS,
        token: 'apns-token-789',
      };

      mockDeviceTokenModel.update.mockResolvedValue([0]);
      mockDeviceTokenModel.create.mockResolvedValue({} as never);

      await service.registerDeviceToken(userId, registerDto);

      expect(mockDeviceTokenModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          platform: NotificationPlatform.APNS,
        }),
      );
    });
  });

  describe('unregisterDeviceToken', () => {
    it('should unregister a device token', async () => {
      const userId = 'user-123';
      const tokenId = 'token-456';

      const mockToken = {
        id: tokenId,
        userId,
        isActive: true,
      };

      mockDeviceTokenModel.findOne.mockResolvedValue(mockToken as never);
      mockDeviceTokenModel.update.mockResolvedValue([1]);

      await service.unregisterDeviceToken(userId, tokenId);

      expect(mockDeviceTokenModel.findOne).toHaveBeenCalledWith({
        where: { id: tokenId, userId },
      });
      expect(mockDeviceTokenModel.update).toHaveBeenCalledWith(
        { isActive: false },
        { where: { id: tokenId } },
      );
    });

    it('should throw NotFoundException if token not found', async () => {
      const userId = 'user-123';
      const tokenId = 'non-existent';

      mockDeviceTokenModel.findOne.mockResolvedValue(null);

      await expect(
        service.unregisterDeviceToken(userId, tokenId),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.unregisterDeviceToken(userId, tokenId),
      ).rejects.toThrow('Device token not found');
    });

    it('should verify token ownership before unregistering', async () => {
      const userId = 'user-123';
      const tokenId = 'token-456';

      mockDeviceTokenModel.findOne.mockResolvedValue(null);

      await expect(
        service.unregisterDeviceToken(userId, tokenId),
      ).rejects.toThrow(NotFoundException);
      expect(mockDeviceTokenModel.findOne).toHaveBeenCalledWith({
        where: { id: tokenId, userId },
      });
    });
  });

  describe('getUserDevices', () => {
    it('should retrieve all active devices for a user', async () => {
      const userId = 'user-123';
      const mockDevices = [
        { id: 'token-1', userId, deviceName: 'iPhone', isActive: true },
        { id: 'token-2', userId, deviceName: 'iPad', isActive: true },
      ];

      mockDeviceTokenModel.findAll.mockResolvedValue(mockDevices as never);

      const result = await service.getUserDevices(userId);

      expect(result).toEqual(mockDevices);
      expect(mockDeviceTokenModel.findAll).toHaveBeenCalledWith({
        where: {
          userId,
          isActive: true,
          isValid: true,
        },
      });
    });

    it('should return empty array if user has no devices', async () => {
      const userId = 'user-123';

      mockDeviceTokenModel.findAll.mockResolvedValue([]);

      const result = await service.getUserDevices(userId);

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should only return active and valid tokens', async () => {
      const userId = 'user-123';

      mockDeviceTokenModel.findAll.mockResolvedValue([]);

      await service.getUserDevices(userId);

      expect(mockDeviceTokenModel.findAll).toHaveBeenCalledWith({
        where: expect.objectContaining({
          isActive: true,
          isValid: true,
        }),
      });
    });
  });

  describe('updatePreferences', () => {
    it('should update device notification preferences', async () => {
      const userId = 'user-123';
      const tokenId = 'token-456';
      const preferencesDto: MobileUpdatePreferencesDto = {
        allowNotifications: false,
        allowSound: true,
        allowBadge: false,
      };

      const mockToken = {
        id: tokenId,
        userId,
        update: jest.fn().mockResolvedValue({
          id: tokenId,
          ...preferencesDto,
        }),
      };

      mockDeviceTokenModel.findOne.mockResolvedValue(mockToken as never);

      const result = await service.updatePreferences(
        userId,
        tokenId,
        preferencesDto,
      );

      expect(mockDeviceTokenModel.findOne).toHaveBeenCalledWith({
        where: { id: tokenId, userId },
      });
      expect(mockToken.update).toHaveBeenCalledWith(preferencesDto);
    });

    it('should throw NotFoundException if token not found', async () => {
      const userId = 'user-123';
      const tokenId = 'non-existent';
      const preferencesDto: MobileUpdatePreferencesDto = {
        allowNotifications: false,
      };

      mockDeviceTokenModel.findOne.mockResolvedValue(null);

      await expect(
        service.updatePreferences(userId, tokenId, preferencesDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should update individual preference fields', async () => {
      const userId = 'user-123';
      const tokenId = 'token-456';
      const preferencesDto: MobileUpdatePreferencesDto = {
        allowSound: false,
      };

      const mockToken = {
        id: tokenId,
        userId,
        update: jest.fn().mockResolvedValue({}),
      };

      mockDeviceTokenModel.findOne.mockResolvedValue(mockToken as never);

      await service.updatePreferences(userId, tokenId, preferencesDto);

      expect(mockToken.update).toHaveBeenCalledWith(
        expect.objectContaining({
          allowSound: false,
        }),
      );
    });
  });

  describe('getActiveTokensForUsers', () => {
    it('should retrieve active tokens for multiple users', async () => {
      const userIds = ['user-1', 'user-2', 'user-3'];
      const mockTokens = [
        { id: 'token-1', userId: 'user-1' },
        { id: 'token-2', userId: 'user-2' },
        { id: 'token-3', userId: 'user-3' },
      ];

      mockDeviceTokenModel.findAll.mockResolvedValue(mockTokens as never);

      const result = await service.getActiveTokensForUsers(userIds);

      expect(result).toEqual(mockTokens);
      expect(mockDeviceTokenModel.findAll).toHaveBeenCalledWith({
        where: expect.objectContaining({
          isActive: true,
          isValid: true,
          allowNotifications: true,
        }),
      });
    });

    it('should only return tokens that allow notifications', async () => {
      const userIds = ['user-1'];

      mockDeviceTokenModel.findAll.mockResolvedValue([]);

      await service.getActiveTokensForUsers(userIds);

      expect(mockDeviceTokenModel.findAll).toHaveBeenCalledWith({
        where: expect.objectContaining({
          allowNotifications: true,
        }),
      });
    });

    it('should handle empty user list', async () => {
      mockDeviceTokenModel.findAll.mockResolvedValue([]);

      const result = await service.getActiveTokensForUsers([]);

      expect(result).toEqual([]);
    });
  });

  describe('markTokenAsInvalid', () => {
    it('should mark a token as invalid with reason', async () => {
      const tokenId = 'token-123';
      const reason = 'Token expired';

      mockDeviceTokenModel.update.mockResolvedValue([1]);

      await service.markTokenAsInvalid(tokenId, reason);

      expect(mockDeviceTokenModel.update).toHaveBeenCalledWith(
        {
          isValid: false,
          invalidReason: reason,
        },
        { where: { id: tokenId } },
      );
    });

    it('should handle various invalid reasons', async () => {
      const tokenId = 'token-123';
      const reasons = [
        'Device unregistered',
        'Invalid token format',
        'Authentication failed',
      ];

      for (const reason of reasons) {
        mockDeviceTokenModel.update.mockResolvedValue([1]);
        await service.markTokenAsInvalid(tokenId, reason);

        expect(mockDeviceTokenModel.update).toHaveBeenCalledWith(
          expect.objectContaining({ invalidReason: reason }),
          { where: { id: tokenId } },
        );
      }
    });
  });

  describe('updateLastUsed', () => {
    it('should update lastUsedAt timestamp', async () => {
      const tokenId = 'token-123';

      mockDeviceTokenModel.update.mockResolvedValue([1]);

      await service.updateLastUsed(tokenId);

      expect(mockDeviceTokenModel.update).toHaveBeenCalledWith(
        { lastUsedAt: expect.any(Date) },
        { where: { id: tokenId } },
      );
    });

    it('should use current timestamp', async () => {
      const tokenId = 'token-123';
      const beforeTime = new Date();

      mockDeviceTokenModel.update.mockResolvedValue([1]);

      await service.updateLastUsed(tokenId);

      const afterTime = new Date();
      const callArgs = mockDeviceTokenModel.update.mock.calls[0][0];
      const updatedTime = (callArgs as { lastUsedAt: Date }).lastUsedAt;

      expect(updatedTime.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime());
      expect(updatedTime.getTime()).toBeLessThanOrEqual(afterTime.getTime());
    });
  });

  describe('cleanupInactiveTokens', () => {
    it('should clean up tokens inactive for default 90 days', async () => {
      mockDeviceTokenModel.destroy.mockResolvedValue(5);

      const result = await service.cleanupInactiveTokens();

      expect(result).toBe(5);
      expect(mockDeviceTokenModel.destroy).toHaveBeenCalledWith({
        where: expect.objectContaining({
          isActive: false,
        }),
      });
    });

    it('should clean up tokens inactive for custom days', async () => {
      mockDeviceTokenModel.destroy.mockResolvedValue(3);

      const result = await service.cleanupInactiveTokens(30);

      expect(result).toBe(3);
    });

    it('should return zero if no tokens cleaned up', async () => {
      mockDeviceTokenModel.destroy.mockResolvedValue(0);

      const result = await service.cleanupInactiveTokens();

      expect(result).toBe(0);
    });

    it('should calculate correct cutoff date', async () => {
      const inactiveDays = 60;
      const expectedCutoff = new Date();
      expectedCutoff.setDate(expectedCutoff.getDate() - inactiveDays);

      mockDeviceTokenModel.destroy.mockResolvedValue(2);

      await service.cleanupInactiveTokens(inactiveDays);

      expect(mockDeviceTokenModel.destroy).toHaveBeenCalled();
    });

    it('should only remove inactive tokens', async () => {
      mockDeviceTokenModel.destroy.mockResolvedValue(1);

      await service.cleanupInactiveTokens();

      const whereClause = mockDeviceTokenModel.destroy.mock.calls[0][0].where;
      expect(whereClause).toHaveProperty('isActive', false);
    });
  });
});
