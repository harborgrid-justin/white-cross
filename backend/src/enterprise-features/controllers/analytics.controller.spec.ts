import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsDashboardService } from '../analytics-dashboard.service';
import { DashboardMetricResponseDto } from '../dto';

describe('AnalyticsController', () => {
  let controller: AnalyticsController;
  let service: jest.Mocked<AnalyticsDashboardService>;

  const mockAnalyticsService = {
    getRealtimeMetrics: jest.fn(),
    getHealthTrends: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalyticsController],
      providers: [
        {
          provide: AnalyticsDashboardService,
          useValue: mockAnalyticsService,
        },
      ],
    }).compile();

    controller = module.get<AnalyticsController>(AnalyticsController);
    service = module.get(AnalyticsDashboardService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getRealtimeMetrics', () => {
    it('should retrieve realtime metrics successfully', async () => {
      const expectedMetrics: Partial<DashboardMetricResponseDto>[] = [
        {
          metricName: 'TOTAL_VISITS_TODAY',
          value: 145,
          unit: 'visits',
          trend: 'UP',
          percentageChange: 12.5,
        },
        {
          metricName: 'PENDING_INCIDENTS',
          value: 8,
          unit: 'incidents',
          trend: 'DOWN',
          percentageChange: -20,
        },
        {
          metricName: 'MEDICATION_ADMINISTERED',
          value: 32,
          unit: 'doses',
          trend: 'STABLE',
          percentageChange: 0,
        },
      ];

      mockAnalyticsService.getRealtimeMetrics.mockResolvedValue(expectedMetrics);

      const result = await controller.getRealtimeMetrics();

      expect(service.getRealtimeMetrics).toHaveBeenCalled();
      expect(result).toEqual(expectedMetrics);
      expect(result).toHaveLength(3);
    });

    it('should return empty array when no metrics available', async () => {
      mockAnalyticsService.getRealtimeMetrics.mockResolvedValue([]);

      const result = await controller.getRealtimeMetrics();

      expect(result).toEqual([]);
    });

    it('should handle service errors gracefully', async () => {
      mockAnalyticsService.getRealtimeMetrics.mockRejectedValue(
        new Error('Database connection failed'),
      );

      await expect(controller.getRealtimeMetrics()).rejects.toThrow(
        'Database connection failed',
      );
    });
  });

  describe('getHealthTrends', () => {
    it('should retrieve daily health trends', async () => {
      const period = 'day';
      const expectedTrends = {
        period: 'day',
        startDate: '2025-01-14T00:00:00.000Z',
        endDate: '2025-01-14T23:59:59.999Z',
        trends: [
          {
            category: 'INCIDENTS',
            data: [
              { hour: 8, count: 2 },
              { hour: 10, count: 5 },
              { hour: 14, count: 3 },
            ],
          },
          {
            category: 'MEDICATION',
            data: [
              { hour: 9, count: 10 },
              { hour: 12, count: 15 },
              { hour: 15, count: 7 },
            ],
          },
        ],
      };

      mockAnalyticsService.getHealthTrends.mockResolvedValue(expectedTrends);

      const result = await controller.getHealthTrends(period);

      expect(service.getHealthTrends).toHaveBeenCalledWith(period);
      expect(result).toEqual(expectedTrends);
      expect(result.period).toBe('day');
    });

    it('should retrieve weekly health trends', async () => {
      const period = 'week';
      const expectedTrends = {
        period: 'week',
        startDate: '2025-01-08T00:00:00.000Z',
        endDate: '2025-01-14T23:59:59.999Z',
        trends: [
          {
            category: 'INCIDENTS',
            data: [
              { day: 'MON', count: 12 },
              { day: 'TUE', count: 15 },
              { day: 'WED', count: 10 },
              { day: 'THU', count: 14 },
              { day: 'FRI', count: 18 },
            ],
          },
        ],
      };

      mockAnalyticsService.getHealthTrends.mockResolvedValue(expectedTrends);

      const result = await controller.getHealthTrends(period);

      expect(service.getHealthTrends).toHaveBeenCalledWith(period);
      expect(result.period).toBe('week');
    });

    it('should retrieve monthly health trends', async () => {
      const period = 'month';
      const expectedTrends = {
        period: 'month',
        startDate: '2025-01-01T00:00:00.000Z',
        endDate: '2025-01-31T23:59:59.999Z',
        trends: [
          {
            category: 'ALLERGY_REACTIONS',
            data: [
              { week: 1, count: 5 },
              { week: 2, count: 3 },
              { week: 3, count: 7 },
              { week: 4, count: 4 },
            ],
          },
        ],
      };

      mockAnalyticsService.getHealthTrends.mockResolvedValue(expectedTrends);

      const result = await controller.getHealthTrends(period);

      expect(service.getHealthTrends).toHaveBeenCalledWith(period);
      expect(result.period).toBe('month');
    });

    it('should handle empty trends', async () => {
      const period = 'day';
      const expectedTrends = {
        period: 'day',
        startDate: '2025-01-14T00:00:00.000Z',
        endDate: '2025-01-14T23:59:59.999Z',
        trends: [],
      };

      mockAnalyticsService.getHealthTrends.mockResolvedValue(expectedTrends);

      const result = await controller.getHealthTrends(period);

      expect(result.trends).toEqual([]);
    });

    it('should handle service errors', async () => {
      const period = 'week';

      mockAnalyticsService.getHealthTrends.mockRejectedValue(
        new Error('Failed to calculate trends'),
      );

      await expect(controller.getHealthTrends(period)).rejects.toThrow(
        'Failed to calculate trends',
      );
    });
  });
});
