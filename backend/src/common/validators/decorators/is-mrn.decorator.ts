/**
 * @fileoverview Medical Record Number Validator Decorator
 * @module common/validators/decorators/is-mrn
 * @description Custom decorator for MRN validation
 */

import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

/**
 * MRN validation options
 */
export interface MRNValidationOptions {
  /** Minimum length (default: 6) */
  minLength?: number;
  /** Maximum length (default: 12) */
  maxLength?: number;
  /** Allow lowercase letters */
  allowLowercase?: boolean;
  /** Custom pattern */
  pattern?: RegExp;
}

/**
 * MRN validator constraint
 *
 * @description Validates Medical Record Number format
 * @security PHI - MRNs are Protected Health Information
 */
@ValidatorConstraint({ name: 'isMRN', async: false })
export class IsMRNConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments): boolean {
    if (typeof value !== 'string') return false;

    const options: MRNValidationOptions = args.constraints[0] || {
      minLength: 6,
      maxLength: 12,
      allowLowercase: false,
    };

    const minLength = options.minLength || 6;
    const maxLength = options.maxLength || 12;

    // Custom pattern takes precedence
    if (options.pattern) {
      return options.pattern.test(value);
    }

    // Default pattern: alphanumeric, 6-12 characters
    let pattern: RegExp;
    if (options.allowLowercase) {
      pattern = new RegExp(`^[A-Za-z0-9]{${minLength},${maxLength}}$`);
    } else {
      pattern = new RegExp(`^[A-Z0-9]{${minLength},${maxLength}}$`);
    }

    if (!pattern.test(value)) return false;

    // Additional checks
    // Ensure not all same character
    if (/^(.)\1+$/.test(value)) return false;

    // Ensure at least one digit
    if (!/\d/.test(value)) return false;

    return true;
  }

  defaultMessage(args: ValidationArguments): string {
    const options: MRNValidationOptions = args.constraints[0] || {};
    const minLength = options.minLength || 6;
    const maxLength = options.maxLength || 12;

    if (options.allowLowercase) {
      return `MRN must be ${minLength}-${maxLength} alphanumeric characters`;
    }

    return `MRN must be ${minLength}-${maxLength} uppercase alphanumeric characters`;
  }
}

/**
 * MRN validation decorator
 *
 * @decorator IsMRN
 * @param {MRNValidationOptions} options - Validation options
 * @param {ValidationOptions} validationOptions - Class-validator options
 *
 * @security PHI - Medical Record Numbers are Protected Health Information
 *
 * @example
 * class StudentDto {
 *   @IsMRN()
 *   medicalRecordNumber: string;
 *
 *   @IsMRN({ minLength: 8, maxLength: 10 })
 *   customMRN: string;
 * }
 */
export function IsMRN(
  options?: MRNValidationOptions,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isMRN',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [options],
      options: validationOptions,
      validator: IsMRNConstraint,
    });
  };
}
