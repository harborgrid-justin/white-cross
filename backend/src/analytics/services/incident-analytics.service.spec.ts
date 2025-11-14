import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { IncidentAnalyticsService } from './incident-analytics.service';
import { DateRangeService } from './date-range.service';
import { IncidentReport } from '@/database/models';
import { TimePeriod } from '../enums/time-period.enum';

describe('IncidentAnalyticsService', () => {
  let service: IncidentAnalyticsService;
  let incidentReportModel: typeof IncidentReport;
  let dateRangeService: DateRangeService;

  const mockIncidentReportModel = {
    findAll: jest.fn(),
  };

  const mockDateRangeService = {
    getDateRange: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IncidentAnalyticsService,
        {
          provide: getModelToken(IncidentReport),
          useValue: mockIncidentReportModel,
        },
        {
          provide: DateRangeService,
          useValue: mockDateRangeService,
        },
      ],
    }).compile();

    service = module.get<IncidentAnalyticsService>(IncidentAnalyticsService);
    incidentReportModel = module.get<typeof IncidentReport>(
      getModelToken(IncidentReport),
    );
    dateRangeService = module.get<DateRangeService>(DateRangeService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getIncidentAnalytics', () => {
    const schoolId = 'school-123';
    const mockDateRange = {
      start: new Date('2024-01-01'),
      end: new Date('2024-03-31'),
    };

    beforeEach(() => {
      mockDateRangeService.getDateRange.mockReturnValue(mockDateRange);
    });

    it('should analyze incidents by type', async () => {
      const mockIncidents: Partial<IncidentReport>[] = [
        {
          id: '1',
          type: 'Fall',
          location: 'Playground',
          occurredAt: new Date('2024-01-15T10:00:00'),
        } as IncidentReport,
        {
          id: '2',
          type: 'Fall',
          location: 'Cafeteria',
          occurredAt: new Date('2024-01-16T12:00:00'),
        } as IncidentReport,
        {
          id: '3',
          type: 'Collision',
          location: 'Gym',
          occurredAt: new Date('2024-01-17T14:00:00'),
        } as IncidentReport,
      ];

      mockIncidentReportModel.findAll.mockResolvedValue(mockIncidents);

      const result = await service.getIncidentAnalytics(
        schoolId,
        TimePeriod.LAST_90_DAYS,
      );

      expect(result.byType).toBeDefined();
      expect(result.byType.chartType).toBe('PIE');
      expect(result.byType.datasets[0].data.length).toBeGreaterThan(0);
      const fallData = result.byType.datasets[0].data.find(
        (d: { label: string; value: number }) => d.label === 'Fall',
      );
      expect(fallData?.value).toBe(2);
    });

    it('should analyze incidents by location', async () => {
      const mockIncidents: Partial<IncidentReport>[] = [
        {
          id: '1',
          type: 'Fall',
          location: 'Playground',
          occurredAt: new Date('2024-01-15T10:00:00'),
        } as IncidentReport,
        {
          id: '2',
          type: 'Injury',
          location: 'Playground',
          occurredAt: new Date('2024-01-16T11:00:00'),
        } as IncidentReport,
        {
          id: '3',
          type: 'Fall',
          location: 'Gym',
          occurredAt: new Date('2024-01-17T14:00:00'),
        } as IncidentReport,
      ];

      mockIncidentReportModel.findAll.mockResolvedValue(mockIncidents);

      const result = await service.getIncidentAnalytics(schoolId);

      expect(result.byLocation).toBeDefined();
      expect(result.byLocation.chartType).toBe('BAR');
      expect(result.byLocation.datasets[0].data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ label: 'Playground', value: 2 }),
        ]),
      );
    });

    it('should analyze incidents by time of day', async () => {
      const mockIncidents: Partial<IncidentReport>[] = [
        {
          id: '1',
          type: 'Fall',
          location: 'Playground',
          occurredAt: new Date('2024-01-15T10:00:00'),
        } as IncidentReport,
        {
          id: '2',
          type: 'Injury',
          location: 'Gym',
          occurredAt: new Date('2024-01-15T10:30:00'),
        } as IncidentReport,
        {
          id: '3',
          type: 'Fall',
          location: 'Cafeteria',
          occurredAt: new Date('2024-01-15T14:00:00'),
        } as IncidentReport,
      ];

      mockIncidentReportModel.findAll.mockResolvedValue(mockIncidents);

      const result = await service.getIncidentAnalytics(schoolId);

      expect(result.byTimeOfDay).toBeDefined();
      expect(result.byTimeOfDay.chartType).toBe('LINE');
      expect(result.byTimeOfDay.datasets[0].data.length).toBeGreaterThan(0);
    });

    it('should generate incident trends', async () => {
      const mockIncidents: Partial<IncidentReport>[] = [
        {
          id: '1',
          type: 'Fall',
          location: 'Playground',
          occurredAt: new Date('2024-01-15T10:00:00'),
        } as IncidentReport,
        {
          id: '2',
          type: 'Fall',
          location: 'Gym',
          occurredAt: new Date('2024-01-16T11:00:00'),
        } as IncidentReport,
      ];

      mockIncidentReportModel.findAll.mockResolvedValue(mockIncidents);

      const result = await service.getIncidentAnalytics(schoolId);

      expect(result.trends).toBeDefined();
      expect(Array.isArray(result.trends)).toBe(true);
      expect(result.trends.length).toBeGreaterThan(0);
      expect(result.trends[0]).toHaveProperty('incidentType');
      expect(result.trends[0]).toHaveProperty('count');
      expect(result.trends[0]).toHaveProperty('severity');
    });

    it('should handle empty incident data', async () => {
      mockIncidentReportModel.findAll.mockResolvedValue([]);

      const result = await service.getIncidentAnalytics(schoolId);

      expect(result.byType.datasets[0].data).toEqual([]);
      expect(result.trends).toEqual([]);
    });

    it('should handle null location values', async () => {
      const mockIncidents: Partial<IncidentReport>[] = [
        {
          id: '1',
          type: 'Fall',
          location: null,
          occurredAt: new Date('2024-01-15T10:00:00'),
        } as IncidentReport,
      ];

      mockIncidentReportModel.findAll.mockResolvedValue(mockIncidents);

      const result = await service.getIncidentAnalytics(schoolId);

      const unknownLocation = result.byLocation.datasets[0].data.find(
        (d: { label: string; value: number }) => d.label === 'Unknown',
      );
      expect(unknownLocation).toBeDefined();
    });

    it('should limit location results to top 10', async () => {
      const mockIncidents: Partial<IncidentReport>[] = Array(20)
        .fill(null)
        .map((_, i) => ({
          id: `${i}`,
          type: 'Fall',
          location: `Location ${i}`,
          occurredAt: new Date('2024-01-15T10:00:00'),
        } as IncidentReport));

      mockIncidentReportModel.findAll.mockResolvedValue(mockIncidents);

      const result = await service.getIncidentAnalytics(schoolId);

      expect(result.byLocation.datasets[0].data.length).toBeLessThanOrEqual(
        10,
      );
    });

    it('should handle errors gracefully', async () => {
      const error = new Error('Database error');
      mockIncidentReportModel.findAll.mockRejectedValue(error);

      await expect(
        service.getIncidentAnalytics(schoolId),
      ).rejects.toThrow('Database error');
    });
  });

  describe('assessIncidentSeverity', () => {
    it('should return SERIOUS for severe incidents', () => {
      expect(service.assessIncidentSeverity('Severe injury')).toBe('SERIOUS');
      expect(service.assessIncidentSeverity('Serious fall')).toBe('SERIOUS');
      expect(service.assessIncidentSeverity('Emergency response')).toBe(
        'SERIOUS',
      );
    });

    it('should return MODERATE for moderate incidents', () => {
      expect(service.assessIncidentSeverity('Moderate injury')).toBe(
        'MODERATE',
      );
      expect(service.assessIncidentSeverity('Minor injury')).toBe('MODERATE');
    });

    it('should return MINOR for other incidents', () => {
      expect(service.assessIncidentSeverity('Scrape')).toBe('MINOR');
      expect(service.assessIncidentSeverity('Bump')).toBe('MINOR');
    });

    it('should be case insensitive', () => {
      expect(service.assessIncidentSeverity('SEVERE INJURY')).toBe('SERIOUS');
      expect(service.assessIncidentSeverity('moderate injury')).toBe(
        'MODERATE',
      );
    });
  });

  describe('identifyHighRiskLocations', () => {
    const schoolId = 'school-123';
    const mockDateRange = {
      start: new Date('2024-01-01'),
      end: new Date('2024-03-31'),
    };

    beforeEach(() => {
      mockDateRangeService.getDateRange.mockReturnValue(mockDateRange);
    });

    it('should identify high-risk locations', async () => {
      const mockIncidents: Partial<IncidentReport>[] = Array(15)
        .fill(null)
        .map((_, i) => ({
          id: `${i}`,
          type: 'Fall',
          location: 'Playground',
          occurredAt: new Date('2024-01-15'),
        } as IncidentReport));

      mockIncidentReportModel.findAll.mockResolvedValue(mockIncidents);

      const result = await service.identifyHighRiskLocations(
        schoolId,
        TimePeriod.LAST_90_DAYS,
      );

      expect(result.length).toBeGreaterThan(0);
      expect(result[0].location).toBe('Playground');
      expect(result[0].incidentCount).toBe(15);
      expect(result[0].severity).toBe('HIGH');
    });

    it('should return medium severity for 6-10 incidents', async () => {
      const mockIncidents: Partial<IncidentReport>[] = Array(8)
        .fill(null)
        .map((_, i) => ({
          id: `${i}`,
          type: 'Fall',
          location: 'Cafeteria',
          occurredAt: new Date('2024-01-15'),
        } as IncidentReport));

      mockIncidentReportModel.findAll.mockResolvedValue(mockIncidents);

      const result = await service.identifyHighRiskLocations(
        schoolId,
        TimePeriod.LAST_90_DAYS,
      );

      expect(result[0].severity).toBe('MEDIUM');
    });

    it('should return low severity for fewer than 6 incidents', async () => {
      const mockIncidents: Partial<IncidentReport>[] = Array(3)
        .fill(null)
        .map((_, i) => ({
          id: `${i}`,
          type: 'Fall',
          location: 'Classroom',
          occurredAt: new Date('2024-01-15'),
        } as IncidentReport));

      mockIncidentReportModel.findAll.mockResolvedValue(mockIncidents);

      const result = await service.identifyHighRiskLocations(
        schoolId,
        TimePeriod.LAST_90_DAYS,
      );

      expect(result[0].severity).toBe('LOW');
    });

    it('should limit results to top 5 locations', async () => {
      const mockIncidents: Partial<IncidentReport>[] = Array(100)
        .fill(null)
        .map((_, i) => ({
          id: `${i}`,
          type: 'Fall',
          location: `Location ${i % 10}`,
          occurredAt: new Date('2024-01-15'),
        } as IncidentReport));

      mockIncidentReportModel.findAll.mockResolvedValue(mockIncidents);

      const result = await service.identifyHighRiskLocations(
        schoolId,
        TimePeriod.LAST_90_DAYS,
      );

      expect(result.length).toBeLessThanOrEqual(5);
    });

    it('should sort by incident count descending', async () => {
      const mockIncidents: Partial<IncidentReport>[] = [
        ...Array(5).fill({ location: 'Location A' }),
        ...Array(10).fill({ location: 'Location B' }),
        ...Array(3).fill({ location: 'Location C' }),
      ].map((data, i) => ({
        id: `${i}`,
        type: 'Fall',
        location: data.location,
        occurredAt: new Date('2024-01-15'),
      } as IncidentReport));

      mockIncidentReportModel.findAll.mockResolvedValue(mockIncidents);

      const result = await service.identifyHighRiskLocations(
        schoolId,
        TimePeriod.LAST_90_DAYS,
      );

      expect(result[0].location).toBe('Location B');
      expect(result[0].incidentCount).toBe(10);
    });
  });
});
