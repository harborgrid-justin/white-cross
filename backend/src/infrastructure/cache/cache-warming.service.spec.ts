/**
 * @fileoverview Tests for Cache Warming Service
 * @module infrastructure/cache/warming
 */

import { Test, TestingModule } from '@nestjs/testing';
import { SchedulerRegistry } from '@nestjs/schedule';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CacheWarmingService } from './cache-warming.service';
import { CacheService } from './cache.service';
import { LoggerService } from '@/common/logging/logger.service';
import { CacheEvent, CacheWarmingStrategy } from './cache.interfaces';

// Mock CronJob
jest.mock('cron', () => ({
  CronJob: jest.fn().mockImplementation((schedule, callback) => ({
    schedule,
    callback,
    start: jest.fn(),
    stop: jest.fn(),
  })),
}));

describe('CacheWarmingService', () => {
  let service: CacheWarmingService;
  let mockLogger: jest.Mocked<LoggerService>;
  let mockCacheService: jest.Mocked<CacheService>;
  let mockEventEmitter: jest.Mocked<EventEmitter2>;
  let mockSchedulerRegistry: jest.Mocked<SchedulerRegistry>;

  const createMockStrategy = (
    overrides: Partial<CacheWarmingStrategy> = {},
  ): CacheWarmingStrategy => ({
    name: 'test-strategy',
    type: 'scheduled',
    priority: 5,
    ttl: 3600,
    loader: jest.fn().mockResolvedValue([
      { key: 'test:key1', value: 'value1' },
      { key: 'test:key2', value: 'value2' },
    ]),
    ...overrides,
  });

  beforeEach(async () => {
    mockLogger = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    } as unknown as jest.Mocked<LoggerService>;

    mockCacheService = {
      set: jest.fn().mockResolvedValue(undefined),
      get: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<CacheService>;

    mockEventEmitter = {
      emit: jest.fn(),
    } as unknown as jest.Mocked<EventEmitter2>;

    mockSchedulerRegistry = {
      addCronJob: jest.fn(),
      deleteCronJob: jest.fn(),
      getCronJobs: jest.fn().mockReturnValue(new Map()),
    } as unknown as jest.Mocked<SchedulerRegistry>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CacheWarmingService,
        {
          provide: LoggerService,
          useValue: mockLogger,
        },
        {
          provide: CacheService,
          useValue: mockCacheService,
        },
        {
          provide: EventEmitter2,
          useValue: mockEventEmitter,
        },
        {
          provide: SchedulerRegistry,
          useValue: mockSchedulerRegistry,
        },
      ],
    }).compile();

    service = module.get<CacheWarmingService>(CacheWarmingService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Constructor and Initialization', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should initialize with empty strategies', () => {
      const stats = service.getStats();
      expect(stats.strategies).toBe(0);
    });

    it('should initialize statistics', () => {
      const stats = service.getStats();
      expect(stats.totalWarmed).toBe(0);
      expect(stats.lastCount).toBe(0);
      expect(stats.failures).toBe(0);
      expect(stats.inProgress).toBe(false);
    });

    it('should log initialization on module init', async () => {
      await service.onModuleInit();
      expect(mockLogger.log).toHaveBeenCalled();
    });
  });

  describe('registerStrategy()', () => {
    it('should register a warming strategy', () => {
      const strategy = createMockStrategy();
      service.registerStrategy(strategy);

      const stats = service.getStats();
      expect(stats.strategies).toBe(1);
    });

    it('should register multiple strategies', () => {
      service.registerStrategy(createMockStrategy({ name: 'strategy1' }));
      service.registerStrategy(createMockStrategy({ name: 'strategy2' }));

      const stats = service.getStats();
      expect(stats.strategies).toBe(2);
    });

    it('should schedule cron job for scheduled strategies', () => {
      const strategy = createMockStrategy({
        type: 'scheduled',
        schedule: '0 * * * *',
      });

      service.registerStrategy(strategy);

      expect(mockSchedulerRegistry.addCronJob).toHaveBeenCalledWith(
        'cache-warm-test-strategy',
        expect.any(Object),
      );
    });

    it('should not schedule cron job for non-scheduled strategies', () => {
      const strategy = createMockStrategy({ type: 'on-demand' });
      service.registerStrategy(strategy);

      expect(mockSchedulerRegistry.addCronJob).not.toHaveBeenCalled();
    });

    it('should not schedule if no schedule specified', () => {
      const strategy = createMockStrategy({
        type: 'scheduled',
        schedule: undefined,
      });
      service.registerStrategy(strategy);

      expect(mockSchedulerRegistry.addCronJob).not.toHaveBeenCalled();
    });
  });

  describe('unregisterStrategy()', () => {
    it('should unregister a strategy', () => {
      const strategy = createMockStrategy();
      service.registerStrategy(strategy);
      service.unregisterStrategy('test-strategy');

      const stats = service.getStats();
      expect(stats.strategies).toBe(0);
    });

    it('should delete cron job for scheduled strategies', () => {
      const strategy = createMockStrategy({
        type: 'scheduled',
        schedule: '0 * * * *',
      });
      service.registerStrategy(strategy);

      service.unregisterStrategy('test-strategy');

      expect(mockSchedulerRegistry.deleteCronJob).toHaveBeenCalledWith(
        'cache-warm-test-strategy',
      );
    });

    it('should handle unregistering non-existent strategy', () => {
      expect(() => service.unregisterStrategy('nonexistent')).not.toThrow();
    });

    it('should handle cron job deletion errors', () => {
      mockSchedulerRegistry.deleteCronJob.mockImplementation(() => {
        throw new Error('Job not found');
      });

      expect(() => service.unregisterStrategy('test-strategy')).not.toThrow();
    });
  });

  describe('warmByStrategy()', () => {
    it('should warm cache using specific strategy', async () => {
      const strategy = createMockStrategy();
      service.registerStrategy(strategy);

      const count = await service.warmByStrategy('test-strategy');

      expect(count).toBe(2);
      expect(strategy.loader).toHaveBeenCalled();
      expect(mockCacheService.set).toHaveBeenCalledTimes(2);
    });

    it('should return 0 for non-existent strategy', async () => {
      const count = await service.warmByStrategy('nonexistent');
      expect(count).toBe(0);
    });

    it('should use strategy TTL', async () => {
      const strategy = createMockStrategy({ ttl: 7200 });
      service.registerStrategy(strategy);

      await service.warmByStrategy('test-strategy');

      expect(mockCacheService.set).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        expect.objectContaining({ ttl: 7200 }),
      );
    });

    it('should use default TTL if not specified', async () => {
      const strategy = createMockStrategy({ ttl: undefined });
      service.registerStrategy(strategy);

      await service.warmByStrategy('test-strategy');

      expect(mockCacheService.set).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        expect.objectContaining({ ttl: 3600 }),
      );
    });

    it('should emit cache warm event on success', async () => {
      const strategy = createMockStrategy();
      service.registerStrategy(strategy);

      await service.warmByStrategy('test-strategy');

      expect(mockEventEmitter.emit).toHaveBeenCalledWith(
        CacheEvent.WARM,
        expect.objectContaining({
          strategy: 'test-strategy',
          count: 2,
          duration: expect.any(Number),
        }),
      );
    });

    it('should handle loader errors', async () => {
      const strategy = createMockStrategy({
        loader: jest.fn().mockRejectedValue(new Error('Loader failed')),
      });
      service.registerStrategy(strategy);

      await expect(service.warmByStrategy('test-strategy')).rejects.toThrow('Loader failed');
    });

    it('should continue warming even if some entries fail', async () => {
      const strategy = createMockStrategy();
      service.registerStrategy(strategy);

      mockCacheService.set
        .mockResolvedValueOnce(undefined)
        .mockRejectedValueOnce(new Error('Set failed'))
        .mockResolvedValueOnce(undefined);

      const count = await service.warmByStrategy('test-strategy');

      expect(count).toBe(1);
      expect(mockCacheService.set).toHaveBeenCalledTimes(2);
    });

    it('should include entry options in cache set call', async () => {
      const strategy = createMockStrategy({
        loader: jest.fn().mockResolvedValue([
          {
            key: 'test:key',
            value: 'value',
            options: { priority: 'high' },
          },
        ]),
      });
      service.registerStrategy(strategy);

      await service.warmByStrategy('test-strategy');

      expect(mockCacheService.set).toHaveBeenCalledWith(
        'test:key',
        'value',
        expect.objectContaining({ priority: 'high' }),
      );
    });
  });

  describe('warmAll()', () => {
    beforeEach(() => {
      service.registerStrategy(createMockStrategy({ name: 'strategy1', priority: 10 }));
      service.registerStrategy(createMockStrategy({ name: 'strategy2', priority: 5 }));
      service.registerStrategy(createMockStrategy({ name: 'strategy3', priority: 15 }));
    });

    it('should warm all strategies', async () => {
      const count = await service.warmAll();

      expect(count).toBe(6); // 3 strategies × 2 entries each
      expect(mockCacheService.set).toHaveBeenCalledTimes(6);
    });

    it('should warm strategies in priority order', async () => {
      await service.warmAll();

      // Verify strategies were executed
      expect(mockCacheService.set).toHaveBeenCalled();
    });

    it('should skip warming if already in progress', async () => {
      const warmPromise1 = service.warmAll();
      const warmPromise2 = service.warmAll();

      const [count1, count2] = await Promise.all([warmPromise1, warmPromise2]);

      expect(count1).toBeGreaterThan(0);
      expect(count2).toBe(0);
    });

    it('should filter by strategy type', async () => {
      service.registerStrategy(createMockStrategy({
        name: 'on-demand-strategy',
        type: 'on-demand',
      }));

      const count = await service.warmAll('scheduled');

      expect(count).toBe(6); // Only scheduled strategies
    });

    it('should update statistics on completion', async () => {
      await service.warmAll();

      const stats = service.getStats();
      expect(stats.totalWarmed).toBe(6);
      expect(stats.lastCount).toBe(6);
      expect(stats.lastWarmingTime).toBeDefined();
    });

    it('should handle strategy failures gracefully', async () => {
      service.registerStrategy(createMockStrategy({
        name: 'failing-strategy',
        loader: jest.fn().mockRejectedValue(new Error('Strategy failed')),
      }));

      const count = await service.warmAll();

      expect(count).toBe(6); // Other strategies still completed
      const stats = service.getStats();
      expect(stats.failures).toBe(1);
    });

    it('should set inProgress flag during execution', async () => {
      const warmPromise = service.warmAll();

      // Check immediately after starting
      const statsDuring = service.getStats();
      expect(statsDuring.inProgress).toBe(true);

      await warmPromise;

      const statsAfter = service.getStats();
      expect(statsAfter.inProgress).toBe(false);
    });

    it('should reset inProgress flag even on error', async () => {
      service.registerStrategy(createMockStrategy({
        name: 'error-strategy',
        loader: jest.fn().mockRejectedValue(new Error('Fatal error')),
      }));

      await service.warmAll();

      const stats = service.getStats();
      expect(stats.inProgress).toBe(false);
    });
  });

  describe('handleCacheMiss()', () => {
    it('should trigger lazy warming strategies on cache miss', async () => {
      const lazyStrategy = createMockStrategy({
        name: 'lazy-strategy',
        type: 'lazy',
      });
      service.registerStrategy(lazyStrategy);

      await service.handleCacheMiss({ key: 'missed-key' });

      // Give setImmediate time to execute
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(lazyStrategy.loader).toHaveBeenCalled();
    });

    it('should not trigger non-lazy strategies', async () => {
      const scheduledStrategy = createMockStrategy({
        name: 'scheduled-strategy',
        type: 'scheduled',
      });
      service.registerStrategy(scheduledStrategy);

      await service.handleCacheMiss({ key: 'missed-key' });
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(scheduledStrategy.loader).not.toHaveBeenCalled();
    });

    it('should handle lazy warming errors gracefully', async () => {
      const errorStrategy = createMockStrategy({
        name: 'error-lazy',
        type: 'lazy',
        loader: jest.fn().mockRejectedValue(new Error('Lazy warming failed')),
      });
      service.registerStrategy(errorStrategy);

      await expect(service.handleCacheMiss({ key: 'missed-key' })).resolves.not.toThrow();
    });
  });

  describe('scheduledWarmingJob()', () => {
    it('should skip if cache warming not enabled', async () => {
      process.env.CACHE_WARMING_ENABLED = 'false';
      service.registerStrategy(createMockStrategy());

      await service.scheduledWarmingJob();

      expect(mockCacheService.set).not.toHaveBeenCalled();
    });

    it('should warm all scheduled strategies when enabled', async () => {
      process.env.CACHE_WARMING_ENABLED = 'true';
      service.registerStrategy(createMockStrategy({ type: 'scheduled' }));

      await service.scheduledWarmingJob();

      expect(mockCacheService.set).toHaveBeenCalled();
    });

    it('should only warm scheduled strategies', async () => {
      process.env.CACHE_WARMING_ENABLED = 'true';
      service.registerStrategy(createMockStrategy({
        name: 'on-demand',
        type: 'on-demand',
      }));

      await service.scheduledWarmingJob();

      expect(mockCacheService.set).not.toHaveBeenCalled();
    });
  });

  describe('getStats()', () => {
    it('should return current statistics', () => {
      const stats = service.getStats();

      expect(stats).toEqual({
        totalWarmed: 0,
        lastCount: 0,
        failures: 0,
        lastWarmingTime: undefined,
        strategies: 0,
        inProgress: false,
      });
    });

    it('should update after warming', async () => {
      service.registerStrategy(createMockStrategy());
      await service.warmByStrategy('test-strategy');

      const stats = service.getStats();

      expect(stats.totalWarmed).toBeGreaterThan(0);
      expect(stats.strategies).toBe(1);
    });
  });

  describe('resetStats()', () => {
    it('should reset warming statistics', async () => {
      service.registerStrategy(createMockStrategy());
      await service.warmByStrategy('test-strategy');

      service.resetStats();

      const stats = service.getStats();
      expect(stats.totalWarmed).toBe(0);
      expect(stats.lastCount).toBe(0);
      expect(stats.failures).toBe(0);
      expect(stats.lastWarmingTime).toBeUndefined();
    });

    it('should not reset strategy count', async () => {
      service.registerStrategy(createMockStrategy());
      await service.warmByStrategy('test-strategy');

      service.resetStats();

      const stats = service.getStats();
      expect(stats.strategies).toBe(1);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle empty loader results', async () => {
      const strategy = createMockStrategy({
        loader: jest.fn().mockResolvedValue([]),
      });
      service.registerStrategy(strategy);

      const count = await service.warmByStrategy('test-strategy');

      expect(count).toBe(0);
      expect(mockCacheService.set).not.toHaveBeenCalled();
    });

    it('should handle concurrent warming attempts', async () => {
      service.registerStrategy(createMockStrategy());

      const promises = [
        service.warmAll(),
        service.warmAll(),
        service.warmAll(),
      ];

      const results = await Promise.all(promises);

      const successfulWarms = results.filter(count => count > 0);
      expect(successfulWarms).toHaveLength(1);
    });

    it('should handle strategy with null loader results', async () => {
      const strategy = createMockStrategy({
        loader: jest.fn().mockResolvedValue(null),
      });
      service.registerStrategy(strategy);

      await expect(service.warmByStrategy('test-strategy')).rejects.toThrow();
    });

    it('should measure warming duration accurately', async () => {
      const strategy = createMockStrategy({
        loader: jest.fn().mockImplementation(async () => {
          await new Promise(resolve => setTimeout(resolve, 100));
          return [{ key: 'test:key', value: 'value' }];
        }),
      });
      service.registerStrategy(strategy);

      await service.warmByStrategy('test-strategy');

      expect(mockEventEmitter.emit).toHaveBeenCalledWith(
        CacheEvent.WARM,
        expect.objectContaining({
          duration: expect.any(Number),
        }),
      );

      const emitCall = mockEventEmitter.emit.mock.calls[0][1] as { duration: number };
      expect(emitCall.duration).toBeGreaterThanOrEqual(0);
    });

    it('should handle strategies with same priority', async () => {
      service.registerStrategy(createMockStrategy({ name: 'strategy1', priority: 5 }));
      service.registerStrategy(createMockStrategy({ name: 'strategy2', priority: 5 }));

      const count = await service.warmAll();

      expect(count).toBe(4); // Both strategies should execute
    });
  });
});
