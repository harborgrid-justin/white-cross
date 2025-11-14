import { Test, TestingModule } from '@nestjs/testing';
import { HealthDomainController } from './health-domain.controller';
import { HealthDomainService } from './health-domain.service';

describe('HealthDomainController', () => {
  let controller: HealthDomainController;
  let service: jest.Mocked<HealthDomainService>;

  const mockHealthDomainService = {
    createHealthRecord: jest.fn(),
    getHealthRecord: jest.fn(),
    updateHealthRecord: jest.fn(),
    deleteHealthRecord: jest.fn(),
    getHealthRecords: jest.fn(),
    searchHealthRecords: jest.fn(),
    bulkDeleteHealthRecords: jest.fn(),
    createAllergy: jest.fn(),
    updateAllergy: jest.fn(),
    deleteAllergy: jest.fn(),
    getStudentAllergies: jest.fn(),
    getCriticalAllergies: jest.fn(),
    verifyAllergy: jest.fn(),
    createImmunization: jest.fn(),
    updateImmunization: jest.fn(),
    deleteImmunization: jest.fn(),
    getStudentImmunizations: jest.fn(),
    getImmunizationCompliance: jest.fn(),
    getOverdueImmunizations: jest.fn(),
    createExemption: jest.fn(),
    getExemptions: jest.fn(),
    getExemption: jest.fn(),
    updateExemption: jest.fn(),
    deleteExemption: jest.fn(),
    getStudentExemptions: jest.fn(),
    getScheduleByAge: jest.fn(),
    getCatchUpSchedule: jest.fn(),
    getSchoolEntryRequirements: jest.fn(),
    checkContraindications: jest.fn(),
    getVaccinationRates: jest.fn(),
    generateStateReport: jest.fn(),
    getComplianceSummary: jest.fn(),
    getExemptionRates: jest.fn(),
    createChronicCondition: jest.fn(),
    updateChronicCondition: jest.fn(),
    deleteChronicCondition: jest.fn(),
    getStudentChronicConditions: jest.fn(),
    recordVitalSigns: jest.fn(),
    getLatestVitalSigns: jest.fn(),
    getVitalSignsHistory: jest.fn(),
    getGrowthData: jest.fn(),
    checkAbnormalVitals: jest.fn(),
    getHealthSummary: jest.fn(),
    getHealthStatistics: jest.fn(),
    exportStudentData: jest.fn(),
    importStudentData: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthDomainController],
      providers: [
        {
          provide: HealthDomainService,
          useValue: mockHealthDomainService,
        },
      ],
    }).compile();

    controller = module.get<HealthDomainController>(HealthDomainController);
    service = module.get(HealthDomainService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Health Record Endpoints', () => {
    it('should create health record', async () => {
      const dto = { studentId: '123', type: 'VISIT' };
      mockHealthDomainService.createHealthRecord.mockResolvedValue({} as never);

      const result = await controller.createHealthRecord(dto as never);

      expect(service.createHealthRecord).toHaveBeenCalledWith(dto);
      expect(result).toBeDefined();
    });

    it('should get health record by ID', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      mockHealthDomainService.getHealthRecord.mockResolvedValue({} as never);

      await controller.getHealthRecord(id);

      expect(service.getHealthRecord).toHaveBeenCalledWith(id);
    });

    it('should update health record', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const dto = { notes: 'Updated' };
      mockHealthDomainService.updateHealthRecord.mockResolvedValue({} as never);

      await controller.updateHealthRecord(id, dto as never);

      expect(service.updateHealthRecord).toHaveBeenCalledWith(id, dto);
    });

    it('should delete health record', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      mockHealthDomainService.deleteHealthRecord.mockResolvedValue(true);

      await controller.deleteHealthRecord(id);

      expect(service.deleteHealthRecord).toHaveBeenCalledWith(id);
    });

    it('should search health records', async () => {
      const query = 'flu';
      const filters = {};
      const pagination = { page: 1, limit: 20 };
      mockHealthDomainService.searchHealthRecords.mockResolvedValue({} as never);

      await controller.searchHealthRecords(query, filters as never, pagination as never);

      expect(service.searchHealthRecords).toHaveBeenCalled();
    });

    it('should bulk delete health records', async () => {
      const ids = ['id1', 'id2', 'id3'];
      mockHealthDomainService.bulkDeleteHealthRecords.mockResolvedValue({} as never);

      await controller.bulkDeleteHealthRecords(ids);

      expect(service.bulkDeleteHealthRecords).toHaveBeenCalledWith(ids);
    });
  });

  describe('Allergy Endpoints', () => {
    it('should create allergy', async () => {
      const dto = { studentId: '123', allergen: 'Peanuts', severity: 'SEVERE' };
      mockHealthDomainService.createAllergy.mockResolvedValue({} as never);

      await controller.createAllergy(dto as never);

      expect(service.createAllergy).toHaveBeenCalledWith(dto);
    });

    it('should get critical allergies', async () => {
      mockHealthDomainService.getCriticalAllergies.mockResolvedValue([]);

      const result = await controller.getCriticalAllergies();

      expect(service.getCriticalAllergies).toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it('should verify allergy', async () => {
      const id = 'allergy-123';
      const verifiedBy = 'doctor-456';
      mockHealthDomainService.verifyAllergy.mockResolvedValue({} as never);

      await controller.verifyAllergy(id, verifiedBy);

      expect(service.verifyAllergy).toHaveBeenCalledWith(id, verifiedBy);
    });
  });

  describe('Immunization Endpoints', () => {
    it('should create immunization', async () => {
      const dto = { studentId: '123', vaccineName: 'MMR' };
      mockHealthDomainService.createImmunization.mockResolvedValue({} as never);

      await controller.createImmunization(dto as never);

      expect(service.createImmunization).toHaveBeenCalledWith(dto);
    });

    it('should get immunization compliance', async () => {
      const studentId = '123e4567-e89b-12d3-a456-426614174000';
      mockHealthDomainService.getImmunizationCompliance.mockResolvedValue({} as never);

      await controller.getImmunizationCompliance(studentId);

      expect(service.getImmunizationCompliance).toHaveBeenCalledWith(studentId);
    });

    it('should get overdue immunizations', async () => {
      const queryDto = { schoolId: 'school-1' };
      mockHealthDomainService.getOverdueImmunizations.mockResolvedValue([] as never);

      await controller.getOverdueImmunizations(queryDto as never);

      expect(service.getOverdueImmunizations).toHaveBeenCalledWith(queryDto);
    });
  });

  describe('Vital Signs Endpoints', () => {
    it('should record vital signs', async () => {
      const studentId = '123e4567-e89b-12d3-a456-426614174000';
      const vitals = { temperature: 98.6, heartRate: 72 };
      const notes = 'Normal checkup';
      mockHealthDomainService.recordVitalSigns.mockResolvedValue({} as never);

      await controller.recordVitalSigns(studentId, vitals, notes);

      expect(service.recordVitalSigns).toHaveBeenCalledWith(studentId, vitals, notes);
    });

    it('should get latest vital signs', async () => {
      const studentId = '123e4567-e89b-12d3-a456-426614174000';
      mockHealthDomainService.getLatestVitalSigns.mockResolvedValue({} as never);

      await controller.getLatestVitalSigns(studentId);

      expect(service.getLatestVitalSigns).toHaveBeenCalledWith(studentId);
    });

    it('should check abnormal vitals', async () => {
      const studentId = '123e4567-e89b-12d3-a456-426614174000';
      mockHealthDomainService.checkAbnormalVitals.mockResolvedValue([]);

      await controller.checkAbnormalVitals(studentId);

      expect(service.checkAbnormalVitals).toHaveBeenCalledWith(studentId);
    });
  });

  describe('Analytics Endpoints', () => {
    it('should get health summary', async () => {
      const studentId = '123e4567-e89b-12d3-a456-426614174000';
      mockHealthDomainService.getHealthSummary.mockResolvedValue({} as never);

      await controller.getHealthSummary(studentId);

      expect(service.getHealthSummary).toHaveBeenCalledWith(studentId);
    });

    it('should get health statistics', async () => {
      mockHealthDomainService.getHealthStatistics.mockResolvedValue({} as never);

      await controller.getHealthStatistics();

      expect(service.getHealthStatistics).toHaveBeenCalledWith(undefined);
    });

    it('should get health statistics for specific student', async () => {
      const studentId = '123e4567-e89b-12d3-a456-426614174000';
      mockHealthDomainService.getHealthStatistics.mockResolvedValue({} as never);

      await controller.getHealthStatistics(studentId);

      expect(service.getHealthStatistics).toHaveBeenCalledWith(studentId);
    });
  });

  describe('Import/Export Endpoints', () => {
    it('should export student data', async () => {
      const studentId = '123e4567-e89b-12d3-a456-426614174000';
      const options = { format: 'JSON' };
      mockHealthDomainService.exportStudentData.mockResolvedValue({} as never);

      await controller.exportStudentData(studentId, options);

      expect(service.exportStudentData).toHaveBeenCalledWith(studentId, options);
    });

    it('should import student data', async () => {
      const importData = { studentId: '123', records: [] };
      const options = { format: 'JSON' };
      mockHealthDomainService.importStudentData.mockResolvedValue({} as never);

      await controller.importStudentData(importData, options);

      expect(service.importStudentData).toHaveBeenCalledWith(importData, options);
    });
  });
});
