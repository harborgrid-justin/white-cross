import { Test, TestingModule } from '@nestjs/testing';
import { ComplianceController } from './compliance.controller';
import { HipaaComplianceService } from '../hipaa-compliance.service';
import { RegulationTrackingService } from '../regulation-tracking.service';
import {
  GenerateComplianceReportDto,
  HIPAAComplianceCheckResponseDto,
  RegulationUpdateResponseDto,
} from '../dto';

describe('ComplianceController', () => {
  let controller: ComplianceController;
  let hipaaService: jest.Mocked<HipaaComplianceService>;
  let regulationService: jest.Mocked<RegulationTrackingService>;

  const mockHipaaService = {
    performComplianceAudit: jest.fn(),
    generateComplianceReport: jest.fn(),
  };

  const mockRegulationService = {
    trackRegulationChanges: jest.fn(),
    assessImpact: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComplianceController],
      providers: [
        {
          provide: HipaaComplianceService,
          useValue: mockHipaaService,
        },
        {
          provide: RegulationTrackingService,
          useValue: mockRegulationService,
        },
      ],
    }).compile();

    controller = module.get<ComplianceController>(ComplianceController);
    hipaaService = module.get(HipaaComplianceService);
    regulationService = module.get(RegulationTrackingService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('performComplianceAudit', () => {
    it('should perform HIPAA compliance audit', async () => {
      const expectedChecks: Partial<HIPAAComplianceCheckResponseDto>[] = [
        { checkName: 'ACCESS_CONTROLS', status: 'PASS', details: 'All controls in place' },
        { checkName: 'AUDIT_LOGS', status: 'PASS', details: 'Logging enabled' },
        { checkName: 'ENCRYPTION', status: 'WARNING', details: 'Some data not encrypted' },
      ];

      mockHipaaService.performComplianceAudit.mockResolvedValue(expectedChecks);

      const result = await controller.performComplianceAudit();

      expect(hipaaService.performComplianceAudit).toHaveBeenCalled();
      expect(result).toHaveLength(3);
      expect(result.filter((c) => c.status === 'PASS')).toHaveLength(2);
    });
  });

  describe('generateComplianceReport', () => {
    it('should generate compliance report for date range', async () => {
      const dto: GenerateComplianceReportDto = {
        startDate: '2025-01-01',
        endDate: '2025-01-31',
      };

      const expectedReport = {
        period: { start: dto.startDate, end: dto.endDate },
        overallCompliance: 98.5,
        findings: 2,
        recommendations: 3,
      };

      mockHipaaService.generateComplianceReport.mockResolvedValue(expectedReport);

      const result = await controller.generateComplianceReport(dto);

      expect(hipaaService.generateComplianceReport).toHaveBeenCalledWith(
        new Date(dto.startDate),
        new Date(dto.endDate),
      );
      expect(result.overallCompliance).toBeGreaterThan(90);
    });
  });

  describe('trackRegulationChanges', () => {
    it('should track regulation changes for state', async () => {
      const state = 'CA';
      const expectedUpdates: Partial<RegulationUpdateResponseDto>[] = [
        {
          regulationId: 'reg-1',
          state,
          effectiveDate: '2025-03-01',
          description: 'New immunization requirements',
        },
      ];

      mockRegulationService.trackRegulationChanges.mockResolvedValue(expectedUpdates);

      const result = await controller.trackRegulationChanges(state);

      expect(regulationService.trackRegulationChanges).toHaveBeenCalledWith(state);
      expect(result).toHaveLength(1);
    });
  });

  describe('assessImpact', () => {
    it('should assess regulation impact', async () => {
      const regulationId = 'reg-1';
      const expectedAssessment = {
        regulationId,
        affectedStudents: 250,
        requiredActions: ['Update vaccination records', 'Notify parents'],
        estimatedCost: 5000,
        priority: 'HIGH',
      };

      mockRegulationService.assessImpact.mockResolvedValue(expectedAssessment);

      const result = await controller.assessImpact(regulationId);

      expect(regulationService.assessImpact).toHaveBeenCalledWith(regulationId);
      expect(result.priority).toBe('HIGH');
    });
  });
});
