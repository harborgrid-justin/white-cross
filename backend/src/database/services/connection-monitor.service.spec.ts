import { Test, TestingModule } from '@nestjs/testing';
import { Sequelize } from 'sequelize-typescript';
import { ConnectionMonitorService, ConnectionPoolMetrics, ConnectionHealthStatus } from './connection-monitor.service';
import { LoggerService } from '@/common/logging/logger.service';

describe('ConnectionMonitorService', () => {
  let service: ConnectionMonitorService;
  let mockSequelize: jest.Mocked<Sequelize>;
  let mockLogger: jest.Mocked<LoggerService>;

  // Mock pool structure
  const mockPool = {
    used: [],
    free: [],
    pending: [],
    options: {
      max: 10,
      min: 2,
    },
  };

  beforeEach(async () => {
    // Create mocks
    mockLogger = {
      info: jest.fn(),
      debug: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    } as unknown as jest.Mocked<LoggerService>;

    mockSequelize = {
      authenticate: jest.fn().mockResolvedValue(undefined),
      connectionManager: {
        pool: mockPool,
      },
    } as unknown as jest.Mocked<Sequelize>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConnectionMonitorService,
        {
          provide: LoggerService,
          useValue: mockLogger,
        },
        {
          provide: Sequelize,
          useValue: mockSequelize,
        },
      ],
    }).compile();

    service = module.get<ConnectionMonitorService>(ConnectionMonitorService);

    // Clear all timers between tests
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  describe('initialization', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should start monitoring on module init', async () => {
      const startMonitoringSpy = jest.spyOn(service, 'startMonitoring');
      await service.onModuleInit();
      expect(startMonitoringSpy).toHaveBeenCalled();
    });

    it('should stop monitoring on module destroy', async () => {
      const stopMonitoringSpy = jest.spyOn(service, 'stopMonitoring');
      await service.onModuleDestroy();
      expect(stopMonitoringSpy).toHaveBeenCalled();
    });
  });

  describe('collectMetrics', () => {
    it('should collect metrics from connection pool', async () => {
      mockPool.used = [{}, {}, {}]; // 3 active connections
      mockPool.free = [{}]; // 1 idle connection
      mockPool.pending = [{}]; // 1 waiting request

      const metrics = await service.collectMetrics();

      expect(metrics).toMatchObject({
        active: 3,
        idle: 1,
        waiting: 1,
        total: 4,
        max: 10,
        utilizationPercent: 40,
      });
      expect(metrics.timestamp).toBeInstanceOf(Date);
    });

    it('should return empty metrics when pool is not available', async () => {
      mockSequelize.connectionManager = undefined as unknown as typeof mockSequelize.connectionManager;

      const metrics = await service.collectMetrics();

      expect(metrics).toMatchObject({
        active: 0,
        idle: 0,
        waiting: 0,
        total: 0,
        max: 0,
        utilizationPercent: 0,
      });
    });

    it('should handle errors gracefully', async () => {
      mockSequelize.connectionManager = { pool: null } as unknown as typeof mockSequelize.connectionManager;

      const metrics = await service.collectMetrics();

      expect(metrics.active).toBe(0);
      expect(mockLogger.warn).toHaveBeenCalledWith('Connection pool not available');
    });
  });

  describe('performHealthCheck', () => {
    it('should return healthy status when authentication succeeds', async () => {
      mockSequelize.authenticate.mockResolvedValueOnce(undefined);

      const health = await service.performHealthCheck();

      expect(health.isHealthy).toBe(true);
      expect(health.consecutiveFailures).toBe(0);
      expect(health.issues).toEqual([]);
    });

    it('should increment consecutive failures on error', async () => {
      mockSequelize.authenticate.mockRejectedValueOnce(new Error('Connection failed'));

      const health = await service.performHealthCheck();

      expect(health.isHealthy).toBe(true); // Still healthy after 1 failure
      expect(health.consecutiveFailures).toBe(1);
      expect(health.issues).toContain(expect.stringContaining('Database authentication failed'));
    });

    it('should mark as unhealthy after 3 consecutive failures', async () => {
      mockSequelize.authenticate.mockRejectedValue(new Error('Connection failed'));

      await service.performHealthCheck(); // 1st failure
      await service.performHealthCheck(); // 2nd failure
      const health = await service.performHealthCheck(); // 3rd failure

      expect(health.isHealthy).toBe(false);
      expect(health.consecutiveFailures).toBe(3);
    });

    it('should detect high utilization issues', async () => {
      mockPool.used = new Array(10).fill({});
      mockPool.free = [];
      mockPool.options.max = 10;

      await service.collectMetrics();
      const health = await service.performHealthCheck();

      expect(health.issues).toContain('Connection pool near exhaustion');
    });

    it('should detect high waiting queue issues', async () => {
      mockPool.pending = new Array(15).fill({});

      await service.collectMetrics();
      const health = await service.performHealthCheck();

      expect(health.issues).toContain('High connection wait queue');
    });
  });

  describe('startMonitoring', () => {
    it('should collect initial metrics and start intervals', async () => {
      const collectSpy = jest.spyOn(service, 'collectMetrics');
      const healthSpy = jest.spyOn(service, 'performHealthCheck');

      await service.startMonitoring();

      expect(collectSpy).toHaveBeenCalledTimes(1);
      expect(healthSpy).toHaveBeenCalledTimes(1);

      // Fast forward to trigger intervals
      jest.advanceTimersByTime(30000);
      expect(collectSpy).toHaveBeenCalledTimes(2);

      jest.advanceTimersByTime(30000);
      expect(healthSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('stopMonitoring', () => {
    it('should clear all intervals', async () => {
      await service.startMonitoring();
      await service.stopMonitoring();

      const collectSpy = jest.spyOn(service, 'collectMetrics');

      jest.advanceTimersByTime(60000);

      // Should not be called after stopping
      expect(collectSpy).not.toHaveBeenCalled();
    });
  });

  describe('getMetrics', () => {
    it('should return current metrics', async () => {
      await service.collectMetrics();

      const metrics = service.getMetrics();

      expect(metrics).toBeDefined();
      expect(metrics).toHaveProperty('active');
      expect(metrics).toHaveProperty('idle');
    });

    it('should return null if no metrics collected', () => {
      const metrics = service.getMetrics();
      expect(metrics).toBeNull();
    });
  });

  describe('getHealthStatus', () => {
    it('should return copy of health status', async () => {
      await service.performHealthCheck();

      const health = service.getHealthStatus();

      expect(health).toBeDefined();
      expect(health).toHaveProperty('isHealthy');
      expect(health).toHaveProperty('consecutiveFailures');
    });
  });

  describe('getPrometheusMetrics', () => {
    it('should return formatted Prometheus metrics', async () => {
      mockPool.used = [{}, {}];
      mockPool.free = [{}, {}, {}];
      mockPool.options.max = 10;

      await service.collectMetrics();

      const promMetrics = service.getPrometheusMetrics();

      expect(promMetrics).toContain('db_pool_active_connections 2');
      expect(promMetrics).toContain('db_pool_idle_connections 3');
      expect(promMetrics).toContain('db_pool_max_connections 10');
    });

    it('should return empty string when no metrics available', () => {
      const promMetrics = service.getPrometheusMetrics();
      expect(promMetrics).toBe('');
    });
  });

  describe('forceMetricsCollection', () => {
    it('should immediately collect and analyze metrics', async () => {
      mockPool.used = new Array(9).fill({});
      mockPool.options.max = 10;

      const metrics = await service.forceMetricsCollection();

      expect(metrics.utilizationPercent).toBeGreaterThan(80);
      expect(mockLogger.warn).toHaveBeenCalledWith(
        expect.stringContaining('HIGH: Connection pool utilization'),
        expect.any(Object)
      );
    });
  });

  describe('forceHealthCheck', () => {
    it('should immediately perform health check', async () => {
      const health = await service.forceHealthCheck();

      expect(health).toBeDefined();
      expect(mockSequelize.authenticate).toHaveBeenCalled();
    });
  });

  describe('metric analysis thresholds', () => {
    it('should log critical alert for 95%+ utilization', async () => {
      mockPool.used = new Array(10).fill({});
      mockPool.free = [];
      mockPool.options.max = 10;

      await service.collectMetrics();
      jest.advanceTimersByTime(30000);

      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.stringContaining('CRITICAL: Connection pool utilization'),
        expect.any(Object)
      );
    });

    it('should log warning for high wait queue', async () => {
      mockPool.pending = new Array(10).fill({});

      await service.collectMetrics();
      jest.advanceTimersByTime(30000);

      expect(mockLogger.warn).toHaveBeenCalledWith(
        expect.stringContaining('Connection pool wait queue is high'),
        expect.any(Object)
      );
    });
  });
});
