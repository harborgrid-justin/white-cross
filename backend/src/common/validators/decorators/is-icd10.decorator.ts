/**
 * @fileoverview ICD-10 Code Validator Decorator
 * @module common/validators/decorators/is-icd10
 * @description Custom decorator for ICD-10 code validation
 */

import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

/**
 * ICD-10 validation options
 */
export interface ICD10ValidationOptions {
  /** Allow billing codes (with decimal) */
  allowBillingFormat?: boolean;
  /** Strict format validation */
  strictFormat?: boolean;
}

/**
 * ICD-10 validator constraint
 *
 * @description Validates ICD-10 diagnostic codes
 * Format: Letter + 2 digits + optional decimal + up to 4 digits
 * @see https://www.who.int/standards/classifications/classification-of-diseases
 */
@ValidatorConstraint({ name: 'isICD10', async: false })
export class IsICD10Constraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments): boolean {
    if (typeof value !== 'string') return false;

    const options: ICD10ValidationOptions = args.constraints[0] || {
      allowBillingFormat: true,
      strictFormat: true,
    };

    // Convert to uppercase for validation
    const code = value.toUpperCase().trim();

    // Basic ICD-10 format: Letter + 2-3 digits, optionally followed by decimal and up to 4 more digits
    // Examples: A00, A00.0, A00.01, Z99.89
    const pattern = /^[A-Z]\d{2}(\.\d{1,4})?$/;

    if (!pattern.test(code)) return false;

    if (options.strictFormat) {
      return this.performStrictValidation(code);
    }

    return true;
  }

  /**
   * Perform strict ICD-10 validation
   */
  private performStrictValidation(code: string): boolean {
    const firstChar = code[0];

    // Valid ICD-10 starting characters
    const validStarts = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (!validStarts.includes(firstChar)) return false;

    // Check for invalid category codes
    // U codes are for special purposes (COVID-19, etc.)
    // Some letters are not used in standard ICD-10
    const restrictedCategories = [
      'U00',
      'U01',
      'U02',
      'U03',
      'U04',
      'U05',
      'U06',
      'U08',
      'U09',
    ];
    const category = code.substring(0, 3);

    // Allow U07 (COVID-19) and other valid U codes
    if (
      firstChar === 'U' &&
      !code.startsWith('U07') &&
      restrictedCategories.includes(category)
    ) {
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments): string {
    return 'ICD-10 code must be in valid format (e.g., A00, A00.1, Z99.89)';
  }
}

/**
 * ICD-10 validation decorator
 *
 * @decorator IsICD10
 * @param {ICD10ValidationOptions} options - Validation options
 * @param {ValidationOptions} validationOptions - Class-validator options
 *
 * @example
 * class DiagnosisDto {
 *   @IsICD10()
 *   diagnosisCode: string;
 *
 *   @IsICD10({ strictFormat: true })
 *   primaryDiagnosis: string;
 * }
 */
export function IsICD10(
  options?: ICD10ValidationOptions,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isICD10',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [options],
      options: validationOptions,
      validator: IsICD10Constraint,
    });
  };
}
