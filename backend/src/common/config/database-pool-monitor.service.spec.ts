import { Test, TestingModule } from '@nestjs/testing';
import { Sequelize } from 'sequelize';
import {
  DatabasePoolMonitorService,
  PoolMetrics,
  PoolAlert,
} from './database-pool-monitor.service';
import { LoggerService } from '@/common/logging/logger.service';

describe('DatabasePoolMonitorService', () => {
  let service: DatabasePoolMonitorService;
  let mockSequelize: Partial<Sequelize>;
  let mockLogger: Partial<LoggerService>;

  const createMockPool = (config: {
    used?: number;
    free?: number;
    pending?: number;
    max?: number;
  }) => ({
    used: new Array(config.used || 0).fill({}),
    free: new Array(config.free || 0).fill({}),
    pending: new Array(config.pending || 0).fill({}),
    options: { max: config.max || 10 },
  });

  beforeEach(async () => {
    mockLogger = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    } as Partial<LoggerService>;

    mockSequelize = {
      authenticate: jest.fn().mockResolvedValue(undefined),
      connectionManager: {
        pool: createMockPool({ used: 2, free: 8, pending: 0, max: 10 }),
      },
    } as unknown as Partial<Sequelize>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DatabasePoolMonitorService,
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

    service = module.get<DatabasePoolMonitorService>(DatabasePoolMonitorService);
  });

  describe('Initialization', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should initialize with empty metrics and alerts', () => {
      expect(service['metrics']).toEqual([]);
      expect(service['alerts']).toEqual([]);
    });

    it('should have correct threshold values', () => {
      expect(service['HIGH_UTILIZATION_THRESHOLD']).toBe(0.8);
      expect(service['CRITICAL_UTILIZATION_THRESHOLD']).toBe(0.9);
      expect(service['MAX_WAITING_REQUESTS']).toBe(5);
    });

    it('should call checkPoolHealth on module init', async () => {
      const spy = jest.spyOn(service, 'checkPoolHealth');
      await service.onModuleInit();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Metrics Collection', () => {
    it('should collect pool metrics', async () => {
      const metrics = await service.collectMetrics();

      expect(metrics).toBeDefined();
      expect(metrics?.activeConnections).toBe(2);
      expect(metrics?.idleConnections).toBe(8);
      expect(metrics?.waitingRequests).toBe(0);
      expect(metrics?.totalConnections).toBe(10);
      expect(metrics?.maxConnections).toBe(10);
    });

    it('should calculate utilization percentage', async () => {
      const metrics = await service.collectMetrics();

      expect(metrics?.utilizationPercent).toBe(100);
    });

    it('should handle zero utilization', async () => {
      (mockSequelize as any).connectionManager.pool = createMockPool({
        used: 0,
        free: 0,
        pending: 0,
        max: 10,
      });

      const metrics = await service.collectMetrics();

      expect(metrics?.utilizationPercent).toBe(0);
    });

    it('should store metrics in history', async () => {
      await service.collectMetrics();
      await service.collectMetrics();

      expect(service['metrics'].length).toBe(2);
    });

    it('should limit metrics history', async () => {
      service['MAX_METRICS_HISTORY'] = 3;

      for (let i = 0; i < 5; i++) {
        await service.collectMetrics();
      }

      expect(service['metrics'].length).toBe(3);
    });

    it('should return null when pool is not available', async () => {
      jest.spyOn(service as any, 'getConnectionPool').mockReturnValue(null);

      const metrics = await service.collectMetrics();

      expect(metrics).toBeNull();
      expect(mockLogger.warn).toHaveBeenCalledWith('Connection pool not available');
    });

    it('should handle errors during metric collection', async () => {
      jest.spyOn(service as any, 'getConnectionPool').mockImplementation(() => {
        throw new Error('Pool error');
      });

      const metrics = await service.collectMetrics();

      expect(metrics).toBeNull();
      expect(mockLogger.error).toHaveBeenCalled();
    });

    it('should log warning for high utilization', async () => {
      (mockSequelize as any).connectionManager.pool = createMockPool({
        used: 8,
        free: 2,
        pending: 0,
        max: 10,
      });

      await service.collectMetrics();

      expect(mockLogger.warn).toHaveBeenCalled();
    });

    it('should log warning for waiting requests', async () => {
      (mockSequelize as any).connectionManager.pool = createMockPool({
        used: 5,
        free: 5,
        pending: 3,
        max: 10,
      });

      await service.collectMetrics();

      expect(mockLogger.warn).toHaveBeenCalled();
    });
  });

  describe('Health Checks', () => {
    it('should return true for healthy pool', async () => {
      (mockSequelize as any).connectionManager.pool = createMockPool({
        used: 3,
        free: 7,
        pending: 0,
        max: 10,
      });

      const isHealthy = await service.checkPoolHealth();

      expect(isHealthy).toBe(true);
    });

    it('should return false for critical utilization', async () => {
      (mockSequelize as any).connectionManager.pool = createMockPool({
        used: 9,
        free: 1,
        pending: 0,
        max: 10,
      });

      const isHealthy = await service.checkPoolHealth();

      expect(isHealthy).toBe(false);
    });

    it('should return false for too many waiting requests', async () => {
      (mockSequelize as any).connectionManager.pool = createMockPool({
        used: 5,
        free: 5,
        pending: 10,
        max: 10,
      });

      const isHealthy = await service.checkPoolHealth();

      expect(isHealthy).toBe(false);
    });

    it('should return false on connection failure', async () => {
      (mockSequelize.authenticate as jest.Mock).mockRejectedValue(new Error('Connection failed'));

      const isHealthy = await service.checkPoolHealth();

      expect(isHealthy).toBe(false);
      expect(mockLogger.error).toHaveBeenCalled();
    });

    it('should record alert on connection error', async () => {
      (mockSequelize.authenticate as jest.Mock).mockRejectedValue(new Error('DB Error'));

      await service.checkPoolHealth();

      const alerts = service.getAlerts();
      expect(alerts.length).toBeGreaterThan(0);
      expect(alerts[alerts.length - 1].type).toBe('connection_error');
      expect(alerts[alerts.length - 1].severity).toBe('critical');
    });
  });

  describe('Metrics Retrieval', () => {
    beforeEach(async () => {
      await service.collectMetrics();
      await service.collectMetrics();
    });

    it('should get current metrics', () => {
      const current = service.getCurrentMetrics();

      expect(current).toBeDefined();
      expect(current).toEqual(service['metrics'][service['metrics'].length - 1]);
    });

    it('should return null when no metrics collected', () => {
      service['metrics'] = [];
      const current = service.getCurrentMetrics();

      expect(current).toBeNull();
    });

    it('should get metrics history', () => {
      const history = service.getMetricsHistory(10);

      expect(history.length).toBeLessThanOrEqual(10);
    });

    it('should limit metrics history retrieval', () => {
      for (let i = 0; i < 30; i++) {
        service['metrics'].push({
          activeConnections: i,
          idleConnections: 10 - i,
          waitingRequests: 0,
          totalConnections: 10,
          maxConnections: 10,
          utilizationPercent: 100,
          timestamp: new Date(),
        });
      }

      const history = service.getMetricsHistory(5);

      expect(history.length).toBe(5);
    });

    it('should get most recent metrics in history', () => {
      const metric1: PoolMetrics = {
        activeConnections: 1,
        idleConnections: 9,
        waitingRequests: 0,
        totalConnections: 10,
        maxConnections: 10,
        utilizationPercent: 100,
        timestamp: new Date(Date.now() - 1000),
      };

      const metric2: PoolMetrics = {
        activeConnections: 2,
        idleConnections: 8,
        waitingRequests: 0,
        totalConnections: 10,
        maxConnections: 10,
        utilizationPercent: 100,
        timestamp: new Date(),
      };

      service['metrics'] = [metric1, metric2];

      const history = service.getMetricsHistory(1);
      expect(history[0]).toEqual(metric2);
    });
  });

  describe('Alert Management', () => {
    it('should record high utilization alert', async () => {
      (mockSequelize as any).connectionManager.pool = createMockPool({
        used: 8,
        free: 2,
        pending: 0,
        max: 10,
      });

      await service.collectMetrics();

      const alerts = service.getAlerts();
      expect(alerts.some(a => a.type === 'high_utilization')).toBe(true);
    });

    it('should record critical pool exhaustion alert', async () => {
      (mockSequelize as any).connectionManager.pool = createMockPool({
        used: 9,
        free: 1,
        pending: 0,
        max: 10,
      });

      await service.collectMetrics();

      const alerts = service.getAlerts();
      expect(alerts.some(a => a.type === 'pool_exhaustion')).toBe(true);
      expect(alerts.some(a => a.severity === 'critical')).toBe(true);
    });

    it('should record connection wait alert', async () => {
      (mockSequelize as any).connectionManager.pool = createMockPool({
        used: 5,
        free: 5,
        pending: 7,
        max: 10,
      });

      await service.collectMetrics();

      const alerts = service.getAlerts();
      expect(alerts.some(a => a.type === 'connection_wait')).toBe(true);
    });

    it('should set critical severity for many waiting requests', async () => {
      (mockSequelize as any).connectionManager.pool = createMockPool({
        used: 5,
        free: 5,
        pending: 15,
        max: 10,
      });

      await service.collectMetrics();

      const alerts = service.getAlerts();
      const waitAlert = alerts.find(a => a.type === 'connection_wait');
      expect(waitAlert?.severity).toBe('critical');
    });

    it('should limit alert history', async () => {
      service['MAX_ALERTS_HISTORY'] = 3;

      for (let i = 0; i < 5; i++) {
        (mockSequelize as any).connectionManager.pool = createMockPool({
          used: 9,
          free: 1,
          pending: 0,
          max: 10,
        });
        await service.collectMetrics();
      }

      expect(service['alerts'].length).toBeLessThanOrEqual(3);
    });

    it('should get recent alerts', () => {
      const alert1: PoolAlert = {
        type: 'high_utilization',
        severity: 'warning',
        message: 'Test alert 1',
        metrics: null,
        timestamp: new Date(),
      };

      const alert2: PoolAlert = {
        type: 'connection_wait',
        severity: 'critical',
        message: 'Test alert 2',
        metrics: null,
        timestamp: new Date(),
      };

      service['alerts'] = [alert1, alert2];

      const alerts = service.getAlerts(1);
      expect(alerts.length).toBe(1);
    });
  });

  describe('Pool Statistics', () => {
    beforeEach(async () => {
      (mockSequelize as any).connectionManager.pool = createMockPool({
        used: 5,
        free: 5,
        pending: 0,
        max: 10,
      });

      await service.collectMetrics();

      (mockSequelize as any).connectionManager.pool = createMockPool({
        used: 8,
        free: 2,
        pending: 2,
        max: 10,
      });

      await service.collectMetrics();
    });

    it('should calculate pool statistics', () => {
      const stats = service.getPoolStatistics();

      expect(stats).toBeDefined();
      expect(stats?.current).toBeDefined();
      expect(stats?.averages).toBeDefined();
      expect(stats?.peaks).toBeDefined();
    });

    it('should calculate average utilization', () => {
      const stats = service.getPoolStatistics();

      expect(stats?.averages.utilizationPercent).toBeGreaterThan(0);
    });

    it('should calculate peak utilization', () => {
      const stats = service.getPoolStatistics();

      expect(stats?.peaks.utilizationPercent).toBe(100);
    });

    it('should calculate average waiting requests', () => {
      const stats = service.getPoolStatistics();

      expect(stats?.averages.waitingRequests).toBeGreaterThanOrEqual(0);
    });

    it('should return alert counts', () => {
      const stats = service.getPoolStatistics();

      expect(stats?.alertCount).toBeDefined();
      expect(stats?.criticalAlertCount).toBeDefined();
    });

    it('should return null when no metrics', () => {
      service['metrics'] = [];
      const stats = service.getPoolStatistics();

      expect(stats).toBeNull();
    });
  });

  describe('History Management', () => {
    beforeEach(async () => {
      await service.collectMetrics();
      (mockSequelize as any).connectionManager.pool = createMockPool({
        used: 9,
        free: 1,
        pending: 0,
        max: 10,
      });
      await service.collectMetrics();
    });

    it('should clear history', () => {
      service.clearHistory();

      expect(service['metrics']).toEqual([]);
      expect(service['alerts']).toEqual([]);
    });

    it('should log when clearing history', () => {
      service.clearHistory();

      expect(mockLogger.info).toHaveBeenCalledWith('Pool monitor history cleared');
    });
  });

  describe('Edge Cases', () => {
    it('should handle pool with no max connections', async () => {
      (mockSequelize as any).connectionManager.pool = {
        used: [],
        free: [],
        pending: [],
        options: {},
      };

      const metrics = await service.collectMetrics();

      expect(metrics?.maxConnections).toBe(0);
      expect(metrics?.utilizationPercent).toBe(0);
    });

    it('should handle pool with undefined arrays', async () => {
      (mockSequelize as any).connectionManager.pool = {
        used: undefined,
        free: undefined,
        pending: undefined,
        options: { max: 10 },
      };

      const metrics = await service.collectMetrics();

      expect(metrics?.activeConnections).toBe(0);
      expect(metrics?.idleConnections).toBe(0);
      expect(metrics?.waitingRequests).toBe(0);
    });

    it('should handle exactly 80% utilization threshold', async () => {
      (mockSequelize as any).connectionManager.pool = createMockPool({
        used: 8,
        free: 2,
        pending: 0,
        max: 10,
      });

      await service.collectMetrics();

      const alerts = service.getAlerts();
      expect(alerts.some(a => a.type === 'high_utilization')).toBe(true);
    });

    it('should handle exactly 90% utilization threshold', async () => {
      (mockSequelize as any).connectionManager.pool = createMockPool({
        used: 9,
        free: 1,
        pending: 0,
        max: 10,
      });

      await service.collectMetrics();

      const alerts = service.getAlerts();
      expect(alerts.some(a => a.type === 'pool_exhaustion')).toBe(true);
    });

    it('should handle exactly 5 waiting requests', async () => {
      (mockSequelize as any).connectionManager.pool = createMockPool({
        used: 5,
        free: 5,
        pending: 5,
        max: 10,
      });

      await service.collectMetrics();

      const isHealthy = await service.checkPoolHealth();
      expect(isHealthy).toBe(true);
    });

    it('should handle 6 waiting requests (over threshold)', async () => {
      (mockSequelize as any).connectionManager.pool = createMockPool({
        used: 5,
        free: 5,
        pending: 6,
        max: 10,
      });

      await service.collectMetrics();

      const alerts = service.getAlerts();
      expect(alerts.some(a => a.type === 'connection_wait')).toBe(true);
    });

    it('should handle sequelize without connectionManager', async () => {
      (mockSequelize as any).connectionManager = undefined;

      const metrics = await service.collectMetrics();

      expect(metrics).toBeNull();
    });
  });
});
