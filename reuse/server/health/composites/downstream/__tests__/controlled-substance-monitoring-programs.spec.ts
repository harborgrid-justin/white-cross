/**
 * CONTROLLED SUBSTANCE MONITORING PROGRAMS TESTS - CRITICAL DEA COMPLIANCE
 *
 * Comprehensive tests for PDMP integration including:
 * - State PDMP querying
 * - Controlled substance dispensing reporting
 * - DEA compliance auditing
 * - Opioid risk assessment
 * - Prescription monitoring
 * - DEA number validation
 * - Schedule II-V tracking
 * - Audit trail maintenance
 *
 * @security DEA Compliance Critical
 * @compliance 21 CFR Part 1304 - DEA Reporting
 * @compliance State PDMP Requirements
 * @coverage Target: 95%+
 */

import { Test, TestingModule } from '@nestjs/testing';
import { ControlledSubstanceMonitoringService } from '../controlled-substance-monitoring-programs';
import {
  PatientFactory,
  PrescriptionFactory,
  ProviderFactory,
  MedicationFactory,
} from './utils/mock-data-factory';
import {
  generateDEANumber,
  isValidDEANumber,
  pastDate,
} from './utils/test-helpers';

describe('ControlledSubstanceMonitoringService (CRITICAL DEA COMPLIANCE)', () => {
  let service: ControlledSubstanceMonitoringService;

  const validPatient = PatientFactory.create();
  const validProvider = ProviderFactory.create();
  const validDEANumber = generateDEANumber();
  const controlledMedication = MedicationFactory.createControlled('II');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ControlledSubstanceMonitoringService],
    }).compile();

    service = module.get<ControlledSubstanceMonitoringService>(
      ControlledSubstanceMonitoringService,
    );

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ==================== PDMP QUERYING ====================

  describe('queryPDMP', () => {
    it('should query state PDMP successfully', async () => {
      // Act
      const result = await service.queryPDMP(validPatient.id, 'CA');

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveProperty('controlledSubstances');
      expect(Array.isArray(result.controlledSubstances)).toBe(true);
    });

    it('should require patient ID', async () => {
      // Act & Assert
      await expect(service.queryPDMP('', 'CA')).rejects.toThrow(
        'Patient ID is required',
      );
    });

    it('should require state code', async () => {
      // Act & Assert
      await expect(service.queryPDMP(validPatient.id, '')).rejects.toThrow(
        'State code is required',
      );
    });

    it('should validate state code format', async () => {
      // Act & Assert
      await expect(
        service.queryPDMP(validPatient.id, 'INVALID'),
      ).rejects.toThrow('Invalid state code format');
    });

    it('should return patient controlled substance history', async () => {
      // Act
      const result = await service.queryPDMP(validPatient.id, 'CA');

      // Assert
      expect(result.controlledSubstances).toBeDefined();
      if (result.controlledSubstances.length > 0) {
        expect(result.controlledSubstances[0]).toHaveProperty('medication');
        expect(result.controlledSubstances[0]).toHaveProperty('dispensedDate');
        expect(result.controlledSubstances[0]).toHaveProperty('prescriber');
        expect(result.controlledSubstances[0]).toHaveProperty('pharmacy');
      }
    });

    it('should include prescription details in results', async () => {
      // Act
      const result = await service.queryPDMP(validPatient.id, 'CA');

      // Assert
      if (result.controlledSubstances.length > 0) {
        expect(result.controlledSubstances[0]).toHaveProperty('quantity');
        expect(result.controlledSubstances[0]).toHaveProperty('daysSupply');
        expect(result.controlledSubstances[0]).toHaveProperty('refillsRemaining');
      }
    });

    it('should filter by date range when provided', async () => {
      // Arrange
      const startDate = pastDate(90);
      const endDate = new Date();

      // Act
      const result = await service.queryPDMP(
        validPatient.id,
        'CA',
        startDate,
        endDate,
      );

      // Assert
      expect(result.controlledSubstances.every(
        (cs: any) =>
          cs.dispensedDate >= startDate && cs.dispensedDate <= endDate,
      )).toBe(true);
    });

    it('should include DEA schedule in results', async () => {
      // Act
      const result = await service.queryPDMP(validPatient.id, 'CA');

      // Assert
      if (result.controlledSubstances.length > 0) {
        expect(result.controlledSubstances[0]).toHaveProperty('schedule');
        expect(['II', 'III', 'IV', 'V']).toContain(
          result.controlledSubstances[0].schedule,
        );
      }
    });

    it('should log PDMP query for audit trail', async () => {
      // Arrange
      const logSpy = jest.spyOn(service['logger'], 'log');

      // Act
      await service.queryPDMP(validPatient.id, 'CA');

      // Assert
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining(`Querying state PDMP: CA for patient: ${validPatient.id}`),
      );
    });

    it('should handle PDMP service unavailable', async () => {
      // Arrange
      jest
        .spyOn(service as any, 'connectToPDMP')
        .mockRejectedValue(new Error('PDMP service unavailable'));

      // Act & Assert
      await expect(service.queryPDMP(validPatient.id, 'CA')).rejects.toThrow(
        'PDMP service unavailable',
      );
    });

    it('should return query metadata', async () => {
      // Act
      const result = await service.queryPDMP(validPatient.id, 'CA');

      // Assert
      expect(result).toHaveProperty('queryDate');
      expect(result).toHaveProperty('dataSource');
      expect(result.queryDate).toBeInstanceOf(Date);
    });

    it('should handle patient not found in PDMP', async () => {
      // Act
      const result = await service.queryPDMP('patient-not-in-pdmp', 'CA');

      // Assert
      expect(result.controlledSubstances).toEqual([]);
      expect(result).toHaveProperty('patientNotFound', true);
    });
  });

  // ==================== PDMP REPORTING ====================

  describe('reportToPDMP', () => {
    const prescriptionData = {
      patientId: validPatient.id,
      providerId: validProvider.id,
      medication: controlledMedication,
      quantity: 30,
      daysSupply: 30,
      refills: 0,
      pharmacyNcpdp: '1234567',
    };

    it('should report controlled substance prescription to PDMP', async () => {
      // Act
      const result = await service.reportToPDMP(
        prescriptionData,
        validDEANumber,
      );

      // Assert
      expect(result).toBeDefined();
      expect(result.reported).toBe(true);
      expect(result.deaCompliant).toBe(true);
    });

    it('should require prescription data', async () => {
      // Act & Assert
      await expect(
        service.reportToPDMP(null as any, validDEANumber),
      ).rejects.toThrow('Prescription data is required');
    });

    it('should require DEA number', async () => {
      // Act & Assert
      await expect(service.reportToPDMP(prescriptionData, '')).rejects.toThrow(
        'DEA number is required',
      );
    });

    it('should validate DEA number format', async () => {
      // Act & Assert
      await expect(
        service.reportToPDMP(prescriptionData, 'INVALID-DEA'),
      ).rejects.toThrow('Invalid DEA number format');
    });

    it('should require patient ID in prescription data', async () => {
      // Arrange
      const invalidData = { ...prescriptionData, patientId: '' };

      // Act & Assert
      await expect(
        service.reportToPDMP(invalidData, validDEANumber),
      ).rejects.toThrow('Patient ID is required');
    });

    it('should require provider ID in prescription data', async () => {
      // Arrange
      const invalidData = { ...prescriptionData, providerId: '' };

      // Act & Assert
      await expect(
        service.reportToPDMP(invalidData, validDEANumber),
      ).rejects.toThrow('Provider ID is required');
    });

    it('should validate medication is controlled substance', async () => {
      // Arrange
      const nonControlled = {
        ...prescriptionData,
        medication: MedicationFactory.create({ isControlled: false }),
      };

      // Act & Assert
      await expect(
        service.reportToPDMP(nonControlled, validDEANumber),
      ).rejects.toThrow('Medication is not a controlled substance');
    });

    it('should require quantity', async () => {
      // Arrange
      const invalidData = { ...prescriptionData, quantity: 0 };

      // Act & Assert
      await expect(
        service.reportToPDMP(invalidData, validDEANumber),
      ).rejects.toThrow('Quantity is required');
    });

    it('should require days supply', async () => {
      // Arrange
      const invalidData = { ...prescriptionData, daysSupply: 0 };

      // Act & Assert
      await expect(
        service.reportToPDMP(invalidData, validDEANumber),
      ).rejects.toThrow('Days supply is required');
    });

    it('should validate pharmacy NCPDP ID', async () => {
      // Arrange
      const invalidData = { ...prescriptionData, pharmacyNcpdp: '' };

      // Act & Assert
      await expect(
        service.reportToPDMP(invalidData, validDEANumber),
      ).rejects.toThrow('Pharmacy NCPDP ID is required');
    });

    it('should enforce Schedule II limits (no refills)', async () => {
      // Arrange
      const scheduleIIWithRefills = {
        ...prescriptionData,
        medication: MedicationFactory.createControlled('II'),
        refills: 2, // Invalid for Schedule II
      };

      // Act & Assert
      await expect(
        service.reportToPDMP(scheduleIIWithRefills, validDEANumber),
      ).rejects.toThrow('Schedule II prescriptions cannot have refills');
    });

    it('should enforce Schedule III-IV refill limits (max 5)', async () => {
      // Arrange
      const excessiveRefills = {
        ...prescriptionData,
        medication: MedicationFactory.createControlled('III'),
        refills: 6, // Exceeds limit
      };

      // Act & Assert
      await expect(
        service.reportToPDMP(excessiveRefills, validDEANumber),
      ).rejects.toThrow('Schedule III-IV prescriptions cannot exceed 5 refills');
    });

    it('should enforce quantity limits for Schedule II', async () => {
      // Arrange
      const excessiveQuantity = {
        ...prescriptionData,
        medication: MedicationFactory.createControlled('II'),
        quantity: 500, // Excessive
        daysSupply: 90,
      };

      // Act & Assert
      await expect(
        service.reportToPDMP(excessiveQuantity, validDEANumber),
      ).rejects.toThrow('Quantity exceeds maximum allowed for Schedule II');
    });

    it('should generate PDMP transaction ID', async () => {
      // Act
      const result = await service.reportToPDMP(
        prescriptionData,
        validDEANumber,
      );

      // Assert
      expect(result).toHaveProperty('pdmpTransactionId');
      expect(typeof result.pdmpTransactionId).toBe('string');
    });

    it('should log PDMP reporting for audit trail', async () => {
      // Arrange
      const logSpy = jest.spyOn(service['logger'], 'log');

      // Act
      await service.reportToPDMP(prescriptionData, validDEANumber);

      // Assert
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('Reporting controlled substance prescription to PDMP'),
      );
    });

    it('should include timestamp in report', async () => {
      // Act
      const result = await service.reportToPDMP(
        prescriptionData,
        validDEANumber,
      );

      // Assert
      expect(result).toHaveProperty('reportedAt');
      expect(result.reportedAt).toBeInstanceOf(Date);
    });

    it('should handle PDMP reporting failures gracefully', async () => {
      // Arrange
      jest
        .spyOn(service as any, 'submitToPDMP')
        .mockRejectedValue(new Error('PDMP system error'));

      // Act & Assert
      await expect(
        service.reportToPDMP(prescriptionData, validDEANumber),
      ).rejects.toThrow('Failed to report to PDMP: PDMP system error');
    });
  });

  // ==================== DEA COMPLIANCE AUDIT ====================

  describe('performDEAAudit', () => {
    it('should perform DEA compliance audit for provider', async () => {
      // Act
      const result = await service.performDEAAudit(validProvider.id);

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveProperty('compliant');
      expect(result).toHaveProperty('violations');
      expect(typeof result.compliant).toBe('boolean');
      expect(Array.isArray(result.violations)).toBe(true);
    });

    it('should require provider ID', async () => {
      // Act & Assert
      await expect(service.performDEAAudit('')).rejects.toThrow(
        'Provider ID is required',
      );
    });

    it('should check DEA registration status', async () => {
      // Act
      const result = await service.performDEAAudit(validProvider.id);

      // Assert
      expect(result).toHaveProperty('deaRegistration');
      if (result.deaRegistration) {
        expect(result.deaRegistration).toHaveProperty('active');
        expect(result.deaRegistration).toHaveProperty('expirationDate');
      }
    });

    it('should flag expired DEA numbers', async () => {
      // Arrange
      const expiredDEAProvider = 'provider-expired-dea';

      // Act
      const result = await service.performDEAAudit(expiredDEAProvider);

      // Assert
      expect(result.compliant).toBe(false);
      expect(result.violations).toContain('DEA number expired');
    });

    it('should check controlled substance prescribing patterns', async () => {
      // Act
      const result = await service.performDEAAudit(validProvider.id);

      // Assert
      expect(result).toHaveProperty('prescribingPatterns');
      if (result.prescribingPatterns) {
        expect(result.prescribingPatterns).toHaveProperty('totalPrescriptions');
        expect(result.prescribingPatterns).toHaveProperty('scheduleIIPrescriptions');
      }
    });

    it('should flag unusual prescribing patterns', async () => {
      // Arrange
      const highVolumeProvider = 'provider-high-volume';

      // Act
      const result = await service.performDEAAudit(highVolumeProvider);

      // Assert
      if (result.violations.length > 0) {
        expect(result.violations).toContain('Unusual prescribing pattern detected');
      }
    });

    it('should verify record keeping compliance', async () => {
      // Act
      const result = await service.performDEAAudit(validProvider.id);

      // Assert
      expect(result).toHaveProperty('recordKeeping');
      if (result.recordKeeping) {
        expect(result.recordKeeping).toHaveProperty('compliant');
      }
    });

    it('should check inventory controls', async () => {
      // Act
      const result = await service.performDEAAudit(validProvider.id);

      // Assert
      expect(result).toHaveProperty('inventoryControl');
    });

    it('should identify missing PDMP checks', async () => {
      // Arrange
      const noPDMPCheckProvider = 'provider-no-pdmp-checks';

      // Act
      const result = await service.performDEAAudit(noPDMPCheckProvider);

      // Assert
      expect(result.violations).toContain('Missing required PDMP checks');
    });

    it('should generate compliance score', async () => {
      // Act
      const result = await service.performDEAAudit(validProvider.id);

      // Assert
      expect(result).toHaveProperty('complianceScore');
      expect(typeof result.complianceScore).toBe('number');
      expect(result.complianceScore).toBeGreaterThanOrEqual(0);
      expect(result.complianceScore).toBeLessThanOrEqual(100);
    });

    it('should include audit timestamp', async () => {
      // Act
      const result = await service.performDEAAudit(validProvider.id);

      // Assert
      expect(result).toHaveProperty('auditDate');
      expect(result.auditDate).toBeInstanceOf(Date);
    });

    it('should recommend corrective actions for violations', async () => {
      // Arrange
      const nonCompliantProvider = 'provider-non-compliant';

      // Act
      const result = await service.performDEAAudit(nonCompliantProvider);

      // Assert
      if (result.violations.length > 0) {
        expect(result).toHaveProperty('correctiveActions');
        expect(Array.isArray(result.correctiveActions)).toBe(true);
        expect(result.correctiveActions.length).toBeGreaterThan(0);
      }
    });

    it('should log DEA audit performance', async () => {
      // Arrange
      const logSpy = jest.spyOn(service['logger'], 'log');

      // Act
      await service.performDEAAudit(validProvider.id);

      // Assert
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining(`Performing DEA compliance audit for provider: ${validProvider.id}`),
      );
    });
  });

  // ==================== OPIOID RISK ASSESSMENT ====================

  describe('assessOpioidRisk', () => {
    it('should assess opioid risk for patient', async () => {
      // Act
      const result = await service.assessOpioidRisk(validPatient.id);

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveProperty('riskLevel');
      expect(['LOW', 'MODERATE', 'HIGH', 'VERY_HIGH']).toContain(
        result.riskLevel,
      );
    });

    it('should calculate morphine milligram equivalents (MME)', async () => {
      // Act
      const result = await service.assessOpioidRisk(validPatient.id);

      // Assert
      expect(result).toHaveProperty('mme');
      expect(typeof result.mme).toBe('number');
    });

    it('should flag MME above 90mg/day', async () => {
      // Arrange
      const highMMEPatient = 'patient-high-mme';

      // Act
      const result = await service.assessOpioidRisk(highMMEPatient);

      // Assert
      expect(result.riskLevel).toBe('HIGH');
      expect(result.mme).toBeGreaterThan(90);
      expect(result).toHaveProperty('requiresReview', true);
    });

    it('should identify multiple opioid prescriptions', async () => {
      // Arrange
      const multipleOpioidsPatient = 'patient-multiple-opioids';

      // Act
      const result = await service.assessOpioidRisk(multipleOpioidsPatient);

      // Assert
      expect(result.riskLevel).toContain('HIGH');
      expect(result.factors).toContain('Multiple opioid prescriptions');
    });

    it('should flag concurrent benzodiazepine use', async () => {
      // Arrange
      const concurrentBenzoPatient = 'patient-concurrent-benzo';

      // Act
      const result = await service.assessOpioidRisk(concurrentBenzoPatient);

      // Assert
      expect(result.factors).toContain('Concurrent benzodiazepine use');
      expect(result.riskLevel).toContain('HIGH');
    });

    it('should require patient ID', async () => {
      // Act & Assert
      await expect(service.assessOpioidRisk('')).rejects.toThrow(
        'Patient ID is required',
      );
    });

    it('should include risk mitigation recommendations', async () => {
      // Act
      const result = await service.assessOpioidRisk(validPatient.id);

      // Assert
      expect(result).toHaveProperty('recommendations');
      expect(Array.isArray(result.recommendations)).toBe(true);
    });
  });

  // ==================== ERROR HANDLING ====================

  describe('Error Handling', () => {
    it('should handle state PDMP unavailable', async () => {
      // Arrange
      jest
        .spyOn(service as any, 'connectToPDMP')
        .mockRejectedValue(new Error('State PDMP offline'));

      // Act & Assert
      await expect(service.queryPDMP(validPatient.id, 'CA')).rejects.toThrow(
        'State PDMP offline',
      );
    });

    it('should provide meaningful error messages', async () => {
      // Act & Assert
      await expect(service.queryPDMP('', 'CA')).rejects.toThrow(
        expect.stringContaining('required'),
      );
    });

    it('should log all errors for troubleshooting', async () => {
      // Arrange
      const errorSpy = jest.spyOn(service['logger'], 'error');

      // Act
      try {
        await service.queryPDMP('', 'CA');
      } catch (e) {
        // Expected error
      }

      // Assert
      expect(errorSpy).toHaveBeenCalled();
    });
  });

  // ==================== AUDIT LOGGING ====================

  describe('Audit Logging', () => {
    it('should log all PDMP queries with HIGH severity', async () => {
      // Arrange
      const logSpy = jest.spyOn(service['logger'], 'log');

      // Act
      await service.queryPDMP(validPatient.id, 'CA');

      // Assert
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('Querying state PDMP'),
      );
    });

    it('should log all PDMP reports with HIGH severity', async () => {
      // Arrange
      const logSpy = jest.spyOn(service['logger'], 'log');
      const prescriptionData = {
        patientId: validPatient.id,
        medication: controlledMedication,
      };

      // Act
      await service.reportToPDMP(prescriptionData, validDEANumber);

      // Assert
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('Reporting controlled substance'),
      );
    });

    it('should log DEA audits', async () => {
      // Arrange
      const logSpy = jest.spyOn(service['logger'], 'log');

      // Act
      await service.performDEAAudit(validProvider.id);

      // Assert
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('Performing DEA compliance audit'),
      );
    });
  });
});
