import { Test, TestingModule } from '@nestjs/testing';
import { HealthDomainService } from './health-domain.service';
import { VaccinationService } from '../health-record/vaccination/vaccination.service';
import { AllergyService } from '../health-record/allergy/allergy.service';
import { ChronicConditionService } from '../services/chronic-condition/chronic-condition.service';
import { VitalsService } from '../health-record/vitals/vitals.service';
import { SearchService } from '../health-record/search/search.service';
import { StatisticsService } from '../health-record/statistics/statistics.service';
import { ImportExportService } from '../health-record/import-export/import-export.service';
import { ValidationService } from '../health-record/validation/validation.service';

describe('HealthDomainService', () => {
  let service: HealthDomainService;
  let vaccinationService: jest.Mocked<VaccinationService>;
  let allergyService: jest.Mocked<AllergyService>;
  let chronicConditionService: jest.Mocked<ChronicConditionService>;
  let vitalsService: jest.Mocked<VitalsService>;
  let statisticsService: jest.Mocked<StatisticsService>;
  let importExportService: jest.Mocked<ImportExportService>;

  const mockVaccinationService = {
    addVaccination: jest.fn(),
    getVaccinationHistory: jest.fn(),
    checkComplianceStatus: jest.fn(),
  };

  const mockAllergyService = {
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findByStudent: jest.fn(),
  };

  const mockChronicConditionService = {
    addChronicCondition: jest.fn(),
    getChronicConditions: jest.fn(),
  };

  const mockVitalsService = {
    recordVitals: jest.fn(),
    getVitalsHistory: jest.fn(),
    detectAnomalies: jest.fn(),
  };

  const mockSearchService = {};
  const mockStatisticsService = {
    getStudentStatistics: jest.fn(),
  };

  const mockImportExportService = {
    exportStudentRecord: jest.fn(),
    importRecords: jest.fn(),
  };

  const mockValidationService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthDomainService,
        {
          provide: VaccinationService,
          useValue: mockVaccinationService,
        },
        {
          provide: AllergyService,
          useValue: mockAllergyService,
        },
        {
          provide: ChronicConditionService,
          useValue: mockChronicConditionService,
        },
        {
          provide: VitalsService,
          useValue: mockVitalsService,
        },
        {
          provide: SearchService,
          useValue: mockSearchService,
        },
        {
          provide: StatisticsService,
          useValue: mockStatisticsService,
        },
        {
          provide: ImportExportService,
          useValue: mockImportExportService,
        },
        {
          provide: ValidationService,
          useValue: mockValidationService,
        },
      ],
    }).compile();

    service = module.get<HealthDomainService>(HealthDomainService);
    vaccinationService = module.get(VaccinationService);
    allergyService = module.get(AllergyService);
    chronicConditionService = module.get(ChronicConditionService);
    vitalsService = module.get(VitalsService);
    statisticsService = module.get(StatisticsService);
    importExportService = module.get(ImportExportService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createAllergy', () => {
    it('should create allergy via AllergyService', async () => {
      const dto = { studentId: '123', allergen: 'Peanuts', severity: 'SEVERE' };
      mockAllergyService.create.mockResolvedValue({ id: 'allergy-1', ...dto } as never);

      const result = await service.createAllergy(dto as never);

      expect(allergyService.create).toHaveBeenCalled();
      expect(result.id).toBe('allergy-1');
    });

    it('should handle AllergyService errors', async () => {
      const dto = { studentId: '123', allergen: 'Peanuts' };
      mockAllergyService.create.mockRejectedValue(new Error('Student not found'));

      await expect(service.createAllergy(dto as never)).rejects.toThrow('Student not found');
    });
  });

  describe('getStudentAllergies', () => {
    it('should return paginated allergies', async () => {
      const studentId = '123e4567-e89b-12d3-a456-426614174000';
      const allergies = [
        { id: 'allergy-1', studentId, allergen: 'Peanuts' },
        { id: 'allergy-2', studentId, allergen: 'Shellfish' },
      ];
      mockAllergyService.findByStudent.mockResolvedValue(allergies as never);

      const result = await service.getStudentAllergies(studentId, {}, 1, 20);

      expect(result.data).toBeDefined();
      expect(result.pagination).toBeDefined();
      expect(result.pagination.page).toBe(1);
    });
  });

  describe('createImmunization', () => {
    it('should create immunization via VaccinationService', async () => {
      const dto = { studentId: '123', vaccineName: 'MMR' };
      mockVaccinationService.addVaccination.mockResolvedValue({ id: 'vax-1' } as never);

      const result = await service.createImmunization(dto as never);

      expect(vaccinationService.addVaccination).toHaveBeenCalledWith(dto);
      expect(result.id).toBe('vax-1');
    });
  });

  describe('getStudentImmunizations', () => {
    it('should return paginated immunizations', async () => {
      const studentId = '123e4567-e89b-12d3-a456-426614174000';
      const vaccinations = [{ id: 'vax-1', vaccineName: 'MMR' }];
      mockVaccinationService.getVaccinationHistory.mockResolvedValue(vaccinations as never);

      const result = await service.getStudentImmunizations(studentId, {}, 1, 20);

      expect(result.data).toEqual(vaccinations);
      expect(result.pagination.total).toBe(1);
    });
  });

  describe('getImmunizationCompliance', () => {
    it('should return compliance status', async () => {
      const studentId = '123e4567-e89b-12d3-a456-426614174000';
      const complianceStatus = { compliant: true, missingVaccines: [] };
      mockVaccinationService.checkComplianceStatus.mockResolvedValue(complianceStatus as never);

      const result = await service.getImmunizationCompliance(studentId);

      expect(vaccinationService.checkComplianceStatus).toHaveBeenCalledWith(studentId);
      expect(result.compliant).toBe(true);
    });
  });

  describe('createChronicCondition', () => {
    it('should create chronic condition', async () => {
      const dto = { studentId: '123', condition: 'Asthma' };
      mockChronicConditionService.addChronicCondition.mockResolvedValue({
        id: 'condition-1',
      } as never);

      const result = await service.createChronicCondition(dto as never);

      expect(chronicConditionService.addChronicCondition).toHaveBeenCalledWith(dto);
      expect(result.id).toBe('condition-1');
    });
  });

  describe('recordVitalSigns', () => {
    it('should record vital signs', async () => {
      const studentId = '123e4567-e89b-12d3-a456-426614174000';
      const vitals = { temperature: 98.6, heartRate: 72 };
      const notes = 'Regular checkup';
      mockVitalsService.recordVitals.mockResolvedValue({ id: 'vitals-1' } as never);

      const result = await service.recordVitalSigns(studentId, vitals, notes);

      expect(vitalsService.recordVitals).toHaveBeenCalled();
      expect(result.id).toBe('vitals-1');
    });
  });

  describe('getLatestVitalSigns', () => {
    it('should return latest vital signs', async () => {
      const studentId = '123e4567-e89b-12d3-a456-426614174000';
      const vitals = [{ temperature: 98.6, heartRate: 72 }];
      mockVitalsService.getVitalsHistory.mockResolvedValue(vitals as never);

      const result = await service.getLatestVitalSigns(studentId);

      expect(vitalsService.getVitalsHistory).toHaveBeenCalledWith(studentId, 1);
      expect(result).toEqual(vitals[0]);
    });

    it('should return null when no vitals exist', async () => {
      const studentId = '123e4567-e89b-12d3-a456-426614174000';
      mockVitalsService.getVitalsHistory.mockResolvedValue([]);

      const result = await service.getLatestVitalSigns(studentId);

      expect(result).toBeNull();
    });
  });

  describe('checkAbnormalVitals', () => {
    it('should detect abnormal vitals', async () => {
      const studentId = '123e4567-e89b-12d3-a456-426614174000';
      const anomalies = { anomalies: [{ type: 'HIGH_TEMP', value: 102 }] };
      mockVitalsService.detectAnomalies.mockResolvedValue(anomalies as never);

      const result = await service.checkAbnormalVitals(studentId);

      expect(result).toHaveLength(1);
    });
  });

  describe('getHealthSummary', () => {
    it('should return health summary', async () => {
      const studentId = '123e4567-e89b-12d3-a456-426614174000';
      const summary = { totalVisits: 10, lastVisit: new Date() };
      mockStatisticsService.getStudentStatistics.mockResolvedValue(summary as never);

      const result = await service.getHealthSummary(studentId);

      expect(statisticsService.getStudentStatistics).toHaveBeenCalledWith(studentId);
      expect(result).toEqual(summary);
    });
  });

  describe('exportStudentData', () => {
    it('should export student data', async () => {
      const studentId = '123e4567-e89b-12d3-a456-426614174000';
      const options = { format: 'JSON' };
      const exportData = { format: 'JSON', data: {} };
      mockImportExportService.exportStudentRecord.mockResolvedValue(exportData as never);

      const result = await service.exportStudentData(studentId, options);

      expect(importExportService.exportStudentRecord).toHaveBeenCalledWith(studentId, 'JSON');
      expect(result.format).toBe('JSON');
    });
  });

  describe('importStudentData', () => {
    it('should import student data', async () => {
      const importData = { studentId: '123', records: [] };
      const options = { format: 'JSON' };
      const result = { success: true, recordsImported: 5 };
      mockImportExportService.importRecords.mockResolvedValue(result as never);

      const importResult = await service.importStudentData(importData, options);

      expect(importExportService.importRecords).toHaveBeenCalled();
      expect(importResult.success).toBe(true);
    });
  });
});
