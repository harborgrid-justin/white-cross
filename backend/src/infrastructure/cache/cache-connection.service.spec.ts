/**
 * @fileoverview Tests for Cache Connection Service
 * @module infrastructure/cache/connection
 */

import { Test, TestingModule } from '@nestjs/testing';
import { CacheConnectionService } from './cache-connection.service';
import { CacheConfigService } from './cache.config';
import { LoggerService } from '@/common/logging/logger.service';
import Redis from 'ioredis';

// Mock Redis
jest.mock('ioredis');

describe('CacheConnectionService', () => {
  let service: CacheConnectionService;
  let mockLogger: jest.Mocked<LoggerService>;
  let mockCacheConfig: jest.Mocked<CacheConfigService>;
  let mockRedis: jest.Mocked<Redis>;

  const mockRedisConfig = {
    host: 'localhost',
    port: 6379,
    password: 'test-password',
    db: 0,
    connectionTimeout: 5000,
    maxRetries: 3,
    retryDelay: 1000,
  };

  beforeEach(async () => {
    // Create mock Redis instance
    mockRedis = {
      ping: jest.fn().mockResolvedValue('PONG'),
      quit: jest.fn().mockResolvedValue('OK'),
      on: jest.fn(),
    } as unknown as jest.Mocked<Redis>;

    (Redis as unknown as jest.Mock).mockImplementation(() => mockRedis);

    mockLogger = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    } as unknown as jest.Mocked<LoggerService>;

    mockCacheConfig = {
      getRedisConfig: jest.fn().mockReturnValue(mockRedisConfig),
    } as unknown as jest.Mocked<CacheConfigService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CacheConnectionService,
        {
          provide: LoggerService,
          useValue: mockLogger,
        },
        {
          provide: CacheConfigService,
          useValue: mockCacheConfig,
        },
      ],
    }).compile();

    service = module.get<CacheConnectionService>(CacheConnectionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Constructor and Initialization', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should initialize with null Redis client', () => {
      expect(service.getClient()).toBeNull();
    });

    it('should initialize with zero reconnect attempts', () => {
      expect(service.getReconnectAttempts()).toBe(0);
    });
  });

  describe('connect()', () => {
    it('should successfully connect to Redis', async () => {
      await service.connect();

      expect(mockCacheConfig.getRedisConfig).toHaveBeenCalled();
      expect(Redis).toHaveBeenCalledWith(
        expect.objectContaining({
          host: mockRedisConfig.host,
          port: mockRedisConfig.port,
          password: mockRedisConfig.password,
          db: mockRedisConfig.db,
          connectTimeout: mockRedisConfig.connectionTimeout,
        }),
      );
      expect(mockRedis.ping).toHaveBeenCalled();
      expect(service.getClient()).toBe(mockRedis);
    });

    it('should set up event handlers on connect', async () => {
      await service.connect();

      expect(mockRedis.on).toHaveBeenCalledWith('error', expect.any(Function));
      expect(mockRedis.on).toHaveBeenCalledWith('connect', expect.any(Function));
      expect(mockRedis.on).toHaveBeenCalledWith('ready', expect.any(Function));
      expect(mockRedis.on).toHaveBeenCalledWith('close', expect.any(Function));
      expect(mockRedis.on).toHaveBeenCalledWith('reconnecting', expect.any(Function));
    });

    it('should configure retry strategy', async () => {
      await service.connect();

      const redisCall = (Redis as unknown as jest.Mock).mock.calls[0][0];
      const retryStrategy = redisCall.retryStrategy;

      expect(retryStrategy).toBeDefined();
    });

    it('should return null from retry strategy after max retries', async () => {
      await service.connect();

      const redisCall = (Redis as unknown as jest.Mock).mock.calls[0][0];
      const retryStrategy = redisCall.retryStrategy;

      const result = retryStrategy(mockRedisConfig.maxRetries + 1);
      expect(result).toBeNull();
    });

    it('should return exponential backoff delay within retry limit', async () => {
      await service.connect();

      const redisCall = (Redis as unknown as jest.Mock).mock.calls[0][0];
      const retryStrategy = redisCall.retryStrategy;

      const result = retryStrategy(2);
      expect(result).toBe(2000); // 2 * 1000
    });

    it('should cap retry delay at 10 seconds', async () => {
      await service.connect();

      const redisCall = (Redis as unknown as jest.Mock).mock.calls[0][0];
      const retryStrategy = redisCall.retryStrategy;

      const result = retryStrategy(20);
      expect(result).toBe(10000); // Max delay
    });

    it('should handle connection failure', async () => {
      const error = new Error('Connection failed');
      mockRedis.ping.mockRejectedValueOnce(error);

      await expect(service.connect()).rejects.toThrow(error);
      expect(service.isConnected()).toBe(false);
      expect(service.getLastError()).toBe(error);
    });

    it('should set isHealthy to false on connection error', async () => {
      mockRedis.ping.mockRejectedValueOnce(new Error('Connection failed'));

      await expect(service.connect()).rejects.toThrow();
      expect(service.isConnected()).toBe(false);
    });
  });

  describe('disconnect()', () => {
    it('should disconnect from Redis when connected', async () => {
      await service.connect();
      await service.disconnect();

      expect(mockRedis.quit).toHaveBeenCalled();
      expect(service.getClient()).toBeNull();
    });

    it('should handle disconnect when not connected', async () => {
      await service.disconnect();

      expect(mockRedis.quit).not.toHaveBeenCalled();
      expect(service.getClient()).toBeNull();
    });

    it('should handle disconnect errors gracefully', async () => {
      await service.connect();
      mockRedis.quit.mockRejectedValueOnce(new Error('Disconnect failed'));

      await expect(service.disconnect()).rejects.toThrow('Disconnect failed');
    });
  });

  describe('checkHealth()', () => {
    it('should return latency on successful health check', async () => {
      await service.connect();

      const latency = await service.checkHealth();

      expect(mockRedis.ping).toHaveBeenCalled();
      expect(latency).toBeGreaterThanOrEqual(0);
    });

    it('should return -1 when Redis is not connected', async () => {
      const latency = await service.checkHealth();

      expect(latency).toBe(-1);
    });

    it('should return -1 and mark unhealthy on ping failure', async () => {
      await service.connect();
      mockRedis.ping.mockRejectedValueOnce(new Error('Ping failed'));

      const latency = await service.checkHealth();

      expect(latency).toBe(-1);
      expect(service.isConnected()).toBe(false);
    });

    it('should store last error on health check failure', async () => {
      await service.connect();
      const error = new Error('Ping failed');
      mockRedis.ping.mockRejectedValueOnce(error);

      await service.checkHealth();

      expect(service.getLastError()).toBe(error);
    });
  });

  describe('isConnected()', () => {
    it('should return true when connected and healthy', async () => {
      await service.connect();

      expect(service.isConnected()).toBe(true);
    });

    it('should return false when not connected', () => {
      expect(service.isConnected()).toBe(false);
    });

    it('should return false when unhealthy', async () => {
      await service.connect();
      mockRedis.ping.mockRejectedValueOnce(new Error('Health check failed'));
      await service.checkHealth();

      expect(service.isConnected()).toBe(false);
    });
  });

  describe('getClient()', () => {
    it('should return null before connection', () => {
      expect(service.getClient()).toBeNull();
    });

    it('should return Redis instance after connection', async () => {
      await service.connect();

      expect(service.getClient()).toBe(mockRedis);
    });

    it('should return null after disconnection', async () => {
      await service.connect();
      await service.disconnect();

      expect(service.getClient()).toBeNull();
    });
  });

  describe('Event Handlers', () => {
    let eventHandlers: Record<string, (arg: unknown) => void>;

    beforeEach(async () => {
      eventHandlers = {};
      mockRedis.on.mockImplementation((event: string, handler: (arg: unknown) => void) => {
        eventHandlers[event] = handler;
        return mockRedis;
      });

      await service.connect();
    });

    it('should handle error event', () => {
      const error = new Error('Redis error');
      eventHandlers.error(error);

      expect(service.isConnected()).toBe(false);
      expect(service.getLastError()).toBe(error);
    });

    it('should handle connect event', () => {
      // Trigger error first to set unhealthy state
      const error = new Error('Test error');
      eventHandlers.error(error);

      // Now trigger connect
      eventHandlers.connect(undefined);

      expect(service.getReconnectAttempts()).toBe(0);
    });

    it('should handle reconnecting event', () => {
      eventHandlers.reconnecting(undefined);
      eventHandlers.reconnecting(undefined);

      expect(service.getReconnectAttempts()).toBe(2);
    });

    it('should handle close event', () => {
      eventHandlers.close(undefined);

      expect(service.isConnected()).toBe(false);
    });

    it('should handle ready event', () => {
      eventHandlers.ready(undefined);

      // Just verify it doesn't throw
      expect(true).toBe(true);
    });
  });

  describe('onModuleDestroy()', () => {
    it('should disconnect on module destroy', async () => {
      await service.connect();
      await service.onModuleDestroy();

      expect(mockRedis.quit).toHaveBeenCalled();
      expect(service.getClient()).toBeNull();
    });

    it('should handle module destroy when not connected', async () => {
      await expect(service.onModuleDestroy()).resolves.not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('should handle multiple connect calls', async () => {
      await service.connect();
      await service.connect();

      expect(Redis).toHaveBeenCalledTimes(2);
    });

    it('should handle multiple disconnect calls', async () => {
      await service.connect();
      await service.disconnect();
      await service.disconnect();

      expect(mockRedis.quit).toHaveBeenCalledTimes(1);
    });

    it('should handle rapid health checks', async () => {
      await service.connect();

      const healthChecks = await Promise.all([
        service.checkHealth(),
        service.checkHealth(),
        service.checkHealth(),
      ]);

      expect(healthChecks).toHaveLength(3);
      healthChecks.forEach((latency) => {
        expect(latency).toBeGreaterThanOrEqual(0);
      });
    });

    it('should maintain state across reconnection attempts', async () => {
      await service.connect();

      // Simulate reconnection
      eventHandlers.reconnecting(undefined);
      eventHandlers.reconnecting(undefined);

      expect(service.getReconnectAttempts()).toBe(2);

      // Simulate successful reconnection
      eventHandlers.connect(undefined);

      expect(service.getReconnectAttempts()).toBe(0);
    });
  });

  describe('Configuration Validation', () => {
    it('should handle missing configuration gracefully', async () => {
      mockCacheConfig.getRedisConfig.mockReturnValueOnce(null as unknown as typeof mockRedisConfig);

      await expect(service.connect()).rejects.toThrow();
    });

    it('should use correct configuration values', async () => {
      const customConfig = {
        ...mockRedisConfig,
        host: 'custom-redis',
        port: 7000,
      };
      mockCacheConfig.getRedisConfig.mockReturnValueOnce(customConfig);

      await service.connect();

      expect(Redis).toHaveBeenCalledWith(
        expect.objectContaining({
          host: 'custom-redis',
          port: 7000,
        }),
      );
    });
  });
});
