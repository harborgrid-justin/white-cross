import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { VitalsService } from './vitals.service';
import { LoggerService } from '@/common/logging/logger.service';
import { VitalSigns } from '@/database/models';
import { Student } from '@/database/models';

describe('VitalsService', () => {
  let service: VitalsService;
  let vitalSignsModel: jest.Mocked<typeof VitalSigns>;
  let studentModel: jest.Mocked<typeof Student>;

  const mockVitalSignsModel = {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
  };

  const mockStudentModel = {
    findByPk: jest.fn(),
  };

  const mockLogger = {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VitalsService,
        { provide: LoggerService, useValue: mockLogger },
        { provide: 'VitalSignsRepository', useValue: mockVitalSignsModel },
        { provide: 'StudentRepository', useValue: mockStudentModel },
      ],
    }).compile();

    service = module.get<VitalsService>(VitalsService);
    vitalSignsModel = mockVitalSignsModel as never;
    studentModel = mockStudentModel as never;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('recordVitals', () => {
    it('should record vitals with BMI calculation', async () => {
      const data = {
        studentId: '123',
        height: 170,
        heightUnit: 'cm',
        weight: 70,
        weightUnit: 'kg',
        temperature: 98.6,
      };
      mockStudentModel.findByPk.mockResolvedValue({ id: '123' } as never);
      mockVitalSignsModel.create.mockResolvedValue({ id: 'v1', bmi: 24.22 } as never);

      const result = await service.recordVitals(data);

      expect(studentModel.findByPk).toHaveBeenCalledWith('123');
      expect(result.bmi).toBeDefined();
    });

    it('should throw BadRequestException for nonexistent student', async () => {
      const data = { studentId: 'invalid' };
      mockStudentModel.findByPk.mockResolvedValue(null);

      await expect(service.recordVitals(data)).rejects.toThrow(BadRequestException);
    });

    it('should detect abnormal vitals', async () => {
      const data = {
        studentId: '123',
        temperature: 102,
        temperatureUnit: 'F',
        bloodPressureSystolic: 150,
        bloodPressureDiastolic: 95,
      };
      mockStudentModel.findByPk.mockResolvedValue({ id: '123' } as never);
      mockVitalSignsModel.create.mockResolvedValue({
        id: 'v1',
        isAbnormal: true,
        abnormalFlags: ['ABNORMAL_TEMPERATURE', 'HIGH_BLOOD_PRESSURE'],
      } as never);

      const result = await service.recordVitals(data);

      expect(result.isAbnormal).toBe(true);
      expect(result.abnormalFlags).toContain('ABNORMAL_TEMPERATURE');
    });
  });

  describe('getVitalsHistory', () => {
    it('should retrieve vitals history', async () => {
      const studentId = '123';
      mockStudentModel.findByPk.mockResolvedValue({ id: studentId } as never);
      mockVitalSignsModel.findAll.mockResolvedValue([{}, {}] as never);

      const result = await service.getVitalsHistory(studentId);

      expect(Array.isArray(result)).toBe(true);
    });

    it('should throw NotFoundException for nonexistent student', async () => {
      mockStudentModel.findByPk.mockResolvedValue(null);

      await expect(service.getVitalsHistory('invalid')).rejects.toThrow(NotFoundException);
    });

    it('should apply limit when provided', async () => {
      const studentId = '123';
      mockStudentModel.findByPk.mockResolvedValue({ id: studentId } as never);
      mockVitalSignsModel.findAll.mockResolvedValue([{}] as never);

      await service.getVitalsHistory(studentId, 5);

      expect(vitalSignsModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ limit: 5 }),
      );
    });
  });

  describe('detectAnomalies', () => {
    it('should detect anomalies in recent measurements', async () => {
      const studentId = '123';
      const vitals = [
        { isAbnormal: true, abnormalFlags: ['HIGH_TEMP'] },
        { isAbnormal: true, abnormalFlags: ['HIGH_BP'] },
      ];
      mockStudentModel.findByPk.mockResolvedValue({ id: studentId } as never);
      mockVitalSignsModel.findAll.mockResolvedValue(vitals as never);

      const result = await service.detectAnomalies(studentId);

      expect(result.anomalies.length).toBeGreaterThan(0);
    });

    it('should return empty anomalies when no history', async () => {
      const studentId = '123';
      mockStudentModel.findByPk.mockResolvedValue({ id: studentId } as never);
      mockVitalSignsModel.findAll.mockResolvedValue([]);

      const result = await service.detectAnomalies(studentId);

      expect(result.anomalies).toEqual([]);
    });
  });

  describe('calculateBMIPercentile', () => {
    it('should calculate BMI percentile', () => {
      const result = service.calculateBMIPercentile(20, 120, 'M');

      expect(result.bmi).toBe(20);
      expect(result.percentile).toBeDefined();
      expect(result.category).toBeDefined();
    });
  });
});
