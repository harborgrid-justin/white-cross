/**
 * LOC: 7D2F5B9E31
 * WC-SVC-HLT-VAL | validation.module.ts - Health Record Validation Module
 *
 * UPSTREAM (imports from):
 *   - logger.ts (utils/logger.ts)
 *   - healthRecordValidators.ts (utils/healthRecordValidators.ts)
 *   - types.ts (./types.ts)
 *
 * DOWNSTREAM (imported by):
 *   - healthRecord.module.ts
 *   - allergy.module.ts
 *   - chronicCondition.module.ts
 *   - vaccination.module.ts
 *
 * Purpose: Centralized validation logic for health records with HIPAA compliance
 * Exports: Validation functions for health data, vitals, medical codes
 * HIPAA: Validates PHI data integrity and compliance
 * Last Updated: 2025-10-18 | File Type: .ts
 * Critical Path: Data validation → HIPAA compliance → Error prevention
 */

import { logger } from '../../utils/logger';
import {
  validateHealthRecordData,
  validateVitalSigns,
  calculateBMI,
  validateICD10Code,
  validateCVXCode,
  validateNPI,
  validateDiagnosisDate,
  validateVaccinationDates,
  validateAllergyReactions,
  ValidationResult
} from '../../utils/healthRecordValidators';
import { CreateHealthRecordData, VitalSigns } from './types';

/**
 * Validation Module
 * Handles all validation logic for health records with comprehensive error checking
 */
export class ValidationModule {
  /**
   * Validate health record data with student age context
   */
  static validateHealthRecord(
    data: {
      vital?: any;
      date?: Date;
      diagnosisCode?: string;
      providerNpi?: string;
    },
    dateOfBirth?: Date
  ): ValidationResult {
    const result = validateHealthRecordData(data, dateOfBirth);

    // Log warnings
    if (result.warnings.length > 0) {
      logger.warn('Health record validation warnings:', result.warnings);
    }

    // Log errors
    if (!result.isValid && result.errors.length > 0) {
      logger.error('Health record validation errors:', result.errors);
    }

    return result;
  }

  /**
   * Calculate and validate BMI from height and weight
   */
  static calculateAndValidateBMI(height: number, weight: number): number | null {
    const bmi = calculateBMI(height, weight);

    if (bmi !== null) {
      logger.debug(`BMI calculated: ${bmi} (Height: ${height}cm, Weight: ${weight}kg)`);
    } else {
      logger.warn(`Invalid BMI calculation inputs - Height: ${height}, Weight: ${weight}`);
    }

    return bmi;
  }

  /**
   * Validate and auto-calculate BMI in vital signs
   */
  static processVitals(vitals: any, recordId?: string): any {
    if (!vitals || typeof vitals !== 'object' || vitals === null) {
      return vitals;
    }

    const processedVitals = { ...vitals };

    // Auto-calculate BMI if height and weight present
    if (processedVitals.height && processedVitals.weight) {
      const calculatedBMI = this.calculateAndValidateBMI(
        processedVitals.height,
        processedVitals.weight
      );

      if (calculatedBMI !== null) {
        processedVitals.bmi = calculatedBMI;
        const logMsg = recordId
          ? `Auto-calculated BMI: ${calculatedBMI} for record ${recordId}`
          : `Auto-calculated BMI: ${calculatedBMI}`;
        logger.info(logMsg);
      }
    }

    // Validate vital signs
    const vitalValidation = validateVitalSigns(processedVitals);
    if (vitalValidation.warnings.length > 0) {
      logger.warn('Vital signs validation warnings:', vitalValidation.warnings);
    }
    if (!vitalValidation.isValid) {
      logger.error('Vital signs validation errors:', vitalValidation.errors);
    }

    return processedVitals;
  }

  /**
   * Validate ICD-10 diagnosis code
   */
  static validateICD10(code: string): ValidationResult {
    const result = validateICD10Code(code);

    if (!result.isValid) {
      logger.error(`Invalid ICD-10 code: ${code}`, result.errors);
    }

    if (result.warnings.length > 0) {
      logger.warn(`ICD-10 code warnings for ${code}:`, result.warnings);
    }

    return result;
  }

  /**
   * Validate CVX vaccine code
   */
  static validateCVX(code: string, vaccineName?: string): ValidationResult {
    const result = validateCVXCode(code);

    if (!result.isValid) {
      const vaccine = vaccineName ? ` for ${vaccineName}` : '';
      logger.error(`Invalid CVX code: ${code}${vaccine}`, result.errors);
    }

    if (result.warnings.length > 0) {
      const vaccine = vaccineName ? ` for ${vaccineName}` : '';
      logger.warn(`CVX code warnings${vaccine}:`, result.warnings);
    }

    return result;
  }

  /**
   * Validate NPI (National Provider Identifier)
   */
  static validateNPICode(npi: string): ValidationResult {
    const result = validateNPI(npi);

    if (!result.isValid) {
      logger.error(`Invalid NPI: ${npi}`, result.errors);
    }

    return result;
  }

  /**
   * Validate diagnosis date
   */
  static validateDiagnosisDateValue(date: Date): ValidationResult {
    const result = validateDiagnosisDate(date);

    if (!result.isValid) {
      logger.error('Invalid diagnosis date:', result.errors);
    }

    if (result.warnings.length > 0) {
      logger.warn('Diagnosis date warnings:', result.warnings);
    }

    return result;
  }

  /**
   * Validate vaccination dates (administration and expiration)
   */
  static validateVaccinationDateRange(
    administrationDate: Date,
    expirationDate?: Date,
    vaccineName?: string
  ): ValidationResult {
    const result = validateVaccinationDates(administrationDate, expirationDate);

    if (!result.isValid) {
      const vaccine = vaccineName ? ` for ${vaccineName}` : '';
      logger.error(`Invalid vaccination dates${vaccine}:`, result.errors);
    }

    if (result.warnings.length > 0) {
      const vaccine = vaccineName ? ` for ${vaccineName}` : '';
      logger.warn(`Vaccination date warnings${vaccine}:`, result.warnings);
    }

    return result;
  }

  /**
   * Validate allergy reaction description
   */
  static validateAllergyReaction(reaction: string): ValidationResult {
    const result = validateAllergyReactions(reaction);

    if (result.warnings.length > 0) {
      logger.warn('Allergy reaction validation warnings:', result.warnings);
    }

    return result;
  }

  /**
   * Validate required field is not empty
   */
  static validateRequired(value: string | undefined | null, fieldName: string): void {
    if (!value || value.trim().length === 0) {
      throw new Error(`${fieldName} is required`);
    }
  }

  /**
   * Validate dose numbers for vaccinations
   */
  static validateDoseNumbers(doseNumber: number, totalDoses: number): void {
    if (doseNumber > totalDoses) {
      throw new Error(
        `Dose number (${doseNumber}) cannot exceed total doses (${totalDoses})`
      );
    }

    if (doseNumber < 1) {
      throw new Error('Dose number must be at least 1');
    }

    if (totalDoses < 1) {
      throw new Error('Total doses must be at least 1');
    }
  }

  /**
   * Check if vaccination is expired
   */
  static checkVaccineExpiration(
    expirationDate: Date,
    vaccineName: string,
    cvxCode?: string
  ): boolean {
    const isExpired = new Date(expirationDate) < new Date();

    if (isExpired) {
      logger.warn(
        `WARNING: Expired vaccine - ${vaccineName} (CVX: ${cvxCode || 'N/A'}) ` +
        `expired on ${expirationDate.toISOString()}`
      );
    }

    return isExpired;
  }

  /**
   * Merge and validate vital signs for updates
   */
  static mergeVitals(currentVitals: any, updateVitals: any, recordId: string): any {
    const current = currentVitals && typeof currentVitals === 'object' && currentVitals !== null
      ? currentVitals as any
      : {};

    const update = updateVitals && typeof updateVitals === 'object' && updateVitals !== null
      ? updateVitals as any
      : {};

    const merged = { ...current, ...update };

    // Recalculate BMI if height or weight updated
    if (merged.height && merged.weight) {
      const calculatedBMI = this.calculateAndValidateBMI(merged.height, merged.weight);
      if (calculatedBMI !== null) {
        merged.bmi = calculatedBMI;
        logger.info(`Auto-recalculated BMI: ${calculatedBMI} for record ${recordId}`);
      }
    }

    return merged;
  }
}
