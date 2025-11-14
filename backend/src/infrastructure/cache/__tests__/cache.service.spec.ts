/**
 * @fileoverview Cache Service Unit Tests
 * @module infrastructure/cache/__tests__
 */

import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CacheService } from '../cache.service';
import { CacheConfigService } from '../cache.config';
import { CacheConnectionService } from '../cache-connection.service';
import { CacheStorageService } from '../cache-storage.service';
import { CacheSerializationService } from '../cache-serialization.service';
import { CacheInvalidationService } from '../cache-invalidation.service';
import { CacheOperationsService } from '../cache-operations.service';
import { LoggerService } from '@/common/logging/logger.service';
import { CacheEvent } from '../cache.interfaces';

describe('CacheService', () => {
  let service: CacheService;
  let configService: jest.Mocked<CacheConfigService>;
  let connectionService: jest.Mocked<CacheConnectionService>;
  let storageService: jest.Mocked<CacheStorageService>;
  let serializationService: jest.Mocked<CacheSerializationService>;
  let invalidationService: jest.Mocked<CacheInvalidationService>;
  let operationsService: jest.Mocked<CacheOperationsService>;
  let eventEmitter: jest.Mocked<EventEmitter2>;
  let loggerService: jest.Mocked<LoggerService>;

  beforeEach(async () => {
    const mockConfigService = {
      validate: jest.fn(),
      getSummary: jest.fn().mockReturnValue({
        enabled: true,
        l1Enabled: true,
        l2Enabled: true,
      }),
      getMaxMemoryMB: jest.fn().mockReturnValue(100),
      getL1MaxItems: jest.fn().mockReturnValue(1000),
      getL1TTL: jest.fn().mockReturnValue(300000),
    };

    const mockConnectionService = {
      connect: jest.fn().mockResolvedValue(undefined),
      disconnect: jest.fn().mockResolvedValue(undefined),
      getClient: jest.fn().mockReturnValue({
        ping: jest.fn().mockResolvedValue('PONG'),
      }),
      isConnected: jest.fn().mockReturnValue(true),
      getHealth: jest.fn().mockResolvedValue({
        connected: true,
        latency: 1,
        memoryUsage: 50,
      }),
    };

    const mockStorageService = {
      startCleanup: jest.fn(),
      stopCleanup: jest.fn(),
      get: jest.fn(),
      set: jest.fn().mockResolvedValue(undefined),
      delete: jest.fn().mockResolvedValue(true),
      clear: jest.fn().mockResolvedValue(undefined),
      getL1Stats: jest.fn().mockReturnValue({
        size: 100,
        maxSize: 1000,
        hitRate: 0.85,
      }),
    };

    const mockSerializationService = {
      serialize: jest.fn((value) => JSON.stringify(value)),
      deserialize: jest.fn((value) => JSON.parse(value)),
      compress: jest.fn((value) => value),
      decompress: jest.fn((value) => value),
    };

    const mockInvalidationService = {
      invalidateByTag: jest.fn().mockResolvedValue(5),
      invalidateByPattern: jest.fn().mockResolvedValue(3),
      addTag: jest.fn(),
      getTags: jest.fn().mockReturnValue(['user:123', 'role:admin']),
    };

    const mockOperationsService = {
      mget: jest.fn().mockResolvedValue({}),
      mset: jest.fn().mockResolvedValue(undefined),
      increment: jest.fn().mockResolvedValue(1),
      decrement: jest.fn().mockResolvedValue(0),
    };

    const mockEventEmitter = {
      emit: jest.fn(),
    };

    const mockLoggerService = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CacheService,
        { provide: CacheConfigService, useValue: mockConfigService },
        { provide: CacheConnectionService, useValue: mockConnectionService },
        { provide: CacheStorageService, useValue: mockStorageService },
        { provide: CacheSerializationService, useValue: mockSerializationService },
        { provide: CacheInvalidationService, useValue: mockInvalidationService },
        { provide: CacheOperationsService, useValue: mockOperationsService },
        { provide: EventEmitter2, useValue: mockEventEmitter },
        { provide: LoggerService, useValue: mockLoggerService },
      ],
    }).compile();

    service = module.get<CacheService>(CacheService);
    configService = module.get(CacheConfigService);
    connectionService = module.get(CacheConnectionService);
    storageService = module.get(CacheStorageService);
    serializationService = module.get(CacheSerializationService);
    invalidationService = module.get(CacheInvalidationService);
    operationsService = module.get(CacheOperationsService);
    eventEmitter = module.get(EventEmitter2);
    loggerService = module.get(LoggerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Lifecycle', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should initialize successfully', async () => {
      await service.onModuleInit();

      expect(configService.validate).toHaveBeenCalled();
      expect(connectionService.connect).toHaveBeenCalled();
      expect(storageService.startCleanup).toHaveBeenCalled();
    });

    it('should handle initialization errors gracefully', async () => {
      connectionService.connect.mockRejectedValueOnce(new Error('Connection failed'));

      await service.onModuleInit();

      expect(loggerService.error).toHaveBeenCalled();
    });

    it('should disconnect on module destroy', async () => {
      await service.onModuleDestroy();

      expect(storageService.stopCleanup).toHaveBeenCalled();
      expect(connectionService.disconnect).toHaveBeenCalled();
    });
  });

  describe('get', () => {
    it('should return cached value from L1', async () => {
      const testData = { id: 1, name: 'Test' };
      storageService.get.mockResolvedValueOnce({
        value: testData,
        tier: 'L1',
      });

      const result = await service.get('test-key');

      expect(result).toEqual(testData);
      expect(storageService.get).toHaveBeenCalledWith('test-key');
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        CacheEvent.HIT,
        expect.objectContaining({ key: 'test-key', tier: 'L1' })
      );
    });

    it('should return cached value from L2', async () => {
      const testData = { id: 2, name: 'Test L2' };
      storageService.get.mockResolvedValueOnce({
        value: testData,
        tier: 'L2',
      });

      const result = await service.get('test-key-l2');

      expect(result).toEqual(testData);
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        CacheEvent.HIT,
        expect.objectContaining({ tier: 'L2' })
      );
    });

    it('should return null on cache miss', async () => {
      storageService.get.mockResolvedValueOnce(null);

      const result = await service.get('non-existent');

      expect(result).toBeNull();
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        CacheEvent.MISS,
        expect.objectContaining({ key: 'non-existent' })
      );
    });

    it('should handle get errors gracefully', async () => {
      storageService.get.mockRejectedValueOnce(new Error('Redis error'));

      const result = await service.get('error-key');

      expect(result).toBeNull();
      expect(loggerService.error).toHaveBeenCalled();
    });
  });

  describe('set', () => {
    it('should cache value with default TTL', async () => {
      const testData = { id: 1, name: 'Test' };

      await service.set('test-key', testData);

      expect(storageService.set).toHaveBeenCalledWith(
        'test-key',
        testData,
        expect.objectContaining({})
      );
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        CacheEvent.SET,
        expect.objectContaining({ key: 'test-key' })
      );
    });

    it('should cache value with custom TTL', async () => {
      const testData = { id: 2, name: 'Test TTL' };
      const customTTL = 60000;

      await service.set('test-key-ttl', testData, { ttl: customTTL });

      expect(storageService.set).toHaveBeenCalledWith(
        'test-key-ttl',
        testData,
        expect.objectContaining({ ttl: customTTL })
      );
    });

    it('should cache value with tags', async () => {
      const testData = { userId: 123 };
      const tags = ['user:123', 'profile'];

      await service.set('user-profile', testData, { tags });

      expect(invalidationService.addTag).toHaveBeenCalled();
    });

    it('should handle set errors gracefully', async () => {
      storageService.set.mockRejectedValueOnce(new Error('Redis error'));

      await service.set('error-key', { data: 'test' });

      expect(loggerService.error).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete cached value', async () => {
      await service.delete('test-key');

      expect(storageService.delete).toHaveBeenCalledWith('test-key');
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        CacheEvent.DELETE,
        expect.objectContaining({ key: 'test-key' })
      );
    });

    it('should handle delete errors gracefully', async () => {
      storageService.delete.mockRejectedValueOnce(new Error('Redis error'));

      const result = await service.delete('error-key');

      expect(result).toBe(false);
      expect(loggerService.error).toHaveBeenCalled();
    });
  });

  describe('Invalidation', () => {
    it('should invalidate by tag', async () => {
      const count = await service.invalidateByTag('user:123');

      expect(invalidationService.invalidateByTag).toHaveBeenCalledWith('user:123');
      expect(count).toBe(5);
    });

    it('should invalidate by pattern', async () => {
      const count = await service.invalidateByPattern('user:*');

      expect(invalidationService.invalidateByPattern).toHaveBeenCalledWith('user:*');
      expect(count).toBe(3);
    });

    it('should clear all cache', async () => {
      await service.clear();

      expect(storageService.clear).toHaveBeenCalled();
    });
  });

  describe('Batch Operations', () => {
    it('should get multiple values', async () => {
      const keys = ['key1', 'key2', 'key3'];
      const mockResults = {
        key1: { id: 1 },
        key2: { id: 2 },
        key3: null,
      };
      operationsService.mget.mockResolvedValueOnce(mockResults);

      const results = await service.mget(keys);

      expect(operationsService.mget).toHaveBeenCalledWith(keys);
      expect(results).toEqual(mockResults);
    });

    it('should set multiple values', async () => {
      const entries = {
        key1: { id: 1 },
        key2: { id: 2 },
      };

      await service.mset(entries);

      expect(operationsService.mset).toHaveBeenCalledWith(entries, undefined);
    });
  });

  describe('Numeric Operations', () => {
    it('should increment counter', async () => {
      const result = await service.increment('counter', 5);

      expect(operationsService.increment).toHaveBeenCalledWith('counter', 5, undefined);
      expect(result).toBe(1);
    });

    it('should decrement counter', async () => {
      const result = await service.decrement('counter', 3);

      expect(operationsService.decrement).toHaveBeenCalledWith('counter', 3, undefined);
      expect(result).toBe(0);
    });
  });

  describe('Statistics', () => {
    it('should return cache statistics', async () => {
      const stats = await service.getStats();

      expect(stats).toHaveProperty('hits');
      expect(stats).toHaveProperty('misses');
      expect(stats).toHaveProperty('hitRate');
      expect(stats).toHaveProperty('l1Stats');
      expect(stats).toHaveProperty('uptime');
    });
  });

  describe('Health Check', () => {
    it('should return healthy status', async () => {
      const health = await service.getHealth();

      expect(health).toHaveProperty('status');
      expect(health).toHaveProperty('redis');
      expect(health.redis).toHaveProperty('connected', true);
    });

    it('should return unhealthy status on connection failure', async () => {
      connectionService.isConnected.mockReturnValueOnce(false);

      const health = await service.getHealth();

      expect(health.status).toBe('unhealthy');
    });
  });
});
