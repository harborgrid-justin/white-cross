import { Test, TestingModule } from '@nestjs/testing';
import { VitalSignsController } from './vital-signs.controller';
import { VitalSignsService } from '../services/vital-signs.service';
import { RecordVitalsDto } from '../dto/vitals/record-vitals.dto';
import { UpdateVitalsDto } from '../dto/vitals/update-vitals.dto';
import { VitalsFiltersDto } from '../dto/vitals/vitals-filters.dto';

describe('VitalSignsController', () => {
  let controller: VitalSignsController;
  let vitalsService: jest.Mocked<VitalSignsService>;

  const mockVitalsService = {
    record: jest.fn(),
    findAll: jest.fn(),
    findByStudent: jest.fn(),
    getTrends: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VitalSignsController],
      providers: [
        {
          provide: VitalSignsService,
          useValue: mockVitalsService,
        },
      ],
    }).compile();

    controller = module.get<VitalSignsController>(VitalSignsController);
    vitalsService = module.get(VitalSignsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('record', () => {
    it('should record vital signs successfully', async () => {
      const recordDto: RecordVitalsDto = {
        studentId: 'student-123',
        visitId: 'visit-456',
        bloodPressureSystolic: 120,
        bloodPressureDiastolic: 80,
        heartRate: 72,
        temperature: 98.6,
        respiratoryRate: 16,
        oxygenSaturation: 98,
      };

      const mockResponse = {
        id: 'vital-789',
        ...recordDto,
        createdAt: new Date('2024-01-15'),
      };

      vitalsService.record.mockResolvedValue(mockResponse);

      const result = await controller.record(recordDto);

      expect(result).toEqual(mockResponse);
      expect(vitalsService.record).toHaveBeenCalledWith(recordDto);
      expect(vitalsService.record).toHaveBeenCalledTimes(1);
    });

    it('should handle invalid vital signs data', async () => {
      const recordDto: RecordVitalsDto = {
        studentId: 'student-123',
        visitId: 'visit-456',
        bloodPressureSystolic: -10,
        bloodPressureDiastolic: 80,
      };

      const error = new Error('Invalid blood pressure value');
      vitalsService.record.mockRejectedValue(error);

      await expect(controller.record(recordDto)).rejects.toThrow(
        'Invalid blood pressure value',
      );
    });

    it('should record complete vital signs with BMI calculation', async () => {
      const recordDto: RecordVitalsDto = {
        studentId: 'student-123',
        visitId: 'visit-456',
        height: 170,
        weight: 70,
        bloodPressureSystolic: 120,
        bloodPressureDiastolic: 80,
        heartRate: 72,
        temperature: 98.6,
        respiratoryRate: 16,
        oxygenSaturation: 98,
      };

      const mockResponse = {
        id: 'vital-789',
        ...recordDto,
        bmi: 24.2,
        createdAt: new Date('2024-01-15'),
      };

      vitalsService.record.mockResolvedValue(mockResponse);

      const result = await controller.record(recordDto);

      expect(result.bmi).toBe(24.2);
      expect(vitalsService.record).toHaveBeenCalledWith(recordDto);
    });

    it('should handle student not found error', async () => {
      const recordDto: RecordVitalsDto = {
        studentId: 'non-existent',
        visitId: 'visit-456',
        heartRate: 72,
      };

      const error = new Error('Student not found');
      vitalsService.record.mockRejectedValue(error);

      await expect(controller.record(recordDto)).rejects.toThrow(
        'Student not found',
      );
    });
  });

  describe('findAll', () => {
    it('should retrieve all vital signs with filters', async () => {
      const filters: VitalsFiltersDto = {
        studentId: 'student-123',
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      };

      const mockResponse = {
        data: [
          {
            id: 'vital-1',
            studentId: 'student-123',
            heartRate: 72,
            recordedAt: new Date('2024-01-15'),
          },
        ],
        total: 1,
      };

      vitalsService.findAll.mockResolvedValue(mockResponse);

      const result = await controller.findAll(filters);

      expect(result).toEqual(mockResponse);
      expect(vitalsService.findAll).toHaveBeenCalledWith(filters);
    });

    it('should filter by vital type', async () => {
      const filters: VitalsFiltersDto = {
        vitalType: 'blood_pressure',
      };

      const mockResponse = {
        data: [
          {
            id: 'vital-1',
            bloodPressureSystolic: 120,
            bloodPressureDiastolic: 80,
          },
        ],
        total: 1,
      };

      vitalsService.findAll.mockResolvedValue(mockResponse);

      const result = await controller.findAll(filters);

      expect(result).toEqual(mockResponse);
      expect(vitalsService.findAll).toHaveBeenCalledWith(filters);
    });

    it('should return empty array when no vitals found', async () => {
      const filters: VitalsFiltersDto = {};
      const mockResponse = { data: [], total: 0 };

      vitalsService.findAll.mockResolvedValue(mockResponse);

      const result = await controller.findAll(filters);

      expect(result.data).toHaveLength(0);
      expect(result.total).toBe(0);
    });
  });

  describe('findByStudent', () => {
    it('should retrieve vital history for a student', async () => {
      const studentId = 'student-123';
      const mockHistory = {
        studentId,
        vitals: [
          {
            id: 'vital-1',
            heartRate: 72,
            recordedAt: new Date('2024-01-15'),
          },
          {
            id: 'vital-2',
            heartRate: 75,
            recordedAt: new Date('2024-01-10'),
          },
        ],
        total: 2,
      };

      vitalsService.findByStudent.mockResolvedValue(mockHistory);

      const result = await controller.findByStudent(studentId);

      expect(result).toEqual(mockHistory);
      expect(vitalsService.findByStudent).toHaveBeenCalledWith(studentId);
    });

    it('should handle student not found', async () => {
      const studentId = 'non-existent';
      const error = new Error('Student not found');

      vitalsService.findByStudent.mockRejectedValue(error);

      await expect(controller.findByStudent(studentId)).rejects.toThrow(
        'Student not found',
      );
    });
  });

  describe('getTrends', () => {
    it('should retrieve vital trends for a student', async () => {
      const studentId = 'student-123';
      const startDate = '2024-01-01';
      const endDate = '2024-01-31';

      const mockTrends = {
        studentId,
        trends: {
          heartRate: {
            average: 72,
            min: 68,
            max: 78,
            trend: 'stable',
          },
          bloodPressure: {
            systolic: { average: 120, trend: 'increasing' },
            diastolic: { average: 80, trend: 'stable' },
          },
        },
        period: {
          start: new Date(startDate),
          end: new Date(endDate),
        },
      };

      vitalsService.getTrends.mockResolvedValue(mockTrends);

      const result = await controller.getTrends(studentId, startDate, endDate);

      expect(result).toEqual(mockTrends);
      expect(vitalsService.getTrends).toHaveBeenCalledWith(
        studentId,
        new Date(startDate),
        new Date(endDate),
      );
    });

    it('should handle invalid date range', async () => {
      const studentId = 'student-123';
      const startDate = '2024-12-31';
      const endDate = '2024-01-01';

      const error = new Error('Invalid date range');
      vitalsService.getTrends.mockRejectedValue(error);

      await expect(
        controller.getTrends(studentId, startDate, endDate),
      ).rejects.toThrow('Invalid date range');
    });

    it('should handle malformed date strings', async () => {
      const studentId = 'student-123';
      const startDate = 'invalid-date';
      const endDate = '2024-01-31';

      const error = new Error('Invalid date format');
      vitalsService.getTrends.mockRejectedValue(error);

      await expect(
        controller.getTrends(studentId, startDate, endDate),
      ).rejects.toThrow('Invalid date format');
    });
  });

  describe('findOne', () => {
    it('should retrieve a vital signs record by id', async () => {
      const vitalId = 'vital-123';
      const mockVital = {
        id: vitalId,
        studentId: 'student-123',
        heartRate: 72,
        bloodPressureSystolic: 120,
        bloodPressureDiastolic: 80,
        recordedAt: new Date('2024-01-15'),
      };

      vitalsService.findOne.mockResolvedValue(mockVital);

      const result = await controller.findOne(vitalId);

      expect(result).toEqual(mockVital);
      expect(vitalsService.findOne).toHaveBeenCalledWith(vitalId);
    });

    it('should handle vital signs record not found', async () => {
      const vitalId = 'non-existent';
      const error = new Error('Vital signs record not found');

      vitalsService.findOne.mockRejectedValue(error);

      await expect(controller.findOne(vitalId)).rejects.toThrow(
        'Vital signs record not found',
      );
    });
  });

  describe('update', () => {
    it('should update vital signs successfully', async () => {
      const vitalId = 'vital-123';
      const updateDto: UpdateVitalsDto = {
        heartRate: 75,
        notes: 'Updated reading',
      };

      const mockUpdated = {
        id: vitalId,
        heartRate: 75,
        notes: 'Updated reading',
        updatedAt: new Date('2024-01-15'),
      };

      vitalsService.update.mockResolvedValue(mockUpdated);

      const result = await controller.update(vitalId, updateDto);

      expect(result).toEqual(mockUpdated);
      expect(vitalsService.update).toHaveBeenCalledWith(vitalId, updateDto);
    });

    it('should handle invalid update data', async () => {
      const vitalId = 'vital-123';
      const updateDto: UpdateVitalsDto = {
        heartRate: -10,
      };

      const error = new Error('Invalid heart rate value');
      vitalsService.update.mockRejectedValue(error);

      await expect(controller.update(vitalId, updateDto)).rejects.toThrow(
        'Invalid heart rate value',
      );
    });

    it('should maintain audit trail on update', async () => {
      const vitalId = 'vital-123';
      const updateDto: UpdateVitalsDto = {
        bloodPressureSystolic: 125,
      };

      const mockUpdated = {
        id: vitalId,
        bloodPressureSystolic: 125,
        auditTrail: [
          {
            field: 'bloodPressureSystolic',
            oldValue: 120,
            newValue: 125,
            changedAt: new Date('2024-01-15'),
          },
        ],
      };

      vitalsService.update.mockResolvedValue(mockUpdated);

      const result = await controller.update(vitalId, updateDto);

      expect(result.auditTrail).toBeDefined();
      expect(vitalsService.update).toHaveBeenCalledWith(vitalId, updateDto);
    });
  });

  describe('remove', () => {
    it('should delete vital signs record successfully', async () => {
      const vitalId = 'vital-123';

      vitalsService.remove.mockResolvedValue(undefined);

      await controller.remove(vitalId);

      expect(vitalsService.remove).toHaveBeenCalledWith(vitalId);
      expect(vitalsService.remove).toHaveBeenCalledTimes(1);
    });

    it('should handle vital signs record not found on delete', async () => {
      const vitalId = 'non-existent';
      const error = new Error('Vital signs record not found');

      vitalsService.remove.mockRejectedValue(error);

      await expect(controller.remove(vitalId)).rejects.toThrow(
        'Vital signs record not found',
      );
    });

    it('should handle soft delete', async () => {
      const vitalId = 'vital-123';

      vitalsService.remove.mockResolvedValue(undefined);

      await controller.remove(vitalId);

      expect(vitalsService.remove).toHaveBeenCalledWith(vitalId);
    });
  });
});
