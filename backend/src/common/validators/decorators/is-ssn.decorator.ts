/**
 * @fileoverview SSN Validator Decorator
 * @module common/validators/decorators/is-ssn
 * @description Custom decorator for Social Security Number validation with HIPAA compliance
 */

import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

/**
 * SSN validation options
 */
export interface SSNValidationOptions {
  /** Allow dashes in format (XXX-XX-XXXX) */
  allowDashes?: boolean;
  /** Perform additional validity checks */
  strictValidation?: boolean;
}

/**
 * SSN validator constraint
 *
 * @description Validates SSN format and performs basic validity checks
 * @security PHI - SSNs must be encrypted at rest and in transit
 */
@ValidatorConstraint({ name: 'isSSN', async: false })
export class IsSSNConstraint implements ValidatorConstraintInterface {
  // Invalid SSN patterns (known to be invalid)
  private readonly INVALID_SSNS = [
    '000000000',
    '111111111',
    '222222222',
    '333333333',
    '444444444',
    '555555555',
    '666666666',
    '777777777',
    '888888888',
    '999999999',
    '123456789',
  ];

  validate(value: any, args: ValidationArguments): boolean {
    if (typeof value !== 'string') return false;

    const options: SSNValidationOptions = args.constraints[0] || {};

    // Remove dashes for validation
    const cleanSSN = value.replace(/-/g, '');

    // Basic format check: must be 9 digits
    if (!/^\d{9}$/.test(cleanSSN)) return false;

    // If dashes not allowed, ensure original value has no dashes
    if (!options.allowDashes && value.includes('-')) return false;

    // If dashes allowed, ensure correct format (XXX-XX-XXXX)
    if (options.allowDashes && value.includes('-')) {
      if (!/^\d{3}-\d{2}-\d{4}$/.test(value)) return false;
    }

    // Strict validation
    if (options.strictValidation) {
      return this.performStrictValidation(cleanSSN);
    }

    return true;
  }

  /**
   * Perform strict SSN validation
   */
  private performStrictValidation(ssn: string): boolean {
    // Check for invalid patterns
    if (this.INVALID_SSNS.includes(ssn)) return false;

    // Extract area, group, and serial numbers
    const area = ssn.substring(0, 3);
    const group = ssn.substring(3, 5);
    const serial = ssn.substring(5, 9);

    // Area number cannot be 000, 666, or 900-999
    const areaNum = parseInt(area, 10);
    if (areaNum === 0 || areaNum === 666 || areaNum >= 900) return false;

    // Group number cannot be 00
    if (group === '00') return false;

    // Serial number cannot be 0000
    if (serial === '0000') return false;

    // Check for sequential numbers (potential test data)
    if (ssn === '123456789' || ssn === '987654321') return false;

    return true;
  }

  defaultMessage(args: ValidationArguments): string {
    const options: SSNValidationOptions = args.constraints[0] || {};

    if (options.strictValidation) {
      return 'SSN must be a valid Social Security Number';
    }

    if (options.allowDashes) {
      return 'SSN must be in format XXX-XX-XXXX or XXXXXXXXX';
    }

    return 'SSN must be 9 digits';
  }
}

/**
 * SSN validation decorator
 *
 * @decorator IsSSN
 * @param {SSNValidationOptions} options - Validation options
 * @param {ValidationOptions} validationOptions - Class-validator options
 *
 * @security PHI - Use with caution, ensure encryption
 *
 * @example
 * class StudentDto {
 *   @IsSSN({ allowDashes: true, strictValidation: true })
 *   @Transform(({ value }) => encryptSSN(value))
 *   ssn: string;
 * }
 */
export function IsSSN(
  options?: SSNValidationOptions,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isSSN',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [options],
      options: validationOptions,
      validator: IsSSNConstraint,
    });
  };
}
