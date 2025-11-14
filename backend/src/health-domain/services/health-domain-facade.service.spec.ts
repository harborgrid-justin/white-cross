import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { HealthDomainFacadeService } from './health-domain-facade.service';
import { RequestContextService } from '@/common/context/request-context.service';

describe('HealthDomainFacadeService', () => {
  let service: HealthDomainFacadeService;
  let moduleRef: jest.Mocked<ModuleRef>;
  let eventEmitter: jest.Mocked<EventEmitter2>;
  let requestContext: jest.Mocked<RequestContextService>;

  const mockModuleRef = {
    get: jest.fn(),
  };

  const mockEventEmitter = {
    emit: jest.fn(),
  };

  const mockRequestContext = {
    requestId: 'test-request-id',
    userId: 'test-user-id',
    getLogContext: jest.fn().mockReturnValue({ requestId: 'test-request-id' }),
    getAuditContext: jest.fn().mockReturnValue({
      requestId: 'test-request-id',
      timestamp: new Date(),
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthDomainFacadeService,
        {
          provide: ModuleRef,
          useValue: mockModuleRef,
        },
        {
          provide: EventEmitter2,
          useValue: mockEventEmitter,
        },
        {
          provide: RequestContextService,
          useValue: mockRequestContext,
        },
      ],
    }).compile();

    service = module.get<HealthDomainFacadeService>(HealthDomainFacadeService);
    moduleRef = module.get(ModuleRef);
    eventEmitter = module.get(EventEmitter2);
    requestContext = module.get(RequestContextService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createHealthRecord', () => {
    it('should create health record and emit event', async () => {
      const createDto = {
        studentId: '123e4567-e89b-12d3-a456-426614174000',
        type: 'VISIT',
        date: new Date(),
        notes: 'Annual checkup',
      };

      const result = await service.createHealthRecord(createDto);

      expect(result).toHaveProperty('id');
      expect(result.studentId).toBe(createDto.studentId);
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'health-record.created',
        expect.objectContaining({
          healthRecordId: expect.any(String),
          studentId: createDto.studentId,
        }),
      );
    });

    it('should handle errors gracefully', async () => {
      const createDto = {
        studentId: '',
        type: 'VISIT',
        date: new Date(),
      };

      await expect(service.createHealthRecord(createDto)).rejects.toThrow();
    });
  });

  describe('getHealthRecord', () => {
    it('should throw NotFoundException for non-existent record', async () => {
      const healthRecordId = '123e4567-e89b-12d3-a456-426614174000';

      await expect(service.getHealthRecord(healthRecordId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should validate UUID format', async () => {
      const invalidId = 'invalid-uuid';

      await expect(service.getHealthRecord(invalidId)).rejects.toThrow();
    });
  });

  describe('updateHealthRecord', () => {
    it('should update health record and emit event', async () => {
      const healthRecordId = '123e4567-e89b-12d3-a456-426614174000';
      const updateDto = {
        studentId: '123e4567-e89b-12d3-a456-426614174000',
        notes: 'Updated notes',
      };

      const result = await service.updateHealthRecord(healthRecordId, updateDto);

      expect(result).toHaveProperty('id');
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'health-record.updated',
        expect.any(Object),
      );
    });
  });

  describe('deleteHealthRecord', () => {
    it('should delete health record and emit event', async () => {
      const healthRecordId = '123e4567-e89b-12d3-a456-426614174000';

      const result = await service.deleteHealthRecord(healthRecordId);

      expect(result).toBe(true);
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'health-record.deleted',
        expect.any(Object),
      );
    });
  });

  describe('createAllergy', () => {
    it('should create allergy via lazy-loaded service', async () => {
      const allergyDto = {
        studentId: '123e4567-e89b-12d3-a456-426614174000',
        allergen: 'Peanuts',
        severity: 'SEVERE',
        reaction: 'Anaphylaxis',
      };

      const mockAllergyService = {
        create: jest.fn().mockResolvedValue({
          id: 'allergy-123',
          ...allergyDto,
        }),
      };

      mockModuleRef.get.mockReturnValue(mockAllergyService);

      const result = await service.createAllergy(allergyDto);

      expect(result).toHaveProperty('id');
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'allergy.created',
        expect.any(Object),
      );
    });
  });

  describe('createImmunization', () => {
    it('should create immunization via lazy-loaded service', async () => {
      const immunizationDto = {
        studentId: '123e4567-e89b-12d3-a456-426614174000',
        vaccineName: 'MMR',
        dateAdministered: new Date(),
        lotNumber: 'LOT-123',
      };

      const mockVaccinationService = {
        addVaccination: jest.fn().mockResolvedValue({
          id: 'vaccination-123',
          ...immunizationDto,
        }),
      };

      mockModuleRef.get.mockReturnValue(mockVaccinationService);

      const result = await service.createImmunization(immunizationDto);

      expect(result).toHaveProperty('id');
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'immunization.created',
        expect.any(Object),
      );
    });
  });

  describe('recordVitalSigns', () => {
    it('should record vital signs', async () => {
      const studentId = '123e4567-e89b-12d3-a456-426614174000';
      const vitals = {
        temperature: 98.6,
        heartRate: 72,
        bloodPressureSystolic: 120,
        bloodPressureDiastolic: 80,
      };

      const mockVitalsService = {
        recordVitals: jest.fn().mockResolvedValue({
          id: 'vitals-123',
          studentId,
          ...vitals,
        }),
      };

      mockModuleRef.get.mockReturnValue(mockVitalsService);

      const result = await service.recordVitalSigns(studentId, vitals);

      expect(result).toHaveProperty('id');
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'vital-signs.recorded',
        expect.any(Object),
      );
    });
  });

  describe('checkAbnormalVitals', () => {
    it('should detect abnormal vitals and emit event', async () => {
      const studentId = '123e4567-e89b-12d3-a456-426614174000';

      const mockVitalsService = {
        detectAnomalies: jest.fn().mockResolvedValue({
          anomalies: [{ type: 'HIGH_TEMPERATURE', value: 102 }],
          latestVitals: { temperature: 102 },
        }),
      };

      mockModuleRef.get.mockReturnValue(mockVitalsService);

      const result = await service.checkAbnormalVitals(studentId);

      expect(result).toHaveLength(1);
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'abnormal-vitals.detected',
        expect.any(Object),
      );
    });
  });

  describe('getHealthSummary', () => {
    it('should retrieve health summary via statistics service', async () => {
      const studentId = '123e4567-e89b-12d3-a456-426614174000';

      const mockStatisticsService = {
        getStudentStatistics: jest.fn().mockResolvedValue({
          studentId,
          totalVisits: 10,
          lastVisit: new Date(),
        }),
      };

      mockModuleRef.get.mockReturnValue(mockStatisticsService);

      const result = await service.getHealthSummary(studentId);

      expect(result).toHaveProperty('studentId');
      expect(result.studentId).toBe(studentId);
    });
  });

  describe('exportStudentData', () => {
    it('should export student data in specified format', async () => {
      const studentId = '123e4567-e89b-12d3-a456-426614174000';
      const options = { format: 'JSON' };

      const mockImportExportService = {
        exportStudentRecord: jest.fn().mockResolvedValue({
          format: 'JSON',
          data: { studentId, records: [] },
        }),
      };

      mockModuleRef.get.mockReturnValue(mockImportExportService);

      const result = await service.exportStudentData(studentId, options);

      expect(result.format).toBe('JSON');
    });
  });

  describe('importStudentData', () => {
    it('should import student data', async () => {
      const importData = {
        studentId: '123e4567-e89b-12d3-a456-426614174000',
        allergies: [],
        immunizations: [],
      };

      const mockImportExportService = {
        importRecords: jest.fn().mockResolvedValue({
          success: true,
          recordsImported: 5,
        }),
      };

      mockModuleRef.get.mockReturnValue(mockImportExportService);

      const result = await service.importStudentData(importData);

      expect(result.success).toBe(true);
    });
  });
});
