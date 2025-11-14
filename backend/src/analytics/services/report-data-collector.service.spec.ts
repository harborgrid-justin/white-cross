import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ReportDataCollectorService } from './report-data-collector.service';
import { Student, HealthRecord, MedicationLog, Appointment, IncidentReport, StudentMedication, Vaccination } from '@/database/models';
import { AnalyticsReportType, AnalyticsTimePeriod } from '../analytics-interfaces';

describe('ReportDataCollectorService', () => {
  let service: ReportDataCollectorService;
  let cacheManager: { get: jest.Mock; set: jest.Mock };

  const mockStudentModel = { findAll: jest.fn(), count: jest.fn() };
  const mockHealthRecordModel = { findAll: jest.fn(), count: jest.fn(), findOne: jest.fn() };
  const mockMedicationLogModel = { findAll: jest.fn(), count: jest.fn(), findOne: jest.fn() };
  const mockAppointmentModel = { findAll: jest.fn(), count: jest.fn() };
  const mockIncidentReportModel = { findAll: jest.fn(), count: jest.fn() };
  const mockStudentMedicationModel = { findAll: jest.fn(), count: jest.fn() };
  const mockVaccinationModel = { findAll: jest.fn(), count: jest.fn() };

  beforeEach(async () => {
    cacheManager = { get: jest.fn(), set: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportDataCollectorService,
        { provide: getModelToken(Student), useValue: mockStudentModel },
        { provide: getModelToken(HealthRecord), useValue: mockHealthRecordModel },
        { provide: getModelToken(MedicationLog), useValue: mockMedicationLogModel },
        { provide: getModelToken(Appointment), useValue: mockAppointmentModel },
        { provide: getModelToken(IncidentReport), useValue: mockIncidentReportModel },
        { provide: getModelToken(StudentMedication), useValue: mockStudentMedicationModel },
        { provide: getModelToken(Vaccination), useValue: mockVaccinationModel },
        { provide: CACHE_MANAGER, useValue: cacheManager },
      ],
    }).compile();

    service = module.get<ReportDataCollectorService>(ReportDataCollectorService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('collectReportData', () => {
    it('should collect health overview data', async () => {
      mockStudentModel.count.mockResolvedValue(100);
      mockHealthRecordModel.count.mockResolvedValue(250);
      mockStudentMedicationModel.count.mockResolvedValue(50);
      mockMedicationLogModel.count.mockResolvedValue(45);
      mockVaccinationModel.count.mockResolvedValue(800);
      mockIncidentReportModel.count.mockResolvedValue(15);
      mockAppointmentModel.count.mockResolvedValue(120);

      const result = await service.collectReportData(
        'school-123',
        AnalyticsReportType.HEALTH_OVERVIEW,
        AnalyticsTimePeriod.LAST_30_DAYS,
      );

      expect(result).toHaveProperty('totalStudents');
      expect(result).toHaveProperty('activeHealthRecords');
    });

    it('should throw error for unsupported report type', async () => {
      await expect(
        service.collectReportData('school-123', 'UNSUPPORTED_TYPE' as never, AnalyticsTimePeriod.LAST_30_DAYS),
      ).rejects.toThrow();
    });

    it('should handle errors gracefully', async () => {
      mockStudentModel.count.mockRejectedValue(new Error('DB error'));

      await expect(
        service.collectReportData('school-123', AnalyticsReportType.HEALTH_OVERVIEW, AnalyticsTimePeriod.LAST_30_DAYS),
      ).rejects.toThrow();
    });
  });

  describe('getDateRange', () => {
    it('should calculate correct date range for LAST_7_DAYS', () => {
      const result = service['getDateRange'](AnalyticsTimePeriod.LAST_7_DAYS);
      const daysDiff = Math.floor((result.end.getTime() - result.start.getTime()) / (1000 * 60 * 60 * 24));
      expect(daysDiff).toBe(7);
    });

    it('should calculate correct date range for LAST_30_DAYS', () => {
      const result = service['getDateRange'](AnalyticsTimePeriod.LAST_30_DAYS);
      const daysDiff = Math.floor((result.end.getTime() - result.start.getTime()) / (1000 * 60 * 60 * 24));
      expect(daysDiff).toBe(30);
    });

    it('should calculate correct date range for LAST_YEAR', () => {
      const result = service['getDateRange'](AnalyticsTimePeriod.LAST_YEAR);
      const yearsDiff = result.end.getFullYear() - result.start.getFullYear();
      expect(yearsDiff).toBe(1);
    });
  });

  describe('calculateOverallCompliance', () => {
    it('should calculate weighted compliance correctly', () => {
      const result = service['calculateOverallCompliance']({
        medicationAdherence: 90,
        immunizationCompliance: 95,
        appointmentCompletion: 85,
        incidentReporting: 92,
      });

      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThanOrEqual(100);
    });
  });

  describe('determineComplianceStatus', () => {
    it('should return EXCELLENT for high compliance', () => {
      const result = service['determineComplianceStatus'](96);
      expect(result).toBe('EXCELLENT');
    });

    it('should return GOOD for moderate compliance', () => {
      const result = service['determineComplianceStatus'](88);
      expect(result).toBe('GOOD');
    });

    it('should return NEEDS_IMPROVEMENT for low compliance', () => {
      const result = service['determineComplianceStatus'](75);
      expect(result).toBe('NEEDS_IMPROVEMENT');
    });

    it('should return CRITICAL for very low compliance', () => {
      const result = service['determineComplianceStatus'](65);
      expect(result).toBe('CRITICAL');
    });
  });
});
