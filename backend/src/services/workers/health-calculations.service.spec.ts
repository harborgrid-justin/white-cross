import { Test, TestingModule } from '@nestjs/testing';
import { HealthCalculationsService, BMIInput, VitalDataPoint } from './health-calculations.service';
import { WorkerPoolService } from './worker-pool.service';
import { LoggerService } from '../../common/logging/logger.service';

describe('HealthCalculationsService', () => {
  let service: HealthCalculationsService;
  let workerPool: jest.Mocked<WorkerPoolService>;
  let logger: jest.Mocked<LoggerService>;

  beforeEach(async () => {
    workerPool = {
      executeTask: jest.fn(),
      getStats: jest.fn(),
      onModuleInit: jest.fn(),
      shutdown: jest.fn(),
    } as unknown as jest.Mocked<WorkerPoolService>;

    logger = {
      info: jest.fn(),
      error: jest.fn(),
      warning: jest.fn(),
      debug: jest.fn(),
    } as unknown as jest.Mocked<LoggerService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthCalculationsService,
        { provide: LoggerService, useValue: logger },
      ],
    }).compile();

    service = module.get<HealthCalculationsService>(HealthCalculationsService);
    service['workerPool'] = workerPool;

    jest.clearAllMocks();
  });

  describe('calculateBMI', () => {
    it('should calculate BMI correctly', async () => {
      const height = 180;
      const weight = 75;
      const expectedBMI = 23.1;

      workerPool.executeTask.mockResolvedValue(expectedBMI);

      const result = await service.calculateBMI(height, weight);

      expect(workerPool.executeTask).toHaveBeenCalledWith('bmi', { height, weight });
      expect(result).toBe(expectedBMI);
    });

    it('should throw error when worker pool not initialized', async () => {
      service['workerPool'] = null;

      await expect(service.calculateBMI(180, 75)).rejects.toThrow(
        'Health calculations worker pool not initialized'
      );
    });
  });

  describe('batchCalculateBMI', () => {
    it('should calculate BMI for multiple records', async () => {
      const records: BMIInput[] = [
        { height: 180, weight: 75 },
        { height: 165, weight: 60 },
        { height: 175, weight: 70 },
      ];
      const expectedBMIs = [23.1, 22.0, 22.9];

      workerPool.executeTask.mockResolvedValue(expectedBMIs);

      const result = await service.batchCalculateBMI(records);

      expect(workerPool.executeTask).toHaveBeenCalledWith('bmi_batch', records);
      expect(result).toEqual(expectedBMIs);
    });

    it('should handle empty batch', async () => {
      workerPool.executeTask.mockResolvedValue([]);

      const result = await service.batchCalculateBMI([]);

      expect(result).toEqual([]);
    });
  });

  describe('analyzeVitalTrends', () => {
    it('should analyze increasing trend', async () => {
      const vitals: VitalDataPoint[] = [
        { date: new Date('2024-01-01'), value: 120 },
        { date: new Date('2024-01-15'), value: 125 },
        { date: new Date('2024-02-01'), value: 130 },
      ];

      const expectedAnalysis = {
        trend: 'increasing' as const,
        changeRate: 8.3,
        average: 125,
        min: 120,
        max: 130,
      };

      workerPool.executeTask.mockResolvedValue(expectedAnalysis);

      const result = await service.analyzeVitalTrends(vitals);

      expect(workerPool.executeTask).toHaveBeenCalledWith('vital_trends', vitals);
      expect(result).toEqual(expectedAnalysis);
    });

    it('should analyze decreasing trend', async () => {
      const vitals: VitalDataPoint[] = [
        { date: new Date('2024-01-01'), value: 130 },
        { date: new Date('2024-01-15'), value: 125 },
        { date: new Date('2024-02-01'), value: 120 },
      ];

      const expectedAnalysis = {
        trend: 'decreasing' as const,
        changeRate: -7.7,
        average: 125,
        min: 120,
        max: 130,
      };

      workerPool.executeTask.mockResolvedValue(expectedAnalysis);

      const result = await service.analyzeVitalTrends(vitals);

      expect(result.trend).toBe('decreasing');
    });

    it('should analyze stable trend', async () => {
      const vitals: VitalDataPoint[] = [
        { date: new Date('2024-01-01'), value: 120 },
        { date: new Date('2024-01-15'), value: 121 },
        { date: new Date('2024-02-01'), value: 120 },
      ];

      const expectedAnalysis = {
        trend: 'stable' as const,
        changeRate: 0.5,
        average: 120.3,
      };

      workerPool.executeTask.mockResolvedValue(expectedAnalysis);

      const result = await service.analyzeVitalTrends(vitals);

      expect(result.trend).toBe('stable');
    });
  });

  describe('calculateAggregations', () => {
    it('should calculate statistical aggregations', async () => {
      const values = [10, 20, 30, 40, 50];

      const expectedStats = {
        count: 5,
        sum: 150,
        average: 30,
        min: 10,
        max: 50,
        median: 30,
        stdDev: 14.14,
      };

      workerPool.executeTask.mockResolvedValue(expectedStats);

      const result = await service.calculateAggregations(values);

      expect(workerPool.executeTask).toHaveBeenCalledWith('aggregations', values);
      expect(result).toEqual(expectedStats);
    });

    it('should handle single value', async () => {
      const values = [42];

      const expectedStats = {
        count: 1,
        sum: 42,
        average: 42,
        min: 42,
        max: 42,
        median: 42,
        stdDev: 0,
      };

      workerPool.executeTask.mockResolvedValue(expectedStats);

      const result = await service.calculateAggregations(values);

      expect(result.stdDev).toBe(0);
    });
  });

  describe('getPoolStats', () => {
    it('should return worker pool statistics', () => {
      const stats = {
        poolSize: 4,
        activeWorkers: 2,
        idleWorkers: 2,
        queuedTasks: 5,
        totalTasksProcessed: 100,
        totalErrors: 1,
      };

      workerPool.getStats.mockReturnValue(stats);

      const result = service.getPoolStats();

      expect(result).toEqual(stats);
    });
  });

  describe('lifecycle hooks', () => {
    it('should initialize worker pool on module init', async () => {
      const newService = new HealthCalculationsService(logger);

      await newService.onModuleInit();

      expect(newService['workerPool']).toBeDefined();
    });

    it('should shutdown worker pool on module destroy', async () => {
      await service.onModuleDestroy();

      expect(workerPool.shutdown).toHaveBeenCalled();
      expect(service['workerPool']).toBeNull();
    });
  });
});
