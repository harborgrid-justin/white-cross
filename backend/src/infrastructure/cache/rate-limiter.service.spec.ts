/**
 * @fileoverview Tests for Rate Limiter Service
 * @module infrastructure/cache/rate-limiter
 */

import { Test, TestingModule } from '@nestjs/testing';
import { RateLimiterService } from './rate-limiter.service';
import { CacheService } from './cache.service';
import { RateLimitConfig, RateLimitStatus } from './cache.interfaces';

describe('RateLimiterService', () => {
  let service: RateLimiterService;
  let mockCacheService: jest.Mocked<CacheService>;

  const defaultConfig: RateLimitConfig = {
    max: 10,
    windowMs: 60000, // 1 minute
    keyGenerator: (context: Record<string, unknown>) => context.userId as string || 'anonymous',
  };

  beforeEach(async () => {
    mockCacheService = {
      get: jest.fn(),
      set: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<CacheService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RateLimiterService,
        {
          provide: CacheService,
          useValue: mockCacheService,
        },
      ],
    }).compile();

    service = module.get<RateLimiterService>(RateLimiterService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Constructor and Initialization', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should initialize with empty configurations', () => {
      const stats = service.getStats();
      expect(stats.configurations).toBe(0);
    });

    it('should initialize with zero statistics', () => {
      const stats = service.getStats();
      expect(stats.totalRequests).toBe(0);
      expect(stats.limitedRequests).toBe(0);
      expect(stats.uniqueKeys).toBe(0);
    });
  });

  describe('registerConfig()', () => {
    it('should register a rate limit configuration', () => {
      service.registerConfig('test', defaultConfig);

      const stats = service.getStats();
      expect(stats.configurations).toBe(1);
    });

    it('should register multiple configurations', () => {
      service.registerConfig('config1', defaultConfig);
      service.registerConfig('config2', { ...defaultConfig, max: 20 });

      const stats = service.getStats();
      expect(stats.configurations).toBe(2);
    });

    it('should overwrite existing configuration with same name', () => {
      service.registerConfig('test', defaultConfig);
      service.registerConfig('test', { ...defaultConfig, max: 20 });

      const stats = service.getStats();
      expect(stats.configurations).toBe(1);
    });
  });

  describe('checkLimit()', () => {
    const context = { userId: 'user123', ip: '127.0.0.1' };

    beforeEach(() => {
      service.registerConfig('test', defaultConfig);
      mockCacheService.get.mockResolvedValue(0);
      mockCacheService.set.mockResolvedValue(undefined);
    });

    it('should allow request when under limit', async () => {
      mockCacheService.get.mockResolvedValue(5);

      const result = await service.checkLimit('test', context);

      expect(result.limited).toBe(false);
      expect(result.remaining).toBe(4); // 10 - 5 - 1
      expect(result.limit).toBe(10);
      expect(result.retryAfter).toBe(0);
    });

    it('should block request when at limit', async () => {
      mockCacheService.get.mockResolvedValue(10);

      const result = await service.checkLimit('test', context);

      expect(result.limited).toBe(true);
      expect(result.remaining).toBe(0);
      expect(result.limit).toBe(10);
      expect(result.retryAfter).toBeGreaterThan(0);
    });

    it('should block request when over limit', async () => {
      mockCacheService.get.mockResolvedValue(15);

      const result = await service.checkLimit('test', context);

      expect(result.limited).toBe(true);
      expect(result.remaining).toBe(0);
    });

    it('should allow request when config not found', async () => {
      const result = await service.checkLimit('nonexistent', context);

      expect(result.limited).toBe(false);
      expect(result.remaining).toBe(Number.MAX_SAFE_INTEGER);
    });

    it('should increment counter when request allowed', async () => {
      mockCacheService.get.mockResolvedValue(5);

      await service.checkLimit('test', context);

      expect(mockCacheService.set).toHaveBeenCalled();
      const setCall = mockCacheService.set.mock.calls[0];
      expect(setCall[1]).toBe(6); // 5 + 1
    });

    it('should not increment counter when request blocked', async () => {
      mockCacheService.get.mockResolvedValue(10);

      await service.checkLimit('test', context);

      expect(mockCacheService.set).not.toHaveBeenCalled();
    });

    it('should use keyGenerator from config', async () => {
      const customKeyGenerator = jest.fn(() => 'custom-key');
      service.registerConfig('custom', {
        ...defaultConfig,
        keyGenerator: customKeyGenerator,
      });

      await service.checkLimit('custom', context);

      expect(customKeyGenerator).toHaveBeenCalledWith(context);
    });

    it('should skip rate limiting when skip function returns true', async () => {
      service.registerConfig('skip-test', {
        ...defaultConfig,
        skip: (ctx: Record<string, unknown>) => ctx.userId === 'admin',
      });

      const result = await service.checkLimit('skip-test', { userId: 'admin' });

      expect(result.limited).toBe(false);
      expect(result.remaining).toBe(Number.MAX_SAFE_INTEGER);
      expect(mockCacheService.get).not.toHaveBeenCalled();
    });

    it('should not skip rate limiting when skip function returns false', async () => {
      service.registerConfig('skip-test', {
        ...defaultConfig,
        skip: (ctx: Record<string, unknown>) => ctx.userId === 'admin',
      });
      mockCacheService.get.mockResolvedValue(0);

      const result = await service.checkLimit('skip-test', { userId: 'user' });

      expect(result.limited).toBe(false);
      expect(mockCacheService.get).toHaveBeenCalled();
    });

    it('should call handler when limit exceeded', async () => {
      const handler = jest.fn();
      service.registerConfig('handler-test', {
        ...defaultConfig,
        handler,
      });
      mockCacheService.get.mockResolvedValue(10);

      await service.checkLimit('handler-test', context);

      expect(handler).toHaveBeenCalledWith(context);
    });

    it('should handle handler errors gracefully', async () => {
      const handler = jest.fn().mockRejectedValue(new Error('Handler error'));
      service.registerConfig('handler-test', {
        ...defaultConfig,
        handler,
      });
      mockCacheService.get.mockResolvedValue(10);

      const result = await service.checkLimit('handler-test', context);

      expect(result.limited).toBe(true);
      expect(handler).toHaveBeenCalled();
    });

    it('should update statistics on each check', async () => {
      mockCacheService.get.mockResolvedValue(0);

      await service.checkLimit('test', context);
      await service.checkLimit('test', context);

      const stats = service.getStats();
      expect(stats.totalRequests).toBe(2);
    });

    it('should track unique keys', async () => {
      mockCacheService.get.mockResolvedValue(0);

      await service.checkLimit('test', { userId: 'user1' });
      await service.checkLimit('test', { userId: 'user2' });
      await service.checkLimit('test', { userId: 'user1' });

      const stats = service.getStats();
      expect(stats.uniqueKeys).toBe(2);
    });

    it('should increment limited requests counter when blocked', async () => {
      mockCacheService.get.mockResolvedValue(10);

      await service.checkLimit('test', context);

      const stats = service.getStats();
      expect(stats.limitedRequests).toBe(1);
    });
  });

  describe('consumeTokens()', () => {
    beforeEach(() => {
      service.registerConfig('test', defaultConfig);
      mockCacheService.get.mockResolvedValue(0);
      mockCacheService.set.mockResolvedValue(undefined);
    });

    it('should consume single token successfully', async () => {
      mockCacheService.get.mockResolvedValue(5);

      const result = await service.consumeTokens('test', 'user123', 1);

      expect(result).toBe(true);
      expect(mockCacheService.set).toHaveBeenCalled();
      const setCall = mockCacheService.set.mock.calls[0];
      expect(setCall[1]).toBe(6);
    });

    it('should consume multiple tokens successfully', async () => {
      mockCacheService.get.mockResolvedValue(5);

      const result = await service.consumeTokens('test', 'user123', 3);

      expect(result).toBe(true);
      const setCall = mockCacheService.set.mock.calls[0];
      expect(setCall[1]).toBe(8);
    });

    it('should fail when not enough tokens available', async () => {
      mockCacheService.get.mockResolvedValue(8);

      const result = await service.consumeTokens('test', 'user123', 3);

      expect(result).toBe(false);
      expect(mockCacheService.set).not.toHaveBeenCalled();
    });

    it('should allow consumption when config not found', async () => {
      const result = await service.consumeTokens('nonexistent', 'user123', 1);

      expect(result).toBe(true);
    });

    it('should default to consuming 1 token', async () => {
      mockCacheService.get.mockResolvedValue(5);

      await service.consumeTokens('test', 'user123');

      const setCall = mockCacheService.set.mock.calls[0];
      expect(setCall[1]).toBe(6);
    });
  });

  describe('getRemainingTokens()', () => {
    beforeEach(() => {
      service.registerConfig('test', defaultConfig);
    });

    it('should return correct remaining tokens', async () => {
      mockCacheService.get.mockResolvedValue(7);

      const remaining = await service.getRemainingTokens('test', 'user123');

      expect(remaining).toBe(3); // 10 - 7
    });

    it('should return 0 when at limit', async () => {
      mockCacheService.get.mockResolvedValue(10);

      const remaining = await service.getRemainingTokens('test', 'user123');

      expect(remaining).toBe(0);
    });

    it('should return 0 when over limit', async () => {
      mockCacheService.get.mockResolvedValue(15);

      const remaining = await service.getRemainingTokens('test', 'user123');

      expect(remaining).toBe(0);
    });

    it('should return max safe integer when config not found', async () => {
      const remaining = await service.getRemainingTokens('nonexistent', 'user123');

      expect(remaining).toBe(Number.MAX_SAFE_INTEGER);
    });

    it('should return full limit when no usage recorded', async () => {
      mockCacheService.get.mockResolvedValue(null);

      const remaining = await service.getRemainingTokens('test', 'user123');

      expect(remaining).toBe(10);
    });
  });

  describe('reset()', () => {
    beforeEach(() => {
      service.registerConfig('test', defaultConfig);
    });

    it('should delete rate limit key', async () => {
      await service.reset('test', 'user123');

      expect(mockCacheService.delete).toHaveBeenCalled();
      const deleteCall = mockCacheService.delete.mock.calls[0][0];
      expect(deleteCall).toContain('ratelimit:test:user123');
    });

    it('should handle reset for non-existent key', async () => {
      mockCacheService.delete.mockResolvedValue(undefined);

      await expect(service.reset('test', 'user123')).resolves.not.toThrow();
    });
  });

  describe('getStats()', () => {
    beforeEach(() => {
      service.registerConfig('test', defaultConfig);
      mockCacheService.get.mockResolvedValue(0);
      mockCacheService.set.mockResolvedValue(undefined);
    });

    it('should return correct statistics', async () => {
      mockCacheService.get.mockResolvedValue(5);
      await service.checkLimit('test', { userId: 'user1' });
      await service.checkLimit('test', { userId: 'user2' });

      const stats = service.getStats();

      expect(stats.totalRequests).toBe(2);
      expect(stats.limitedRequests).toBe(0);
      expect(stats.uniqueKeys).toBe(2);
      expect(stats.configurations).toBe(1);
    });

    it('should calculate limit rate correctly', async () => {
      mockCacheService.get
        .mockResolvedValueOnce(5)
        .mockResolvedValueOnce(10)
        .mockResolvedValueOnce(5)
        .mockResolvedValueOnce(10);

      await service.checkLimit('test', { userId: 'user1' });
      await service.checkLimit('test', { userId: 'user2' });
      await service.checkLimit('test', { userId: 'user3' });
      await service.checkLimit('test', { userId: 'user4' });

      const stats = service.getStats();
      expect(stats.limitRate).toBe(50); // 2 out of 4 limited = 50%
    });

    it('should handle zero requests for limit rate', () => {
      const stats = service.getStats();
      expect(stats.limitRate).toBe(0);
    });
  });

  describe('resetStats()', () => {
    beforeEach(() => {
      service.registerConfig('test', defaultConfig);
      mockCacheService.get.mockResolvedValue(5);
      mockCacheService.set.mockResolvedValue(undefined);
    });

    it('should reset all statistics', async () => {
      await service.checkLimit('test', { userId: 'user1' });
      await service.checkLimit('test', { userId: 'user2' });

      service.resetStats();

      const stats = service.getStats();
      expect(stats.totalRequests).toBe(0);
      expect(stats.limitedRequests).toBe(0);
      expect(stats.uniqueKeys).toBe(0);
    });

    it('should not reset configurations', async () => {
      await service.checkLimit('test', { userId: 'user1' });
      service.resetStats();

      const stats = service.getStats();
      expect(stats.configurations).toBe(1);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    beforeEach(() => {
      service.registerConfig('test', defaultConfig);
    });

    it('should handle cache service get errors gracefully', async () => {
      mockCacheService.get.mockRejectedValue(new Error('Cache get failed'));

      const result = await service.checkLimit('test', { userId: 'user123' });

      expect(result.limited).toBe(false);
    });

    it('should handle cache service set errors gracefully', async () => {
      mockCacheService.get.mockResolvedValue(5);
      mockCacheService.set.mockRejectedValue(new Error('Cache set failed'));

      const result = await service.checkLimit('test', { userId: 'user123' });

      expect(result.limited).toBe(false);
    });

    it('should handle concurrent requests correctly', async () => {
      mockCacheService.get.mockResolvedValue(8);
      mockCacheService.set.mockResolvedValue(undefined);

      const promises = [
        service.checkLimit('test', { userId: 'user1' }),
        service.checkLimit('test', { userId: 'user1' }),
        service.checkLimit('test', { userId: 'user1' }),
      ];

      const results = await Promise.all(promises);

      expect(results).toHaveLength(3);
    });

    it('should handle window boundary correctly', async () => {
      const now = Date.now();
      jest.spyOn(Date, 'now').mockReturnValue(now);

      mockCacheService.get.mockResolvedValue(5);
      await service.checkLimit('test', { userId: 'user123' });

      const cacheKey = mockCacheService.get.mock.calls[0][0];
      expect(cacheKey).toContain(Math.floor(now / defaultConfig.windowMs).toString());

      jest.restoreAllMocks();
    });

    it('should provide correct resetAt timestamp', async () => {
      const now = Date.now();
      jest.spyOn(Date, 'now').mockReturnValue(now);

      mockCacheService.get.mockResolvedValue(5);
      const result = await service.checkLimit('test', { userId: 'user123' });

      const expectedResetAt = Math.ceil(now / defaultConfig.windowMs) * defaultConfig.windowMs;
      expect(result.resetAt).toBe(expectedResetAt);

      jest.restoreAllMocks();
    });

    it('should calculate retryAfter correctly when limited', async () => {
      const now = Date.now();
      jest.spyOn(Date, 'now').mockReturnValue(now);

      mockCacheService.get.mockResolvedValue(10);
      const result = await service.checkLimit('test', { userId: 'user123' });

      expect(result.retryAfter).toBeGreaterThan(0);
      expect(result.retryAfter).toBeLessThanOrEqual(Math.ceil(defaultConfig.windowMs / 1000));

      jest.restoreAllMocks();
    });
  });
});
