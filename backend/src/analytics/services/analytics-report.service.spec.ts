import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { AnalyticsReportService } from './analytics-report.service';
import { ComplianceReportGeneratorService } from './compliance-report-generator.service';
import { HealthTrendAnalyticsService } from './health-trend-analytics.service';
import { TimePeriod } from '../enums/time-period.enum';
import { AnalyticsGenerateCustomReportDto } from '../dto/custom-reports.dto';
import { GetReportQueryDto } from '../dto/report-generation.dto';

describe('AnalyticsReportService', () => {
  let service: AnalyticsReportService;
  let healthTrendService: HealthTrendAnalyticsService;
  let reportGeneratorService: ComplianceReportGeneratorService;

  const mockHealthTrendService = {
    getPopulationSummary: jest.fn(),
  };

  const mockReportGeneratorService = {
    generateImmunizationReport: jest.fn(),
    generateControlledSubstanceReport: jest.fn(),
    generateScreeningReport: jest.fn(),
    getReport: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsReportService,
        {
          provide: HealthTrendAnalyticsService,
          useValue: mockHealthTrendService,
        },
        {
          provide: ComplianceReportGeneratorService,
          useValue: mockReportGeneratorService,
        },
      ],
    }).compile();

    service = module.get<AnalyticsReportService>(AnalyticsReportService);
    healthTrendService = module.get<HealthTrendAnalyticsService>(
      HealthTrendAnalyticsService,
    );
    reportGeneratorService = module.get<ComplianceReportGeneratorService>(
      ComplianceReportGeneratorService,
    );

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateCustomReport', () => {
    const userId = 'user-123';
    const startDate = new Date('2024-01-01');
    const endDate = new Date('2024-03-31');

    it('should generate immunization report', async () => {
      const dto: AnalyticsGenerateCustomReportDto = {
        reportName: 'Immunization Report',
        reportType: 'IMMUNIZATION_REPORT',
        startDate,
        endDate,
        format: 'PDF',
        filters: { schoolId: 'school-123' },
      };

      const mockReport = {
        id: 'RPT-123',
        reportType: 'IMMUNIZATION_REPORT',
        generatedDate: new Date(),
        format: 'PDF',
        status: 'COMPLETED',
        fileUrl: '/reports/RPT-123.pdf',
      };

      mockReportGeneratorService.generateImmunizationReport.mockResolvedValue(
        mockReport,
      );

      const result = await service.generateCustomReport(dto, userId);

      expect(result.report.id).toBe('RPT-123');
      expect(result.report.name).toBe('Immunization Report');
      expect(result.report.type).toBe('IMMUNIZATION_REPORT');
      expect(result.report.format).toBe('PDF');
      expect(result.report.status).toBe('COMPLETED');
      expect(mockReportGeneratorService.generateImmunizationReport).toHaveBeenCalledWith(
        {
          schoolId: 'school-123',
          periodStart: startDate,
          periodEnd: endDate,
          format: 'PDF',
          generatedBy: userId,
        },
      );
    });

    it('should generate compliance status report', async () => {
      const dto: AnalyticsGenerateCustomReportDto = {
        reportName: 'Compliance Report',
        reportType: 'COMPLIANCE_STATUS',
        startDate,
        endDate,
        format: 'CSV',
        filters: { schoolId: 'school-456' },
      };

      const mockReport = {
        id: 'RPT-456',
        reportType: 'COMPLIANCE_STATUS',
        generatedDate: new Date(),
        format: 'CSV',
        status: 'COMPLETED',
        fileUrl: '/reports/RPT-456.csv',
      };

      mockReportGeneratorService.generateControlledSubstanceReport.mockResolvedValue(
        mockReport,
      );

      const result = await service.generateCustomReport(dto, userId);

      expect(result.report.id).toBe('RPT-456');
      expect(result.report.format).toBe('CSV');
      expect(mockReportGeneratorService.generateControlledSubstanceReport).toHaveBeenCalled();
    });

    it('should generate student health summary report', async () => {
      const dto: AnalyticsGenerateCustomReportDto = {
        reportName: 'Student Health Summary',
        reportType: 'STUDENT_HEALTH_SUMMARY',
        startDate,
        endDate,
        format: 'JSON',
        filters: { schoolId: 'school-789' },
      };

      const mockReport = {
        id: 'RPT-789',
        reportType: 'STUDENT_HEALTH_SUMMARY',
        generatedDate: new Date(),
        format: 'JSON',
        status: 'COMPLETED',
        fileUrl: '/reports/RPT-789.json',
      };

      mockReportGeneratorService.generateScreeningReport.mockResolvedValue(
        mockReport,
      );

      const result = await service.generateCustomReport(dto, userId);

      expect(result.report.id).toBe('RPT-789');
      expect(result.report.format).toBe('JSON');
      expect(mockReportGeneratorService.generateScreeningReport).toHaveBeenCalled();
    });

    it('should generate generic health metrics report for unknown type', async () => {
      const dto: AnalyticsGenerateCustomReportDto = {
        reportName: 'Custom Report',
        reportType: 'CUSTOM_HEALTH_METRICS',
        startDate,
        endDate,
        filters: { schoolId: 'school-999' },
      };

      const mockSummary = {
        totalStudents: 500,
        totalHealthVisits: 1200,
        averageVisitsPerStudent: 2.4,
      };

      mockHealthTrendService.getPopulationSummary.mockResolvedValue(
        mockSummary,
      );

      const result = await service.generateCustomReport(dto, userId);

      expect(result.report.name).toBe('Custom Report');
      expect(result.report.type).toBe('CUSTOM_HEALTH_METRICS');
      expect(result.report.format).toBe('JSON');
      expect(mockHealthTrendService.getPopulationSummary).toHaveBeenCalledWith(
        'school-999',
        TimePeriod.CUSTOM,
        { start: startDate, end: endDate },
      );
    });

    it('should use default format JSON when not specified', async () => {
      const dto: AnalyticsGenerateCustomReportDto = {
        reportName: 'Default Format Report',
        reportType: 'CUSTOM_TYPE',
        startDate,
        endDate,
        filters: { schoolId: 'school-000' },
      };

      mockHealthTrendService.getPopulationSummary.mockResolvedValue({});

      const result = await service.generateCustomReport(dto, userId);

      expect(result.report.format).toBe('JSON');
    });

    it('should include recipients if provided', async () => {
      const dto: AnalyticsGenerateCustomReportDto = {
        reportName: 'Report with Recipients',
        reportType: 'CUSTOM_TYPE',
        startDate,
        endDate,
        recipients: ['admin@school.com', 'nurse@school.com'],
      };

      mockHealthTrendService.getPopulationSummary.mockResolvedValue({});

      const result = await service.generateCustomReport(dto, userId);

      expect(result.report.recipients).toEqual([
        'admin@school.com',
        'nurse@school.com',
      ]);
    });

    it('should include schedule if provided', async () => {
      const dto: AnalyticsGenerateCustomReportDto = {
        reportName: 'Scheduled Report',
        reportType: 'CUSTOM_TYPE',
        startDate,
        endDate,
        schedule: 'WEEKLY',
      };

      mockHealthTrendService.getPopulationSummary.mockResolvedValue({});

      const result = await service.generateCustomReport(dto, userId);

      expect(result.report.schedule).toBe('WEEKLY');
    });

    it('should handle errors during report generation', async () => {
      const dto: AnalyticsGenerateCustomReportDto = {
        reportName: 'Error Report',
        reportType: 'IMMUNIZATION_REPORT',
        startDate,
        endDate,
      };

      const error = new Error('Report generation failed');
      mockReportGeneratorService.generateImmunizationReport.mockRejectedValue(
        error,
      );

      await expect(
        service.generateCustomReport(dto, userId),
      ).rejects.toThrow('Report generation failed');
    });

    it('should use default schoolId when not provided in filters', async () => {
      const dto: AnalyticsGenerateCustomReportDto = {
        reportName: 'No School Report',
        reportType: 'CUSTOM_TYPE',
        startDate,
        endDate,
      };

      mockHealthTrendService.getPopulationSummary.mockResolvedValue({});

      await service.generateCustomReport(dto, userId);

      expect(mockHealthTrendService.getPopulationSummary).toHaveBeenCalledWith(
        'default-school',
        TimePeriod.CUSTOM,
        { start: startDate, end: endDate },
      );
    });
  });

  describe('getGeneratedReport', () => {
    const reportId = 'RPT-123';

    it('should return full report when includeData is true', async () => {
      const query: GetReportQueryDto = {
        includeData: true,
      };

      const mockReport = {
        id: reportId,
        title: 'Test Report',
        reportType: 'IMMUNIZATION_REPORT',
        generatedDate: new Date(),
        status: 'COMPLETED',
        format: 'PDF',
        fileUrl: '/reports/RPT-123.pdf',
        data: { summary: 'test data' },
      };

      mockReportGeneratorService.getReport.mockResolvedValue(mockReport);

      const result = await service.getGeneratedReport(reportId, query);

      expect(result.report).toEqual(mockReport);
      expect(mockReportGeneratorService.getReport).toHaveBeenCalledWith(
        reportId,
      );
    });

    it('should return metadata only when includeData is false', async () => {
      const query: GetReportQueryDto = {
        includeData: false,
      };

      const mockReport = {
        id: reportId,
        title: 'Test Report',
        reportType: 'IMMUNIZATION_REPORT',
        generatedDate: new Date(),
        status: 'COMPLETED',
        format: 'PDF',
        fileUrl: '/reports/RPT-123.pdf',
        data: { summary: 'should not be included' },
      };

      mockReportGeneratorService.getReport.mockResolvedValue(mockReport);

      const result = await service.getGeneratedReport(reportId, query);

      expect(result.report).toEqual({
        id: reportId,
        title: 'Test Report',
        reportType: 'IMMUNIZATION_REPORT',
        generatedDate: mockReport.generatedDate,
        status: 'COMPLETED',
        format: 'PDF',
        fileUrl: '/reports/RPT-123.pdf',
      });
      expect(result.report).not.toHaveProperty('data');
    });

    it('should throw NotFoundException when report not found', async () => {
      const query: GetReportQueryDto = {
        includeData: true,
      };

      mockReportGeneratorService.getReport.mockResolvedValue(null);

      await expect(
        service.getGeneratedReport('non-existent', query),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.getGeneratedReport('non-existent', query),
      ).rejects.toThrow('Report not found');
    });

    it('should handle errors during report retrieval', async () => {
      const query: GetReportQueryDto = {
        includeData: true,
      };

      const error = new Error('Database error');
      mockReportGeneratorService.getReport.mockRejectedValue(error);

      await expect(
        service.getGeneratedReport(reportId, query),
      ).rejects.toThrow('Database error');
    });

    it('should default to including data when includeData not specified', async () => {
      const query: GetReportQueryDto = {};

      const mockReport = {
        id: reportId,
        title: 'Test Report',
        reportType: 'IMMUNIZATION_REPORT',
        generatedDate: new Date(),
        status: 'COMPLETED',
        format: 'PDF',
        fileUrl: '/reports/RPT-123.pdf',
      };

      mockReportGeneratorService.getReport.mockResolvedValue(mockReport);

      const result = await service.getGeneratedReport(reportId, query);

      expect(result.report).toEqual(mockReport);
    });
  });
});
