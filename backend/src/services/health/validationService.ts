/**
 * WC-GEN-258 | validationService.ts - General utility functions and operations
 * Purpose: general utility functions and operations
 * Upstream: ../../database/types/enums, ./types | Dependencies: ../../database/types/enums, ./types
 * Downstream: Routes, services, other modules | Called by: Application components
 * Related: Similar modules, tests, documentation
 * Exports: constants | Key Services: Core functionality
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Module loading → Function execution → Response handling
 * LLM Context: general utility functions and operations, part of backend architecture
 */

import { HealthRecordType, AllergySeverity, ConditionStatus, ConditionSeverity } from '../../database/types/enums';
import {
  CreateHealthRecordData,
  UpdateHealthRecordData,
  CreateAllergyData,
  UpdateAllergyData,
  CreateVaccinationData,
  UpdateVaccinationData,
  CreateChronicConditionData,
  UpdateChronicConditionData,
  VitalSigns
} from './types';

/**
 * Comprehensive validation service for all health record data
 * Provides validation for health records, allergies, vaccinations, chronic conditions, and vital signs
 */
class ValidationService {
  
  // ============================================================================
  // HEALTH RECORD VALIDATION
  // ============================================================================

  /**
   * Validate health record creation data
   */
  validateCreateHealthRecord(data: CreateHealthRecordData): string[] {
    const errors: string[] = [];

    // Required field validation
    if (!data.studentId) {
      errors.push('Student ID is required');
    }

    if (!data.type) {
      errors.push('Health record type is required');
    } else if (!Object.values(HealthRecordType).includes(data.type)) {
      errors.push('Invalid health record type');
    }

    if (!data.date) {
      errors.push('Date is required');
    } else if (new Date(data.date) > new Date()) {
      errors.push('Date cannot be in the future');
    }

    if (!data.description || data.description.trim().length === 0) {
      errors.push('Description is required');
    } else if (data.description.length > 1000) {
      errors.push('Description cannot exceed 1000 characters');
    }

    // Optional field validation
    if (data.provider && data.provider.length > 200) {
      errors.push('Provider name cannot exceed 200 characters');
    }

    if (data.notes && data.notes.length > 2000) {
      errors.push('Notes cannot exceed 2000 characters');
    }

    // Vital signs validation if present
    if (data.vital) {
      const vitalErrors = this.validateVitalSigns(data.vital);
      errors.push(...vitalErrors);
    }

    return errors;
  }

  /**
   * Validate health record update data
   */
  validateUpdateHealthRecord(data: UpdateHealthRecordData): string[] {
    const errors: string[] = [];

    // Optional field validation
    if (data.type && !Object.values(HealthRecordType).includes(data.type)) {
      errors.push('Invalid health record type');
    }

    if (data.date && new Date(data.date) > new Date()) {
      errors.push('Date cannot be in the future');
    }

    if (data.description !== undefined) {
      if (!data.description || data.description.trim().length === 0) {
        errors.push('Description cannot be empty');
      } else if (data.description.length > 1000) {
        errors.push('Description cannot exceed 1000 characters');
      }
    }

    if (data.provider && data.provider.length > 200) {
      errors.push('Provider name cannot exceed 200 characters');
    }

    if (data.notes && data.notes.length > 2000) {
      errors.push('Notes cannot exceed 2000 characters');
    }

    // Vital signs validation if present
    if (data.vital) {
      const vitalErrors = this.validateVitalSigns(data.vital);
      errors.push(...vitalErrors);
    }

    return errors;
  }

  // ============================================================================
  // VITAL SIGNS VALIDATION
  // ============================================================================

  /**
   * Validate vital signs data
   */
  validateVitalSigns(vitals: VitalSigns): string[] {
    const errors: string[] = [];

    // Temperature validation (in Celsius)
    if (vitals.temperature !== undefined) {
      if (vitals.temperature < 30 || vitals.temperature > 45) {
        errors.push('Temperature must be between 30°C and 45°C');
      }
    }

    // Blood pressure validation
    if (vitals.bloodPressureSystolic !== undefined) {
      if (vitals.bloodPressureSystolic < 60 || vitals.bloodPressureSystolic > 250) {
        errors.push('Systolic blood pressure must be between 60 and 250 mmHg');
      }
    }

    if (vitals.bloodPressureDiastolic !== undefined) {
      if (vitals.bloodPressureDiastolic < 30 || vitals.bloodPressureDiastolic > 150) {
        errors.push('Diastolic blood pressure must be between 30 and 150 mmHg');
      }
    }

    // Validate that systolic is higher than diastolic
    if (vitals.bloodPressureSystolic && vitals.bloodPressureDiastolic) {
      if (vitals.bloodPressureSystolic <= vitals.bloodPressureDiastolic) {
        errors.push('Systolic blood pressure must be higher than diastolic blood pressure');
      }
    }

    // Heart rate validation
    if (vitals.heartRate !== undefined) {
      if (vitals.heartRate < 30 || vitals.heartRate > 250) {
        errors.push('Heart rate must be between 30 and 250 bpm');
      }
    }

    // Respiratory rate validation
    if (vitals.respiratoryRate !== undefined) {
      if (vitals.respiratoryRate < 5 || vitals.respiratoryRate > 60) {
        errors.push('Respiratory rate must be between 5 and 60 breaths per minute');
      }
    }

    // Oxygen saturation validation
    if (vitals.oxygenSaturation !== undefined) {
      if (vitals.oxygenSaturation < 70 || vitals.oxygenSaturation > 100) {
        errors.push('Oxygen saturation must be between 70% and 100%');
      }
    }

    // Height validation (in cm)
    if (vitals.height !== undefined) {
      if (vitals.height < 30 || vitals.height > 250) {
        errors.push('Height must be between 30 and 250 cm');
      }
    }

    // Weight validation (in kg)
    if (vitals.weight !== undefined) {
      if (vitals.weight < 1 || vitals.weight > 300) {
        errors.push('Weight must be between 1 and 300 kg');
      }
    }

    // BMI validation (if provided)
    if (vitals.bmi !== undefined) {
      if (vitals.bmi < 10 || vitals.bmi > 60) {
        errors.push('BMI must be between 10 and 60');
      }
    }

    return errors;
  }

  // ============================================================================
  // ALLERGY VALIDATION
  // ============================================================================

  /**
   * Validate allergy creation data
   */
  validateCreateAllergy(data: CreateAllergyData): string[] {
    const errors: string[] = [];

    // Required field validation
    if (!data.studentId) {
      errors.push('Student ID is required');
    }

    if (!data.allergen || data.allergen.trim().length === 0) {
      errors.push('Allergen is required');
    } else if (data.allergen.length > 200) {
      errors.push('Allergen name cannot exceed 200 characters');
    }

    if (!data.severity) {
      errors.push('Severity is required');
    } else if (!Object.values(AllergySeverity).includes(data.severity)) {
      errors.push('Invalid allergy severity');
    }

    // Optional field validation
    if (data.reaction && data.reaction.length > 500) {
      errors.push('Reaction description cannot exceed 500 characters');
    }

    if (data.treatment && data.treatment.length > 500) {
      errors.push('Treatment description cannot exceed 500 characters');
    }

    if (data.verifiedBy && data.verifiedBy.length > 200) {
      errors.push('Verified by field cannot exceed 200 characters');
    }

    return errors;
  }

  /**
   * Validate allergy update data
   */
  validateUpdateAllergy(data: UpdateAllergyData): string[] {
    const errors: string[] = [];

    // Optional field validation
    if (data.allergen !== undefined) {
      if (!data.allergen || data.allergen.trim().length === 0) {
        errors.push('Allergen cannot be empty');
      } else if (data.allergen.length > 200) {
        errors.push('Allergen name cannot exceed 200 characters');
      }
    }

    if (data.severity && !Object.values(AllergySeverity).includes(data.severity)) {
      errors.push('Invalid allergy severity');
    }

    if (data.reaction && data.reaction.length > 500) {
      errors.push('Reaction description cannot exceed 500 characters');
    }

    if (data.treatment && data.treatment.length > 500) {
      errors.push('Treatment description cannot exceed 500 characters');
    }

    if (data.verifiedBy && data.verifiedBy.length > 200) {
      errors.push('Verified by field cannot exceed 200 characters');
    }

    return errors;
  }

  // ============================================================================
  // VACCINATION VALIDATION
  // ============================================================================

  /**
   * Validate vaccination creation data
   */
  validateCreateVaccination(data: CreateVaccinationData): string[] {
    const errors: string[] = [];

    // Required field validation
    if (!data.studentId) {
      errors.push('Student ID is required');
    }

    if (!data.vaccineName || data.vaccineName.trim().length === 0) {
      errors.push('Vaccine name is required');
    } else if (data.vaccineName.length > 200) {
      errors.push('Vaccine name cannot exceed 200 characters');
    }

    if (!data.administrationDate) {
      errors.push('Administration date is required');
    } else if (new Date(data.administrationDate) > new Date()) {
      errors.push('Administration date cannot be in the future');
    }

    if (!data.administeredBy || data.administeredBy.trim().length === 0) {
      errors.push('Administered by is required');
    } else if (data.administeredBy.length > 200) {
      errors.push('Administered by field cannot exceed 200 characters');
    }

    // Optional field validation
    if (data.cvxCode && (data.cvxCode.length < 1 || data.cvxCode.length > 10)) {
      errors.push('CVX code must be between 1 and 10 characters');
    }

    if (data.lotNumber && data.lotNumber.length > 50) {
      errors.push('Lot number cannot exceed 50 characters');
    }

    if (data.manufacturer && data.manufacturer.length > 200) {
      errors.push('Manufacturer name cannot exceed 200 characters');
    }

    if (data.doseNumber !== undefined && (data.doseNumber < 1 || data.doseNumber > 20)) {
      errors.push('Dose number must be between 1 and 20');
    }

    if (data.totalDoses !== undefined && (data.totalDoses < 1 || data.totalDoses > 20)) {
      errors.push('Total doses must be between 1 and 20');
    }

    if (data.doseNumber && data.totalDoses && data.doseNumber > data.totalDoses) {
      errors.push('Dose number cannot be greater than total doses');
    }

    if (data.expirationDate && new Date(data.expirationDate) < new Date(data.administrationDate)) {
      errors.push('Expiration date cannot be before administration date');
    }

    if (data.nextDueDate && new Date(data.nextDueDate) < new Date(data.administrationDate)) {
      errors.push('Next due date cannot be before administration date');
    }

    return errors;
  }

  /**
   * Validate vaccination update data
   */
  validateUpdateVaccination(data: UpdateVaccinationData): string[] {
    const errors: string[] = [];

    // Optional field validation
    if (data.vaccineName !== undefined) {
      if (!data.vaccineName || data.vaccineName.trim().length === 0) {
        errors.push('Vaccine name cannot be empty');
      } else if (data.vaccineName.length > 200) {
        errors.push('Vaccine name cannot exceed 200 characters');
      }
    }

    if (data.administrationDate && new Date(data.administrationDate) > new Date()) {
      errors.push('Administration date cannot be in the future');
    }

    if (data.administeredBy !== undefined) {
      if (!data.administeredBy || data.administeredBy.trim().length === 0) {
        errors.push('Administered by cannot be empty');
      } else if (data.administeredBy.length > 200) {
        errors.push('Administered by field cannot exceed 200 characters');
      }
    }

    if (data.cvxCode && (data.cvxCode.length < 1 || data.cvxCode.length > 10)) {
      errors.push('CVX code must be between 1 and 10 characters');
    }

    if (data.lotNumber && data.lotNumber.length > 50) {
      errors.push('Lot number cannot exceed 50 characters');
    }

    if (data.manufacturer && data.manufacturer.length > 200) {
      errors.push('Manufacturer name cannot exceed 200 characters');
    }

    if (data.doseNumber !== undefined && (data.doseNumber < 1 || data.doseNumber > 20)) {
      errors.push('Dose number must be between 1 and 20');
    }

    if (data.totalDoses !== undefined && (data.totalDoses < 1 || data.totalDoses > 20)) {
      errors.push('Total doses must be between 1 and 20');
    }

    return errors;
  }

  // ============================================================================
  // CHRONIC CONDITION VALIDATION
  // ============================================================================

  /**
   * Validate chronic condition creation data
   */
  validateCreateChronicCondition(data: CreateChronicConditionData): string[] {
    const errors: string[] = [];

    // Required field validation
    if (!data.studentId) {
      errors.push('Student ID is required');
    }

    if (!data.condition || data.condition.trim().length === 0) {
      errors.push('Condition is required');
    } else if (data.condition.length > 200) {
      errors.push('Condition name cannot exceed 200 characters');
    }

    if (!data.diagnosisDate) {
      errors.push('Diagnosis date is required');
    } else if (new Date(data.diagnosisDate) > new Date()) {
      errors.push('Diagnosis date cannot be in the future');
    }

    // Optional field validation
    if (data.status && !Object.values(ConditionStatus).includes(data.status)) {
      errors.push('Invalid condition status');
    }

    if (data.severity && !Object.values(ConditionSeverity).includes(data.severity)) {
      errors.push('Invalid condition severity');
    }

    if (data.notes && data.notes.length > 2000) {
      errors.push('Notes cannot exceed 2000 characters');
    }

    if (data.carePlan && data.carePlan.length > 2000) {
      errors.push('Care plan cannot exceed 2000 characters');
    }

    if (data.diagnosedBy && data.diagnosedBy.length > 200) {
      errors.push('Diagnosed by field cannot exceed 200 characters');
    }

    if (data.icdCode && (data.icdCode.length < 3 || data.icdCode.length > 10)) {
      errors.push('ICD code must be between 3 and 10 characters');
    }

    // Date validation
    if (data.lastReviewDate && new Date(data.lastReviewDate) > new Date()) {
      errors.push('Last review date cannot be in the future');
    }

    if (data.nextReviewDate && new Date(data.nextReviewDate) < new Date()) {
      errors.push('Next review date should not be in the past');
    }

    if (data.lastReviewDate && data.nextReviewDate && 
        new Date(data.lastReviewDate) > new Date(data.nextReviewDate)) {
      errors.push('Last review date cannot be after next review date');
    }

    return errors;
  }

  /**
   * Validate chronic condition update data
   */
  validateUpdateChronicCondition(data: UpdateChronicConditionData): string[] {
    const errors: string[] = [];

    // Optional field validation
    if (data.condition !== undefined) {
      if (!data.condition || data.condition.trim().length === 0) {
        errors.push('Condition cannot be empty');
      } else if (data.condition.length > 200) {
        errors.push('Condition name cannot exceed 200 characters');
      }
    }

    if (data.diagnosisDate && new Date(data.diagnosisDate) > new Date()) {
      errors.push('Diagnosis date cannot be in the future');
    }

    if (data.status && !Object.values(ConditionStatus).includes(data.status)) {
      errors.push('Invalid condition status');
    }

    if (data.severity && !Object.values(ConditionSeverity).includes(data.severity)) {
      errors.push('Invalid condition severity');
    }

    if (data.notes && data.notes.length > 2000) {
      errors.push('Notes cannot exceed 2000 characters');
    }

    if (data.carePlan && data.carePlan.length > 2000) {
      errors.push('Care plan cannot exceed 2000 characters');
    }

    if (data.diagnosedBy && data.diagnosedBy.length > 200) {
      errors.push('Diagnosed by field cannot exceed 200 characters');
    }

    if (data.icdCode && (data.icdCode.length < 3 || data.icdCode.length > 10)) {
      errors.push('ICD code must be between 3 and 10 characters');
    }

    return errors;
  }

  // ============================================================================
  // UTILITY VALIDATION METHODS
  // ============================================================================

  /**
   * Validate student ID format
   */
  validateStudentId(studentId: string): boolean {
    return studentId && studentId.trim().length > 0 && studentId.length <= 50;
  }

  /**
   * Validate email format
   */
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate phone number format
   */
  validatePhoneNumber(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  }

  /**
   * Validate date range
   */
  validateDateRange(startDate: Date, endDate: Date): string[] {
    const errors: string[] = [];

    if (startDate > endDate) {
      errors.push('Start date cannot be after end date');
    }

    if (endDate > new Date()) {
      errors.push('End date cannot be in the future');
    }

    return errors;
  }

  /**
   * Validate CVX code format (CDC vaccine codes)
   */
  validateCVXCode(cvxCode: string): boolean {
    // CVX codes are typically 1-3 digit numbers
    const cvxRegex = /^\d{1,3}$/;
    return cvxRegex.test(cvxCode);
  }

  /**
   * Validate ICD-10 code format
   */
  validateICD10Code(icdCode: string): boolean {
    // Basic ICD-10 format validation (letter followed by digits and optional characters)
    const icdRegex = /^[A-Z]\d{2}(\.\d{1,4})?$/;
    return icdRegex.test(icdCode);
  }
}

export const validationService = new ValidationService();
export { ValidationService };
