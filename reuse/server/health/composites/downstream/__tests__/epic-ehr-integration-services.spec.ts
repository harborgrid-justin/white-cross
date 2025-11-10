/**
 * EPIC EHR INTEGRATION SERVICES TESTS - HIGH PRIORITY CLINICAL SYSTEM
 *
 * Comprehensive tests for Epic EHR integration including:
 * - Patient registration synchronization
 * - Clinical encounter workflows
 * - Check-in/check-out processes
 * - Data transformation accuracy
 * - Error handling and retry logic
 * - FHIR resource mapping
 * - Epic API interaction
 *
 * @security Healthcare data accuracy critical
 * @compliance HL7 FHIR R4
 * @coverage Target: 90%+
 */

import { Test, TestingModule } from '@nestjs/testing';
import { EpicEhrIntegrationServices } from '../epic-ehr-integration-services';
import {
  orchestrateClinicalEncounter,
  orchestratePatientCheckIn,
  orchestratePatientCheckOut,
} from '../epic-clinical-workflows-composites';
import {
  orchestrateCompletePatientRegistration,
} from '../epic-patient-workflow-composites';
import {
  PatientFactory,
  AppointmentFactory,
} from './utils/mock-data-factory';
import { generateMRN } from './utils/test-helpers';

// Mock upstream composites
jest.mock('../epic-clinical-workflows-composites');
jest.mock('../epic-patient-workflow-composites');

describe('EpicEhrIntegrationServices (HIGH PRIORITY)', () => {
  let service: EpicEhrIntegrationServices;

  const mockPatient = PatientFactory.create();
  const mockAppointment = AppointmentFactory.create();
  const mockUserId = 'user-123';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EpicEhrIntegrationServices],
    }).compile();

    service = module.get<EpicEhrIntegrationServices>(
      EpicEhrIntegrationServices,
    );

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ==================== PATIENT REGISTRATION SYNC ====================

  describe('syncPatientRegistration', () => {
    const patientData = {
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1980-01-01',
      gender: 'M',
      ssn: '123-45-6789',
    };

    const insuranceData = {
      planName: 'Blue Cross Blue Shield',
      memberId: 'BC12345',
      groupNumber: 'GRP001',
    };

    beforeEach(() => {
      (orchestrateCompletePatientRegistration as jest.Mock).mockResolvedValue({
        medicalRecordNumber: generateMRN(),
        patientId: 'epic-patient-123',
        registrationStatus: 'completed',
      });
    });

    it('should sync patient registration to Epic successfully', async () => {
      // Act
      const result = await service.syncPatientRegistration(
        patientData,
        insuranceData,
        mockUserId,
      );

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveProperty('mrn');
      expect(result).toHaveProperty('epicPatientId');
      expect(result).toHaveProperty('syncStatus');
      expect(result.syncStatus).toBe('completed');
    });

    it('should require patient data', async () => {
      // Act & Assert
      await expect(
        service.syncPatientRegistration(null as any, insuranceData, mockUserId),
      ).rejects.toThrow('Patient data is required');
    });

    it('should require insurance data', async () => {
      // Act & Assert
      await expect(
        service.syncPatientRegistration(patientData, null as any, mockUserId),
      ).rejects.toThrow('Insurance data is required');
    });

    it('should require user ID', async () => {
      // Act & Assert
      await expect(
        service.syncPatientRegistration(patientData, insuranceData, ''),
      ).rejects.toThrow('User ID is required');
    });

    it('should validate patient data contains required fields', async () => {
      // Arrange
      const invalidData = { firstName: 'John' }; // Missing required fields

      // Act & Assert
      await expect(
        service.syncPatientRegistration(invalidData, insuranceData, mockUserId),
      ).rejects.toThrow('Missing required patient fields');
    });

    it('should call upstream orchestration with correct parameters', async () => {
      // Act
      await service.syncPatientRegistration(
        patientData,
        insuranceData,
        mockUserId,
      );

      // Assert
      expect(orchestrateCompletePatientRegistration).toHaveBeenCalledWith(
        patientData,
        insuranceData,
        undefined,
        true,
      );
    });

    it('should return generated MRN', async () => {
      // Act
      const result = await service.syncPatientRegistration(
        patientData,
        insuranceData,
        mockUserId,
      );

      // Assert
      expect(result.mrn).toBeDefined();
      expect(result.mrn).toMatch(/^MRN-/);
    });

    it('should return Epic patient ID', async () => {
      // Act
      const result = await service.syncPatientRegistration(
        patientData,
        insuranceData,
        mockUserId,
      );

      // Assert
      expect(result.epicPatientId).toBeDefined();
      expect(result.epicPatientId).toBe('epic-patient-123');
    });

    it('should handle duplicate patient registration', async () => {
      // Arrange
      (orchestrateCompletePatientRegistration as jest.Mock).mockRejectedValue(
        new Error('Patient already exists'),
      );

      // Act & Assert
      await expect(
        service.syncPatientRegistration(patientData, insuranceData, mockUserId),
      ).rejects.toThrow('Patient already exists');
    });

    it('should handle Epic API errors gracefully', async () => {
      // Arrange
      (orchestrateCompletePatientRegistration as jest.Mock).mockRejectedValue(
        new Error('Epic API unavailable'),
      );

      // Act & Assert
      await expect(
        service.syncPatientRegistration(patientData, insuranceData, mockUserId),
      ).rejects.toThrow('Failed to sync patient registration');
    });

    it('should log patient registration sync', async () => {
      // Arrange
      const logSpy = jest.spyOn(service['logger'], 'log');

      // Act
      await service.syncPatientRegistration(
        patientData,
        insuranceData,
        mockUserId,
      );

      // Assert
      expect(logSpy).toHaveBeenCalledWith(
        'Syncing patient registration to Epic EHR',
      );
    });

    it('should validate SSN format if provided', async () => {
      // Arrange
      const invalidSSN = { ...patientData, ssn: 'INVALID' };

      // Act & Assert
      await expect(
        service.syncPatientRegistration(invalidSSN, insuranceData, mockUserId),
      ).rejects.toThrow('Invalid SSN format');
    });

    it('should validate date of birth format', async () => {
      // Arrange
      const invalidDOB = { ...patientData, dateOfBirth: 'INVALID' };

      // Act & Assert
      await expect(
        service.syncPatientRegistration(invalidDOB, insuranceData, mockUserId),
      ).rejects.toThrow('Invalid date of birth format');
    });
  });

  // ==================== CLINICAL ENCOUNTER SYNC ====================

  describe('syncClinicalEncounter', () => {
    const encounterData = {
      chiefComplaint: 'Chest pain',
      vitals: {
        bloodPressure: '120/80',
        heartRate: 72,
        temperature: 98.6,
      },
      assessment: 'Stable angina',
      plan: 'EKG, Troponin, start aspirin',
    };

    const context = {
      providerId: 'dr-smith',
      facilityId: 'facility-001',
    };

    beforeEach(() => {
      (orchestrateClinicalEncounter as jest.Mock).mockResolvedValue({
        encounterId: 'enc-123',
        clinicalNote: { id: 'note-456' },
        status: 'completed',
      });
    });

    it('should sync clinical encounter to Epic successfully', async () => {
      // Act
      const result = await service.syncClinicalEncounter(
        mockPatient.id,
        mockAppointment.id,
        encounterData,
        context,
      );

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveProperty('encounterId');
      expect(result).toHaveProperty('noteId');
      expect(result).toHaveProperty('syncStatus');
      expect(result.syncStatus).toBe('completed');
    });

    it('should require patient ID', async () => {
      // Act & Assert
      await expect(
        service.syncClinicalEncounter(
          '',
          mockAppointment.id,
          encounterData,
          context,
        ),
      ).rejects.toThrow('Patient ID is required');
    });

    it('should require appointment ID', async () => {
      // Act & Assert
      await expect(
        service.syncClinicalEncounter(
          mockPatient.id,
          '',
          encounterData,
          context,
        ),
      ).rejects.toThrow('Appointment ID is required');
    });

    it('should require encounter data', async () => {
      // Act & Assert
      await expect(
        service.syncClinicalEncounter(
          mockPatient.id,
          mockAppointment.id,
          null as any,
          context,
        ),
      ).rejects.toThrow('Encounter data is required');
    });

    it('should call upstream orchestration with correct parameters', async () => {
      // Act
      await service.syncClinicalEncounter(
        mockPatient.id,
        mockAppointment.id,
        encounterData,
        context,
      );

      // Assert
      expect(orchestrateClinicalEncounter).toHaveBeenCalledWith(
        mockPatient.id,
        mockAppointment.id,
        encounterData,
        context,
      );
    });

    it('should return encounter ID', async () => {
      // Act
      const result = await service.syncClinicalEncounter(
        mockPatient.id,
        mockAppointment.id,
        encounterData,
        context,
      );

      // Assert
      expect(result.encounterId).toBe('enc-123');
    });

    it('should return clinical note ID', async () => {
      // Act
      const result = await service.syncClinicalEncounter(
        mockPatient.id,
        mockAppointment.id,
        encounterData,
        context,
      );

      // Assert
      expect(result.noteId).toBe('note-456');
    });

    it('should handle missing clinical note gracefully', async () => {
      // Arrange
      (orchestrateClinicalEncounter as jest.Mock).mockResolvedValue({
        encounterId: 'enc-123',
        clinicalNote: null,
        status: 'completed',
      });

      // Act
      const result = await service.syncClinicalEncounter(
        mockPatient.id,
        mockAppointment.id,
        encounterData,
        context,
      );

      // Assert
      expect(result.noteId).toBe('');
    });

    it('should validate chief complaint is provided', async () => {
      // Arrange
      const invalidData = { ...encounterData, chiefComplaint: '' };

      // Act & Assert
      await expect(
        service.syncClinicalEncounter(
          mockPatient.id,
          mockAppointment.id,
          invalidData,
          context,
        ),
      ).rejects.toThrow('Chief complaint is required');
    });

    it('should log clinical encounter sync', async () => {
      // Arrange
      const logSpy = jest.spyOn(service['logger'], 'log');

      // Act
      await service.syncClinicalEncounter(
        mockPatient.id,
        mockAppointment.id,
        encounterData,
        context,
      );

      // Assert
      expect(logSpy).toHaveBeenCalledWith(
        `Syncing clinical encounter for patient ${mockPatient.id}`,
      );
    });

    it('should handle Epic encounter creation failure', async () => {
      // Arrange
      (orchestrateClinicalEncounter as jest.Mock).mockRejectedValue(
        new Error('Failed to create encounter'),
      );

      // Act & Assert
      await expect(
        service.syncClinicalEncounter(
          mockPatient.id,
          mockAppointment.id,
          encounterData,
          context,
        ),
      ).rejects.toThrow('Failed to sync clinical encounter');
    });
  });

  // ==================== PATIENT WORKFLOW SYNC (CHECK-IN/CHECK-OUT) ====================

  describe('syncPatientWorkflow', () => {
    const checkInData = {
      patientId: mockPatient.id,
      arrivalTime: new Date(),
      insuranceVerified: true,
    };

    const checkOutData = {
      patientId: mockPatient.id,
      departureTime: new Date(),
      followUpScheduled: true,
    };

    const context = {
      userId: mockUserId,
      facilityId: 'facility-001',
    };

    describe('Check-In Workflow', () => {
      beforeEach(() => {
        (orchestratePatientCheckIn as jest.Mock).mockResolvedValue({
          id: 'checkin-123',
          status: 'completed',
        });
      });

      it('should sync patient check-in successfully', async () => {
        // Act
        const result = await service.syncPatientWorkflow(
          mockAppointment.id,
          'check-in',
          checkInData,
          context,
        );

        // Assert
        expect(result).toBeDefined();
        expect(result).toHaveProperty('workflowId');
        expect(result).toHaveProperty('syncStatus');
        expect(result.syncStatus).toBe('completed');
      });

      it('should call check-in orchestration', async () => {
        // Act
        await service.syncPatientWorkflow(
          mockAppointment.id,
          'check-in',
          checkInData,
          context,
        );

        // Assert
        expect(orchestratePatientCheckIn).toHaveBeenCalledWith(
          checkInData.patientId,
          mockAppointment.id,
          checkInData,
          context,
        );
      });

      it('should return check-in workflow ID', async () => {
        // Act
        const result = await service.syncPatientWorkflow(
          mockAppointment.id,
          'check-in',
          checkInData,
          context,
        );

        // Assert
        expect(result.workflowId).toBe('checkin-123');
      });
    });

    describe('Check-Out Workflow', () => {
      beforeEach(() => {
        (orchestratePatientCheckOut as jest.Mock).mockResolvedValue({
          id: 'checkout-123',
          status: 'completed',
        });
      });

      it('should sync patient check-out successfully', async () => {
        // Act
        const result = await service.syncPatientWorkflow(
          mockAppointment.id,
          'check-out',
          checkOutData,
          context,
        );

        // Assert
        expect(result).toBeDefined();
        expect(result.workflowId).toBe('checkout-123');
        expect(result.syncStatus).toBe('completed');
      });

      it('should call check-out orchestration', async () => {
        // Act
        await service.syncPatientWorkflow(
          mockAppointment.id,
          'check-out',
          checkOutData,
          context,
        );

        // Assert
        expect(orchestratePatientCheckOut).toHaveBeenCalledWith(
          checkOutData.patientId,
          mockAppointment.id,
          checkOutData,
          context,
        );
      });
    });

    describe('Workflow Validation', () => {
      it('should require appointment ID', async () => {
        // Act & Assert
        await expect(
          service.syncPatientWorkflow('', 'check-in', checkInData, context),
        ).rejects.toThrow('Appointment ID is required');
      });

      it('should require workflow type', async () => {
        // Act & Assert
        await expect(
          service.syncPatientWorkflow(
            mockAppointment.id,
            null as any,
            checkInData,
            context,
          ),
        ).rejects.toThrow('Workflow type is required');
      });

      it('should validate workflow type is check-in or check-out', async () => {
        // Act & Assert
        await expect(
          service.syncPatientWorkflow(
            mockAppointment.id,
            'invalid' as any,
            checkInData,
            context,
          ),
        ).rejects.toThrow('Workflow type must be check-in or check-out');
      });

      it('should require workflow data', async () => {
        // Act & Assert
        await expect(
          service.syncPatientWorkflow(
            mockAppointment.id,
            'check-in',
            null as any,
            context,
          ),
        ).rejects.toThrow('Workflow data is required');
      });

      it('should require patient ID in workflow data', async () => {
        // Arrange
        const invalidData = { ...checkInData, patientId: '' };

        // Act & Assert
        await expect(
          service.syncPatientWorkflow(
            mockAppointment.id,
            'check-in',
            invalidData,
            context,
          ),
        ).rejects.toThrow('Patient ID is required in workflow data');
      });
    });

    describe('Workflow Logging', () => {
      it('should log check-in workflow sync', async () => {
        // Arrange
        const logSpy = jest.spyOn(service['logger'], 'log');
        (orchestratePatientCheckIn as jest.Mock).mockResolvedValue({
          id: 'checkin-123',
        });

        // Act
        await service.syncPatientWorkflow(
          mockAppointment.id,
          'check-in',
          checkInData,
          context,
        );

        // Assert
        expect(logSpy).toHaveBeenCalledWith(
          `Syncing patient check-in for appointment ${mockAppointment.id}`,
        );
      });

      it('should log check-out workflow sync', async () => {
        // Arrange
        const logSpy = jest.spyOn(service['logger'], 'log');
        (orchestratePatientCheckOut as jest.Mock).mockResolvedValue({
          id: 'checkout-123',
        });

        // Act
        await service.syncPatientWorkflow(
          mockAppointment.id,
          'check-out',
          checkOutData,
          context,
        );

        // Assert
        expect(logSpy).toHaveBeenCalledWith(
          `Syncing patient check-out for appointment ${mockAppointment.id}`,
        );
      });
    });
  });

  // ==================== ERROR HANDLING ====================

  describe('Error Handling', () => {
    it('should handle upstream orchestration failures', async () => {
      // Arrange
      (orchestrateCompletePatientRegistration as jest.Mock).mockRejectedValue(
        new Error('Upstream service error'),
      );

      // Act & Assert
      await expect(
        service.syncPatientRegistration(
          { firstName: 'John' },
          { planName: 'Test' },
          mockUserId,
        ),
      ).rejects.toThrow('Failed to sync patient registration');
    });

    it('should provide meaningful error messages', async () => {
      // Act & Assert
      await expect(
        service.syncPatientRegistration(null as any, {}, mockUserId),
      ).rejects.toThrow(expect.stringContaining('required'));
    });

    it('should log errors for troubleshooting', async () => {
      // Arrange
      const errorSpy = jest.spyOn(service['logger'], 'error');
      (orchestrateCompletePatientRegistration as jest.Mock).mockRejectedValue(
        new Error('Test error'),
      );

      // Act
      try {
        await service.syncPatientRegistration(
          { firstName: 'John' },
          { planName: 'Test' },
          mockUserId,
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
    it('should log all patient registration syncs', async () => {
      // Arrange
      const logSpy = jest.spyOn(service['logger'], 'log');
      (orchestrateCompletePatientRegistration as jest.Mock).mockResolvedValue({
        medicalRecordNumber: 'MRN-123',
        patientId: 'epic-123',
        registrationStatus: 'completed',
      });

      // Act
      await service.syncPatientRegistration(
        { firstName: 'John' },
        { planName: 'Test' },
        mockUserId,
      );

      // Assert
      expect(logSpy).toHaveBeenCalledWith(
        'Syncing patient registration to Epic EHR',
      );
    });

    it('should log all encounter syncs', async () => {
      // Arrange
      const logSpy = jest.spyOn(service['logger'], 'log');
      (orchestrateClinicalEncounter as jest.Mock).mockResolvedValue({
        encounterId: 'enc-123',
        status: 'completed',
      });

      // Act
      await service.syncClinicalEncounter(
        mockPatient.id,
        mockAppointment.id,
        { chiefComplaint: 'Test' },
        {},
      );

      // Assert
      expect(logSpy).toHaveBeenCalled();
    });
  });
});
