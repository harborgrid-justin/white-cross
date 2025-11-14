import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CacheService } from './cache.service';
import { LoggerService } from '@/common/logging/logger.service';
import { CacheConfigService } from './cache.config';
import { CacheConnectionService } from './cache-connection.service';
import { CacheStorageService } from './cache-storage.service';
import { CacheSerializationService } from './cache-serialization.service';
import { CacheInvalidationService } from './cache-invalidation.service';
import { CacheOperationsService } from './cache-operations.service';
import { CacheOptions, CacheEvent } from './cache.interfaces';

describe('CacheService', () => {
  let service: CacheService;
  let mockLogger: jest.Mocked<LoggerService>;
  let mockConfig: jest.Mocked<CacheConfigService>;
  let mockConnection: jest.Mocked<CacheConnectionService>;
  let mockStorage: jest.Mocked<CacheStorageService>;
  let mockSerialization: jest.Mocked<CacheSerializationService>;
  let mockInvalidation: jest.Mocked<CacheInvalidationService>;
  let mockOperations: jest.Mocked<CacheOperationsService>;
  let mockEventEmitter: jest.Mocked<EventEmitter2>;

  beforeEach(async () => {
    mockLogger = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    } as unknown as jest.Mocked<LoggerService>;

    mockConfig = {
      validate: jest.fn(),
      buildKey: jest.fn((key: string) => `prefix:${key}`),
      isL1CacheEnabled: jest.fn().mockReturnValue(true),
      getSummary: jest.fn().mockReturnValue({ enabled: true }),
      getConfig: jest.fn().mockReturnValue({ l1MaxSize: 100 }),
    } as unknown as jest.Mocked<CacheConfigService>;

    mockConnection = {
      connect: jest.fn().mockResolvedValue(undefined),
      disconnect: jest.fn().mockResolvedValue(undefined),
      isConnected: jest.fn().mockReturnValue(true),
      checkHealth: jest.fn().mockResolvedValue(10),
      getLastError: jest.fn().mockReturnValue(null),
    } as unknown as jest.Mocked<CacheConnectionService>;

    mockStorage = {
      getFromL1: jest.fn().mockReturnValue(null),
      getFromL2: jest.fn().mockResolvedValue(null),
      setToL1: jest.fn(),
      setToL2: jest.fn().mockResolvedValue(undefined),
      deleteFromL1: jest.fn(),
      deleteFromL2: jest.fn().mockResolvedValue(undefined),
      hasInL1: jest.fn().mockReturnValue(false),
      hasInL2: jest.fn().mockResolvedValue(false),
      startCleanup: jest.fn(),
      stopCleanup: jest.fn(),
      getL1Size: jest.fn().mockReturnValue(10),
      getL1MemoryUsage: jest.fn().mockReturnValue(1024),
      clearAll: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<CacheStorageService>;

    mockSerialization = {} as jest.Mocked<CacheSerializationService>;

    mockInvalidation = {
      invalidate: jest.fn().mockResolvedValue(5),
      indexTags: jest.fn(),
      removeFromTagIndex: jest.fn(),
      clearTagIndex: jest.fn(),
    } as unknown as jest.Mocked<CacheInvalidationService>;

    mockOperations = {
      mget: jest.fn().mockResolvedValue([]),
      mset: jest.fn().mockResolvedValue(undefined),
      mdel: jest.fn().mockResolvedValue(0),
      increment: jest.fn().mockResolvedValue(1),
      decrement: jest.fn().mockResolvedValue(1),
      getErrorCount: jest.fn().mockReturnValue(0),
      resetErrorCount: jest.fn(),
    } as unknown as jest.Mocked<CacheOperationsService>;

    mockEventEmitter = {
      emit: jest.fn(),
    } as unknown as jest.Mocked<EventEmitter2>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CacheService,
        { provide: LoggerService, useValue: mockLogger },
        { provide: CacheConfigService, useValue: mockConfig },
        { provide: CacheConnectionService, useValue: mockConnection },
        { provide: CacheStorageService, useValue: mockStorage },
        { provide: CacheSerializationService, useValue: mockSerialization },
        { provide: CacheInvalidationService, useValue: mockInvalidation },
        { provide: CacheOperationsService, useValue: mockOperations },
        { provide: EventEmitter2, useValue: mockEventEmitter },
      ],
    }).compile();

    service = module.get<CacheService>(CacheService);
  });

  describe('initialization', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should initialize on module init', async () => {
      await service.onModuleInit();

      expect(mockConfig.validate).toHaveBeenCalled();
      expect(mockConnection.connect).toHaveBeenCalled();
      expect(mockStorage.startCleanup).toHaveBeenCalled();
    });

    it('should cleanup on module destroy', async () => {
      await service.onModuleDestroy();

      expect(mockStorage.stopCleanup).toHaveBeenCalled();
      expect(mockConnection.disconnect).toHaveBeenCalled();
      expect(mockInvalidation.clearTagIndex).toHaveBeenCalled();
    });
  });

  describe('get', () => {
    const options: CacheOptions = {};

    it('should get from L1 cache first', async () => {
      mockStorage.getFromL1 = jest.fn().mockReturnValue({ data: 'test' });

      const result = await service.get<{ data: string }>('key', options);

      expect(result).toEqual({ data: 'test' });
      expect(mockStorage.getFromL1).toHaveBeenCalledWith('prefix:key');
      expect(mockStorage.getFromL2).not.toHaveBeenCalled();
    });

    it('should get from L2 cache if L1 miss', async () => {
      mockStorage.getFromL1 = jest.fn().mockReturnValue(null);
      mockStorage.getFromL2 = jest.fn().mockResolvedValue({ data: 'test' });

      const result = await service.get<{ data: string }>('key', options);

      expect(result).toEqual({ data: 'test' });
      expect(mockStorage.getFromL2).toHaveBeenCalledWith('prefix:key');
    });

    it('should populate L1 from L2 on L2 hit', async () => {
      mockStorage.getFromL1 = jest.fn().mockReturnValue(null);
      mockStorage.getFromL2 = jest.fn().mockResolvedValue({ data: 'test' });

      await service.get<{ data: string }>('key', options);

      expect(mockStorage.setToL1).toHaveBeenCalledWith(
        'prefix:key',
        { data: 'test' },
        options
      );
    });

    it('should return null on cache miss', async () => {
      mockStorage.getFromL1 = jest.fn().mockReturnValue(null);
      mockStorage.getFromL2 = jest.fn().mockResolvedValue(null);

      const result = await service.get('key', options);

      expect(result).toBeNull();
    });

    it('should emit cache events', async () => {
      mockStorage.getFromL1 = jest.fn().mockReturnValue({ data: 'test' });

      await service.get('key', options);

      expect(mockEventEmitter.emit).toHaveBeenCalledWith(
        CacheEvent.HIT,
        expect.objectContaining({ key: 'prefix:key' })
      );
    });

    it('should handle errors gracefully', async () => {
      mockStorage.getFromL2 = jest.fn().mockRejectedValue(new Error('Redis error'));

      const result = await service.get('key', options);

      expect(result).toBeNull();
      expect(mockLogger.error).toHaveBeenCalled();
    });

    it('should skip L1 if requested', async () => {
      mockStorage.getFromL2 = jest.fn().mockResolvedValue({ data: 'test' });

      await service.get('key', { skipL1: true });

      expect(mockStorage.getFromL1).not.toHaveBeenCalled();
      expect(mockStorage.getFromL2).toHaveBeenCalled();
    });
  });

  describe('set', () => {
    const value = { data: 'test' };
    const options: CacheOptions = {};

    it('should set in both L1 and L2 cache', async () => {
      await service.set('key', value, options);

      expect(mockStorage.setToL2).toHaveBeenCalledWith('prefix:key', value, options);
      expect(mockStorage.setToL1).toHaveBeenCalledWith('prefix:key', value, options);
    });

    it('should index tags if provided', async () => {
      const tagsOptions: CacheOptions = { tags: ['tag1', 'tag2'] };

      await service.set('key', value, tagsOptions);

      expect(mockInvalidation.indexTags).toHaveBeenCalledWith('prefix:key', [
        'tag1',
        'tag2',
      ]);
    });

    it('should gracefully degrade if Redis unavailable', async () => {
      mockConnection.isConnected = jest.fn().mockReturnValue(false);
      mockStorage.setToL2 = jest.fn().mockRejectedValue(new Error('Redis down'));

      await service.set('key', value, options);

      expect(mockLogger.warn).toHaveBeenCalledWith(
        expect.stringContaining('Redis unavailable'),
        expect.any(Object)
      );
      expect(mockStorage.setToL1).toHaveBeenCalled();
    });

    it('should skip L1 if requested', async () => {
      await service.set('key', value, { skipL1: true });

      expect(mockStorage.setToL1).not.toHaveBeenCalled();
      expect(mockStorage.setToL2).toHaveBeenCalled();
    });

    it('should emit set event', async () => {
      await service.set('key', value, options);

      expect(mockEventEmitter.emit).toHaveBeenCalledWith(
        CacheEvent.SET,
        expect.objectContaining({ key: 'prefix:key' })
      );
    });
  });

  describe('delete', () => {
    it('should delete from both caches', async () => {
      const result = await service.delete('key');

      expect(mockStorage.deleteFromL1).toHaveBeenCalledWith('prefix:key');
      expect(mockStorage.deleteFromL2).toHaveBeenCalledWith('prefix:key');
      expect(result).toBe(true);
    });

    it('should remove from tag index', async () => {
      await service.delete('key');

      expect(mockInvalidation.removeFromTagIndex).toHaveBeenCalledWith('prefix:key');
    });

    it('should handle Redis unavailable', async () => {
      mockConnection.isConnected = jest.fn().mockReturnValue(false);

      const result = await service.delete('key');

      expect(mockStorage.deleteFromL1).toHaveBeenCalled();
      expect(mockLogger.debug).toHaveBeenCalledWith(
        expect.stringContaining('Redis unavailable')
      );
      expect(result).toBe(true);
    });
  });

  describe('has', () => {
    it('should check L1 cache first', async () => {
      mockStorage.hasInL1 = jest.fn().mockReturnValue(true);

      const result = await service.has('key');

      expect(result).toBe(true);
      expect(mockStorage.hasInL2).not.toHaveBeenCalled();
    });

    it('should check L2 if not in L1', async () => {
      mockStorage.hasInL1 = jest.fn().mockReturnValue(false);
      mockStorage.hasInL2 = jest.fn().mockResolvedValue(true);

      const result = await service.has('key');

      expect(result).toBe(true);
    });
  });

  describe('batch operations', () => {
    it('should get multiple keys', async () => {
      const keys = ['key1', 'key2', 'key3'];

      await service.mget(keys);

      expect(mockOperations.mget).toHaveBeenCalledWith(
        keys,
        {},
        expect.any(Function)
      );
    });

    it('should set multiple keys', async () => {
      const entries = [
        { key: 'key1', value: 'value1' },
        { key: 'key2', value: 'value2' },
      ];

      await service.mset(entries);

      expect(mockOperations.mset).toHaveBeenCalledWith(
        entries,
        {},
        expect.any(Function)
      );
    });

    it('should delete multiple keys', async () => {
      const keys = ['key1', 'key2', 'key3'];

      await service.mdel(keys);

      expect(mockOperations.mdel).toHaveBeenCalledWith(
        keys,
        {},
        expect.any(Function)
      );
    });
  });

  describe('numeric operations', () => {
    it('should increment value', async () => {
      const result = await service.increment('counter', 5);

      expect(mockOperations.increment).toHaveBeenCalledWith('counter', 5, {});
      expect(result).toBe(1);
    });

    it('should decrement value', async () => {
      const result = await service.decrement('counter', 3);

      expect(mockOperations.decrement).toHaveBeenCalledWith('counter', 3, {});
      expect(result).toBe(1);
    });
  });

  describe('invalidation', () => {
    it('should invalidate by pattern', async () => {
      const pattern = { tags: ['user:123'] };

      const count = await service.invalidate(pattern);

      expect(count).toBe(5);
      expect(mockInvalidation.invalidate).toHaveBeenCalled();
    });
  });

  describe('getStats', () => {
    it('should return cache statistics', () => {
      const stats = service.getStats();

      expect(stats).toHaveProperty('hits');
      expect(stats).toHaveProperty('misses');
      expect(stats).toHaveProperty('hitRate');
      expect(stats).toHaveProperty('l1Hits');
      expect(stats).toHaveProperty('l2Hits');
    });

    it('should calculate hit rate correctly', async () => {
      mockStorage.getFromL1 = jest
        .fn()
        .mockReturnValueOnce({ data: 'hit' })
        .mockReturnValueOnce(null)
        .mockReturnValue({ data: 'hit' });

      await service.get('key1');
      await service.get('key2');
      await service.get('key3');

      const stats = service.getStats();
      expect(stats.hitRate).toBeGreaterThan(0);
    });
  });

  describe('resetStats', () => {
    it('should reset all statistics', async () => {
      await service.get('key');
      await service.set('key', 'value');

      service.resetStats();

      const stats = service.getStats();
      expect(stats.hits).toBe(0);
      expect(stats.misses).toBe(0);
      expect(stats.sets).toBe(0);
    });
  });

  describe('getHealth', () => {
    it('should return healthy status', async () => {
      const health = await service.getHealth();

      expect(health.status).toBe('healthy');
      expect(health.redisConnected).toBe(true);
      expect(health.redisLatency).toBe(10);
    });

    it('should return degraded status if Redis disconnected', async () => {
      mockConnection.isConnected = jest.fn().mockReturnValue(false);

      const health = await service.getHealth();

      expect(health.status).toBe('degraded');
      expect(health.redisConnected).toBe(false);
    });

    it('should include error information', async () => {
      mockConnection.getLastError = jest
        .fn()
        .mockReturnValue(new Error('Connection failed'));

      const health = await service.getHealth();

      expect(health.lastError).toBe('Connection failed');
    });
  });

  describe('clear', () => {
    it('should clear all caches', async () => {
      await service.clear();

      expect(mockStorage.clearAll).toHaveBeenCalled();
      expect(mockInvalidation.clearTagIndex).toHaveBeenCalled();
    });
  });
});
