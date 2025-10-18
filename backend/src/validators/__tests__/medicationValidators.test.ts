/**
 * LOC: 14CAD75B0C
 * WC-GEN-364 | medicationValidators.test.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - None (leaf node)
 *
 * DOWNSTREAM (imported by):
 *   - None (not imported)
 */

/**
 * WC-GEN-364 | medicationValidators.test.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../medicationValidators | Dependencies: ../medicationValidators
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: Various exports | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

/**
 * Medication Validators Test Suite
 * Comprehensive unit tests for medication validation schemas
 * Tests: Five Rights of Medication Administration, NDC codes, DEA schedules, dosage formats
 */

import {
  createMedicationSchema,
  updateMedicationSchema,
  assignMedicationToStudentSchema,
  updateStudentMedicationSchema,
  logMedicationAdministrationSchema,
  addToInventorySchema,
  updateInventoryQuantitySchema,
  reportAdverseReactionSchema,
  deactivateStudentMedicationSchema,
} from '../medicationValidators';

describe('Medication Validators', () => {
  // ============================================================================
  // MEDICATION CREATION/UPDATE
  // ============================================================================

  describe('createMedicationSchema', () => {
    const validMedication = {
      name: 'Amoxicillin',
      genericName: 'Amoxicillin',
      dosageForm: 'Capsule',
      strength: '500mg',
      manufacturer: 'Generic Pharma',
      ndc: '12345-1234-12',
      isControlled: false,
    };

    it('should validate correct medication data', () => {
      const { error } = createMedicationSchema.validate(validMedication);
      expect(error).toBeUndefined();
    });

    it('should require name', () => {
      const { error } = createMedicationSchema.validate({
        ...validMedication,
        name: undefined,
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('Medication name is required');
    });

    it('should enforce minimum name length', () => {
      const { error } = createMedicationSchema.validate({
        ...validMedication,
        name: 'A',
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('at least 2 characters');
    });

    it('should validate dosage form enum', () => {
      const { error } = createMedicationSchema.validate({
        ...validMedication,
        dosageForm: 'InvalidForm',
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('valid pharmaceutical form');
    });

    it('should validate strength format', () => {
      const { error } = createMedicationSchema.validate({
        ...validMedication,
        strength: 'invalid',
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('valid format');
    });

    it('should accept valid strength formats', () => {
      const validStrengths = ['500mg', '10ml', '2.5g', '100mcg', '5units'];

      validStrengths.forEach((strength) => {
        const { error } = createMedicationSchema.validate({
          ...validMedication,
          strength,
        });
        expect(error).toBeUndefined();
      });
    });

    it('should validate NDC format', () => {
      const { error } = createMedicationSchema.validate({
        ...validMedication,
        ndc: 'invalid-ndc',
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('NDC must be in format');
    });

    it('should accept valid NDC formats', () => {
      const validNDCs = ['12345-1234-12', '12345-123-12'];

      validNDCs.forEach((ndc) => {
        const { error } = createMedicationSchema.validate({
          ...validMedication,
          ndc,
        });
        expect(error).toBeUndefined();
      });
    });

    it('should require DEA schedule for controlled substances', () => {
      const { error } = createMedicationSchema.validate({
        ...validMedication,
        isControlled: true,
        deaSchedule: undefined,
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('DEA Schedule is required');
    });

    it('should validate DEA schedule values', () => {
      const { error } = createMedicationSchema.validate({
        ...validMedication,
        isControlled: true,
        deaSchedule: 'VI',
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('DEA Schedule must be I, II, III, IV, or V');
    });

    it('should default requiresWitness for Schedule I/II', () => {
      const { value } = createMedicationSchema.validate({
        ...validMedication,
        isControlled: true,
        deaSchedule: 'II',
      });
      expect(value.requiresWitness).toBe(true);
    });
  });

  // ============================================================================
  // PRESCRIPTION (ASSIGN MEDICATION TO STUDENT)
  // ============================================================================

  describe('assignMedicationToStudentSchema', () => {
    const validPrescription = {
      studentId: '123e4567-e89b-12d3-a456-426614174000',
      medicationId: '123e4567-e89b-12d3-a456-426614174001',
      dosage: '500mg',
      frequency: 'twice daily',
      route: 'Oral',
      instructions: 'Take with food',
      startDate: new Date(),
      prescribedBy: 'Dr. John Smith',
      prescriptionNumber: 'RX123456',
      refillsRemaining: 3,
    };

    it('should validate correct prescription data', () => {
      const { error } = assignMedicationToStudentSchema.validate(validPrescription);
      expect(error).toBeUndefined();
    });

    it('should require studentId (Right Patient)', () => {
      const { error } = assignMedicationToStudentSchema.validate({
        ...validPrescription,
        studentId: undefined,
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('Student ID is required');
      expect(error?.message).toContain('Right Patient');
    });

    it('should require medicationId (Right Medication)', () => {
      const { error } = assignMedicationToStudentSchema.validate({
        ...validPrescription,
        medicationId: undefined,
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('Medication ID is required');
      expect(error?.message).toContain('Right Medication');
    });

    it('should require dosage (Right Dose)', () => {
      const { error } = assignMedicationToStudentSchema.validate({
        ...validPrescription,
        dosage: undefined,
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('Dosage is required');
      expect(error?.message).toContain('Right Dose');
    });

    it('should validate dosage format', () => {
      const { error } = assignMedicationToStudentSchema.validate({
        ...validPrescription,
        dosage: 'invalid',
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('valid format');
    });

    it('should accept valid dosage formats', () => {
      const validDosages = ['500mg', '2 tablets', '10ml', '1 unit', '3 capsules'];

      validDosages.forEach((dosage) => {
        const { error} = assignMedicationToStudentSchema.validate({
          ...validPrescription,
          dosage,
        });
        expect(error).toBeUndefined();
      });
    });

    it('should validate frequency patterns', () => {
      const validFrequencies = [
        'twice daily',
        'three times daily',
        'every 6 hours',
        'q4h',
        'BID',
        'TID',
        'QID',
        'as needed',
        'before meals',
        'at bedtime',
      ];

      validFrequencies.forEach((frequency) => {
        const { error } = assignMedicationToStudentSchema.validate({
          ...validPrescription,
          frequency,
        });
        expect(error).toBeUndefined();
      });
    });

    it('should require route (Right Route)', () => {
      const { error } = assignMedicationToStudentSchema.validate({
        ...validPrescription,
        route: undefined,
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('Administration route is required');
      expect(error?.message).toContain('Right Route');
    });

    it('should validate route enum', () => {
      const { error } = assignMedicationToStudentSchema.validate({
        ...validPrescription,
        route: 'InvalidRoute',
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('valid administration route');
    });

    it('should reject future start dates', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);

      const { error } = assignMedicationToStudentSchema.validate({
        ...validPrescription,
        startDate: futureDate,
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('cannot be in the future');
    });

    it('should require endDate after startDate', () => {
      const { error } = assignMedicationToStudentSchema.validate({
        ...validPrescription,
        startDate: new Date('2023-02-01'),
        endDate: new Date('2023-01-01'),
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('End date must be after start date');
    });

    it('should require prescribedBy', () => {
      const { error } = assignMedicationToStudentSchema.validate({
        ...validPrescription,
        prescribedBy: undefined,
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('Prescribing physician is required');
    });

    it('should validate prescription number format', () => {
      const { error } = assignMedicationToStudentSchema.validate({
        ...validPrescription,
        prescriptionNumber: 'invalid#@',
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('6-20 alphanumeric characters');
    });

    it('should enforce refills limit', () => {
      const { error } = assignMedicationToStudentSchema.validate({
        ...validPrescription,
        refillsRemaining: 15,
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('cannot exceed 12');
    });
  });

  // ============================================================================
  // MEDICATION ADMINISTRATION LOG
  // ============================================================================

  describe('logMedicationAdministrationSchema', () => {
    const validAdministration = {
      studentMedicationId: '123e4567-e89b-12d3-a456-426614174000',
      dosageGiven: '500mg',
      timeGiven: new Date(),
      notes: 'Patient tolerated well',
      patientVerified: true,
      allergyChecked: true,
    };

    it('should validate correct administration log', () => {
      const { error } = logMedicationAdministrationSchema.validate(validAdministration);
      expect(error).toBeUndefined();
    });

    it('should require dosageGiven (Right Dose)', () => {
      const { error } = logMedicationAdministrationSchema.validate({
        ...validAdministration,
        dosageGiven: undefined,
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('Dosage given is required');
      expect(error?.message).toContain('Right Dose');
    });

    it('should require timeGiven (Right Time)', () => {
      const { error } = logMedicationAdministrationSchema.validate({
        ...validAdministration,
        timeGiven: undefined,
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('Administration time is required');
      expect(error?.message).toContain('Right Time');
    });

    it('should reject future administration times', () => {
      const futureDate = new Date();
      futureDate.setHours(futureDate.getHours() + 1);

      const { error } = logMedicationAdministrationSchema.validate({
        ...validAdministration,
        timeGiven: futureDate,
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('cannot be in the future');
    });

    it('should validate witness UUID format', () => {
      const { error } = logMedicationAdministrationSchema.validate({
        ...validAdministration,
        witnessId: 'invalid-uuid',
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('valid UUID');
    });

    it('should default patientVerified and allergyChecked to true', () => {
      const { value } = logMedicationAdministrationSchema.validate({
        studentMedicationId: '123e4567-e89b-12d3-a456-426614174000',
        dosageGiven: '500mg',
        timeGiven: new Date(),
      });
      expect(value.patientVerified).toBe(true);
      expect(value.allergyChecked).toBe(true);
    });
  });

  // ============================================================================
  // INVENTORY MANAGEMENT
  // ============================================================================

  describe('addToInventorySchema', () => {
    const validInventory = {
      medicationId: '123e4567-e89b-12d3-a456-426614174000',
      batchNumber: 'BATCH-2023-001',
      expirationDate: new Date('2025-12-31'),
      quantity: 100,
      reorderLevel: 20,
      costPerUnit: 2.50,
      supplier: 'MedSupply Inc',
      location: 'Storage Room A, Shelf 3',
    };

    it('should validate correct inventory data', () => {
      const { error } = addToInventorySchema.validate(validInventory);
      expect(error).toBeUndefined();
    });

    it('should require medicationId', () => {
      const { error } = addToInventorySchema.validate({
        ...validInventory,
        medicationId: undefined,
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('Medication ID is required');
    });

    it('should validate batch number format', () => {
      const { error } = addToInventorySchema.validate({
        ...validInventory,
        batchNumber: 'AB',
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('3-50 alphanumeric characters');
    });

    it('should require future expiration date', () => {
      const pastDate = new Date('2020-01-01');
      const { error } = addToInventorySchema.validate({
        ...validInventory,
        expirationDate: pastDate,
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('cannot add expired medication');
    });

    it('should require positive quantity', () => {
      const { error } = addToInventorySchema.validate({
        ...validInventory,
        quantity: 0,
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('at least 1');
    });

    it('should enforce quantity maximum', () => {
      const { error } = addToInventorySchema.validate({
        ...validInventory,
        quantity: 150000,
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('cannot exceed 100,000');
    });

    it('should default reorderLevel', () => {
      const { value } = addToInventorySchema.validate({
        medicationId: '123e4567-e89b-12d3-a456-426614174000',
        batchNumber: 'BATCH-001',
        expirationDate: new Date('2025-12-31'),
        quantity: 100,
      });
      expect(value.reorderLevel).toBe(10);
    });
  });

  describe('updateInventoryQuantitySchema', () => {
    const validUpdate = {
      quantity: 50,
      reason: 'Monthly stock count adjustment',
      adjustmentType: 'CORRECTION',
    };

    it('should validate correct quantity update', () => {
      const { error } = updateInventoryQuantitySchema.validate(validUpdate);
      expect(error).toBeUndefined();
    });

    it('should require reason for audit trail', () => {
      const { error } = updateInventoryQuantitySchema.validate({
        ...validUpdate,
        reason: undefined,
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('required for audit trail');
    });

    it('should enforce minimum reason length', () => {
      const { error } = updateInventoryQuantitySchema.validate({
        ...validUpdate,
        reason: 'Bad',
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('at least 5 characters');
    });

    it('should require adjustment type', () => {
      const { error } = updateInventoryQuantitySchema.validate({
        ...validUpdate,
        adjustmentType: undefined,
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('Adjustment type is required');
    });

    it('should validate adjustment type enum', () => {
      const validTypes = ['CORRECTION', 'DISPOSAL', 'TRANSFER', 'ADMINISTRATION', 'EXPIRED', 'LOST', 'DAMAGED', 'RETURNED'];

      validTypes.forEach((type) => {
        const { error } = updateInventoryQuantitySchema.validate({
          ...validUpdate,
          adjustmentType: type,
        });
        expect(error).toBeUndefined();
      });
    });
  });

  // ============================================================================
  // ADVERSE REACTION REPORTING
  // ============================================================================

  describe('reportAdverseReactionSchema', () => {
    const validReaction = {
      studentMedicationId: '123e4567-e89b-12d3-a456-426614174000',
      severity: 'MODERATE',
      reaction: 'Patient developed a mild rash on forearms and itching',
      actionTaken: 'Medication discontinued. Antihistamine administered. Patient monitored.',
      notes: 'Reaction resolved within 2 hours',
      reportedAt: new Date(),
      emergencyServicesContacted: false,
      parentNotified: true,
    };

    it('should validate correct adverse reaction report', () => {
      const { error } = reportAdverseReactionSchema.validate(validReaction);
      expect(error).toBeUndefined();
    });

    it('should require severity', () => {
      const { error } = reportAdverseReactionSchema.validate({
        ...validReaction,
        severity: undefined,
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('Severity is required');
    });

    it('should validate severity enum', () => {
      const { error } = reportAdverseReactionSchema.validate({
        ...validReaction,
        severity: 'INVALID',
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('MILD, MODERATE, SEVERE, or LIFE_THREATENING');
    });

    it('should enforce minimum reaction description length', () => {
      const { error } = reportAdverseReactionSchema.validate({
        ...validReaction,
        reaction: 'Rash',
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('at least 10 characters');
    });

    it('should require actionTaken', () => {
      const { error } = reportAdverseReactionSchema.validate({
        ...validReaction,
        actionTaken: undefined,
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('Action taken is required');
    });

    it('should require emergency services flag for SEVERE reactions', () => {
      const { error } = reportAdverseReactionSchema.validate({
        ...validReaction,
        severity: 'SEVERE',
        emergencyServicesContacted: undefined,
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('emergency services were contacted');
    });

    it('should require parent notification flag for MODERATE+ reactions', () => {
      const { error } = reportAdverseReactionSchema.validate({
        ...validReaction,
        severity: 'MODERATE',
        parentNotified: undefined,
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('parent was notified');
    });
  });

  // ============================================================================
  // DEACTIVATION
  // ============================================================================

  describe('deactivateStudentMedicationSchema', () => {
    const validDeactivation = {
      reason: 'Treatment course completed successfully',
      deactivationType: 'COMPLETED',
    };

    it('should validate correct deactivation', () => {
      const { error } = deactivateStudentMedicationSchema.validate(validDeactivation);
      expect(error).toBeUndefined();
    });

    it('should require reason for audit trail', () => {
      const { error } = deactivateStudentMedicationSchema.validate({
        ...validDeactivation,
        reason: undefined,
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('required for audit trail');
    });

    it('should enforce minimum reason length', () => {
      const { error } = deactivateStudentMedicationSchema.validate({
        ...validDeactivation,
        reason: 'Done',
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('at least 10 characters');
    });

    it('should require deactivationType', () => {
      const { error } = deactivateStudentMedicationSchema.validate({
        ...validDeactivation,
        deactivationType: undefined,
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('Deactivation type is required');
    });

    it('should validate deactivationType enum', () => {
      const validTypes = ['COMPLETED', 'DISCONTINUED', 'CHANGED', 'ADVERSE_REACTION', 'PATIENT_REQUEST', 'PHYSICIAN_ORDER', 'OTHER'];

      validTypes.forEach((type) => {
        const { error } = deactivateStudentMedicationSchema.validate({
          ...validDeactivation,
          deactivationType: type,
        });
        expect(error).toBeUndefined();
      });
    });
  });
});
