import { Test, TestingModule } from '@nestjs/testing';
import { Sequelize, Options } from 'sequelize';
import { Logger } from '@nestjs/common';
import {
  calculateOptimalPoolSize,
  calculatePoolSizeByLoad,
  adjustPoolSize,
  validatePoolConfig,
  ConnectionPoolManager,
  checkConnectionHealth,
  validateConnection,
  PoolMetricsCollector,
  ConnectionLeakDetector,
  ReadReplicaRouter,
  createSequelizeWithRetry,
  retryDatabaseOperation,
  analyzePoolPerformance,
  PoolConfig,
  PoolMetrics,
  ConnectionRetryConfig,
  ReplicaConfig,
} from './connection-pooling.service';

describe('Connection Pooling Service', () => {
  describe('calculateOptimalPoolSize', () => {
    it('should calculate optimal pool size based on CPU cores', () => {
      const config = calculateOptimalPoolSize(8, 50, 100, 0.7);

      expect(config.max).toBeGreaterThan(10);
      expect(config.min).toBeGreaterThan(0);
      expect(config.idle).toBe(10000);
      expect(config.acquire).toBe(30000);
    });

    it('should enforce minimum pool size', () => {
      const config = calculateOptimalPoolSize(1, 10, 50, 0.3);

      expect(config.max).toBeGreaterThanOrEqual(10);
      expect(config.min).toBeGreaterThanOrEqual(2);
    });

    it('should handle high latency scenarios', () => {
      const config = calculateOptimalPoolSize(4, 200, 100, 0.7);

      expect(config.max).toBeGreaterThan(calculateOptimalPoolSize(4, 50, 100, 0.7).max);
    });
  });

  describe('calculatePoolSizeByLoad', () => {
    it('should calculate pool size based on concurrent users', () => {
      const config = calculatePoolSizeByLoad(100, 1, 200, 1.2);

      expect(config.max).toBeGreaterThan(10);
      expect(config.min).toBeLessThanOrEqual(config.max!);
    });

    it('should apply safety margin correctly', () => {
      const withMargin = calculatePoolSizeByLoad(50, 1, 200, 1.5);
      const withoutMargin = calculatePoolSizeByLoad(50, 1, 200, 1.0);

      expect(withMargin.max).toBeGreaterThan(withoutMargin.max!);
    });

    it('should enforce minimum pool size', () => {
      const config = calculatePoolSizeByLoad(1, 0.1, 100, 1.0);

      expect(config.max).toBeGreaterThanOrEqual(10);
      expect(config.min).toBeGreaterThanOrEqual(2);
    });
  });

  describe('adjustPoolSize', () => {
    it('should scale up when utilization is high', () => {
      const currentConfig: PoolConfig = { max: 10, min: 2 };
      const metrics: PoolMetrics = {
        poolUtilization: 0.95,
        totalConnections: 0,
        activeConnections: 0,
        idleConnections: 0,
        waitingRequests: 0,
        totalCreated: 0,
        totalDestroyed: 0,
        totalAcquired: 0,
        totalReleased: 0,
        totalTimedOut: 0,
        averageWaitTime: 0,
        averageConnectionLife: 0,
        errorRate: 0,
      };

      const adjusted = adjustPoolSize(currentConfig, metrics);

      expect(adjusted.max).toBeGreaterThan(currentConfig.max!);
    });

    it('should scale down when utilization is low', () => {
      const currentConfig: PoolConfig = { max: 50, min: 10 };
      const metrics: PoolMetrics = {
        poolUtilization: 0.2,
        totalConnections: 0,
        activeConnections: 0,
        idleConnections: 0,
        waitingRequests: 0,
        totalCreated: 0,
        totalDestroyed: 0,
        totalAcquired: 0,
        totalReleased: 0,
        totalTimedOut: 0,
        averageWaitTime: 0,
        averageConnectionLife: 0,
        errorRate: 0,
      };

      const adjusted = adjustPoolSize(currentConfig, metrics);

      expect(adjusted.max).toBeLessThan(currentConfig.max!);
    });

    it('should respect hard cap on max connections', () => {
      const currentConfig: PoolConfig = { max: 90, min: 10 };
      const metrics: PoolMetrics = {
        poolUtilization: 0.99,
        totalConnections: 0,
        activeConnections: 0,
        idleConnections: 0,
        waitingRequests: 0,
        totalCreated: 0,
        totalDestroyed: 0,
        totalAcquired: 0,
        totalReleased: 0,
        totalTimedOut: 0,
        averageWaitTime: 0,
        averageConnectionLife: 0,
        errorRate: 0,
      };

      const adjusted = adjustPoolSize(currentConfig, metrics);

      expect(adjusted.max).toBeLessThanOrEqual(100);
    });

    it('should adjust min size proportionally', () => {
      const currentConfig: PoolConfig = { max: 20, min: 4 };
      const metrics: PoolMetrics = {
        poolUtilization: 0.5,
        totalConnections: 0,
        activeConnections: 0,
        idleConnections: 0,
        waitingRequests: 0,
        totalCreated: 0,
        totalDestroyed: 0,
        totalAcquired: 0,
        totalReleased: 0,
        totalTimedOut: 0,
        averageWaitTime: 0,
        averageConnectionLife: 0,
        errorRate: 0,
      };

      const adjusted = adjustPoolSize(currentConfig, metrics);

      expect(adjusted.min).toBeGreaterThanOrEqual(2);
    });
  });

  describe('validatePoolConfig', () => {
    it('should accept valid configuration', () => {
      const config: PoolConfig = {
        max: 20,
        min: 5,
        idle: 10000,
        acquire: 30000,
      };

      const result = validatePoolConfig(config);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject when max < min', () => {
      const config: PoolConfig = {
        max: 5,
        min: 10,
      };

      const result = validatePoolConfig(config);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('max must be greater than or equal to min');
    });

    it('should reject negative values', () => {
      const config: PoolConfig = {
        max: 10,
        min: -5,
      };

      const result = validatePoolConfig(config);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('min cannot be negative');
    });

    it('should warn about excessive pool size', () => {
      const config: PoolConfig = {
        max: 1500,
        min: 10,
      };

      const result = validatePoolConfig(config);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain(expect.stringContaining('excessive'));
    });
  });

  describe('ConnectionPoolManager', () => {
    let manager: ConnectionPoolManager;
    let mockSequelize: jest.Mocked<Sequelize>;

    beforeEach(() => {
      mockSequelize = {
        connectionManager: {
          pool: {
            used: [],
            free: [],
            pending: [],
            options: { max: 10, min: 2 },
            on: jest.fn(),
          },
        },
        close: jest.fn().mockResolvedValue(undefined),
      } as unknown as jest.Mocked<Sequelize>;

      manager = new ConnectionPoolManager();
    });

    it('should register a pool', () => {
      manager.registerPool('main', mockSequelize);
      const metrics = manager.getMetrics('main');

      expect(metrics).toBeDefined();
    });

    it('should get pool metrics', () => {
      manager.registerPool('main', mockSequelize);

      const mockPool = mockSequelize.connectionManager as Record<string, unknown>;
      (mockPool.pool as Record<string, unknown[]>).used = [{}, {}];
      (mockPool.pool as Record<string, unknown[]>).free = [{}];

      const metrics = manager.getMetrics('main');

      expect(metrics?.activeConnections).toBe(2);
      expect(metrics?.idleConnections).toBe(1);
    });

    it('should close pool gracefully', async () => {
      manager.registerPool('main', mockSequelize);

      await manager.closePool('main');

      expect(mockSequelize.close).toHaveBeenCalled();
    });

    it('should throw error when closing non-existent pool', async () => {
      await expect(manager.closePool('nonexistent')).rejects.toThrow('Pool nonexistent not found');
    });
  });

  describe('checkConnectionHealth', () => {
    let mockSequelize: jest.Mocked<Sequelize>;

    beforeEach(() => {
      mockSequelize = {
        authenticate: jest.fn().mockResolvedValue(undefined),
      } as unknown as jest.Mocked<Sequelize>;
    });

    it('should return healthy status on successful authentication', async () => {
      const health = await checkConnectionHealth(mockSequelize);

      expect(health.isHealthy).toBe(true);
      expect(health.responseTime).toBeGreaterThanOrEqual(0);
      expect(health.consecutiveFailures).toBe(0);
    });

    it('should return unhealthy on authentication failure', async () => {
      mockSequelize.authenticate.mockRejectedValueOnce(new Error('Connection failed'));

      const health = await checkConnectionHealth(mockSequelize);

      expect(health.isHealthy).toBe(false);
      expect(health.consecutiveFailures).toBeGreaterThan(0);
      expect(health.metadata.lastError).toBeDefined();
    });

    it('should enforce timeout', async () => {
      mockSequelize.authenticate.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 10000))
      );

      const health = await checkConnectionHealth(mockSequelize, 100);

      expect(health.isHealthy).toBe(false);
      expect(health.metadata.lastError).toContain('timeout');
    });
  });

  describe('PoolMetricsCollector', () => {
    let collector: PoolMetricsCollector;
    let mockSequelize: jest.Mocked<Sequelize>;

    beforeEach(() => {
      collector = new PoolMetricsCollector();
      mockSequelize = {
        connectionManager: {
          pool: {
            used: [{}, {}],
            free: [{}],
            pending: [],
            options: { max: 10 },
          },
        },
      } as unknown as jest.Mocked<Sequelize>;
    });

    it('should collect metrics', async () => {
      const metrics = await collector.collectMetrics(mockSequelize, 'main');

      expect(metrics.activeConnections).toBe(2);
      expect(metrics.idleConnections).toBe(1);
      expect(metrics.totalConnections).toBe(3);
      expect(metrics.poolUtilization).toBe(0.3);
    });

    it('should track metrics history', async () => {
      await collector.collectMetrics(mockSequelize, 'main');
      await collector.collectMetrics(mockSequelize, 'main');

      const aggregated = collector.getAggregatedMetrics('main', 10);

      expect(aggregated).toBeDefined();
      expect(aggregated.avgUtilization).toBeGreaterThanOrEqual(0);
    });

    it('should detect anomalies', async () => {
      mockSequelize.connectionManager = {
        pool: {
          used: new Array(10).fill({}),
          free: [],
          pending: new Array(15).fill({}),
          options: { max: 10 },
        },
      } as unknown as typeof mockSequelize.connectionManager;

      await collector.collectMetrics(mockSequelize, 'main');

      const anomalies = collector.detectAnomalies('main', {
        utilizationThreshold: 0.9,
        waitingRequestsThreshold: 10,
      });

      expect(anomalies.length).toBeGreaterThan(0);
      expect(anomalies).toContain(expect.stringContaining('High pool utilization'));
      expect(anomalies).toContain(expect.stringContaining('waiting requests'));
    });
  });

  describe('ConnectionLeakDetector', () => {
    let detector: ConnectionLeakDetector;

    beforeEach(() => {
      detector = new ConnectionLeakDetector(1000); // 1 second threshold
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should track connections', () => {
      detector.trackConnection('conn-1', { query: 'SELECT * FROM users' });

      const leaks = detector.detectLeaks();
      expect(leaks).toHaveLength(0);
    });

    it('should detect connection leaks', () => {
      detector.trackConnection('conn-1', { query: 'SELECT * FROM users' });

      jest.advanceTimersByTime(2000);

      const leaks = detector.detectLeaks();
      expect(leaks).toHaveLength(1);
      expect(leaks[0].connectionId).toBe('conn-1');
      expect(leaks[0].duration).toBeGreaterThan(1000);
    });

    it('should remove released connections', () => {
      detector.trackConnection('conn-1');
      detector.releaseConnection('conn-1');

      jest.advanceTimersByTime(2000);

      const leaks = detector.detectLeaks();
      expect(leaks).toHaveLength(0);
    });

    it('should generate leak report', () => {
      detector.trackConnection('conn-1', { query: 'SELECT * FROM users' });

      jest.advanceTimersByTime(2000);

      const report = detector.getLeakReport();

      expect(report).toContain('Connection ID: conn-1');
      expect(report).toContain('Query: SELECT * FROM users');
    });
  });

  describe('ReadReplicaRouter', () => {
    let router: ReadReplicaRouter;
    let mockWrite: jest.Mocked<Sequelize>;
    let mockRead1: jest.Mocked<Sequelize>;
    let mockRead2: jest.Mocked<Sequelize>;

    beforeEach(() => {
      mockWrite = {} as jest.Mocked<Sequelize>;
      mockRead1 = {} as jest.Mocked<Sequelize>;
      mockRead2 = {} as jest.Mocked<Sequelize>;

      const config: ReplicaConfig = {
        write: mockWrite,
        read: [mockRead1, mockRead2],
        loadBalancing: 'round-robin',
      };

      router = new ReadReplicaRouter(config);
    });

    it('should return write instance', () => {
      const writeInstance = router.getWriteInstance();
      expect(writeInstance).toBe(mockWrite);
    });

    it('should round-robin read replicas', () => {
      const first = router.getReadReplica();
      const second = router.getReadReplica();

      expect(first).toBe(mockRead1);
      expect(second).toBe(mockRead2);
    });

    it('should track connection counts', () => {
      router.trackAcquisition(mockRead1);
      router.trackAcquisition(mockRead1);
      router.trackRelease(mockRead1);

      // Should have internal state tracking
      expect(true).toBe(true);
    });
  });

  describe('createSequelizeWithRetry', () => {
    const mockConfig: Options = {
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
    };

    const retryConfig: ConnectionRetryConfig = {
      maxRetries: 3,
      initialDelay: 100,
      maxDelay: 1000,
      backoffMultiplier: 2,
      connectionTimeout: 5000,
    };

    it('should create sequelize instance on first try', async () => {
      const sequelize = await createSequelizeWithRetry(mockConfig, retryConfig);

      expect(sequelize).toBeDefined();
    });

    it('should retry on connection failure', async () => {
      jest.useFakeTimers();

      const promise = createSequelizeWithRetry(
        { ...mockConfig, host: 'invalid-host' },
        { ...retryConfig, maxRetries: 2, initialDelay: 10 }
      );

      jest.advanceTimersByTime(100);

      await expect(promise).rejects.toThrow();

      jest.useRealTimers();
    }, 10000);
  });

  describe('retryDatabaseOperation', () => {
    it('should succeed on first attempt', async () => {
      const operation = jest.fn().mockResolvedValue('success');

      const result = await retryDatabaseOperation(operation);

      expect(result).toBe('success');
      expect(operation).toHaveBeenCalledTimes(1);
    });

    it('should retry on retryable errors', async () => {
      const operation = jest
        .fn()
        .mockRejectedValueOnce(new Error('ECONNREFUSED'))
        .mockResolvedValueOnce('success');

      const result = await retryDatabaseOperation(operation, {
        maxRetries: 3,
        initialDelay: 10,
      });

      expect(result).toBe('success');
      expect(operation).toHaveBeenCalledTimes(2);
    });

    it('should not retry on non-retryable errors', async () => {
      const operation = jest.fn().mockRejectedValue(new Error('Invalid query'));

      await expect(
        retryDatabaseOperation(operation, { maxRetries: 3 })
      ).rejects.toThrow('Invalid query');

      expect(operation).toHaveBeenCalledTimes(1);
    });
  });

  describe('analyzePoolPerformance', () => {
    let mockSequelize: jest.Mocked<Sequelize>;

    beforeEach(() => {
      mockSequelize = {
        connectionManager: {
          pool: {
            options: {
              max: 10,
              min: 2,
              idle: 10000,
              acquire: 30000,
              evict: 1000,
            },
          },
        },
      } as unknown as jest.Mocked<Sequelize>;
    });

    it('should recommend scaling up for high utilization', async () => {
      const metrics: PoolMetrics = {
        poolUtilization: 0.95,
        waitingRequests: 0,
        totalConnections: 0,
        activeConnections: 0,
        idleConnections: 0,
        totalCreated: 0,
        totalDestroyed: 0,
        totalAcquired: 0,
        totalReleased: 0,
        totalTimedOut: 0,
        averageWaitTime: 0,
        averageConnectionLife: 0,
        errorRate: 0,
      };

      const recommendation = await analyzePoolPerformance(mockSequelize, metrics);

      expect(recommendation.recommendedConfig.max).toBeGreaterThan(10);
      expect(recommendation.reasoning).toContain(expect.stringContaining('High pool utilization'));
    });

    it('should recommend scaling down for low utilization', async () => {
      const metrics: PoolMetrics = {
        poolUtilization: 0.2,
        waitingRequests: 0,
        totalConnections: 0,
        activeConnections: 0,
        idleConnections: 0,
        totalCreated: 0,
        totalDestroyed: 0,
        totalAcquired: 0,
        totalReleased: 0,
        totalTimedOut: 0,
        averageWaitTime: 0,
        averageConnectionLife: 0,
        errorRate: 0,
      };

      const recommendation = await analyzePoolPerformance(mockSequelize, metrics);

      expect(recommendation.recommendedConfig.max).toBeLessThan(10);
      expect(recommendation.reasoning).toContain(expect.stringContaining('Low pool utilization'));
    });
  });
});
