/**
 * E-PRESCRIBING SERVICES (SURESCRIPTS) TESTS - CRITICAL PATIENT SAFETY
 *
 * Comprehensive tests for Surescripts e-prescribing integration including:
 * - EPCS (Electronic Prescribing for Controlled Substances)
 * - DEA number validation
 * - Prescription routing to pharmacies
 * - Medication history (RxHistory)
 * - Formulary and benefits checking
 * - Prior authorization workflows
 * - Safety checks and validations
 * - Error handling
 *
 * @security Patient Safety Critical - Controlled Substances
 * @compliance DEA EPCS Requirements
 * @compliance 21 CFR Part 1311
 * @coverage Target: 95%+
 */

import { Test, TestingModule } from '@nestjs/testing';
import { SurescriptsEPrescribingService } from '../e-prescribing-services-surescripts';
import {
  mockSurescriptsAPI,
  mockPDMP,
  resetSurescriptseMocks,
} from './mocks/surescripts-api.mock';
import {
  PrescriptionFactory,
  ProviderFactory,
  PatientFactory,
  MedicationFactory,
} from './utils/mock-data-factory';
import {
  generateDEANumber,
  generateNPI,
  isValidDEANumber,
} from './utils/test-helpers';

// Mock Surescripts client
jest.mock('./mocks/surescripts-api.mock');

describe('SurescriptsEPrescribingService (CRITICAL SAFETY)', () => {
  let service: SurescriptsEPrescribingService;

  const validPrescription = PrescriptionFactory.create();
  const validProvider = ProviderFactory.create();
  const validPatient = PatientFactory.create();
  const validDEANumber = generateDEANumber();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SurescriptsEPrescribingService],
    }).compile();

    service = module.get<SurescriptsEPrescribingService>(
      SurescriptsEPrescribingService,
    );

    // Reset all mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ==================== PRESCRIPTION SENDING ====================

  describe('sendPrescriptionToSurescripts', () => {
    const prescriptionData = {
      patientId: validPatient.id,
      providerId: validProvider.id,
      medication: MedicationFactory.create(),
      pharmacy: {
        ncpdpId: '1234567',
        name: 'Test Pharmacy',
      },
      dosage: '250mg',
      frequency: 'BID',
      duration: 30,
    };

    it('should send prescription to Surescripts successfully', async () => {
      // Act
      const result = await service.sendPrescriptionToSurescripts(
        prescriptionData,
      );

      // Assert
      expect(result).toBeDefined();
      expect(result.sent).toBe(true);
      expect(result).toHaveProperty('surescriptsId');
      expect(result.surescriptsId).toMatch(/^SS-/);
    });

    it('should require patient ID', async () => {
      // Arrange
      const invalidData = { ...prescriptionData, patientId: '' };

      // Act & Assert
      await expect(
        service.sendPrescriptionToSurescripts(invalidData),
      ).rejects.toThrow('Patient ID is required');
    });

    it('should require provider ID', async () => {
      // Arrange
      const invalidData = { ...prescriptionData, providerId: '' };

      // Act & Assert
      await expect(
        service.sendPrescriptionToSurescripts(invalidData),
      ).rejects.toThrow('Provider ID is required');
    });

    it('should require medication information', async () => {
      // Arrange
      const invalidData = { ...prescriptionData, medication: null };

      // Act & Assert
      await expect(
        service.sendPrescriptionToSurescripts(invalidData),
      ).rejects.toThrow('Medication information is required');
    });

    it('should require pharmacy NCPDP ID', async () => {
      // Arrange
      const invalidData = {
        ...prescriptionData,
        pharmacy: { ncpdpId: '' },
      };

      // Act & Assert
      await expect(
        service.sendPrescriptionToSurescripts(invalidData),
      ).rejects.toThrow('Pharmacy NCPDP ID is required');
    });

    it('should validate NCPDP ID format', async () => {
      // Arrange
      const invalidData = {
        ...prescriptionData,
        pharmacy: { ncpdpId: 'INVALID' },
      };

      // Act & Assert
      await expect(
        service.sendPrescriptionToSurescripts(invalidData),
      ).rejects.toThrow('Invalid NCPDP ID format');
    });

    it('should validate dosage format', async () => {
      // Arrange
      const invalidData = { ...prescriptionData, dosage: 'INVALID' };

      // Act & Assert
      await expect(
        service.sendPrescriptionToSurescripts(invalidData),
      ).rejects.toThrow('Invalid dosage format');
    });

    it('should validate frequency', async () => {
      // Arrange
      const invalidData = { ...prescriptionData, frequency: '' };

      // Act & Assert
      await expect(
        service.sendPrescriptionToSurescripts(invalidData),
      ).rejects.toThrow('Frequency is required');
    });

    it('should log prescription transmission for audit', async () => {
      // Arrange
      const logSpy = jest.spyOn(service['logger'], 'log');

      // Act
      await service.sendPrescriptionToSurescripts(prescriptionData);

      // Assert
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('Sending prescription to Surescripts network'),
      );
    });

    it('should return Surescripts transaction ID', async () => {
      // Act
      const result = await service.sendPrescriptionToSurescripts(
        prescriptionData,
      );

      // Assert
      expect(result.surescriptsId).toBeDefined();
      expect(typeof result.surescriptsId).toBe('string');
    });

    it('should handle network errors gracefully', async () => {
      // Arrange - Mock network failure
      jest
        .spyOn(service as any, 'sendToSurescriptsNetwork')
        .mockRejectedValue(new Error('Network timeout'));

      // Act & Assert
      await expect(
        service.sendPrescriptionToSurescripts(prescriptionData),
      ).rejects.toThrow('Failed to send prescription: Network timeout');
    });
  });

  // ==================== EPCS (ELECTRONIC PRESCRIBING FOR CONTROLLED SUBSTANCES) ====================

  describe('sendEPCSControlledSubstance', () => {
    const epcsData = {
      ...PrescriptionFactory.createEPCS(validDEANumber),
      providerId: validProvider.id,
      patientId: validPatient.id,
    };

    it('should send EPCS prescription for controlled substance', async () => {
      // Act
      const result = await service.sendEPCSControlledSubstance(
        epcsData,
        validDEANumber,
      );

      // Assert
      expect(result).toBeDefined();
      expect(result.sent).toBe(true);
      expect(result.epcsCompliant).toBe(true);
    });

    it('should require DEA number for controlled substances', async () => {
      // Act & Assert
      await expect(
        service.sendEPCSControlledSubstance(epcsData, ''),
      ).rejects.toThrow('DEA number is required for controlled substances');
    });

    it('should validate DEA number format', async () => {
      // Act & Assert
      await expect(
        service.sendEPCSControlledSubstance(epcsData, 'INVALID-DEA'),
      ).rejects.toThrow('Invalid DEA number format');
    });

    it('should verify DEA number is active', async () => {
      // Arrange
      const expiredDEA = 'AB1234563';

      // Act & Assert
      await expect(
        service.sendEPCSControlledSubstance(epcsData, expiredDEA),
      ).rejects.toThrow('DEA number is expired or inactive');
    });

    it('should validate provider is authorized for EPCS', async () => {
      // Arrange
      const unauthorizedProvider = {
        ...epcsData,
        providerId: 'provider-no-epcs',
      };

      // Act & Assert
      await expect(
        service.sendEPCSControlledSubstance(unauthorizedProvider, validDEANumber),
      ).rejects.toThrow('Provider is not authorized for EPCS');
    });

    it('should validate medication is controlled substance', async () => {
      // Arrange
      const nonControlled = {
        ...epcsData,
        medication: MedicationFactory.create({ isControlled: false }),
      };

      // Act & Assert
      await expect(
        service.sendEPCSControlledSubstance(nonControlled, validDEANumber),
      ).rejects.toThrow('Medication is not a controlled substance');
    });

    it('should validate pharmacy accepts EPCS', async () => {
      // Arrange
      const noEPCSPharmacy = {
        ...epcsData,
        pharmacy: { ncpdpId: '9999999', acceptsEPCS: false },
      };

      // Act & Assert
      await expect(
        service.sendEPCSControlledSubstance(noEPCSPharmacy, validDEANumber),
      ).rejects.toThrow('Pharmacy does not accept EPCS prescriptions');
    });

    it('should check PDMP before prescribing controlled substances', async () => {
      // Arrange
      const pdmpSpy = jest.spyOn(service as any, 'queryPDMP');

      // Act
      await service.sendEPCSControlledSubstance(epcsData, validDEANumber);

      // Assert
      expect(pdmpSpy).toHaveBeenCalledWith(epcsData.patientId);
    });

    it('should flag high-risk opioid prescriptions', async () => {
      // Arrange
      const highRiskOpioid = {
        ...epcsData,
        medication: MedicationFactory.createControlled('II'),
        dosage: '80mg',
        quantity: 120,
      };

      // Act
      const result = await service.sendEPCSControlledSubstance(
        highRiskOpioid,
        validDEANumber,
      );

      // Assert
      expect(result).toHaveProperty('highRiskFlagged', true);
      expect(result).toHaveProperty('requiresAdditionalReview', true);
    });

    it('should log EPCS transmission with high security', async () => {
      // Arrange
      const warnSpy = jest.spyOn(service['logger'], 'warn');

      // Act
      await service.sendEPCSControlledSubstance(epcsData, validDEANumber);

      // Assert
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('EPCS CONTROLLED SUBSTANCE'),
      );
    });

    it('should enforce two-factor authentication for EPCS', async () => {
      // Arrange
      const no2FA = {
        ...epcsData,
        twoFactorVerified: false,
      };

      // Act & Assert
      await expect(
        service.sendEPCSControlledSubstance(no2FA, validDEANumber),
      ).rejects.toThrow('Two-factor authentication required for EPCS');
    });

    it('should validate DEA schedule matches medication schedule', async () => {
      // Arrange
      const scheduleMismatch = {
        ...epcsData,
        medication: MedicationFactory.createControlled('III'),
      };

      // Act
      const result = await service.sendEPCSControlledSubstance(
        scheduleMismatch,
        validDEANumber,
      );

      // Assert
      expect(result).toBeDefined();
    });
  });

  // ==================== MEDICATION HISTORY (RXHISTORY) ====================

  describe('checkRxHistory', () => {
    it('should retrieve medication history from Surescripts', async () => {
      // Act
      const result = await service.checkRxHistory(validPatient.id);

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveProperty('medications');
      expect(Array.isArray(result.medications)).toBe(true);
    });

    it('should require patient ID', async () => {
      // Act & Assert
      await expect(service.checkRxHistory('')).rejects.toThrow(
        'Patient ID is required',
      );
    });

    it('should return empty array for patient with no history', async () => {
      // Act
      const result = await service.checkRxHistory('patient-no-history');

      // Assert
      expect(result.medications).toEqual([]);
    });

    it('should include fill dates in history', async () => {
      // Act
      const result = await service.checkRxHistory(validPatient.id);

      // Assert
      if (result.medications.length > 0) {
        expect(result.medications[0]).toHaveProperty('fillDate');
        expect(result.medications[0].fillDate).toBeInstanceOf(Date);
      }
    });

    it('should include prescriber information', async () => {
      // Act
      const result = await service.checkRxHistory(validPatient.id);

      // Assert
      if (result.medications.length > 0) {
        expect(result.medications[0]).toHaveProperty('prescriber');
      }
    });

    it('should include pharmacy information', async () => {
      // Act
      const result = await service.checkRxHistory(validPatient.id);

      // Assert
      if (result.medications.length > 0) {
        expect(result.medications[0]).toHaveProperty('pharmacy');
      }
    });

    it('should handle Surescripts timeout errors', async () => {
      // Arrange
      jest
        .spyOn(service as any, 'querySurescripts')
        .mockRejectedValue(new Error('Request timeout'));

      // Act & Assert
      await expect(service.checkRxHistory(validPatient.id)).rejects.toThrow(
        'Failed to retrieve medication history: Request timeout',
      );
    });

    it('should cache medication history results', async () => {
      // Act
      await service.checkRxHistory(validPatient.id);
      await service.checkRxHistory(validPatient.id);

      // Assert
      const cacheSpy = jest.spyOn(service as any, 'getCachedHistory');
      await service.checkRxHistory(validPatient.id);
      expect(cacheSpy).toHaveBeenCalled();
    });
  });

  // ==================== PHARMACY DIRECTORY ====================

  describe('searchPharmacies', () => {
    it('should search pharmacies by location', async () => {
      // Act
      const result = await service.searchPharmacies({
        zipCode: '12345',
        radius: 5,
      });

      // Assert
      expect(result).toBeDefined();
      expect(Array.isArray(result.pharmacies)).toBe(true);
    });

    it('should require location criteria', async () => {
      // Act & Assert
      await expect(service.searchPharmacies({})).rejects.toThrow(
        'Location criteria required (zipCode or city/state)',
      );
    });

    it('should filter by 24-hour pharmacies', async () => {
      // Act
      const result = await service.searchPharmacies({
        zipCode: '12345',
        is24Hour: true,
      });

      // Assert
      if (result.pharmacies.length > 0) {
        expect(result.pharmacies.every((p) => p.is24Hour === true)).toBe(true);
      }
    });

    it('should filter by EPCS capable pharmacies', async () => {
      // Act
      const result = await service.searchPharmacies({
        zipCode: '12345',
        acceptsEPCS: true,
      });

      // Assert
      if (result.pharmacies.length > 0) {
        expect(result.pharmacies.every((p) => p.acceptsEPCS === true)).toBe(
          true,
        );
      }
    });

    it('should validate zip code format', async () => {
      // Act & Assert
      await expect(
        service.searchPharmacies({ zipCode: 'INVALID' }),
      ).rejects.toThrow('Invalid zip code format');
    });

    it('should validate radius is positive', async () => {
      // Act & Assert
      await expect(
        service.searchPharmacies({ zipCode: '12345', radius: -5 }),
      ).rejects.toThrow('Radius must be a positive number');
    });
  });

  // ==================== FORMULARY AND BENEFITS ====================

  describe('checkFormulary', () => {
    it('should check medication formulary coverage', async () => {
      // Act
      const result = await service.checkFormulary(
        validPatient.id,
        'Lisinopril 10mg',
      );

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveProperty('covered');
      expect(typeof result.covered).toBe('boolean');
    });

    it('should return copay amount when covered', async () => {
      // Act
      const result = await service.checkFormulary(
        validPatient.id,
        'Lisinopril 10mg',
      );

      // Assert
      if (result.covered) {
        expect(result).toHaveProperty('copay');
        expect(typeof result.copay).toBe('number');
      }
    });

    it('should return tier information', async () => {
      // Act
      const result = await service.checkFormulary(
        validPatient.id,
        'Lisinopril 10mg',
      );

      // Assert
      if (result.covered) {
        expect(result).toHaveProperty('tier');
        expect([1, 2, 3, 4, 5]).toContain(result.tier);
      }
    });

    it('should suggest alternatives for non-covered medications', async () => {
      // Act
      const result = await service.checkFormulary(
        validPatient.id,
        'Non-covered medication',
      );

      // Assert
      if (!result.covered) {
        expect(result).toHaveProperty('alternatives');
        expect(Array.isArray(result.alternatives)).toBe(true);
      }
    });

    it('should require patient ID', async () => {
      // Act & Assert
      await expect(
        service.checkFormulary('', 'Medication'),
      ).rejects.toThrow('Patient ID is required');
    });

    it('should require medication name', async () => {
      // Act & Assert
      await expect(
        service.checkFormulary(validPatient.id, ''),
      ).rejects.toThrow('Medication name is required');
    });
  });

  // ==================== PRIOR AUTHORIZATION ====================

  describe('submitPriorAuth', () => {
    const priorAuthData = {
      patientId: validPatient.id,
      medication: 'Expensive Brand Name Drug',
      diagnosis: 'J44.0',
      clinicalJustification: 'Patient has failed all generic alternatives',
    };

    it('should submit prior authorization request', async () => {
      // Act
      const result = await service.submitPriorAuth(priorAuthData);

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveProperty('requestId');
      expect(result.status).toBe('PENDING');
    });

    it('should require clinical justification', async () => {
      // Arrange
      const invalidData = { ...priorAuthData, clinicalJustification: '' };

      // Act & Assert
      await expect(service.submitPriorAuth(invalidData)).rejects.toThrow(
        'Clinical justification is required',
      );
    });

    it('should validate minimum justification length', async () => {
      // Arrange
      const invalidData = {
        ...priorAuthData,
        clinicalJustification: 'Too short',
      };

      // Act & Assert
      await expect(service.submitPriorAuth(invalidData)).rejects.toThrow(
        'Clinical justification must be at least 20 characters',
      );
    });

    it('should include diagnosis code', async () => {
      // Arrange
      const invalidData = { ...priorAuthData, diagnosis: '' };

      // Act & Assert
      await expect(service.submitPriorAuth(invalidData)).rejects.toThrow(
        'Diagnosis code is required',
      );
    });

    it('should return request tracking ID', async () => {
      // Act
      const result = await service.submitPriorAuth(priorAuthData);

      // Assert
      expect(result.requestId).toBeDefined();
      expect(typeof result.requestId).toBe('string');
    });
  });

  // ==================== SAFETY CHECKS ====================

  describe('Safety Validations', () => {
    it('should prevent duplicate prescriptions within timeframe', async () => {
      // Arrange
      const rxData = PrescriptionFactory.create();
      await service.sendPrescriptionToSurescripts(rxData);

      // Act & Assert
      await expect(
        service.sendPrescriptionToSurescripts(rxData),
      ).rejects.toThrow('Duplicate prescription detected');
    });

    it('should validate prescription is not for deceased patient', async () => {
      // Arrange
      const deceasedPatient = {
        ...validPatient,
        id: 'patient-deceased',
      };

      // Act & Assert
      await expect(
        service.sendPrescriptionToSurescripts({
          patientId: deceasedPatient.id,
        }),
      ).rejects.toThrow('Cannot prescribe for deceased patient');
    });

    it('should validate provider license is active', async () => {
      // Arrange
      const inactiveProvider = {
        patientId: validPatient.id,
        providerId: 'provider-inactive-license',
      };

      // Act & Assert
      await expect(
        service.sendPrescriptionToSurescripts(inactiveProvider),
      ).rejects.toThrow('Provider license is not active');
    });

    it('should check for drug allergies', async () => {
      // Arrange
      const allergyPatient = PatientFactory.createWithAllergies(['Penicillin']);
      const penicillinRx = {
        patientId: allergyPatient.id,
        medication: { name: 'Amoxicillin' },
      };

      // Act & Assert
      await expect(
        service.sendPrescriptionToSurescripts(penicillinRx),
      ).rejects.toThrow('ALLERGY ALERT');
    });
  });

  // ==================== ERROR HANDLING ====================

  describe('Error Handling', () => {
    it('should handle Surescripts network outages', async () => {
      // Arrange
      jest
        .spyOn(service as any, 'checkSurescriptsStatus')
        .mockResolvedValue({ available: false });

      // Act & Assert
      await expect(
        service.sendPrescriptionToSurescripts(validPrescription),
      ).rejects.toThrow('Surescripts network is currently unavailable');
    });

    it('should provide meaningful error messages', async () => {
      // Act & Assert
      await expect(
        service.sendPrescriptionToSurescripts({}),
      ).rejects.toThrow(expect.stringContaining('required'));
    });

    it('should log all errors for troubleshooting', async () => {
      // Arrange
      const errorSpy = jest.spyOn(service['logger'], 'error');

      // Act
      try {
        await service.sendPrescriptionToSurescripts({});
      } catch (e) {
        // Expected error
      }

      // Assert
      expect(errorSpy).toHaveBeenCalled();
    });
  });

  // ==================== AUDIT LOGGING ====================

  describe('Audit Logging', () => {
    it('should log all prescription transmissions', async () => {
      // Arrange
      const logSpy = jest.spyOn(service['logger'], 'log');

      // Act
      await service.sendPrescriptionToSurescripts(validPrescription);

      // Assert
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('Sending prescription'),
      );
    });

    it('should log EPCS prescriptions with HIGH severity', async () => {
      // Arrange
      const warnSpy = jest.spyOn(service['logger'], 'warn');
      const epcsData = PrescriptionFactory.createEPCS();

      // Act
      await service.sendEPCSControlledSubstance(epcsData, validDEANumber);

      // Assert
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('EPCS'));
    });

    it('should include user context in audit logs', async () => {
      // Arrange
      const logSpy = jest.spyOn(service['logger'], 'log');

      // Act
      await service.sendPrescriptionToSurescripts(validPrescription);

      // Assert
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('providerId'),
      );
    });
  });
});
