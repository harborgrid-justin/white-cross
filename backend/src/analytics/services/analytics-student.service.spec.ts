import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { AnalyticsStudentService } from './analytics-student.service';
import { HealthRecord, Appointment, MedicationLog } from '@/database';
import { GetStudentHealthMetricsQueryDto } from '../dto/health-metrics.dto';

describe('AnalyticsStudentService', () => {
  let service: AnalyticsStudentService;

  const mockHealthRecordModel = {
    findAll: jest.fn(),
  };

  const mockAppointmentModel = {
    findAll: jest.fn(),
  };

  const mockMedicationLogModel = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsStudentService,
        { provide: getModelToken(HealthRecord), useValue: mockHealthRecordModel },
        { provide: getModelToken(Appointment), useValue: mockAppointmentModel },
        { provide: getModelToken(MedicationLog), useValue: mockMedicationLogModel },
      ],
    }).compile();

    service = module.get<AnalyticsStudentService>(AnalyticsStudentService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getStudentHealthMetrics', () => {
    const studentId = 'student-123';
    const mockQuery: GetStudentHealthMetricsQueryDto = {
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-03-31'),
    };

    it('should retrieve comprehensive student health metrics', async () => {
      mockHealthRecordModel.findAll.mockResolvedValue([
        { id: '1', recordType: 'ILLNESS', recordDate: new Date() },
      ]);
      mockMedicationLogModel.findAll.mockResolvedValue([
        { id: '1', status: 'ADMINISTERED', administeredAt: new Date() },
      ]);
      mockAppointmentModel.findAll.mockResolvedValue([
        { id: '1', status: 'COMPLETED', scheduledAt: new Date() },
      ]);

      const result = await service.getStudentHealthMetrics(studentId, mockQuery);

      expect(result.studentId).toBe(studentId);
      expect(result.trends).toBeDefined();
      expect(result.period).toBeDefined();
    });

    it('should calculate medication adherence correctly', async () => {
      mockHealthRecordModel.findAll.mockResolvedValue([]);
      mockMedicationLogModel.findAll.mockResolvedValue([
        { id: '1', status: 'ADMINISTERED' },
        { id: '2', status: 'ADMINISTERED' },
        { id: '3', status: 'MISSED' },
      ]);
      mockAppointmentModel.findAll.mockResolvedValue([]);

      const result = await service.getStudentHealthMetrics(studentId, mockQuery);

      expect(result.trends.medicationAdherence.rate).toBe(67);
      expect(result.trends.medicationAdherence.scheduled).toBe(3);
      expect(result.trends.medicationAdherence.administered).toBe(2);
    });

    it('should extract vital signs from health records', async () => {
      mockHealthRecordModel.findAll.mockResolvedValue([
        {
          id: '1',
          recordType: 'VITAL_SIGNS_CHECK',
          recordDate: new Date(),
          metadata: { vitalSigns: { temperature: 98.6, heartRate: 72 } },
        },
      ]);
      mockMedicationLogModel.findAll.mockResolvedValue([]);
      mockAppointmentModel.findAll.mockResolvedValue([]);

      const result = await service.getStudentHealthMetrics(studentId, mockQuery);

      expect(result.trends.vitalSigns.length).toBeGreaterThan(0);
      expect(result.trends.vitalSigns[0]).toHaveProperty('temperature');
    });

    it('should group health visits by type', async () => {
      mockHealthRecordModel.findAll.mockResolvedValue([
        { id: '1', recordType: 'ILLNESS' },
        { id: '2', recordType: 'ILLNESS' },
        { id: '3', recordType: 'INJURY' },
      ]);
      mockMedicationLogModel.findAll.mockResolvedValue([]);
      mockAppointmentModel.findAll.mockResolvedValue([]);

      const result = await service.getStudentHealthMetrics(studentId, mockQuery);

      expect(result.trends.healthVisitsByType.ILLNESS).toBe(2);
      expect(result.trends.healthVisitsByType.INJURY).toBe(1);
    });

    it('should handle errors gracefully', async () => {
      mockHealthRecordModel.findAll.mockRejectedValue(new Error('DB error'));

      await expect(
        service.getStudentHealthMetrics(studentId, mockQuery),
      ).rejects.toThrow();
    });
  });
});
