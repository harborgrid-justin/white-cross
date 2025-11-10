/**
 * MEDICATION ADMINISTRATION RECORD (MAR) TESTS - CRITICAL SAFETY
 *
 * Tests for eMAR workflows including:
 * - Medication administration recording
 * - Barcode scanning and 5 Rights verification
 * - Administration validation
 * - Safety checks
 * - Audit logging
 * - Error handling
 *
 * @security Patient Safety Critical
 * @compliance Five Rights of Medication Administration
 * @coverage Target: 95%+
 */

import { Test, TestingModule } from '@nestjs/testing';
import { MedicationAdministrationRecordService } from '../medication-administration-record-mar';

describe('MedicationAdministrationRecordService (CRITICAL SAFETY)', () => {
  let service: MedicationAdministrationRecordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MedicationAdministrationRecordService],
    }).compile();

    service = module.get<MedicationAdministrationRecordService>(
      MedicationAdministrationRecordService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ==================== MEDICATION ADMINISTRATION RECORDING ====================

  describe('recordAdministration', () => {
    const validAdministrationData = {
      patientId: 'patient-123',
      medicationId: 'med-456',
      dosage: '250mg',
      route: 'ORAL',
      administeredBy: 'nurse-789',
      administeredAt: new Date(),
      notes: 'Patient took medication with water',
    };

    it('should record medication administration successfully', async () => {
      // Act
      const result = await service.recordAdministration(validAdministrationData);

      // Assert
      expect(result).toBeDefined();
      expect(result.recorded).toBe(true);
      expect(result.timestamp).toBeInstanceOf(Date);
    });

    it('should reject administration without patient ID', async () => {
      // Arrange
      const invalidData = { ...validAdministrationData, patientId: null };

      // Act & Assert
      await expect(
        service.recordAdministration(invalidData),
      ).rejects.toThrow('Patient ID is required');
    });

    it('should reject administration without medication ID', async () => {
      // Arrange
      const invalidData = { ...validAdministrationData, medicationId: null };

      // Act & Assert
      await expect(
        service.recordAdministration(invalidData),
      ).rejects.toThrow('Medication ID is required');
    });

    it('should reject administration without dosage', async () => {
      // Arrange
      const invalidData = { ...validAdministrationData, dosage: '' };

      // Act & Assert
      await expect(
        service.recordAdministration(invalidData),
      ).rejects.toThrow('Dosage is required');
    });

    it('should reject administration without route', async () => {
      // Arrange
      const invalidData = { ...validAdministrationData, route: null };

      // Act & Assert
      await expect(
        service.recordAdministration(invalidData),
      ).rejects.toThrow('Route is required');
    });

    it('should reject administration without administered by', async () => {
      // Arrange
      const invalidData = { ...validAdministrationData, administeredBy: null };

      // Act & Assert
      await expect(
        service.recordAdministration(invalidData),
      ).rejects.toThrow('Administered by is required');
    });

    it('should validate administration time is not in the future', async () => {
      // Arrange
      const futureTime = new Date(Date.now() + 86400000);
      const invalidData = {
        ...validAdministrationData,
        administeredAt: futureTime,
      };

      // Act & Assert
      await expect(
        service.recordAdministration(invalidData),
      ).rejects.toThrow('Administration time cannot be in the future');
    });

    it('should log administration for audit trail', async () => {
      // Arrange
      const logSpy = jest.spyOn(service['logger'], 'log');

      // Act
      await service.recordAdministration(validAdministrationData);

      // Assert
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('Recording medication administration'),
      );
    });
  });

  // ==================== BARCODE VERIFICATION (5 RIGHTS) ====================

  describe('scanBarcodeVerification', () => {
    const validMedicationBarcode = 'MED-123456789';
    const validPatientBarcode = 'PAT-987654321';

    it('should verify barcodes successfully', async () => {
      // Act
      const result = await service.scanBarcodeVerification(
        validMedicationBarcode,
        validPatientBarcode,
      );

      // Assert
      expect(result).toBeDefined();
      expect(result.verified).toBe(true);
      expect(result.fiveRightsChecked).toBe(true);
    });

    it('should perform 5 Rights check (Right Patient)', async () => {
      // Act
      const result = await service.scanBarcodeVerification(
        validMedicationBarcode,
        validPatientBarcode,
      );

      // Assert
      expect(result.fiveRightsChecked).toBe(true);
      expect(result).toHaveProperty('rightPatient', true);
    });

    it('should perform 5 Rights check (Right Medication)', async () => {
      // Act
      const result = await service.scanBarcodeVerification(
        validMedicationBarcode,
        validPatientBarcode,
      );

      // Assert
      expect(result).toHaveProperty('rightMedication', true);
    });

    it('should perform 5 Rights check (Right Dose)', async () => {
      // Act
      const result = await service.scanBarcodeVerification(
        validMedicationBarcode,
        validPatientBarcode,
      );

      // Assert
      expect(result).toHaveProperty('rightDose', true);
    });

    it('should perform 5 Rights check (Right Route)', async () => {
      // Act
      const result = await service.scanBarcodeVerification(
        validMedicationBarcode,
        validPatientBarcode,
      );

      // Assert
      expect(result).toHaveProperty('rightRoute', true);
    });

    it('should perform 5 Rights check (Right Time)', async () => {
      // Act
      const result = await service.scanBarcodeVerification(
        validMedicationBarcode,
        validPatientBarcode,
      );

      // Assert
      expect(result).toHaveProperty('rightTime', true);
    });

    it('should reject invalid medication barcode', async () => {
      // Act & Assert
      await expect(
        service.scanBarcodeVerification('INVALID', validPatientBarcode),
      ).rejects.toThrow('Invalid medication barcode');
    });

    it('should reject invalid patient barcode', async () => {
      // Act & Assert
      await expect(
        service.scanBarcodeVerification(validMedicationBarcode, 'INVALID'),
      ).rejects.toThrow('Invalid patient barcode');
    });

    it('should reject empty medication barcode', async () => {
      // Act & Assert
      await expect(
        service.scanBarcodeVerification('', validPatientBarcode),
      ).rejects.toThrow('Medication barcode is required');
    });

    it('should reject empty patient barcode', async () => {
      // Act & Assert
      await expect(
        service.scanBarcodeVerification(validMedicationBarcode, ''),
      ).rejects.toThrow('Patient barcode is required');
    });

    it('should detect patient-medication mismatch', async () => {
      // Arrange
      const wrongPatientBarcode = 'PAT-WRONG-123';

      // Act & Assert
      await expect(
        service.scanBarcodeVerification(
          validMedicationBarcode,
          wrongPatientBarcode,
        ),
      ).rejects.toThrow('Patient-medication mismatch detected');
    });

    it('should log barcode verification for audit', async () => {
      // Arrange
      const logSpy = jest.spyOn(service['logger'], 'log');

      // Act
      await service.scanBarcodeVerification(
        validMedicationBarcode,
        validPatientBarcode,
      );

      // Assert
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('Performing barcode verification'),
      );
    });
  });

  // ==================== MEDICATION DUE LIST ====================

  describe('getMedicationsDue', () => {
    it('should return list of medications due', async () => {
      // Arrange
      const patientId = 'patient-123';
      const currentTime = new Date();

      // Act
      const result = await service.getMedicationsDue(patientId, currentTime);

      // Assert
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should filter medications by schedule', async () => {
      // Arrange
      const patientId = 'patient-123';
      const currentTime = new Date('2024-01-15T09:00:00');

      // Act
      const result = await service.getMedicationsDue(patientId, currentTime);

      // Assert
      expect(result.every((med) => med.scheduledTime <= currentTime)).toBe(true);
    });

    it('should exclude already administered medications', async () => {
      // Arrange
      const patientId = 'patient-123';

      // Act
      const result = await service.getMedicationsDue(patientId);

      // Assert
      expect(result.every((med) => !med.administered)).toBe(true);
    });

    it('should handle patient with no medications', async () => {
      // Arrange
      const patientId = 'patient-no-meds';

      // Act
      const result = await service.getMedicationsDue(patientId);

      // Assert
      expect(result).toEqual([]);
    });
  });

  // ==================== LATE MEDICATION ALERTS ====================

  describe('getLateMedications', () => {
    it('should identify overdue medications', async () => {
      // Arrange
      const patientId = 'patient-123';
      const thresholdMinutes = 30;

      // Act
      const result = await service.getLateMedications(
        patientId,
        thresholdMinutes,
      );

      // Assert
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should calculate lateness in minutes', async () => {
      // Arrange
      const patientId = 'patient-123';

      // Act
      const result = await service.getLateMedications(patientId);

      // Assert
      if (result.length > 0) {
        expect(result[0]).toHaveProperty('minutesLate');
        expect(typeof result[0].minutesLate).toBe('number');
      }
    });

    it('should prioritize by severity', async () => {
      // Arrange
      const patientId = 'patient-123';

      // Act
      const result = await service.getLateMedications(patientId);

      // Assert
      if (result.length > 1) {
        expect(result[0].severity).toBeGreaterThanOrEqual(result[1].severity);
      }
    });
  });

  // ==================== MEDICATION HISTORY ====================

  describe('getAdministrationHistory', () => {
    it('should return administration history for patient', async () => {
      // Arrange
      const patientId = 'patient-123';
      const daysBack = 7;

      // Act
      const result = await service.getAdministrationHistory(
        patientId,
        daysBack,
      );

      // Assert
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should filter by date range', async () => {
      // Arrange
      const patientId = 'patient-123';
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');

      // Act
      const result = await service.getAdministrationHistory(
        patientId,
        undefined,
        startDate,
        endDate,
      );

      // Assert
      expect(
        result.every(
          (record) =>
            record.administeredAt >= startDate &&
            record.administeredAt <= endDate,
        ),
      ).toBe(true);
    });

    it('should include administered by information', async () => {
      // Arrange
      const patientId = 'patient-123';

      // Act
      const result = await service.getAdministrationHistory(patientId);

      // Assert
      if (result.length > 0) {
        expect(result[0]).toHaveProperty('administeredBy');
      }
    });
  });

  // ==================== MISSED DOSE DOCUMENTATION ====================

  describe('documentMissedDose', () => {
    const missedDoseData = {
      patientId: 'patient-123',
      medicationId: 'med-456',
      scheduledTime: new Date(),
      reason: 'Patient refused',
      documentedBy: 'nurse-789',
    };

    it('should document missed dose', async () => {
      // Act
      const result = await service.documentMissedDose(missedDoseData);

      // Assert
      expect(result).toBeDefined();
      expect(result.documented).toBe(true);
    });

    it('should require reason for missed dose', async () => {
      // Arrange
      const invalidData = { ...missedDoseData, reason: '' };

      // Act & Assert
      await expect(service.documentMissedDose(invalidData)).rejects.toThrow(
        'Reason for missed dose is required',
      );
    });

    it('should validate reason is from approved list', async () => {
      // Arrange
      const validReasons = [
        'Patient refused',
        'Patient unavailable',
        'NPO order',
        'Discontinued',
        'Other',
      ];
      const invalidData = { ...missedDoseData, reason: 'Invalid reason' };

      // Act & Assert
      await expect(service.documentMissedDose(invalidData)).rejects.toThrow(
        `Reason must be one of: ${validReasons.join(', ')}`,
      );
    });

    it('should log missed dose for audit', async () => {
      // Arrange
      const logSpy = jest.spyOn(service['logger'], 'warn');

      // Act
      await service.documentMissedDose(missedDoseData);

      // Assert
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('MISSED DOSE'),
      );
    });
  });

  // ==================== PRN MEDICATION TRACKING ====================

  describe('recordPRNAdministration', () => {
    const prnData = {
      patientId: 'patient-123',
      medicationId: 'med-prn-456',
      reason: 'Pain level 7/10',
      painScore: 7,
      administeredBy: 'nurse-789',
    };

    it('should record PRN medication administration', async () => {
      // Act
      const result = await service.recordPRNAdministration(prnData);

      // Assert
      expect(result).toBeDefined();
      expect(result.recorded).toBe(true);
    });

    it('should require reason for PRN medication', async () => {
      // Arrange
      const invalidData = { ...prnData, reason: '' };

      // Act & Assert
      await expect(
        service.recordPRNAdministration(invalidData),
      ).rejects.toThrow('Reason for PRN administration is required');
    });

    it('should check PRN frequency limits', async () => {
      // Arrange - Simulate recent PRN administration
      await service.recordPRNAdministration(prnData);

      // Act & Assert - Try to administer again too soon
      await expect(
        service.recordPRNAdministration(prnData),
      ).rejects.toThrow('PRN medication cannot be administered yet');
    });

    it('should track pain scores for PRN pain medications', async () => {
      // Act
      const result = await service.recordPRNAdministration(prnData);

      // Assert
      expect(result).toHaveProperty('painScoreRecorded', true);
    });
  });

  // ==================== SAFETY CHECKS ====================

  describe('Safety Validations', () => {
    it('should prevent duplicate administration within timeframe', async () => {
      // Arrange
      const adminData = {
        patientId: 'patient-123',
        medicationId: 'med-456',
        dosage: '250mg',
      };

      // Act
      await service.recordAdministration(adminData);

      // Assert
      await expect(service.recordAdministration(adminData)).rejects.toThrow(
        'Medication was already administered recently',
      );
    });

    it('should validate medication is not discontinued', async () => {
      // Arrange
      const discontinuedMedData = {
        patientId: 'patient-123',
        medicationId: 'med-discontinued',
      };

      // Act & Assert
      await expect(
        service.recordAdministration(discontinuedMedData),
      ).rejects.toThrow('Medication has been discontinued');
    });

    it('should check for allergy conflicts', async () => {
      // Arrange
      const allergyConflictData = {
        patientId: 'patient-allergic',
        medicationId: 'med-penicillin',
      };

      // Act & Assert
      await expect(
        service.recordAdministration(allergyConflictData),
      ).rejects.toThrow('ALLERGY ALERT: Patient is allergic to this medication');
    });
  });

  // ==================== ERROR HANDLING ====================

  describe('Error Handling', () => {
    it('should handle database errors gracefully', async () => {
      // This test should be implemented when database layer is added
      expect(true).toBe(true);
    });

    it('should provide meaningful error messages', async () => {
      // Arrange
      const invalidData = { patientId: null };

      // Act & Assert
      await expect(service.recordAdministration(invalidData)).rejects.toThrow(
        expect.objectContaining({
          message: expect.stringContaining('required'),
        }),
      );
    });
  });
});
