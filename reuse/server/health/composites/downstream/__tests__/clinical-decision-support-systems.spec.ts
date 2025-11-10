/**
 * CLINICAL DECISION SUPPORT SYSTEMS TESTS - CRITICAL PATIENT SAFETY
 *
 * Comprehensive tests for CDS including:
 * - Drug-drug interaction checking
 * - Drug-allergy alerts
 * - Contraindication detection
 * - Dose range validation
 * - CDS Hooks integration
 * - Clinical recommendations
 * - Order set suggestions
 * - Safety alerts
 * - Evidence-based guidelines
 *
 * @security Patient Safety Critical - Medication Safety
 * @compliance CDS Hooks Specification
 * @compliance FHIR Clinical Reasoning Module
 * @coverage Target: 95%+
 */

import { Test, TestingModule } from '@nestjs/testing';
import { ClinicalDecisionSupportSystems } from '../clinical-decision-support-systems';
import {
  orchestrateClinicalDecisionSupport,
  orchestratePrescriptionOrderingWithSafety,
} from '../epic-clinical-workflows-composites';
import {
  PatientFactory,
  MedicationFactory,
  DiagnosisFactory,
  LabResultFactory,
  AllergyFactory,
  ClinicalContextFactory,
} from './utils/mock-data-factory';
import { generateICD10Code } from './utils/test-helpers';

// Mock upstream composites
jest.mock('../epic-clinical-workflows-composites', () => ({
  orchestrateClinicalDecisionSupport: jest.fn(),
  orchestratePrescriptionOrderingWithSafety: jest.fn(),
  orchestrateLabOrderEntryWithTracking: jest.fn(),
}));

describe('ClinicalDecisionSupportSystems (CRITICAL SAFETY)', () => {
  let service: ClinicalDecisionSupportSystems;

  const mockPatient = PatientFactory.create();
  const mockClinicalContext = ClinicalContextFactory.create();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClinicalDecisionSupportSystems],
    }).compile();

    service = module.get<ClinicalDecisionSupportSystems>(
      ClinicalDecisionSupportSystems,
    );

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ==================== CDS RECOMMENDATIONS ====================

  describe('generateCdsRecommendations', () => {
    it('should generate clinical recommendations', async () => {
      // Arrange
      (orchestrateClinicalDecisionSupport as jest.Mock).mockResolvedValue([
        {
          type: 'drug_interaction',
          severity: 'major',
          message: 'Potential drug interaction detected',
          suggestedActions: ['Review medication list'],
        },
      ]);

      // Act
      const result = await service.generateCdsRecommendations(
        mockPatient.id,
        mockClinicalContext,
        {},
      );

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveProperty('recommendations');
      expect(result).toHaveProperty('alerts');
      expect(result).toHaveProperty('suggestedOrders');
      expect(Array.isArray(result.recommendations)).toBe(true);
    });

    it('should require patient ID', async () => {
      // Act & Assert
      await expect(
        service.generateCdsRecommendations('', mockClinicalContext, {}),
      ).rejects.toThrow('Patient ID is required');
    });

    it('should require clinical context', async () => {
      // Act & Assert
      await expect(
        service.generateCdsRecommendations(mockPatient.id, null as any, {}),
      ).rejects.toThrow('Clinical context is required');
    });

    it('should detect drug-drug interactions', async () => {
      // Arrange
      const interactionContext = {
        ...mockClinicalContext,
        medications: [
          MedicationFactory.create({ name: 'Warfarin' }),
          MedicationFactory.create({ name: 'Aspirin' }),
        ],
      };

      (orchestrateClinicalDecisionSupport as jest.Mock).mockResolvedValue([
        {
          type: 'drug_interaction',
          severity: 'major',
          message: 'Warfarin + Aspirin: Increased bleeding risk',
          suggestedActions: ['Consider alternative', 'Monitor INR closely'],
        },
      ]);

      // Act
      const result = await service.generateCdsRecommendations(
        mockPatient.id,
        interactionContext,
        {},
      );

      // Assert
      expect(result.recommendations).toHaveLength(1);
      expect(result.recommendations[0].type).toBe('drug_interaction');
      expect(result.recommendations[0].severity).toBe('major');
    });

    it('should detect drug-allergy conflicts', async () => {
      // Arrange
      const allergyContext = {
        ...mockClinicalContext,
        allergies: ['Penicillin'],
        medications: [MedicationFactory.create({ name: 'Amoxicillin' })],
      };

      (orchestrateClinicalDecisionSupport as jest.Mock).mockResolvedValue([
        {
          type: 'allergy_alert',
          severity: 'contraindicated',
          message: 'Patient is allergic to Penicillin class',
          suggestedActions: ['STOP medication', 'Choose alternative antibiotic'],
        },
      ]);

      // Act
      const result = await service.generateCdsRecommendations(
        mockPatient.id,
        allergyContext,
        {},
      );

      // Assert
      expect(result.alerts).toHaveLength(1);
      expect(result.alerts[0].type).toBe('allergy_alert');
      expect(result.alerts[0].severity).toBe('contraindicated');
    });

    it('should filter major and contraindicated alerts', async () => {
      // Arrange
      (orchestrateClinicalDecisionSupport as jest.Mock).mockResolvedValue([
        { type: 'info', severity: 'minor', message: 'Info alert' },
        { type: 'warning', severity: 'major', message: 'Major alert' },
        {
          type: 'danger',
          severity: 'contraindicated',
          message: 'Contraindicated',
        },
      ]);

      // Act
      const result = await service.generateCdsRecommendations(
        mockPatient.id,
        mockClinicalContext,
        {},
      );

      // Assert
      expect(result.alerts).toHaveLength(2);
      expect(result.alerts.every((a) => a.severity === 'major' || a.severity === 'contraindicated')).toBe(true);
    });

    it('should include suggested actions in recommendations', async () => {
      // Arrange
      (orchestrateClinicalDecisionSupport as jest.Mock).mockResolvedValue([
        {
          type: 'dosing_alert',
          severity: 'major',
          message: 'Dose exceeds maximum',
          suggestedActions: ['Reduce dose to 500mg', 'Consult pharmacist'],
        },
      ]);

      // Act
      const result = await service.generateCdsRecommendations(
        mockPatient.id,
        mockClinicalContext,
        {},
      );

      // Assert
      expect(result.recommendations[0]).toHaveProperty('actions');
      expect(Array.isArray(result.recommendations[0].actions)).toBe(true);
      expect(result.recommendations[0].actions).toHaveLength(2);
    });

    it('should log CDS recommendation generation', async () => {
      // Arrange
      const logSpy = jest.spyOn(service['logger'], 'log');
      (orchestrateClinicalDecisionSupport as jest.Mock).mockResolvedValue([]);

      // Act
      await service.generateCdsRecommendations(
        mockPatient.id,
        mockClinicalContext,
        {},
      );

      // Assert
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining(`Generating CDS recommendations for patient ${mockPatient.id}`),
      );
    });

    it('should handle upstream composite errors gracefully', async () => {
      // Arrange
      (orchestrateClinicalDecisionSupport as jest.Mock).mockRejectedValue(
        new Error('Upstream service error'),
      );

      // Act & Assert
      await expect(
        service.generateCdsRecommendations(mockPatient.id, mockClinicalContext, {}),
      ).rejects.toThrow('Failed to generate CDS recommendations');
    });
  });

  // ==================== PRESCRIPTION VALIDATION ====================

  describe('validatePrescriptionOrders', () => {
    const mockPrescriptions = [
      {
        medication: 'Lisinopril',
        dose: '10mg',
        frequency: 'daily',
      },
      {
        medication: 'Metformin',
        dose: '500mg',
        frequency: 'BID',
      },
    ];

    it('should validate prescriptions successfully', async () => {
      // Arrange
      (orchestratePrescriptionOrderingWithSafety as jest.Mock).mockResolvedValue(
        mockPrescriptions,
      );

      // Act
      const result = await service.validatePrescriptionOrders(
        mockPatient.id,
        mockPrescriptions,
        {},
      );

      // Assert
      expect(result).toBeDefined();
      expect(result.validated).toBe(true);
      expect(result.safetyIssues).toEqual([]);
      expect(result.approvedPrescriptions).toHaveLength(2);
    });

    it('should require patient ID', async () => {
      // Act & Assert
      await expect(
        service.validatePrescriptionOrders('', mockPrescriptions, {}),
      ).rejects.toThrow('Patient ID is required');
    });

    it('should require prescriptions array', async () => {
      // Act & Assert
      await expect(
        service.validatePrescriptionOrders(mockPatient.id, null as any, {}),
      ).rejects.toThrow('Prescriptions array is required');
    });

    it('should validate prescriptions array is not empty', async () => {
      // Act & Assert
      await expect(
        service.validatePrescriptionOrders(mockPatient.id, [], {}),
      ).rejects.toThrow('Prescriptions array cannot be empty');
    });

    it('should detect drug interactions in prescription orders', async () => {
      // Arrange
      (orchestratePrescriptionOrderingWithSafety as jest.Mock).mockRejectedValue(
        new Error('Drug interaction: Warfarin + Aspirin'),
      );

      // Act
      const result = await service.validatePrescriptionOrders(
        mockPatient.id,
        mockPrescriptions,
        {},
      );

      // Assert
      expect(result.validated).toBe(false);
      expect(result.safetyIssues).toHaveLength(1);
      expect(result.safetyIssues[0].type).toBe('drug_interaction');
      expect(result.approvedPrescriptions).toEqual([]);
    });

    it('should check for contraindications', async () => {
      // Arrange
      const contraindicatedPrescriptions = [
        {
          medication: 'Metformin',
          dose: '500mg',
          patientConditions: ['Renal Failure'],
        },
      ];

      (orchestratePrescriptionOrderingWithSafety as jest.Mock).mockRejectedValue(
        new Error('Contraindicated in renal failure'),
      );

      // Act
      const result = await service.validatePrescriptionOrders(
        mockPatient.id,
        contraindicatedPrescriptions,
        {},
      );

      // Assert
      expect(result.validated).toBe(false);
      expect(result.safetyIssues.length).toBeGreaterThan(0);
    });

    it('should validate dosage ranges', async () => {
      // Arrange
      const excessiveDose = [
        {
          medication: 'Lisinopril',
          dose: '200mg', // Excessive
          frequency: 'daily',
        },
      ];

      (orchestratePrescriptionOrderingWithSafety as jest.Mock).mockRejectedValue(
        new Error('Dose exceeds maximum safe dose'),
      );

      // Act
      const result = await service.validatePrescriptionOrders(
        mockPatient.id,
        excessiveDose,
        {},
      );

      // Assert
      expect(result.validated).toBe(false);
    });

    it('should check for duplicate therapy', async () => {
      // Arrange
      const duplicates = [
        { medication: 'Lisinopril', dose: '10mg', frequency: 'daily' },
        { medication: 'Enalapril', dose: '5mg', frequency: 'daily' }, // Same class
      ];

      (orchestratePrescriptionOrderingWithSafety as jest.Mock).mockRejectedValue(
        new Error('Duplicate therapy: Both are ACE inhibitors'),
      );

      // Act
      const result = await service.validatePrescriptionOrders(
        mockPatient.id,
        duplicates,
        {},
      );

      // Assert
      expect(result.validated).toBe(false);
    });

    it('should log prescription validation', async () => {
      // Arrange
      const logSpy = jest.spyOn(service['logger'], 'log');
      (orchestratePrescriptionOrderingWithSafety as jest.Mock).mockResolvedValue(
        mockPrescriptions,
      );

      // Act
      await service.validatePrescriptionOrders(
        mockPatient.id,
        mockPrescriptions,
        {},
      );

      // Assert
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          `Validating ${mockPrescriptions.length} prescriptions`,
        ),
      );
    });

    it('should return approved prescriptions on success', async () => {
      // Arrange
      (orchestratePrescriptionOrderingWithSafety as jest.Mock).mockResolvedValue(
        mockPrescriptions,
      );

      // Act
      const result = await service.validatePrescriptionOrders(
        mockPatient.id,
        mockPrescriptions,
        {},
      );

      // Assert
      expect(result.approvedPrescriptions).toEqual(mockPrescriptions);
    });
  });

  // ==================== ORDER SET RECOMMENDATIONS ====================

  describe('recommendOrderSets', () => {
    it('should recommend order sets for diagnosis', async () => {
      // Act
      const result = await service.recommendOrderSets(
        mockPatient.id,
        'Congestive Heart Failure',
        {},
      );

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveProperty('orderSets');
      expect(Array.isArray(result.orderSets)).toBe(true);
    });

    it('should require patient ID', async () => {
      // Act & Assert
      await expect(
        service.recommendOrderSets('', 'CHF', {}),
      ).rejects.toThrow('Patient ID is required');
    });

    it('should require diagnosis', async () => {
      // Act & Assert
      await expect(
        service.recommendOrderSets(mockPatient.id, '', {}),
      ).rejects.toThrow('Diagnosis is required');
    });

    it('should include order set details', async () => {
      // Act
      const result = await service.recommendOrderSets(
        mockPatient.id,
        'Congestive Heart Failure',
        {},
      );

      // Assert
      if (result.orderSets.length > 0) {
        expect(result.orderSets[0]).toHaveProperty('orderSetId');
        expect(result.orderSets[0]).toHaveProperty('name');
        expect(result.orderSets[0]).toHaveProperty('description');
        expect(result.orderSets[0]).toHaveProperty('items');
        expect(result.orderSets[0]).toHaveProperty('evidenceLevel');
      }
    });

    it('should return evidence-based order sets', async () => {
      // Act
      const result = await service.recommendOrderSets(
        mockPatient.id,
        'Congestive Heart Failure',
        {},
      );

      // Assert
      if (result.orderSets.length > 0) {
        expect(['Level A', 'Level B', 'Level C']).toContain(
          result.orderSets[0].evidenceLevel,
        );
      }
    });

    it('should include appropriate items in order set', async () => {
      // Act
      const result = await service.recommendOrderSets(
        mockPatient.id,
        'Congestive Heart Failure',
        {},
      );

      // Assert
      expect(result.orderSets[0].items).toContain('BNP');
      expect(result.orderSets[0].items).toContain('Chest X-Ray');
      expect(result.orderSets[0].items).toContain('EKG');
    });

    it('should handle diagnosis not found', async () => {
      // Act
      const result = await service.recommendOrderSets(
        mockPatient.id,
        'Unknown Diagnosis',
        {},
      );

      // Assert
      expect(result.orderSets).toEqual([]);
    });

    it('should log order set recommendation', async () => {
      // Arrange
      const logSpy = jest.spyOn(service['logger'], 'log');

      // Act
      await service.recommendOrderSets(
        mockPatient.id,
        'Congestive Heart Failure',
        {},
      );

      // Assert
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('Recommending order sets for diagnosis'),
      );
    });
  });

  // ==================== DOSE VALIDATION ====================

  describe('Dose Range Validation', () => {
    it('should validate dose is within safe range', async () => {
      // Arrange
      const validDosePrescription = [
        {
          medication: 'Lisinopril',
          dose: '10mg',
          frequency: 'daily',
        },
      ];

      (orchestratePrescriptionOrderingWithSafety as jest.Mock).mockResolvedValue(
        validDosePrescription,
      );

      // Act
      const result = await service.validatePrescriptionOrders(
        mockPatient.id,
        validDosePrescription,
        {},
      );

      // Assert
      expect(result.validated).toBe(true);
    });

    it('should flag doses below minimum', async () => {
      // Arrange
      const lowDose = [
        {
          medication: 'Lisinopril',
          dose: '1mg', // Too low
          frequency: 'daily',
        },
      ];

      (orchestratePrescriptionOrderingWithSafety as jest.Mock).mockRejectedValue(
        new Error('Dose below therapeutic range'),
      );

      // Act
      const result = await service.validatePrescriptionOrders(
        mockPatient.id,
        lowDose,
        {},
      );

      // Assert
      expect(result.validated).toBe(false);
    });

    it('should flag doses above maximum', async () => {
      // Arrange
      const highDose = [
        {
          medication: 'Lisinopril',
          dose: '100mg', // Too high
          frequency: 'daily',
        },
      ];

      (orchestratePrescriptionOrderingWithSafety as jest.Mock).mockRejectedValue(
        new Error('Dose exceeds maximum safe dose'),
      );

      // Act
      const result = await service.validatePrescriptionOrders(
        mockPatient.id,
        highDose,
        {},
      );

      // Assert
      expect(result.validated).toBe(false);
    });
  });

  // ==================== RENAL DOSING ADJUSTMENTS ====================

  describe('Renal Dosing Adjustments', () => {
    it('should recommend dose adjustment for renal impairment', async () => {
      // Arrange
      const renalPatientContext = {
        ...mockClinicalContext,
        labResults: [
          LabResultFactory.create({
            testCode: 'CREATININE',
            value: '2.5',
            units: 'mg/dL',
          }),
        ],
      };

      (orchestrateClinicalDecisionSupport as jest.Mock).mockResolvedValue([
        {
          type: 'renal_dosing',
          severity: 'major',
          message: 'Renal dose adjustment required',
          suggestedActions: ['Reduce dose by 50%', 'Monitor renal function'],
        },
      ]);

      // Act
      const result = await service.generateCdsRecommendations(
        mockPatient.id,
        renalPatientContext,
        {},
      );

      // Assert
      expect(result.recommendations.some((r) => r.type === 'renal_dosing')).toBe(
        true,
      );
    });
  });

  // ==================== GERIATRIC CONSIDERATIONS ====================

  describe('Geriatric Considerations', () => {
    it('should flag Beers Criteria medications for elderly', async () => {
      // Arrange
      const elderlyPatient = PatientFactory.create({
        dateOfBirth: new Date('1940-01-01'),
      });

      const beersListMed = [
        {
          medication: 'Diphenhydramine', // On Beers List
          dose: '25mg',
        },
      ];

      (orchestratePrescriptionOrderingWithSafety as jest.Mock).mockRejectedValue(
        new Error('Potentially inappropriate for elderly (Beers Criteria)'),
      );

      // Act
      const result = await service.validatePrescriptionOrders(
        elderlyPatient.id,
        beersListMed,
        {},
      );

      // Assert
      expect(result.validated).toBe(false);
      expect(result.safetyIssues.length).toBeGreaterThan(0);
    });
  });

  // ==================== PREGNANCY CHECKS ====================

  describe('Pregnancy Safety Checks', () => {
    it('should flag teratogenic medications in pregnancy', async () => {
      // Arrange
      const pregnantPatient = PatientFactory.create({
        gender: 'F',
        isPregnant: true,
      });

      const teratogenicMed = [
        {
          medication: 'Isotretinoin', // Category X
          dose: '40mg',
        },
      ];

      (orchestratePrescriptionOrderingWithSafety as jest.Mock).mockRejectedValue(
        new Error('CONTRAINDICATED IN PREGNANCY (Category X)'),
      );

      // Act
      const result = await service.validatePrescriptionOrders(
        pregnantPatient.id,
        teratogenicMed,
        {},
      );

      // Assert
      expect(result.validated).toBe(false);
    });
  });

  // ==================== ERROR HANDLING ====================

  describe('Error Handling', () => {
    it('should handle upstream service failures', async () => {
      // Arrange
      (orchestrateClinicalDecisionSupport as jest.Mock).mockRejectedValue(
        new Error('Service unavailable'),
      );

      // Act & Assert
      await expect(
        service.generateCdsRecommendations(mockPatient.id, mockClinicalContext, {}),
      ).rejects.toThrow('Failed to generate CDS recommendations');
    });

    it('should provide meaningful error messages', async () => {
      // Act & Assert
      await expect(
        service.generateCdsRecommendations('', mockClinicalContext, {}),
      ).rejects.toThrow(expect.stringContaining('required'));
    });

    it('should log errors for troubleshooting', async () => {
      // Arrange
      const errorSpy = jest.spyOn(service['logger'], 'error');
      (orchestrateClinicalDecisionSupport as jest.Mock).mockRejectedValue(
        new Error('Test error'),
      );

      // Act
      try {
        await service.generateCdsRecommendations(
          mockPatient.id,
          mockClinicalContext,
          {},
        );
      } catch (e) {
        // Expected
      }

      // Assert
      expect(errorSpy).toHaveBeenCalled();
    });
  });

  // ==================== AUDIT LOGGING ====================

  describe('Audit Logging', () => {
    it('should log all CDS hook invocations', async () => {
      // Arrange
      const logSpy = jest.spyOn(service['logger'], 'log');
      (orchestrateClinicalDecisionSupport as jest.Mock).mockResolvedValue([]);

      // Act
      await service.generateCdsRecommendations(
        mockPatient.id,
        mockClinicalContext,
        {},
      );

      // Assert
      expect(logSpy).toHaveBeenCalled();
    });

    it('should log prescription validations', async () => {
      // Arrange
      const logSpy = jest.spyOn(service['logger'], 'log');
      (orchestratePrescriptionOrderingWithSafety as jest.Mock).mockResolvedValue([]);

      // Act
      await service.validatePrescriptionOrders(
        mockPatient.id,
        [{ medication: 'Test' }],
        {},
      );

      // Assert
      expect(logSpy).toHaveBeenCalled();
    });
  });
});
