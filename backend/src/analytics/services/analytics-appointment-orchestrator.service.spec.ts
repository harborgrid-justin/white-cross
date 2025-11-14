import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsAppointmentOrchestratorService } from './analytics-appointment-orchestrator.service';
import { GetAppointmentTrendsQueryDto, GetNoShowRateQueryDto } from '../dto/appointment-analytics.dto';

describe('AnalyticsAppointmentOrchestratorService', () => {
  let service: AnalyticsAppointmentOrchestratorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnalyticsAppointmentOrchestratorService],
    }).compile();

    service = module.get<AnalyticsAppointmentOrchestratorService>(
      AnalyticsAppointmentOrchestratorService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAppointmentTrends', () => {
    it('should return appointment trends with correct structure', async () => {
      const query: GetAppointmentTrendsQueryDto = {
        schoolId: 'school-123',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-03-31'),
        groupBy: 'MONTH',
      };

      const result = await service.getAppointmentTrends(query);

      expect(result).toHaveProperty('trends');
      expect(result).toHaveProperty('period');
      expect(result).toHaveProperty('filters');
      expect(result.trends.totalAppointments).toBeGreaterThan(0);
      expect(result.trends.completedAppointments).toBeDefined();
      expect(result.trends.noShowAppointments).toBeDefined();
    });

    it('should include completion rate in trends', async () => {
      const query: GetAppointmentTrendsQueryDto = {
        schoolId: 'school-456',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-03-31'),
      };

      const result = await service.getAppointmentTrends(query);

      expect(result.trends.completionRate).toBeDefined();
      expect(result.trends.completionRate).toBeGreaterThanOrEqual(0);
      expect(result.trends.completionRate).toBeLessThanOrEqual(100);
    });

    it('should include breakdown by type', async () => {
      const query: GetAppointmentTrendsQueryDto = {
        schoolId: 'school-123',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-03-31'),
      };

      const result = await service.getAppointmentTrends(query);

      expect(Array.isArray(result.trends.byType)).toBe(true);
      expect(result.trends.byType.length).toBeGreaterThan(0);
      expect(result.trends.byType[0]).toHaveProperty('type');
      expect(result.trends.byType[0]).toHaveProperty('count');
      expect(result.trends.byType[0]).toHaveProperty('completionRate');
    });

    it('should use default groupBy when not specified', async () => {
      const query: GetAppointmentTrendsQueryDto = {
        schoolId: 'school-123',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-03-31'),
      };

      const result = await service.getAppointmentTrends(query);

      expect(result.filters.groupBy).toBe('MONTH');
    });

    it('should handle errors gracefully', async () => {
      const query: GetAppointmentTrendsQueryDto = {
        schoolId: 'school-invalid',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-03-31'),
      };

      await expect(service.getAppointmentTrends(query)).resolves.toBeDefined();
    });
  });

  describe('getNoShowRate', () => {
    it('should return no-show analytics with correct structure', async () => {
      const query: GetNoShowRateQueryDto = {
        schoolId: 'school-123',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-03-31'),
      };

      const result = await service.getNoShowRate(query);

      expect(result).toHaveProperty('noShowAnalytics');
      expect(result).toHaveProperty('period');
      expect(result).toHaveProperty('filters');
      expect(result.noShowAnalytics.overallNoShowRate).toBeDefined();
    });

    it('should calculate no-show rate correctly', async () => {
      const query: GetNoShowRateQueryDto = {
        schoolId: 'school-123',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-03-31'),
      };

      const result = await service.getNoShowRate(query);

      const { totalScheduled, totalNoShows, overallNoShowRate } =
        result.noShowAnalytics;
      const expectedRate = (totalNoShows / totalScheduled) * 100;

      expect(Math.abs(overallNoShowRate - expectedRate)).toBeLessThan(0.1);
    });

    it('should compare with target when provided', async () => {
      const query: GetNoShowRateQueryDto = {
        schoolId: 'school-123',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-03-31'),
        compareWithTarget: 5.0,
      };

      const result = await service.getNoShowRate(query);

      expect(result.noShowAnalytics.targetRate).toBe(5.0);
      expect(result.noShowAnalytics.meetsTarget).toBeDefined();
    });

    it('should include reasons when requested', async () => {
      const query: GetNoShowRateQueryDto = {
        schoolId: 'school-123',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-03-31'),
        includeReasons: true,
      };

      const result = await service.getNoShowRate(query);

      expect(result.noShowAnalytics.reasons).not.toBeNull();
      expect(Array.isArray(result.noShowAnalytics.reasons)).toBe(true);
      if (result.noShowAnalytics.reasons) {
        expect(result.noShowAnalytics.reasons.length).toBeGreaterThan(0);
      }
    });

    it('should not include reasons when not requested', async () => {
      const query: GetNoShowRateQueryDto = {
        schoolId: 'school-123',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-03-31'),
        includeReasons: false,
      };

      const result = await service.getNoShowRate(query);

      expect(result.noShowAnalytics.reasons).toBeNull();
    });

    it('should include breakdown by appointment type', async () => {
      const query: GetNoShowRateQueryDto = {
        schoolId: 'school-123',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-03-31'),
      };

      const result = await service.getNoShowRate(query);

      expect(Array.isArray(result.noShowAnalytics.byType)).toBe(true);
      expect(result.noShowAnalytics.byType.length).toBeGreaterThan(0);
      expect(result.noShowAnalytics.byType[0]).toHaveProperty('type');
      expect(result.noShowAnalytics.byType[0]).toHaveProperty('noShowRate');
    });

    it('should include trend analysis', async () => {
      const query: GetNoShowRateQueryDto = {
        schoolId: 'school-123',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-03-31'),
      };

      const result = await service.getNoShowRate(query);

      expect(result.noShowAnalytics.trend).toBeDefined();
      expect(result.noShowAnalytics.trend.direction).toMatch(
        /INCREASING|DECREASING|STABLE/,
      );
      expect(result.noShowAnalytics.trend.changePercent).toBeDefined();
    });

    it('should handle errors gracefully', async () => {
      const query: GetNoShowRateQueryDto = {
        schoolId: 'school-error',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-03-31'),
      };

      await expect(service.getNoShowRate(query)).resolves.toBeDefined();
    });
  });
});
