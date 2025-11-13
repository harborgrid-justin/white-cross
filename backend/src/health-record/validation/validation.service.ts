/**
 * @fileoverview Health Record Validation Service
 * @module health-record/validation
 * @description Comprehensive validation for health records with HIPAA compliance
 * HIPAA Compliance: All validation operations are audited and PHI data is handled securely
 */

import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Student   } from '@/database/models';
import { Vaccination   } from '@/database/models';
import { Allergy   } from '@/database/models';
import { ChronicCondition   } from '@/database/models';
import { VitalSigns   } from '@/database/models';
import { ClinicVisit   } from '@/database/models';

import { BaseService } from '@/common/base';
@Injectable()
export class ValidationService extends BaseService {
  // Valid CVX codes (subset for demonstration)
  private readonly VALID_CVX_CODES = [
    '03',
    '08',
    '10',
    '20',
    '21',
    '88',
    '94',
    '100',
    '106',
    '107',
    '110',
    '113',
    '114',
    '115',
    '116',
    '119',
    '120',
    '121',
    '122',
    '130',
    '133',
    '140',
    '141',
    '143',
    '144',
    '147',
    '148',
    '149',
    '150',
    '151',
    '152',
    '153',
    '154',
    '155',
    '158',
    '160',
    '161',
    '162',
    '163',
    '165',
    '166',
    '167',
    '168',
    '169',
    '170',
    '171',
    '172',
    '173',
    '174',
    '175',
    '176',
    '177',
    '178',
    '179',
    '180',
    '181',
    '182',
    '183',
    '184',
    '185',
    '186',
    '187',
    '188',
    '189',
    '190',
    '191',
    '192',
    '193',
    '194',
    '195',
    '196',
    '197',
    '198',
    '200',
    '201',
    '202',
    '203',
    '204',
    '205',
    '206',
    '207',
    '208',
    '210',
    '211',
    '212',
    '213',
    '214',
    '215',
    '216',
    '217',
    '218',
    '219',
  ];

  // Valid ICD-10 code patterns
  private readonly ICD10_PATTERN = /^[A-Z]\d{2}(\.\d{1,4})?$/;

  // PHI field patterns to detect
  private readonly PHI_PATTERNS = {
    SSN: /\b\d{3}-\d{2}-\d{4}\b/,
    PHONE: /\b\d{3}-\d{3}-\d{4}\b/,
    EMAIL: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/,
    DOB: /\b\d{1,2}\/\d{1,2}\/\d{4}\b/,
  };

  constructor(
    @InjectModel(Student)
    private readonly studentModel: typeof Student,
    @InjectModel(Vaccination)
    private readonly vaccinationModel: typeof Vaccination,
    @InjectModel(Allergy)
    private readonly allergyModel: typeof Allergy,
    @InjectModel(ChronicCondition)
    private readonly chronicConditionModel: typeof ChronicCondition,
    @InjectModel(VitalSigns)
    private readonly vitalSignsModel: typeof VitalSigns,
    @InjectModel(ClinicVisit)
    private readonly clinicVisitModel: typeof ClinicVisit,
  ) {}

  async validateHealthRecord(data: any): Promise<any> {
    this.logInfo('Validating health record data');

    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields
    if (!data.studentId) {
      errors.push('Student ID is required');
    } else {
      // Verify student exists
      const student = await this.studentModel.findByPk(data.studentId);
      if (!student) {
        errors.push(`Student with ID ${data.studentId} not found`);
      }
    }

    if (!data.type) {
      errors.push('Record type is required');
    }

    // Type-specific validation
    switch (data.type) {
      case 'vaccination':
        const vaccineErrors = await this.validateVaccination(data);
        errors.push(...vaccineErrors);
        break;
      case 'allergy':
        const allergyErrors = await this.validateAllergy(data);
        errors.push(...allergyErrors);
        break;
      case 'chronic_condition':
        const conditionErrors = await this.validateChronicCondition(data);
        errors.push(...conditionErrors);
        break;
      case 'vital_signs':
        const vitalsResult = await this.validateVitalSigns(data);
        errors.push(...vitalsResult.errors);
        warnings.push(...vitalsResult.warnings);
        break;
      case 'clinic_visit':
        const visitErrors = await this.validateClinicVisit(data);
        errors.push(...visitErrors);
        break;
    }

    // HIPAA compliance check
    const hipaaResult = await this.enforceHIPAACompliance(data);
    if (!hipaaResult.compliant) {
      errors.push(...hipaaResult.issues);
    }

    // Database constraint validation
    const constraintErrors = await this.validateDatabaseConstraints(data);
    errors.push(...constraintErrors);

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  async validateCVXCode(cvxCode: string): Promise<boolean> {
    this.logInfo(`Validating CVX code: ${cvxCode}`);

    // Remove leading zeros for comparison
    const normalizedCode = cvxCode.replace(/^0+/, '');
    const paddedCode = cvxCode.padStart(2, '0');

    return (
      this.VALID_CVX_CODES.includes(paddedCode) ||
      this.VALID_CVX_CODES.includes(normalizedCode)
    );
  }

  async validateVitalSigns(vitals: any): Promise<any> {
    this.logInfo('Validating vital signs');

    const errors: string[] = [];
    const warnings: string[] = [];

    // Blood pressure validation (pediatric ranges)
    if (vitals.bloodPressureSystolic) {
      if (
        vitals.bloodPressureSystolic < 70 ||
        vitals.bloodPressureSystolic > 140
      ) {
        warnings.push(
          `Systolic BP ${vitals.bloodPressureSystolic} is outside normal range (70-140)`,
        );
      }
      if (
        vitals.bloodPressureSystolic < 50 ||
        vitals.bloodPressureSystolic > 180
      ) {
        errors.push(
          `Systolic BP ${vitals.bloodPressureSystolic} is dangerously abnormal`,
        );
      }
    }

    if (vitals.bloodPressureDiastolic) {
      if (
        vitals.bloodPressureDiastolic < 40 ||
        vitals.bloodPressureDiastolic > 90
      ) {
        warnings.push(
          `Diastolic BP ${vitals.bloodPressureDiastolic} is outside normal range (40-90)`,
        );
      }
      if (
        vitals.bloodPressureDiastolic < 30 ||
        vitals.bloodPressureDiastolic > 120
      ) {
        errors.push(
          `Diastolic BP ${vitals.bloodPressureDiastolic} is dangerously abnormal`,
        );
      }
    }

    // Heart rate validation (pediatric ranges vary by age)
    if (vitals.heartRate) {
      if (vitals.heartRate < 60 || vitals.heartRate > 120) {
        warnings.push(
          `Heart rate ${vitals.heartRate} may be outside normal range`,
        );
      }
      if (vitals.heartRate < 40 || vitals.heartRate > 200) {
        errors.push(`Heart rate ${vitals.heartRate} is dangerously abnormal`);
      }
    }

    // Temperature validation
    if (vitals.temperature) {
      const unit = vitals.temperatureUnit || 'C';
      if (unit === 'C') {
        if (vitals.temperature < 35 || vitals.temperature > 40) {
          warnings.push(
            `Temperature ${vitals.temperature}°C is outside normal range`,
          );
        }
        if (vitals.temperature < 32 || vitals.temperature > 42) {
          errors.push(
            `Temperature ${vitals.temperature}°C is dangerously abnormal`,
          );
        }
      } else if (unit === 'F') {
        if (vitals.temperature < 95 || vitals.temperature > 104) {
          warnings.push(
            `Temperature ${vitals.temperature}°F is outside normal range`,
          );
        }
        if (vitals.temperature < 90 || vitals.temperature > 107) {
          errors.push(
            `Temperature ${vitals.temperature}°F is dangerously abnormal`,
          );
        }
      }
    }

    // Oxygen saturation validation
    if (vitals.oxygenSaturation) {
      if (vitals.oxygenSaturation < 95) {
        warnings.push(`Oxygen saturation ${vitals.oxygenSaturation}% is low`);
      }
      if (vitals.oxygenSaturation < 90) {
        errors.push(
          `Oxygen saturation ${vitals.oxygenSaturation}% is critically low`,
        );
      }
      if (vitals.oxygenSaturation > 100) {
        errors.push('Oxygen saturation cannot exceed 100%');
      }
    }

    // Height/Weight validation
    if (vitals.height) {
      const unit = vitals.heightUnit || 'cm';
      if (unit === 'cm' && (vitals.height < 50 || vitals.height > 220)) {
        warnings.push(`Height ${vitals.height}cm seems unusual`);
      } else if (unit === 'm' && (vitals.height < 0.5 || vitals.height > 2.2)) {
        warnings.push(`Height ${vitals.height}m seems unusual`);
      }
    }

    if (vitals.weight) {
      const unit = vitals.weightUnit || 'kg';
      if (unit === 'kg' && (vitals.weight < 10 || vitals.weight > 200)) {
        warnings.push(
          `Weight ${vitals.weight}kg seems unusual for school-age children`,
        );
      } else if (
        unit === 'lbs' &&
        (vitals.weight < 20 || vitals.weight > 440)
      ) {
        warnings.push(
          `Weight ${vitals.weight}lbs seems unusual for school-age children`,
        );
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  async enforceHIPAACompliance(data: any): Promise<any> {
    this.logInfo('Enforcing HIPAA compliance');

    const issues: string[] = [];

    // Check for unmasked PHI in text fields
    const textFields = this.getAllTextFields(data);

    textFields.forEach(({ field, value }) => {
      // Check for SSN
      if (this.PHI_PATTERNS.SSN.test(value)) {
        issues.push(`Potential unmasked SSN detected in field: ${field}`);
      }

      // Check for phone numbers (should be masked or in separate secure fields)
      if (this.PHI_PATTERNS.PHONE.test(value) && field !== 'emergencyPhone') {
        issues.push(`Potential unmasked phone number in field: ${field}`);
      }
    });

    // Ensure audit fields are present
    if (!data.createdBy && !data.updatedBy) {
      issues.push(
        'Missing audit trail: createdBy or updatedBy required for PHI',
      );
    }

    // Check for required consent if applicable
    if (data.type === 'vaccination' && !data.consentObtained) {
      issues.push('Vaccination record missing consent documentation');
    }

    return {
      compliant: issues.length === 0,
      issues,
    };
  }

  /**
   * Validate ICD-10 code format
   */
  validateICDCode(icdCode: string): boolean {
    this.logInfo(`Validating ICD-10 code: ${icdCode}`);
    return this.ICD10_PATTERN.test(icdCode);
  }

  /**
   * Validate NPI (National Provider Identifier)
   */
  validateNPI(npi: string): boolean {
    this.logInfo(`Validating NPI: ${npi}`);

    // NPI must be 10 digits
    if (!/^\d{10}$/.test(npi)) {
      return false;
    }

    // Luhn algorithm check
    return this.luhnCheck(npi);
  }

  /**
   * Validate date range
   */
  validateDateRange(
    startDate: Date,
    endDate: Date,
  ): { valid: boolean; error?: string } {
    if (startDate > endDate) {
      return { valid: false, error: 'Start date must be before end date' };
    }

    const now = new Date();
    if (startDate > now) {
      return { valid: false, error: 'Start date cannot be in the future' };
    }

    return { valid: true };
  }

  /**
   * Validate uniqueness constraints
   */
  async validateUniqueness(recordType: string, data: any): Promise<string[]> {
    const errors: string[] = [];

    switch (recordType) {
      case 'vaccination':
        // Check for duplicate vaccination records (same student, vaccine, date)
        if (data.studentId && data.cvxCode && data.administrationDate) {
          const existing = await this.vaccinationModel.findOne({
            where: {
              studentId: data.studentId,
              cvxCode: data.cvxCode,
              administrationDate: data.administrationDate,
            },
          });
          if (existing) {
            errors.push(
              'Duplicate vaccination record found for same student, vaccine, and date',
            );
          }
        }
        break;

      case 'allergy':
        // Check for duplicate allergy records (same student, allergen)
        if (data.studentId && data.allergen) {
          const existing = await this.allergyModel.findOne({
            where: {
              studentId: data.studentId,
              allergen: { [Op.iLike]: data.allergen },
              active: true,
            },
          });
          if (existing) {
            errors.push(
              'Active allergy record already exists for this student and allergen',
            );
          }
        }
        break;

      case 'chronic_condition':
        // Check for duplicate condition records (same student, condition)
        if (data.studentId && data.condition) {
          const existing = await this.chronicConditionModel.findOne({
            where: {
              studentId: data.studentId,
              condition: { [Op.iLike]: data.condition },
              status: 'ACTIVE',
            },
          });
          if (existing) {
            errors.push(
              'Active chronic condition record already exists for this student and condition',
            );
          }
        }
        break;
    }

    return errors;
  }

  // Private helper methods

  private async validateVaccination(data: any): Promise<string[]> {
    const errors: string[] = [];

    if (!data.cvxCode) {
      errors.push('CVX code is required for vaccinations');
    } else {
      const isValid = await this.validateCVXCode(data.cvxCode);
      if (!isValid) {
        errors.push(`Invalid CVX code: ${data.cvxCode}`);
      }
    }

    if (!data.administrationDate) {
      errors.push('Administration date is required');
    } else {
      const adminDate = new Date(data.administrationDate);
      if (adminDate > new Date()) {
        errors.push('Administration date cannot be in the future');
      }
    }

    if (data.lotNumber && data.lotNumber.length < 3) {
      errors.push('Lot number must be at least 3 characters');
    }

    if (data.doseNumber && (data.doseNumber < 1 || data.doseNumber > 10)) {
      errors.push('Dose number must be between 1 and 10');
    }

    // Check uniqueness
    const uniquenessErrors = await this.validateUniqueness('vaccination', data);
    errors.push(...uniquenessErrors);

    return errors;
  }

  private async validateAllergy(data: any): Promise<string[]> {
    const errors: string[] = [];

    if (!data.allergen) {
      errors.push('Allergen name is required');
    }

    if (!data.severity) {
      errors.push('Severity level is required');
    } else if (
      !['MILD', 'MODERATE', 'SEVERE', 'LIFE_THREATENING'].includes(
        data.severity,
      )
    ) {
      errors.push('Invalid severity level');
    }

    if (!data.reactions && !data.symptoms) {
      errors.push('Allergic reaction or symptoms description is required');
    }

    // Check uniqueness
    const uniquenessErrors = await this.validateUniqueness('allergy', data);
    errors.push(...uniquenessErrors);

    return errors;
  }

  private async validateChronicCondition(data: any): Promise<string[]> {
    const errors: string[] = [];

    if (!data.condition && !data.icdCode) {
      errors.push('Condition name or ICD code is required');
    }

    if (data.icdCode && !this.validateICDCode(data.icdCode)) {
      errors.push(`Invalid ICD-10 code format: ${data.icdCode}`);
    }

    if (data.diagnosedDate) {
      const diagDate = new Date(data.diagnosedDate);
      if (diagDate > new Date()) {
        errors.push('Diagnosis date cannot be in the future');
      }
    }

    // Check uniqueness
    const uniquenessErrors = await this.validateUniqueness(
      'chronic_condition',
      data,
    );
    errors.push(...uniquenessErrors);

    return errors;
  }

  private async validateClinicVisit(data: any): Promise<string[]> {
    const errors: string[] = [];

    if (!data.reasonForVisit || data.reasonForVisit.length === 0) {
      errors.push('Reason for visit is required');
    }

    if (!data.attendedBy) {
      errors.push('Attending nurse/provider is required');
    }

    if (data.checkOutTime && data.checkInTime) {
      const checkIn = new Date(data.checkInTime);
      const checkOut = new Date(data.checkOutTime);
      if (checkOut < checkIn) {
        errors.push('Check-out time cannot be before check-in time');
      }
    }

    return errors;
  }

  private async validateDatabaseConstraints(data: any): Promise<string[]> {
    const errors: string[] = [];

    // Check foreign key constraints
    if (data.studentId) {
      const student = await this.studentModel.findByPk(data.studentId);
      if (!student) {
        errors.push(`Invalid student ID: ${data.studentId}`);
      }
    }

    // Type-specific constraint validation
    switch (data.type) {
      case 'vaccination':
        // Validate administeredBy exists (assuming it's a user ID)
        if (data.administeredBy) {
          // In a real implementation, you'd check against a User model
          // For now, just validate it's not empty
          if (
            typeof data.administeredBy !== 'string' ||
            data.administeredBy.trim().length === 0
          ) {
            errors.push(
              'Administered by field must be a valid user identifier',
            );
          }
        }
        break;

      case 'allergy':
        // Validate diagnosedBy if provided
        if (
          data.diagnosedBy &&
          (typeof data.diagnosedBy !== 'string' ||
            data.diagnosedBy.trim().length === 0)
        ) {
          errors.push('Diagnosed by field must be a valid provider identifier');
        }
        break;

      case 'chronic_condition':
        // Validate diagnosedBy if provided
        if (
          data.diagnosedBy &&
          (typeof data.diagnosedBy !== 'string' ||
            data.diagnosedBy.trim().length === 0)
        ) {
          errors.push('Diagnosed by field must be a valid provider identifier');
        }
        break;
    }

    return errors;
  }

  private getAllTextFields(
    obj: any,
    prefix = '',
  ): Array<{ field: string; value: string }> {
    const fields: Array<{ field: string; value: string }> = [];

    Object.entries(obj).forEach(([key, value]) => {
      const fieldName = prefix ? `${prefix}.${key}` : key;

      if (typeof value === 'string') {
        fields.push({ field: fieldName, value });
      } else if (typeof value === 'object' && value !== null) {
        fields.push(...this.getAllTextFields(value, fieldName));
      }
    });

    return fields;
  }

  private luhnCheck(value: string): boolean {
    let sum = 0;
    let shouldDouble = false;

    for (let i = value.length - 1; i >= 0; i--) {
      let digit = parseInt(value[i]);

      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
  }
}
