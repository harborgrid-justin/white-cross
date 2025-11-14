import { Test, TestingModule } from '@nestjs/testing';
import { HealthRecordService } from './health-record.service';
import { HealthRecordCrudService } from './services/health-record-crud.service';
import { HealthRecordAllergyService } from './services/health-record-allergy.service';
import { HealthRecordChronicConditionService } from './services/health-record-chronic-condition.service';
import { HealthRecordVaccinationService } from './services/health-record-vaccination.service';
import { HealthRecordVitalsService } from './services/health-record-vitals.service';
import { HealthRecordSummaryService } from './services/health-record-summary.service';
import { HealthRecordBatchService } from './services/health-record-batch.service';

describe('HealthRecordService', () => {
  let service: HealthRecordService;
  let crudService: jest.Mocked<HealthRecordCrudService>;
  let allergyService: jest.Mocked<HealthRecordAllergyService>;
  let vitalsService: jest.Mocked<HealthRecordVitalsService>;
  let summaryService: jest.Mocked<HealthRecordSummaryService>;
  let batchService: jest.Mocked<HealthRecordBatchService>;

  const mockCrudService = {
    getStudentHealthRecords: jest.fn(),
    createHealthRecord: jest.fn(),
    updateHealthRecord: jest.fn(),
    getVaccinationRecords: jest.fn(),
    bulkDeleteHealthRecords: jest.fn(),
    getAllHealthRecords: jest.fn(),
    getHealthRecord: jest.fn(),
    getHealthRecordById: jest.fn(),
    deleteHealthRecord: jest.fn(),
  };

  const mockAllergyService = {
    addAllergy: jest.fn(),
    updateAllergy: jest.fn(),
    getStudentAllergies: jest.fn(),
    deleteAllergy: jest.fn(),
  };

  const mockChronicConditionService = {
    addChronicCondition: jest.fn(),
    getStudentChronicConditions: jest.fn(),
    updateChronicCondition: jest.fn(),
    deleteChronicCondition: jest.fn(),
  };

  const mockVaccinationService = {
    addVaccination: jest.fn(),
    getStudentVaccinations: jest.fn(),
    updateVaccination: jest.fn(),
    deleteVaccination: jest.fn(),
  };

  const mockVitalsService = {
    getGrowthChartData: jest.fn(),
    getRecentVitals: jest.fn(),
  };

  const mockSummaryService = {
    getHealthSummary: jest.fn(),
    searchHealthRecords: jest.fn(),
    exportHealthHistory: jest.fn(),
    importHealthRecords: jest.fn(),
    getHealthRecordStatistics: jest.fn(),
    getCompleteHealthProfile: jest.fn(),
  };

  const mockBatchService = {
    findByIds: jest.fn(),
    findByStudentIds: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthRecordService,
        { provide: HealthRecordCrudService, useValue: mockCrudService },
        { provide: HealthRecordAllergyService, useValue: mockAllergyService },
        { provide: HealthRecordChronicConditionService, useValue: mockChronicConditionService },
        { provide: HealthRecordVaccinationService, useValue: mockVaccinationService },
        { provide: HealthRecordVitalsService, useValue: mockVitalsService },
        { provide: HealthRecordSummaryService, useValue: mockSummaryService },
        { provide: HealthRecordBatchService, useValue: mockBatchService },
      ],
    }).compile();

    service = module.get<HealthRecordService>(HealthRecordService);
    crudService = module.get(HealthRecordCrudService);
    allergyService = module.get(HealthRecordAllergyService);
    vitalsService = module.get(HealthRecordVitalsService);
    summaryService = module.get(HealthRecordSummaryService);
    batchService = module.get(HealthRecordBatchService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getStudentHealthRecords', () => {
    it('should delegate to crudService', async () => {
      const studentId = '123';
      const page = 1;
      const limit = 20;
      const filters = {};
      mockCrudService.getStudentHealthRecords.mockResolvedValue({} as never);

      await service.getStudentHealthRecords(studentId, page, limit, filters);

      expect(crudService.getStudentHealthRecords).toHaveBeenCalledWith(
        studentId,
        page,
        limit,
        filters,
      );
    });
  });

  describe('createHealthRecord', () => {
    it('should delegate to crudService', async () => {
      const dto = { studentId: '123', type: 'VISIT' };
      mockCrudService.createHealthRecord.mockResolvedValue({} as never);

      await service.createHealthRecord(dto as never);

      expect(crudService.createHealthRecord).toHaveBeenCalledWith(dto);
    });
  });

  describe('addAllergy', () => {
    it('should delegate to allergyService', async () => {
      const dto = { studentId: '123', allergen: 'Peanuts' };
      mockAllergyService.addAllergy.mockResolvedValue({} as never);

      await service.addAllergy(dto as never);

      expect(allergyService.addAllergy).toHaveBeenCalledWith(dto);
    });
  });

  describe('getHealthSummary', () => {
    it('should get summary and enhance with vitals', async () => {
      const studentId = '123';
      const summary = { studentId, totalVisits: 10 };
      const vitals = [{ temperature: 98.6 }];
      mockSummaryService.getHealthSummary.mockResolvedValue(summary as never);
      mockVitalsService.getRecentVitals.mockResolvedValue(vitals as never);

      const result = await service.getHealthSummary(studentId);

      expect(summaryService.getHealthSummary).toHaveBeenCalledWith(studentId);
      expect(vitalsService.getRecentVitals).toHaveBeenCalledWith(studentId, 5);
      expect(result.recentVitals).toEqual(vitals);
    });
  });

  describe('findByIds', () => {
    it('should delegate to batchService', async () => {
      const ids = ['id1', 'id2', 'id3'];
      mockBatchService.findByIds.mockResolvedValue([{}, {}, {}] as never);

      await service.findByIds(ids);

      expect(batchService.findByIds).toHaveBeenCalledWith(ids);
    });
  });

  describe('findByStudentIds', () => {
    it('should delegate to batchService', async () => {
      const studentIds = ['s1', 's2'];
      mockBatchService.findByStudentIds.mockResolvedValue([[], []] as never);

      await service.findByStudentIds(studentIds);

      expect(batchService.findByStudentIds).toHaveBeenCalledWith(studentIds);
    });
  });
});
