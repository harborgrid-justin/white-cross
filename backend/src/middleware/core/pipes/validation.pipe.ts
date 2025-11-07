/**
 * @fileoverview Healthcare Validation Pipe for NestJS
 * @module middleware/core/pipes/validation
 * @description HIPAA-compliant validation pipe for healthcare data.
 * Migrated from backend/src/middleware/core/validation/validation.middleware.ts
 *
 * @security OWASP input validation standards
 * @compliance HIPAA - PHI data validation
 */

import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import {
  validate,
  ValidationError as ClassValidatorError,
} from 'class-validator';
import { plainToClass } from 'class-transformer';
import {
  HEALTHCARE_PATTERNS,
  VALIDATION_CONFIGS,
  type ValidationConfig,
  type ValidationErrorDetail,
} from '../types/validation.types';

/**
 * Healthcare Validation Pipe
 *
 * @class HealthcareValidationPipe
 * @implements {PipeTransform}
 *
 * @description NestJS pipe for validating healthcare data with HIPAA compliance.
 * Uses class-validator for DTO validation and custom healthcare-specific rules.
 *
 * @example
 * // In controller
 * @Post('/students')
 * @UsePipes(new HealthcareValidationPipe())
 * async createStudent(@Body() dto: CreateStudentDto) {}
 *
 * @example
 * // Global application
 * app.useGlobalPipes(new HealthcareValidationPipe());
 */
@Injectable()
export class HealthcareValidationPipe implements PipeTransform<any> {
  private readonly logger = new Logger(HealthcareValidationPipe.name);
  private readonly config: Required<ValidationConfig>;

  constructor(config?: ValidationConfig) {
    this.config = {
      enableHipaaCompliance: true,
      enableSecurityValidation: true,
      logValidationErrors: true,
      maxFieldLength: 1000,
      allowedFileTypes: ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'],
      ...VALIDATION_CONFIGS.healthcare,
      ...config,
    };
  }

  /**
   * Transform and validate input data
   *
   * @param {any} value - Input value to validate
   * @param {ArgumentMetadata} metadata - Metadata about the argument
   * @returns {Promise<any>} Validated and transformed data
   * @throws {BadRequestException} When validation fails
   */
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    // Transform plain object to class instance
    const object = plainToClass(metatype, value);

    // Validate using class-validator
    const errors = await validate(object, {
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    });

    if (errors.length > 0) {
      const validationErrors = this.formatValidationErrors(errors);

      if (this.config.logValidationErrors) {
        this.logger.warn('Validation failed', {
          errors: validationErrors,
        });
      }

      throw new BadRequestException({
        message: 'Validation failed',
        errors: validationErrors,
      });
    }

    // Additional healthcare-specific validation
    if (this.config.enableHipaaCompliance) {
      this.validateHealthcareData(object);
    }

    // Security validation
    if (this.config.enableSecurityValidation) {
      this.validateSecurity(object);
    }

    return object;
  }

  /**
   * Check if type should be validated
   *
   * @private
   * @param {Function} metatype - Type to check
   * @returns {boolean} True if should validate
   */
  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  /**
   * Format class-validator errors
   *
   * @private
   * @param {ClassValidatorError[]} errors - Validation errors
   * @returns {ValidationErrorDetail[]} Formatted errors
   */
  private formatValidationErrors(
    errors: ClassValidatorError[],
  ): ValidationErrorDetail[] {
    return errors.flatMap((error) => {
      if (error.constraints) {
        return Object.entries(error.constraints).map(
          ([constraint, message]): ValidationErrorDetail => ({
            field: error.property,
            message: String(message),
            value: error.value,
            constraint,
          }),
        );
      }
      return [];
    });
  }

  /**
   * Validate healthcare-specific data
   *
   * @private
   * @param {any} data - Data to validate
   * @throws {BadRequestException} When validation fails
   */
  private validateHealthcareData(data: any): void {
    const errors: ValidationErrorDetail[] = [];

    // Check for PHI fields and validate them
    if (
      data.medicalRecordNumber &&
      !HEALTHCARE_PATTERNS.MRN.test(data.medicalRecordNumber)
    ) {
      errors.push({
        field: 'medicalRecordNumber',
        message: 'Invalid medical record number format',
        value: data.medicalRecordNumber,
      });
    }

    if (data.providerId && !HEALTHCARE_PATTERNS.NPI.test(data.providerId)) {
      errors.push({
        field: 'providerId',
        message: 'Invalid NPI format (must be 10 digits)',
        value: data.providerId,
      });
    }

    if (data.icdCode && !HEALTHCARE_PATTERNS.ICD10.test(data.icdCode)) {
      errors.push({
        field: 'icdCode',
        message: 'Invalid ICD-10 code format',
        value: data.icdCode,
      });
    }

    if (data.phone && !HEALTHCARE_PATTERNS.PHONE.test(data.phone)) {
      errors.push({
        field: 'phone',
        message: 'Invalid phone number format',
        value: data.phone,
      });
    }

    if (data.dosage && !HEALTHCARE_PATTERNS.DOSAGE.test(data.dosage)) {
      errors.push({
        field: 'dosage',
        message: 'Invalid medication dosage format',
        value: data.dosage,
      });
    }

    if (errors.length > 0) {
      throw new BadRequestException({
        message: 'Healthcare data validation failed',
        errors,
      });
    }
  }

  /**
   * Validate security aspects
   *
   * @private
   * @param {any} data - Data to validate
   * @throws {BadRequestException} When validation fails
   */
  private validateSecurity(data: any): void {
    const errors: ValidationErrorDetail[] = [];

    // Check field lengths
    for (const [key, value] of Object.entries(data)) {
      if (
        typeof value === 'string' &&
        value.length > this.config.maxFieldLength
      ) {
        errors.push({
          field: key,
          message: `Field exceeds maximum length of ${this.config.maxFieldLength} characters`,
          value: value.substring(0, 50) + '...',
        });
      }
    }

    // Check for potential XSS
    const xssPattern = /<script|javascript:|onerror=|onclick=/i;
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string' && xssPattern.test(value)) {
        errors.push({
          field: key,
          message: 'Potential XSS attack detected',
          constraint: 'security',
        });
      }
    }

    // Check for SQL injection patterns
    const sqlPattern =
      /(\bUNION\b|\bSELECT\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b|\bDROP\b)/i;
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string' && sqlPattern.test(value)) {
        errors.push({
          field: key,
          message: 'Potential SQL injection detected',
          constraint: 'security',
        });
      }
    }

    if (errors.length > 0) {
      if (this.config.logValidationErrors) {
        this.logger.error('Security validation failed', { errors });
      }

      throw new BadRequestException({
        message: 'Security validation failed',
        errors,
      });
    }
  }
}

/**
 * Factory function for creating healthcare validation pipe
 *
 * @function createHealthcareValidationPipe
 * @returns {HealthcareValidationPipe} Configured pipe instance
 *
 * @example
 * const pipe = createHealthcareValidationPipe();
 */
export function createHealthcareValidationPipe(): HealthcareValidationPipe {
  return new HealthcareValidationPipe(VALIDATION_CONFIGS.healthcare);
}

/**
 * Factory function for creating admin validation pipe
 *
 * @function createAdminValidationPipe
 * @returns {HealthcareValidationPipe} Configured pipe instance
 *
 * @example
 * const pipe = createAdminValidationPipe();
 */
export function createAdminValidationPipe(): HealthcareValidationPipe {
  return new HealthcareValidationPipe(VALIDATION_CONFIGS.admin);
}
