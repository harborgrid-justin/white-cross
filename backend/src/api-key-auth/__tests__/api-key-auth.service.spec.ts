import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
import { ApiKeyAuthService } from '../api-key-auth.service';
import { ApiKeyEntity } from '../entities/api-key.entity';
import * as crypto from 'crypto';

describe('ApiKeyAuthService', () => {
  let service: ApiKeyAuthService;
  let mockApiKeyModel: any;
  let mockConfigService: any;

  beforeEach(async () => {
    mockApiKeyModel = {
      create: jest.fn(),
      findOne: jest.fn(),
      findByPk: jest.fn(),
      findAll: jest.fn(),
    };

    mockConfigService = {
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApiKeyAuthService,
        {
          provide: getModelToken(ApiKeyEntity),
          useValue: mockApiKeyModel,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<ApiKeyAuthService>(ApiKeyAuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateApiKey', () => {
    it('should generate a new API key successfully', async () => {
      const createDto = {
        name: 'Test API Key',
        description: 'Test description',
        scopes: ['api:read'],
        expiresInDays: 365,
      };

      const userId = 'user-123';

      const mockCreatedKey = {
        id: 'key-123',
        name: createDto.name,
        keyPrefix: 'wc_test_abc',
        scopes: createDto.scopes,
        expiresAt: new Date(),
        createdAt: new Date(),
      };

      mockApiKeyModel.create.mockResolvedValue(mockCreatedKey);

      const result = await service.generateApiKey(createDto, userId);

      expect(result).toHaveProperty('apiKey');
      expect(result.apiKey).toMatch(/^wc_test_/);
      expect(result.name).toBe(createDto.name);
      expect(result.scopes).toEqual(createDto.scopes);
      expect(mockApiKeyModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: createDto.name,
          description: createDto.description,
          scopes: createDto.scopes,
          createdBy: userId,
        }),
      );
    });

    it('should use live prefix in production', async () => {
      // Mock production environment
      process.env.NODE_ENV = 'production';

      const createDto = {
        name: 'Production API Key',
        scopes: ['api:read'],
      };

      const mockCreatedKey = {
        id: 'key-123',
        name: createDto.name,
        keyPrefix: 'wc_live_abc',
        scopes: createDto.scopes,
        expiresAt: new Date(),
        createdAt: new Date(),
      };

      mockApiKeyModel.create.mockResolvedValue(mockCreatedKey);

      const result = await service.generateApiKey(createDto, 'user-123');

      expect(result.apiKey).toMatch(/^wc_live_/);

      // Reset environment
      process.env.NODE_ENV = 'test';
    });

    it('should set default expiration to 1 year if not specified', async () => {
      const createDto = {
        name: 'Test API Key',
        scopes: ['api:read'],
      };

      mockApiKeyModel.create.mockResolvedValue({
        id: 'key-123',
        name: createDto.name,
        keyPrefix: 'wc_test_abc',
        scopes: createDto.scopes,
        expiresAt: new Date(),
        createdAt: new Date(),
      });

      await service.generateApiKey(createDto, 'user-123');

      const createCall = mockApiKeyModel.create.mock.calls[0][0];
      const expiresAt = new Date(createCall.expiresAt);
      const oneYearFromNow = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

      // Check that expiration is approximately 1 year from now (within 1 minute)
      const timeDiff = Math.abs(expiresAt.getTime() - oneYearFromNow.getTime());
      expect(timeDiff).toBeLessThan(60 * 1000);
    });

    it('should throw BadRequestException on database error', async () => {
      mockApiKeyModel.create.mockRejectedValue(new Error('Database error'));

      await expect(
        service.generateApiKey({ name: 'Test' }, 'user-123'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('validateApiKey', () => {
    it('should validate a valid API key', async () => {
      const apiKey = 'wc_test_abc123def456';
      const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');

      const mockApiKeyRecord = {
        id: 'key-123',
        keyHash,
        keyPrefix: 'wc_test_abc',
        isActive: true,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        lastUsedAt: null,
        usageCount: 0,
        update: jest.fn().mockResolvedValue(true),
        isExpired: jest.fn().mockReturnValue(false),
      };

      mockApiKeyModel.findOne.mockResolvedValue(mockApiKeyRecord);

      const result = await service.validateApiKey(apiKey);

      expect(result).toBe(mockApiKeyRecord);
      expect(mockApiKeyModel.findOne).toHaveBeenCalledWith({
        where: { keyHash },
      });
      expect(mockApiKeyRecord.update).toHaveBeenCalledWith(
        expect.objectContaining({
          lastUsedAt: expect.any(Date),
          usageCount: 1,
        }),
      );
    });

    it('should throw UnauthorizedException for non-existent API key', async () => {
      mockApiKeyModel.findOne.mockResolvedValue(null);

      await expect(
        service.validateApiKey('wc_test_invalid'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for inactive API key', async () => {
      const apiKey = 'wc_test_abc123def456';
      const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');

      const mockApiKeyRecord = {
        id: 'key-123',
        keyHash,
        isActive: false, // Inactive
        isExpired: jest.fn().mockReturnValue(false),
      };

      mockApiKeyModel.findOne.mockResolvedValue(mockApiKeyRecord);

      await expect(service.validateApiKey(apiKey)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException for expired API key', async () => {
      const apiKey = 'wc_test_abc123def456';
      const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');

      const mockApiKeyRecord = {
        id: 'key-123',
        keyHash,
        isActive: true,
        expiresAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
        isExpired: jest.fn().mockReturnValue(true), // Expired
      };

      mockApiKeyModel.findOne.mockResolvedValue(mockApiKeyRecord);

      await expect(service.validateApiKey(apiKey)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should increment usage count on successful validation', async () => {
      const apiKey = 'wc_test_abc123def456';
      const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');

      const mockApiKeyRecord = {
        id: 'key-123',
        keyHash,
        isActive: true,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        usageCount: 5,
        update: jest.fn().mockResolvedValue(true),
        isExpired: jest.fn().mockReturnValue(false),
      };

      mockApiKeyModel.findOne.mockResolvedValue(mockApiKeyRecord);

      await service.validateApiKey(apiKey);

      expect(mockApiKeyRecord.update).toHaveBeenCalledWith(
        expect.objectContaining({
          usageCount: 6, // Incremented from 5 to 6
        }),
      );
    });
  });

  describe('revokeApiKey', () => {
    it('should revoke an API key successfully', async () => {
      const apiKeyId = 'key-123';
      const userId = 'user-123';

      const mockApiKeyRecord = {
        id: apiKeyId,
        keyPrefix: 'wc_test_abc',
        update: jest.fn().mockResolvedValue(true),
      };

      mockApiKeyModel.findByPk.mockResolvedValue(mockApiKeyRecord);

      await service.revokeApiKey(apiKeyId, userId);

      expect(mockApiKeyRecord.update).toHaveBeenCalledWith({
        isActive: false,
      });
    });

    it('should throw BadRequestException if API key not found', async () => {
      mockApiKeyModel.findByPk.mockResolvedValue(null);

      await expect(
        service.revokeApiKey('key-123', 'user-123'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('listApiKeys', () => {
    it('should list all API keys for a user', async () => {
      const userId = 'user-123';

      const mockApiKeys = [
        {
          id: 'key-1',
          name: 'API Key 1',
          keyPrefix: 'wc_test_abc',
          toJSON: jest.fn().mockReturnValue({ id: 'key-1', name: 'API Key 1' }),
        },
        {
          id: 'key-2',
          name: 'API Key 2',
          keyPrefix: 'wc_test_def',
          toJSON: jest.fn().mockReturnValue({ id: 'key-2', name: 'API Key 2' }),
        },
      ];

      mockApiKeyModel.findAll.mockResolvedValue(mockApiKeys);

      const result = await service.listApiKeys(userId);

      expect(result).toHaveLength(2);
      expect(mockApiKeyModel.findAll).toHaveBeenCalledWith({
        where: { createdBy: userId },
        attributes: expect.any(Array),
        order: [['createdAt', 'DESC']],
      });
    });

    it('should return empty array if no API keys found', async () => {
      mockApiKeyModel.findAll.mockResolvedValue([]);

      const result = await service.listApiKeys('user-123');

      expect(result).toEqual([]);
    });
  });

  describe('rotateApiKey', () => {
    it('should rotate an API key successfully', async () => {
      const oldKeyId = 'key-123';
      const userId = 'user-123';

      const mockOldKey = {
        id: oldKeyId,
        name: 'Old API Key',
        description: 'Old description',
        scopes: ['api:read'],
        createdBy: userId,
        keyPrefix: 'wc_test_old',
        update: jest.fn().mockResolvedValue(true),
      };

      const mockNewKey = {
        id: 'key-456',
        name: 'Old API Key',
        keyPrefix: 'wc_test_new',
        scopes: ['api:read'],
        createdAt: new Date(),
      };

      mockApiKeyModel.findByPk.mockResolvedValue(mockOldKey);
      mockApiKeyModel.create.mockResolvedValue(mockNewKey);

      const result = await service.rotateApiKey(oldKeyId, userId);

      expect(result.apiKey).toMatch(/^wc_test_/);
      expect(result.name).toBe(mockOldKey.name);
      expect(mockOldKey.update).toHaveBeenCalledWith({ isActive: false });
    });

    it('should throw BadRequestException if old key not found', async () => {
      mockApiKeyModel.findByPk.mockResolvedValue(null);

      await expect(
        service.rotateApiKey('key-123', 'user-123'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if user not authorized', async () => {
      const mockOldKey = {
        id: 'key-123',
        createdBy: 'user-123',
      };

      mockApiKeyModel.findByPk.mockResolvedValue(mockOldKey);

      await expect(
        service.rotateApiKey('key-123', 'user-456'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('hasScope', () => {
    it('should return true if API key has wildcard scope', () => {
      const mockApiKey = {
        scopes: ['api:*'],
      } as ApiKeyEntity;

      const result = service.hasScope(mockApiKey, 'api:read');

      expect(result).toBe(true);
    });

    it('should return true if API key has specific scope', () => {
      const mockApiKey = {
        scopes: ['api:read', 'api:write'],
      } as ApiKeyEntity;

      const result = service.hasScope(mockApiKey, 'api:read');

      expect(result).toBe(true);
    });

    it('should return false if API key does not have scope', () => {
      const mockApiKey = {
        scopes: ['api:read'],
      } as ApiKeyEntity;

      const result = service.hasScope(mockApiKey, 'api:write');

      expect(result).toBe(false);
    });

    it('should return false if API key has no scopes', () => {
      const mockApiKey = {
        scopes: null,
      } as ApiKeyEntity;

      const result = service.hasScope(mockApiKey, 'api:read');

      expect(result).toBe(false);
    });
  });
});
