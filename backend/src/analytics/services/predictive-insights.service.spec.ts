import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { PredictiveInsightsService } from './predictive-insights.service';
import { DateRangeService } from './date-range.service';
import { TrendCalculationService } from './trend-calculation.service';
import { HealthRecord } from '@/database/models';
import { TimePeriod } from '../enums/time-period.enum';
import { PredictiveInsight } from '../interfaces/health-analytics.interfaces';

describe('PredictiveInsightsService', () => {
  let service: PredictiveInsightsService;
  let healthRecordModel: typeof HealthRecord;
  let dateRangeService: DateRangeService;
  let trendCalculationService: TrendCalculationService;

  const mockHealthRecordModel = {
    findAll: jest.fn(),
  };

  const mockDateRangeService = {
    getDateRange: jest.fn(),
  };

  const mockTrendCalculationService = {
    aggregateByWeek: jest.fn(),
    calculateExponentialMovingAverage: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PredictiveInsightsService,
        {
          provide: getModelToken(HealthRecord),
          useValue: mockHealthRecordModel,
        },
        {
          provide: DateRangeService,
          useValue: mockDateRangeService,
        },
        {
          provide: TrendCalculationService,
          useValue: mockTrendCalculationService,
        },
      ],
    }).compile();

    service = module.get<PredictiveInsightsService>(PredictiveInsightsService);
    healthRecordModel = module.get<typeof HealthRecord>(
      getModelToken(HealthRecord),
    );
    dateRangeService = module.get<DateRangeService>(DateRangeService);
    trendCalculationService = module.get<TrendCalculationService>(
      TrendCalculationService,
    );

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPredictiveInsights', () => {
    const schoolId = 'school-123';
    const mockDateRange = {
      start: new Date('2024-01-01'),
      end: new Date('2024-03-31'),
    };

    beforeEach(() => {
      mockDateRangeService.getDateRange.mockReturnValue(mockDateRange);
    });

    it('should return empty insights when no patterns detected', async () => {
      const mockRecords: Partial<HealthRecord>[] = [
        {
          id: '1',
          recordType: 'ILLNESS',
          recordDate: new Date('2024-01-15'),
        } as HealthRecord,
      ];

      mockHealthRecordModel.findAll.mockResolvedValue(mockRecords);
      mockTrendCalculationService.aggregateByWeek.mockReturnValue([5]);
      mockTrendCalculationService.calculateExponentialMovingAverage.mockReturnValue([5]);

      const result = await service.getPredictiveInsights(schoolId);

      expect(result).toEqual([]);
      expect(mockDateRangeService.getDateRange).toHaveBeenCalledWith(
        TimePeriod.LAST_90_DAYS,
      );
      expect(mockHealthRecordModel.findAll).toHaveBeenCalled();
    });

    it('should detect outbreak risk when illness cases trending upward', async () => {
      const mockRecords: Partial<HealthRecord>[] = Array(30)
        .fill(null)
        .map((_, i) => ({
          id: `${i}`,
          recordType: 'ILLNESS',
          recordDate: new Date('2024-01-01'),
          diagnosis: 'Flu',
        } as HealthRecord));

      mockHealthRecordModel.findAll.mockResolvedValue(mockRecords);
      mockTrendCalculationService.aggregateByWeek.mockReturnValue([10, 15, 20]);
      mockTrendCalculationService.calculateExponentialMovingAverage.mockReturnValue([
        10, 15, 20,
      ]);

      const result = await service.getPredictiveInsights(schoolId);

      expect(result.length).toBeGreaterThan(0);
      const outbreakInsight = result.find(
        (i) => i.insightType === 'OUTBREAK_RISK',
      );
      expect(outbreakInsight).toBeDefined();
      expect(outbreakInsight?.severity).toMatch(/HIGH|MEDIUM/);
      expect(outbreakInsight?.recommendations).toBeDefined();
      expect(outbreakInsight?.recommendations.length).toBeGreaterThan(0);
    });

    it('should detect high severity when trend increase exceeds 50%', async () => {
      const mockRecords: Partial<HealthRecord>[] = Array(30)
        .fill(null)
        .map((_, i) => ({
          id: `${i}`,
          recordType: 'ILLNESS',
          recordDate: new Date('2024-01-01'),
        } as HealthRecord));

      mockHealthRecordModel.findAll.mockResolvedValue(mockRecords);
      mockTrendCalculationService.aggregateByWeek.mockReturnValue([10, 20]);
      mockTrendCalculationService.calculateExponentialMovingAverage.mockReturnValue([
        10, 20,
      ]);

      const result = await service.getPredictiveInsights(schoolId);

      const outbreakInsight = result.find(
        (i) => i.insightType === 'OUTBREAK_RISK',
      );
      expect(outbreakInsight?.severity).toBe('HIGH');
    });

    it('should detect stock shortage risk when medication records exceed threshold', async () => {
      const mockRecords: Partial<HealthRecord>[] = Array(150)
        .fill(null)
        .map((_, i) => ({
          id: `${i}`,
          recordType: 'MEDICATION_REVIEW',
          recordDate: new Date('2024-01-01'),
          treatment: 'medication administered',
        } as HealthRecord));

      mockHealthRecordModel.findAll.mockResolvedValue(mockRecords);
      mockTrendCalculationService.aggregateByWeek.mockReturnValue([]);

      const result = await service.getPredictiveInsights(schoolId);

      const stockInsight = result.find(
        (i) => i.insightType === 'STOCK_SHORTAGE',
      );
      expect(stockInsight).toBeDefined();
      expect(stockInsight?.severity).toBe('MEDIUM');
      expect(stockInsight?.recommendations).toContain(
        'Review medication inventory levels',
      );
    });

    it('should not detect stock shortage when medication records below threshold', async () => {
      const mockRecords: Partial<HealthRecord>[] = Array(50)
        .fill(null)
        .map((_, i) => ({
          id: `${i}`,
          recordType: 'MEDICATION_REVIEW',
          recordDate: new Date('2024-01-01'),
        } as HealthRecord));

      mockHealthRecordModel.findAll.mockResolvedValue(mockRecords);
      mockTrendCalculationService.aggregateByWeek.mockReturnValue([]);

      const result = await service.getPredictiveInsights(schoolId);

      const stockInsight = result.find(
        (i) => i.insightType === 'STOCK_SHORTAGE',
      );
      expect(stockInsight).toBeUndefined();
    });

    it('should handle errors gracefully', async () => {
      const error = new Error('Database error');
      mockHealthRecordModel.findAll.mockRejectedValue(error);

      await expect(service.getPredictiveInsights(schoolId)).rejects.toThrow(
        'Database error',
      );
    });

    it('should filter medication records correctly', async () => {
      const mockRecords: Partial<HealthRecord>[] = [
        {
          id: '1',
          recordType: 'MEDICATION_REVIEW',
          treatment: 'medication',
        } as HealthRecord,
        {
          id: '2',
          recordType: 'ILLNESS',
          treatment: 'medication',
        } as HealthRecord,
        {
          id: '3',
          recordType: 'SCREENING',
          treatment: 'checkup',
        } as HealthRecord,
      ];

      mockHealthRecordModel.findAll.mockResolvedValue(mockRecords);
      mockTrendCalculationService.aggregateByWeek.mockReturnValue([]);

      await service.getPredictiveInsights(schoolId);

      expect(mockHealthRecordModel.findAll).toHaveBeenCalled();
    });
  });

  describe('analyzeSeasonalTrend', () => {
    it('should identify flu season correctly', () => {
      const mockRecords: HealthRecord[] = [];

      // December (month 11)
      const decemberResult = service.analyzeSeasonalTrend(mockRecords, 11);
      expect(decemberResult.isPeakSeason).toBe(true);
      expect(decemberResult.expectedIncrease).toBe(35);

      // January (month 0)
      const januaryResult = service.analyzeSeasonalTrend(mockRecords, 0);
      expect(januaryResult.isPeakSeason).toBe(true);
      expect(januaryResult.expectedIncrease).toBe(35);
    });

    it('should identify allergy season correctly', () => {
      const mockRecords: HealthRecord[] = [];

      // April (month 3)
      const aprilResult = service.analyzeSeasonalTrend(mockRecords, 3);
      expect(aprilResult.isPeakSeason).toBe(true);
      expect(aprilResult.expectedIncrease).toBe(25);

      // September (month 8)
      const septemberResult = service.analyzeSeasonalTrend(mockRecords, 8);
      expect(septemberResult.isPeakSeason).toBe(true);
      expect(septemberResult.expectedIncrease).toBe(25);
    });

    it('should return no increase for non-peak months', () => {
      const mockRecords: HealthRecord[] = [];

      // July (month 6)
      const julyResult = service.analyzeSeasonalTrend(mockRecords, 6);
      expect(julyResult.isPeakSeason).toBe(false);
      expect(julyResult.expectedIncrease).toBe(0);
    });

    it('should prioritize flu season over allergy season', () => {
      const mockRecords: HealthRecord[] = [];

      // March (both flu and allergy season)
      const marchResult = service.analyzeSeasonalTrend(mockRecords, 2);
      expect(marchResult.expectedIncrease).toBe(35);
    });
  });

  describe('calculateConditionRiskScore', () => {
    it('should calculate risk score correctly for normal deviation', () => {
      const score = service.calculateConditionRiskScore(100, 100, 0);
      expect(score).toBe(50);
    });

    it('should calculate higher risk for significant deviation', () => {
      const score = service.calculateConditionRiskScore(200, 100, 20);
      expect(score).toBeGreaterThan(50);
    });

    it('should cap risk score at 100', () => {
      const score = service.calculateConditionRiskScore(1000, 10, 500);
      expect(score).toBe(100);
    });

    it('should handle zero historical average', () => {
      const score = service.calculateConditionRiskScore(50, 1, 0);
      expect(score).toBeGreaterThan(0);
    });

    it('should calculate low risk for below-average counts', () => {
      const score = service.calculateConditionRiskScore(50, 100, 0);
      expect(score).toBeLessThan(50);
    });

    it('should factor in growth rate correctly', () => {
      const scoreNoGrowth = service.calculateConditionRiskScore(100, 100, 0);
      const scoreWithGrowth = service.calculateConditionRiskScore(100, 100, 50);
      expect(scoreWithGrowth).toBeGreaterThan(scoreNoGrowth);
    });

    it('should handle negative growth rate', () => {
      const score = service.calculateConditionRiskScore(100, 100, -20);
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThan(50);
    });
  });

  describe('edge cases', () => {
    it('should handle empty health records', async () => {
      mockDateRangeService.getDateRange.mockReturnValue({
        start: new Date('2024-01-01'),
        end: new Date('2024-03-31'),
      });
      mockHealthRecordModel.findAll.mockResolvedValue([]);
      mockTrendCalculationService.aggregateByWeek.mockReturnValue([]);

      const result = await service.getPredictiveInsights('school-123');

      expect(result).toEqual([]);
    });

    it('should handle insufficient trend data', async () => {
      const mockRecords: Partial<HealthRecord>[] = [
        {
          id: '1',
          recordType: 'ILLNESS',
          recordDate: new Date('2024-01-01'),
        } as HealthRecord,
      ];

      mockDateRangeService.getDateRange.mockReturnValue({
        start: new Date('2024-01-01'),
        end: new Date('2024-03-31'),
      });
      mockHealthRecordModel.findAll.mockResolvedValue(mockRecords);
      mockTrendCalculationService.aggregateByWeek.mockReturnValue([10]);
      mockTrendCalculationService.calculateExponentialMovingAverage.mockReturnValue([10]);

      const result = await service.getPredictiveInsights('school-123');

      expect(result).toEqual([]);
    });
  });
});
