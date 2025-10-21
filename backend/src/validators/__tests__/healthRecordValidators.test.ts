/**
 * LOC: 05AA92BFDB
 * WC-GEN-363 | healthRecordValidators.test.ts - General utility functions and operations
 *
 * UPSTREAM (imports from):
 *   - None (leaf node)
 *
 * DOWNSTREAM (imported by):
 *   - None (not imported)
 */

/**
 * WC-GEN-363 | healthRecordValidators.test.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../healthRecordValidators | Dependencies: ../healthRecordValidators
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: Various exports | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

/**
 * Health Record Validators Test Suite
 * Comprehensive unit tests for Joi validation schemas
 * Tests: happy paths, boundary conditions, invalid data, edge cases, healthcare-specific validation
 */

import {
  createHealthRecordSchema,
  updateHealthRecordSchema,
  createAllergySchema,
  updateAllergySchema,
  createConditionSchema,
  updateConditionSchema,
  createVaccinationSchema,
  updateVaccinationSchema,
  createScreeningSchema,
  updateScreeningSchema,
  createGrowthMeasurementSchema,
  updateGrowthMeasurementSchema,
  createVitalSignsSchema,
  updateVitalSignsSchema,
} from '../healthRecordValidators';

describe('Health Record Validators', () => {
  // ============================================================================
  // HEALTH RECORD VALIDATION
  // ============================================================================

  describe('createHealthRecordSchema', () => {
    const validData = {
      studentId: '123e4567-e89b-12d3-a456-426614174000',
      recordType: 'GENERAL',
      recordDate: new Date(),
      title: 'Annual Checkup',
      description: 'Routine annual health examination',
      isConfidential: false,
    };

    it('should validate correct health record data', () => {
      const { error } = createHealthRecordSchema.validate(validData);
      expect(error).toBeUndefined();
    });

    it('should require studentId', () => {
      const { error } = createHealthRecordSchema.validate({
        ...validData,
        studentId: undefined,
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('Student ID is required');
    });

    it('should validate UUID format for studentId', () => {
      const { error } = createHealthRecordSchema.validate({
        ...validData,
        studentId: 'invalid-uuid',
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('valid UUID');
    });

    it('should require recordType', () => {
      const { error } = createHealthRecordSchema.validate({
        ...validData,
        recordType: undefined,
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('Record type is required');
    });

    it('should validate recordType enum', () => {
      const { error } = createHealthRecordSchema.validate({
        ...validData,
        recordType: 'INVALID_TYPE',
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('Record type must be one of');
    });

    it('should reject future recordDate', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);

      const { error } = createHealthRecordSchema.validate({
        ...validData,
        recordDate: futureDate,
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('cannot be in the future');
    });

    it('should require title', () => {
      const { error } = createHealthRecordSchema.validate({
        ...validData,
        title: undefined,
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('Title is required');
    });

    it('should enforce minimum title length', () => {
      const { error } = createHealthRecordSchema.validate({
        ...validData,
        title: 'AB',
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('at least 3 characters');
    });

    it('should enforce maximum title length', () => {
      const { error } = createHealthRecordSchema.validate({
        ...validData,
        title: 'A'.repeat(201),
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('cannot exceed 200 characters');
    });

    it('should accept valid optional fields', () => {
      const { error } = createHealthRecordSchema.validate({
        ...validData,
        providerId: '123e4567-e89b-12d3-a456-426614174001',
        description: 'Detailed description',
        attachments: ['https://example.com/file1.pdf'],
        metadata: { key: 'value' },
        tags: ['urgent', 'followup'],
      });
      expect(error).toBeUndefined();
    });

    it('should validate attachments as URIs', () => {
      const { error } = createHealthRecordSchema.validate({
        ...validData,
        attachments: ['not-a-uri'],
      });
      expect(error).toBeDefined();
    });

    it('should enforce maximum tag length', () => {
      const { error } = createHealthRecordSchema.validate({
        ...validData,
        tags: ['A'.repeat(51)],
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('cannot exceed 50 characters');
    });
  });

  // ============================================================================
  // ALLERGY VALIDATION
  // ============================================================================

  describe('createAllergySchema', () => {
    const validAllergy = {
      studentId: '123e4567-e89b-12d3-a456-426614174000',
      allergen: 'Peanuts',
      allergyType: 'FOOD',
      severity: 'SEVERE',
      symptoms: ['Hives', 'Swelling', 'Difficulty breathing'],
      reactions: 'Anaphylaxis',
      treatment: 'Immediate epinephrine administration and emergency services',
      hasEpiPen: true,
      epiPenLocation: 'Nurse office drawer A',
      epiPenExpiration: new Date('2025-12-31'),
      isActive: true,
    };

    it('should validate correct allergy data', () => {
      const { error } = createAllergySchema.validate(validAllergy);
      expect(error).toBeUndefined();
    });

    it('should require allergen', () => {
      const { error } = createAllergySchema.validate({
        ...validAllergy,
        allergen: undefined,
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('Allergen is required');
    });

    it('should enforce minimum allergen length', () => {
      const { error } = createAllergySchema.validate({
        ...validAllergy,
        allergen: 'A',
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('at least 2 characters');
    });

    it('should validate allergyType enum', () => {
      const { error } = createAllergySchema.validate({
        ...validAllergy,
        allergyType: 'INVALID',
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('Allergy type must be one of');
    });

    it('should validate severity enum', () => {
      const { error } = createAllergySchema.validate({
        ...validAllergy,
        severity: 'INVALID',
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('Severity must be one of');
    });

    it('should require at least one symptom', () => {
      const { error } = createAllergySchema.validate({
        ...validAllergy,
        symptoms: [],
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('At least one symptom is required');
    });

    it('should require treatment for SEVERE allergies', () => {
      const { error } = createAllergySchema.validate({
        ...validAllergy,
        severity: 'SEVERE',
        treatment: '',
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('Treatment is required for SEVERE');
    });

    it('should require treatment for LIFE_THREATENING allergies', () => {
      const { error } = createAllergySchema.validate({
        ...validAllergy,
        severity: 'LIFE_THREATENING',
        treatment: '',
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('Treatment is required');
    });

    it('should require EpiPen info for LIFE_THREATENING allergies', () => {
      const { error } = createAllergySchema.validate({
        ...validAllergy,
        severity: 'LIFE_THREATENING',
        hasEpiPen: undefined,
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('EpiPen information is required');
    });

    it('should require epiPenLocation when hasEpiPen is true', () => {
      const { error } = createAllergySchema.validate({
        ...validAllergy,
        hasEpiPen: true,
        epiPenLocation: '',
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('EpiPen location is required');
    });

    it('should require epiPenExpiration when hasEpiPen is true', () => {
      const { error } = createAllergySchema.validate({
        ...validAllergy,
        hasEpiPen: true,
        epiPenExpiration: undefined,
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('EpiPen expiration date is required');
    });

    it('should reject expired EpiPen', () => {
      const pastDate = new Date('2020-01-01');
      const { error } = createAllergySchema.validate({
        ...validAllergy,
        hasEpiPen: true,
        epiPenExpiration: pastDate,
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('EpiPen has expired');
    });

    it('should reject future diagnosis dates', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);

      const { error } = createAllergySchema.validate({
        ...validAllergy,
        diagnosedDate: futureDate,
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('cannot be in the future');
    });
  });

  // ============================================================================
  // CHRONIC CONDITION VALIDATION
  // ============================================================================

  describe('createConditionSchema', () => {
    const validCondition = {
      studentId: '123e4567-e89b-12d3-a456-426614174000',
      condition: 'Type 1 Diabetes',
      icdCode: 'E10.9',
      severity: 'SEVERE',
      diagnosedDate: new Date('2020-01-15'),
      diagnosedBy: 'Dr. Smith',
      symptoms: ['Frequent urination', 'Excessive thirst'],
      triggers: ['Stress', 'Illness'],
      treatment: 'Insulin therapy and blood glucose monitoring',
      actionPlan: 'Monitor blood glucose 4 times daily. Administer insulin as prescribed. If blood glucose drops below 70, provide fast-acting carbohydrates.',
      restrictions: ['No unsupervised swimming'],
      accommodations: ['Extra bathroom breaks', 'Access to snacks'],
      isActive: true,
    };

    it('should validate correct condition data', () => {
      const { error } = createConditionSchema.validate(validCondition);
      expect(error).toBeUndefined();
    });

    it('should require condition name', () => {
      const { error } = createConditionSchema.validate({
        ...validCondition,
        condition: undefined,
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('Condition is required');
    });

    it('should validate ICD-10 code format', () => {
      const { error } = createConditionSchema.validate({
        ...validCondition,
        icdCode: 'INVALID',
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('ICD-10 format');
    });

    it('should accept valid ICD-10 codes', () => {
      const validCodes = ['E11.9', 'J45.40', 'M79.3'];

      validCodes.forEach((code) => {
        const { error } = createConditionSchema.validate({
          ...validCondition,
          icdCode: code,
        });
        expect(error).toBeUndefined();
      });
    });

    it('should require severity', () => {
      const { error } = createConditionSchema.validate({
        ...validCondition,
        severity: undefined,
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('Severity is required');
    });

    it('should validate severity enum', () => {
      const { error } = createConditionSchema.validate({
        ...validCondition,
        severity: 'INVALID',
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('Severity must be one of');
    });

    it('should require diagnosedDate', () => {
      const { error } = createConditionSchema.validate({
        ...validCondition,
        diagnosedDate: undefined,
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('Diagnosed date is required');
    });

    it('should reject future diagnosis dates', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);

      const { error } = createConditionSchema.validate({
        ...validCondition,
        diagnosedDate: futureDate,
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('cannot be in the future');
    });

    it('should require action plan for SEVERE conditions', () => {
      const { error } = createConditionSchema.validate({
        ...validCondition,
        severity: 'SEVERE',
        actionPlan: '',
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('Action plan is required for SEVERE');
    });

    it('should require action plan for CRITICAL conditions', () => {
      const { error } = createConditionSchema.validate({
        ...validCondition,
        severity: 'CRITICAL',
        actionPlan: '',
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('Action plan is required');
    });

    it('should enforce minimum action plan length', () => {
      const { error } = createConditionSchema.validate({
        ...validCondition,
        severity: 'SEVERE',
        actionPlan: 'Short plan',
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('at least 20 characters');
    });

    it('should validate medication IDs as UUIDs', () => {
      const { error } = createConditionSchema.validate({
        ...validCondition,
        medications: ['invalid-uuid'],
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('valid UUIDs');
    });

    it('should reject past next review dates', () => {
      const pastDate = new Date('2020-01-01');
      const { error } = createConditionSchema.validate({
        ...validCondition,
        nextReviewDate: pastDate,
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('must be in the future');
    });
  });

  // ============================================================================
  // VACCINATION VALIDATION
  // ============================================================================

  describe('createVaccinationSchema', () => {
    const validVaccination = {
      studentId: '123e4567-e89b-12d3-a456-426614174000',
      vaccineName: 'Measles, Mumps, Rubella (MMR)',
      cvxCode: '03',
      ndcCode: '00006-4681-00',
      manufacturer: 'Merck & Co',
      lotNumber: 'ABC123',
      expirationDate: new Date('2025-12-31'),
      administeredDate: new Date('2023-01-15'),
      administeredBy: 'Nurse Johnson',
      administrationSite: 'LEFT_ARM',
      route: 'IM',
      dosage: '0.5ml',
      doseNumber: 1,
      totalDoses: 2,
      nextDoseDate: new Date('2024-01-15'),
      isValid: true,
    };

    it('should validate correct vaccination data', () => {
      const { error } = createVaccinationSchema.validate(validVaccination);
      expect(error).toBeUndefined();
    });

    it('should require vaccine name', () => {
      const { error } = createVaccinationSchema.validate({
        ...validVaccination,
        vaccineName: undefined,
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('Vaccine name is required');
    });

    it('should validate CVX code format', () => {
      const { error } = createVaccinationSchema.validate({
        ...validVaccination,
        cvxCode: 'ABC',
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('CVX code must be 1-3 digits');
    });

    it('should accept valid CVX codes', () => {
      const validCodes = ['03', '20', '140'];

      validCodes.forEach((code) => {
        const { error } = createVaccinationSchema.validate({
          ...validVaccination,
          cvxCode: code,
        });
        expect(error).toBeUndefined();
      });
    });

    it('should validate NDC code format', () => {
      const { error } = createVaccinationSchema.validate({
        ...validVaccination,
        ndcCode: 'INVALID',
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('NDC code must be in format');
    });

    it('should require lot number', () => {
      const { error } = createVaccinationSchema.validate({
        ...validVaccination,
        lotNumber: '',
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('Lot number is required');
    });

    it('should require future expiration date', () => {
      const pastDate = new Date('2020-01-01');
      const { error } = createVaccinationSchema.validate({
        ...validVaccination,
        expirationDate: pastDate,
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('Vaccine has expired');
    });

    it('should reject future administration dates', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);

      const { error } = createVaccinationSchema.validate({
        ...validVaccination,
        administeredDate: futureDate,
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('cannot be in the future');
    });

    it('should validate administration site enum', () => {
      const { error } = createVaccinationSchema.validate({
        ...validVaccination,
        administrationSite: 'INVALID',
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('Administration site must be one of');
    });

    it('should validate route enum', () => {
      const { error } = createVaccinationSchema.validate({
        ...validVaccination,
        route: 'INVALID',
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('Route must be one of');
    });

    it('should require dose number', () => {
      const { error } = createVaccinationSchema.validate({
        ...validVaccination,
        doseNumber: undefined,
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('Dose number is required');
    });

    it('should enforce minimum dose number', () => {
      const { error } = createVaccinationSchema.validate({
        ...validVaccination,
        doseNumber: 0,
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('Dose number must be at least 1');
    });

    it('should require totalDoses >= doseNumber', () => {
      const { error } = createVaccinationSchema.validate({
        ...validVaccination,
        doseNumber: 2,
        totalDoses: 1,
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('Total doses must be greater than or equal');
    });
  });

  // ============================================================================
  // VITAL SIGNS VALIDATION
  // ============================================================================

  describe('createVitalSignsSchema', () => {
    const validVitals = {
      studentId: '123e4567-e89b-12d3-a456-426614174000',
      recordedDate: new Date(),
      temperature: 37.0,
      temperatureUnit: 'C',
      heartRate: 75,
      respiratoryRate: 16,
      bloodPressureSystolic: 120,
      bloodPressureDiastolic: 80,
      oxygenSaturation: 98,
      painLevel: 0,
      recordedBy: 'Nurse Smith',
    };

    it('should validate correct vital signs data', () => {
      const { error } = createVitalSignsSchema.validate(validVitals);
      expect(error).toBeUndefined();
    });

    it('should enforce temperature minimum', () => {
      const { error } = createVitalSignsSchema.validate({
        ...validVitals,
        temperature: 30,
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('at least 35');
    });

    it('should enforce temperature maximum', () => {
      const { error } = createVitalSignsSchema.validate({
        ...validVitals,
        temperature: 45,
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('cannot exceed 42');
    });

    it('should validate temperature unit', () => {
      const { error } = createVitalSignsSchema.validate({
        ...validVitals,
        temperatureUnit: 'INVALID',
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('Temperature unit must be C');
    });

    it('should enforce heart rate range', () => {
      const { error } = createVitalSignsSchema.validate({
        ...validVitals,
        heartRate: 250,
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('cannot exceed 200');
    });

    it('should enforce respiratory rate range', () => {
      const { error } = createVitalSignsSchema.validate({
        ...validVitals,
        respiratoryRate: 70,
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('cannot exceed 60');
    });

    it('should enforce systolic BP range', () => {
      const { error } = createVitalSignsSchema.validate({
        ...validVitals,
        bloodPressureSystolic: 250,
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('cannot exceed 200');
    });

    it('should enforce diastolic BP range', () => {
      const { error } = createVitalSignsSchema.validate({
        ...validVitals,
        bloodPressureDiastolic: 150,
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('cannot exceed 130');
    });

    it('should require diastolic < systolic', () => {
      const { error } = createVitalSignsSchema.validate({
        ...validVitals,
        bloodPressureSystolic: 120,
        bloodPressureDiastolic: 130,
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('must be less than systolic');
    });

    it('should enforce oxygen saturation range', () => {
      const { error } = createVitalSignsSchema.validate({
        ...validVitals,
        oxygenSaturation: 105,
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('cannot exceed 100');
    });

    it('should enforce pain level range', () => {
      const { error } = createVitalSignsSchema.validate({
        ...validVitals,
        painLevel: 11,
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('must be between 0 and 10');
    });

    it('should require recordedBy', () => {
      const { error } = createVitalSignsSchema.validate({
        ...validVitals,
        recordedBy: undefined,
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('Recorder name is required');
    });
  });

  // ============================================================================
  // GROWTH MEASUREMENT VALIDATION
  // ============================================================================

  describe('createGrowthMeasurementSchema', () => {
    const validGrowth = {
      studentId: '123e4567-e89b-12d3-a456-426614174000',
      measurementDate: new Date(),
      height: 150,
      heightUnit: 'CM',
      weight: 45,
      weightUnit: 'KG',
      bmi: 20.0,
      heightPercentile: 50,
      weightPercentile: 50,
      bmiPercentile: 50,
      measuredBy: 'Nurse Johnson',
    };

    it('should validate correct growth measurement data', () => {
      const { error } = createGrowthMeasurementSchema.validate(validGrowth);
      expect(error).toBeUndefined();
    });

    it('should require height', () => {
      const { error } = createGrowthMeasurementSchema.validate({
        ...validGrowth,
        height: undefined,
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('Height is required');
    });

    it('should enforce positive height', () => {
      const { error } = createGrowthMeasurementSchema.validate({
        ...validGrowth,
        height: -10,
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('must be a positive number');
    });

    it('should enforce realistic height maximum', () => {
      const { error } = createGrowthMeasurementSchema.validate({
        ...validGrowth,
        height: 350,
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('cannot exceed 300');
    });

    it('should require weight', () => {
      const { error } = createGrowthMeasurementSchema.validate({
        ...validGrowth,
        weight: undefined,
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('Weight is required');
    });

    it('should enforce positive weight', () => {
      const { error } = createGrowthMeasurementSchema.validate({
        ...validGrowth,
        weight: -5,
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('must be a positive number');
    });

    it('should enforce percentile range', () => {
      const { error } = createGrowthMeasurementSchema.validate({
        ...validGrowth,
        heightPercentile: 101,
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('must be between 0 and 100');
    });

    it('should require measuredBy', () => {
      const { error } = createGrowthMeasurementSchema.validate({
        ...validGrowth,
        measuredBy: undefined,
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('Measurer name is required');
    });
  });

  // ============================================================================
  // UPDATE SCHEMA TESTS
  // ============================================================================

  describe('updateHealthRecordSchema', () => {
    it('should require at least one field', () => {
      const { error } = updateHealthRecordSchema.validate({});
      expect(error).toBeDefined();
    });

    it('should accept partial updates', () => {
      const { error } = updateHealthRecordSchema.validate({
        title: 'Updated Title',
      });
      expect(error).toBeUndefined();
    });

    it('should validate fields when provided', () => {
      const { error } = updateHealthRecordSchema.validate({
        title: 'AB', // Too short
      });
      expect(error).toBeDefined();
      expect(error?.message).toContain('at least 3 characters');
    });
  });

  describe('updateAllergySchema', () => {
    it('should require at least one field', () => {
      const { error } = updateAllergySchema.validate({});
      expect(error).toBeDefined();
    });

    it('should accept partial updates', () => {
      const { error } = updateAllergySchema.validate({
        notes: 'Updated notes',
      });
      expect(error).toBeUndefined();
    });
  });
});
