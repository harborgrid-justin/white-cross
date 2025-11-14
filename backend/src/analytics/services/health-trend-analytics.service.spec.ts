import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HealthTrendAnalyticsService } from './health-trend-analytics.service';
import { DateRangeService } from './date-range.service';
import { TrendCalculationService } from './trend-calculation.service';
import { ConditionAnalyticsService } from './condition-analytics.service';
import { HealthMetricsAnalyzerService } from './health-metrics-analyzer.service';
import { IncidentAnalyticsService } from './incident-analytics.service';
import { PredictiveInsightsService } from './predictive-insights.service';
import { Student, HealthRecord } from '@/database/models';
import { TimePeriod } from '../enums/time-period.enum';

describe('HealthTrendAnalyticsService', () => {
  let service: HealthTrendAnalyticsService;
  let studentModel: typeof Student;
  let healthRecordModel: typeof HealthRecord;
  let dateRangeService: DateRangeService;
  let conditionAnalyticsService: ConditionAnalyticsService;
  let healthMetricsAnalyzerService: HealthMetricsAnalyzerService;

  const mockCache = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  };

  const mockDateRangeService = {
    getDateRange: jest.fn(),
    generateDateRange: jest.fn(),
    getPeriodDays: jest.fn(),
  };

  const mockTrendCalculationService = {
    applyMovingAverage: jest.fn(),
  };

  const mockConditionAnalyticsService = {
    normalizeCondition: jest.fn(),
    getConditionColor: jest.fn(),
  };

  const mockHealthMetricsAnalyzerService = {
    getPopulationSummary: jest.fn(),
    getHealthMetrics: jest.fn(),
  };

  const mockIncidentAnalyticsService = {
    getIncidentAnalytics: jest.fn(),
  };

  const mockPredictiveInsightsService = {
    getPredictiveInsights: jest.fn(),
  };

  const mockStudentModel = {
    findAll: jest.fn(),
    count: jest.fn(),
  };

  const mockHealthRecordModel = {
    findAll: jest.fn(),
    count: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthTrendAnalyticsService,
        { provide: getModelToken(Student), useValue: mockStudentModel },
        { provide: getModelToken(HealthRecord), useValue: mockHealthRecordModel },
        { provide: CACHE_MANAGER, useValue: mockCache },
        { provide: DateRangeService, useValue: mockDateRangeService },
        { provide: TrendCalculationService, useValue: mockTrendCalculationService },
        { provide: ConditionAnalyticsService, useValue: mockConditionAnalyticsService },
        { provide: HealthMetricsAnalyzerService, useValue: mockHealthMetricsAnalyzerService },
        { provide: IncidentAnalyticsService, useValue: mockIncidentAnalyticsService },
        { provide: PredictiveInsightsService, useValue: mockPredictiveInsightsService },
      ],
    }).compile();

    service = module.get<HealthTrendAnalyticsService>(HealthTrendAnalyticsService);
    studentModel = module.get<typeof Student>(getModelToken(Student));
    healthRecordModel = module.get<typeof HealthRecord>(getModelToken(HealthRecord));
    dateRangeService = module.get<DateRangeService>(DateRangeService);
    conditionAnalyticsService = module.get<ConditionAnalyticsService>(ConditionAnalyticsService);
    healthMetricsAnalyzerService = module.get<HealthMetricsAnalyzerService>(HealthMetricsAnalyzerService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPopulationSummary', () => {
    it('should delegate to health metrics analyzer service', async () => {
      const schoolId = 'school-123';
      const period = TimePeriod.LAST_30_DAYS;
      const mockSummary = {
        totalStudents: 500,
        totalHealthVisits: 1200,
        immunizationComplianceRate: 94.5,
      };

      mockHealthMetricsAnalyzerService.getPopulationSummary.mockResolvedValue(mockSummary);

      const result = await service.getPopulationSummary(schoolId, period);

      expect(result).toEqual(mockSummary);
      expect(mockHealthMetricsAnalyzerService.getPopulationSummary).toHaveBeenCalledWith(
        schoolId,
        period,
        undefined,
      );
    });

    it('should pass custom range to health metrics analyzer', async () => {
      const schoolId = 'school-123';
      const customRange = {
        start: new Date('2024-01-01'),
        end: new Date('2024-03-31'),
      };

      mockHealthMetricsAnalyzerService.getPopulationSummary.mockResolvedValue({});

      await service.getPopulationSummary(schoolId, TimePeriod.CUSTOM, customRange);

      expect(mockHealthMetricsAnalyzerService.getPopulationSummary).toHaveBeenCalledWith(
        schoolId,
        TimePeriod.CUSTOM,
        customRange,
      );
    });
  });

  describe('getConditionTrends', () => {
    const schoolId = 'school-123';
    const mockDateRange = {
      start: new Date('2024-01-01'),
      end: new Date('2024-03-31'),
    };

    beforeEach(() => {
      mockDateRangeService.getDateRange.mockReturnValue(mockDateRange);
      mockDateRangeService.generateDateRange.mockReturnValue([
        new Date('2024-01-01'),
        new Date('2024-01-02'),
      ]);
      mockConditionAnalyticsService.normalizeCondition.mockImplementation((d: string) => d);
      mockConditionAnalyticsService.getConditionColor.mockReturnValue('#3B82F6');
      mockTrendCalculationService.applyMovingAverage.mockImplementation((data: unknown[]) => data);
    });

    it('should return condition trends chart data', async () => {
      const mockRecords: Partial<HealthRecord>[] = [
        {
          id: '1',
          diagnosis: 'Flu',
          recordDate: new Date('2024-01-15'),
        } as HealthRecord,
        {
          id: '2',
          diagnosis: 'Flu',
          recordDate: new Date('2024-01-16'),
        } as HealthRecord,
      ];

      mockHealthRecordModel.findAll.mockResolvedValue(mockRecords);

      const result = await service.getConditionTrends(schoolId);

      expect(result.chartType).toBe('LINE');
      expect(result.title).toBe('Health Condition Trends');
      expect(result.datasets).toBeDefined();
      expect(result.datasets.length).toBeGreaterThan(0);
    });

    it('should filter conditions when specified', async () => {
      const mockRecords: Partial<HealthRecord>[] = [
        { id: '1', diagnosis: 'Flu', recordDate: new Date('2024-01-15') } as HealthRecord,
        { id: '2', diagnosis: 'Cold', recordDate: new Date('2024-01-16') } as HealthRecord,
        { id: '3', diagnosis: 'Allergies', recordDate: new Date('2024-01-17') } as HealthRecord,
      ];

      mockHealthRecordModel.findAll.mockResolvedValue(mockRecords);
      mockConditionAnalyticsService.normalizeCondition.mockImplementation((d: string) => d);

      await service.getConditionTrends(schoolId, ['Flu']);

      expect(mockHealthRecordModel.findAll).toHaveBeenCalled();
    });

    it('should limit to top 5 conditions', async () => {
      const mockRecords: Partial<HealthRecord>[] = Array(100)
        .fill(null)
        .map((_, i) => ({
          id: `${i}`,
          diagnosis: `Condition ${i % 7}`,
          recordDate: new Date('2024-01-15'),
        } as HealthRecord));

      mockHealthRecordModel.findAll.mockResolvedValue(mockRecords);

      const result = await service.getConditionTrends(schoolId);

      expect(result.datasets.length).toBeLessThanOrEqual(5);
    });

    it('should apply 7-day moving average', async () => {
      const mockRecords: Partial<HealthRecord>[] = [
        { id: '1', diagnosis: 'Flu', recordDate: new Date('2024-01-15') } as HealthRecord,
      ];

      mockHealthRecordModel.findAll.mockResolvedValue(mockRecords);

      await service.getConditionTrends(schoolId);

      expect(mockTrendCalculationService.applyMovingAverage).toHaveBeenCalledWith(
        expect.any(Array),
        7,
      );
    });

    it('should skip records without diagnosis', async () => {
      const mockRecords: Partial<HealthRecord>[] = [
        { id: '1', diagnosis: null, recordDate: new Date('2024-01-15') } as HealthRecord,
        { id: '2', diagnosis: 'Flu', recordDate: new Date('2024-01-16') } as HealthRecord,
      ];

      mockHealthRecordModel.findAll.mockResolvedValue(mockRecords);

      await service.getConditionTrends(schoolId);

      expect(mockConditionAnalyticsService.normalizeCondition).toHaveBeenCalledTimes(1);
    });

    it('should handle errors gracefully', async () => {
      const error = new Error('Database error');
      mockHealthRecordModel.findAll.mockRejectedValue(error);

      await expect(service.getConditionTrends(schoolId)).rejects.toThrow('Database error');
    });
  });

  describe('getMedicationTrends', () => {
    it('should return medication trends chart', async () => {
      const result = await service.getMedicationTrends('school-123');

      expect(result.chartType).toBe('BAR');
      expect(result.title).toBe('Top Medications Administered');
      expect(result.datasets).toBeDefined();
      expect(result.datasets.length).toBe(1);
      expect(result.datasets[0].data.length).toBeGreaterThan(0);
    });

    it('should include period description', async () => {
      mockDateRangeService.getPeriodDays.mockReturnValue(30);

      const result = await service.getMedicationTrends('school-123', TimePeriod.LAST_30_DAYS);

      expect(result.description).toContain('30');
    });

    it('should handle errors gracefully', async () => {
      mockDateRangeService.getPeriodDays.mockImplementation(() => {
        throw new Error('Service error');
      });

      await expect(service.getMedicationTrends('school-123')).rejects.toThrow();
    });
  });

  describe('getIncidentAnalytics', () => {
    it('should delegate to incident analytics service', async () => {
      const schoolId = 'school-123';
      const mockAnalytics = {
        byType: {},
        byLocation: {},
        byTimeOfDay: {},
        trends: [],
      };

      mockIncidentAnalyticsService.getIncidentAnalytics.mockResolvedValue(mockAnalytics);

      const result = await service.getIncidentAnalytics(schoolId);

      expect(result).toEqual(mockAnalytics);
      expect(mockIncidentAnalyticsService.getIncidentAnalytics).toHaveBeenCalledWith(
        schoolId,
        TimePeriod.LAST_90_DAYS,
      );
    });
  });

  describe('getImmunizationDashboard', () => {
    it('should return immunization compliance dashboard', async () => {
      const result = await service.getImmunizationDashboard('school-123');

      expect(result.overallCompliance).toBeDefined();
      expect(result.byVaccine).toBeDefined();
      expect(result.byGradeLevel).toBeDefined();
      expect(result.upcomingDue).toBeDefined();
      expect(result.overdue).toBeDefined();
    });

    it('should structure vaccine compliance chart correctly', async () => {
      const result = await service.getImmunizationDashboard('school-123');

      expect(result.byVaccine.chartType).toBe('BAR');
      expect(result.byVaccine.datasets[0].data.length).toBeGreaterThan(0);
    });

    it('should handle errors gracefully', async () => {
      const spy = jest.spyOn(service as unknown as { logger: { error: jest.Mock } }, 'logger', 'get');
      spy.mockReturnValue({ error: jest.fn(), log: jest.fn(), warn: jest.fn(), debug: jest.fn() });

      const result = await service.getImmunizationDashboard('school-123');

      expect(result).toBeDefined();
    });
  });

  describe('getAbsenceCorrelation', () => {
    beforeEach(() => {
      mockDateRangeService.getDateRange.mockReturnValue({
        start: new Date('2024-01-01'),
        end: new Date('2024-01-31'),
      });
      mockDateRangeService.generateDateRange.mockReturnValue([
        new Date('2024-01-15'),
      ]);
    });

    it('should return absence correlation chart', async () => {
      const result = await service.getAbsenceCorrelation('school-123');

      expect(result.chartType).toBe('AREA');
      expect(result.title).toBe('Absence Rate vs Health Visits');
      expect(result.datasets).toBeDefined();
      expect(result.datasets.length).toBe(1);
    });

    it('should generate realistic correlation data', async () => {
      const result = await service.getAbsenceCorrelation('school-123');

      const dataPoint = result.datasets[0].data[0];
      expect(dataPoint.value).toBeGreaterThanOrEqual(0);
    });

    it('should handle errors gracefully', async () => {
      mockDateRangeService.getDateRange.mockImplementation(() => {
        throw new Error('Date error');
      });

      await expect(service.getAbsenceCorrelation('school-123')).rejects.toThrow();
    });
  });

  describe('getPredictiveInsights', () => {
    it('should delegate to predictive insights service', async () => {
      const schoolId = 'school-123';
      const mockInsights = [
        {
          insightType: 'OUTBREAK_RISK',
          severity: 'MEDIUM',
          title: 'Potential Outbreak',
          description: 'Cases trending up',
        },
      ];

      mockPredictiveInsightsService.getPredictiveInsights.mockResolvedValue(mockInsights);

      const result = await service.getPredictiveInsights(schoolId);

      expect(result).toEqual(mockInsights);
      expect(mockPredictiveInsightsService.getPredictiveInsights).toHaveBeenCalledWith(schoolId);
    });
  });

  describe('compareCohorts', () => {
    it('should compare health metrics across cohorts', async () => {
      const cohortDefinitions = [
        { name: 'Grade K-5', filter: { gradeLevel: { $lte: 5 } } },
        { name: 'Grade 6-12', filter: { gradeLevel: { $gte: 6 } } },
      ];

      mockStudentModel.findAll.mockResolvedValue([
        { id: '1' },
        { id: '2' },
      ]);
      mockHealthRecordModel.count.mockResolvedValue(10);

      const result = await service.compareCohorts('school-123', cohortDefinitions);

      expect(result.cohorts).toBeDefined();
      expect(result.cohorts.length).toBe(2);
      expect(result.cohorts[0].name).toBe('Grade K-5');
      expect(result.cohorts[0].metrics).toBeDefined();
    });

    it('should calculate average visits correctly', async () => {
      const cohortDefinitions = [
        { name: 'Test Cohort', filter: {} },
      ];

      mockStudentModel.findAll.mockResolvedValue([
        { id: '1' },
        { id: '2' },
      ]);
      mockHealthRecordModel.count.mockResolvedValue(10);

      const result = await service.compareCohorts('school-123', cohortDefinitions);

      const avgVisitsMetric = result.cohorts[0].metrics.find(
        (m: { metricName: string }) => m.metricName === 'Average Health Visits',
      );
      expect(avgVisitsMetric.value).toBe(5);
    });

    it('should handle empty cohorts', async () => {
      const cohortDefinitions = [
        { name: 'Empty Cohort', filter: {} },
      ];

      mockStudentModel.findAll.mockResolvedValue([]);
      mockHealthRecordModel.count.mockResolvedValue(0);

      const result = await service.compareCohorts('school-123', cohortDefinitions);

      expect(result.cohorts[0].metrics[0].value).toBe(0);
    });

    it('should handle errors gracefully', async () => {
      mockStudentModel.findAll.mockRejectedValue(new Error('DB error'));

      await expect(
        service.compareCohorts('school-123', []),
      ).rejects.toThrow();
    });
  });

  describe('getHealthMetrics', () => {
    it('should delegate to health metrics analyzer service', async () => {
      const mockMetrics = [
        {
          metricName: 'Health Visits',
          value: 1200,
          unit: 'visits',
          trend: 'INCREASING',
        },
      ];

      mockHealthMetricsAnalyzerService.getHealthMetrics.mockResolvedValue(mockMetrics);

      const result = await service.getHealthMetrics('school-123', TimePeriod.LAST_30_DAYS);

      expect(result).toEqual(mockMetrics);
      expect(mockHealthMetricsAnalyzerService.getHealthMetrics).toHaveBeenCalledWith(
        'school-123',
        TimePeriod.LAST_30_DAYS,
      );
    });
  });
});
