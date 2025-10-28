/**
 * @fileoverview Medication Dosage Validator Decorator
 * @module common/validators/decorators/is-dosage
 * @description Custom decorator for medication dosage validation
 */

import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

/**
 * Dosage validation options
 */
export interface DosageValidationOptions {
  /** Allowed units */
  allowedUnits?: string[];
  /** Minimum value */
  minValue?: number;
  /** Maximum value */
  maxValue?: number;
}

/**
 * Dosage validator constraint
 *
 * @description Validates medication dosage format and value
 * Format: number (integer or decimal) + space + unit
 * Examples: 10 mg, 2.5 ml, 500 mcg, 100 IU
 */
@ValidatorConstraint({ name: 'isDosage', async: false })
export class IsDosageConstraint implements ValidatorConstraintInterface {
  // Standard medication units
  private readonly STANDARD_UNITS = [
    'mg',    // milligrams
    'mcg',   // micrograms
    'g',     // grams
    'ml',    // milliliters
    'L',     // liters
    'IU',    // international units
    'units', // units (for insulin, etc.)
    'unit',  // singular unit
    'mEq',   // milliequivalents
    'gtt',   // drops
    '%',     // percentage
    'puff',  // inhalations
    'puffs', // plural inhalations
    'spray', // nasal sprays
    'sprays',
    'tablet',
    'tablets',
    'capsule',
    'capsules',
  ];

  validate(value: any, args: ValidationArguments): boolean {
    if (typeof value !== 'string') return false;

    const options: DosageValidationOptions = args.constraints[0] || {};

    // Pattern: number (with optional decimal) + space + unit
    const pattern = /^(\d+(?:\.\d+)?)\s*([a-zA-Z%]+)$/;
    const match = value.match(pattern);

    if (!match) return false;

    const [, amountStr, unit] = match;
    const amount = parseFloat(amountStr);

    // Validate amount is positive
    if (amount <= 0) return false;

    // Validate unit
    const allowedUnits = options.allowedUnits || this.STANDARD_UNITS;
    const unitLower = unit.toLowerCase();
    const isValidUnit = allowedUnits.some(u => u.toLowerCase() === unitLower);

    if (!isValidUnit) return false;

    // Validate value range if specified
    if (options.minValue !== undefined && amount < options.minValue) return false;
    if (options.maxValue !== undefined && amount > options.maxValue) return false;

    return true;
  }

  defaultMessage(args: ValidationArguments): string {
    const options: DosageValidationOptions = args.constraints[0] || {};

    if (options.allowedUnits) {
      return `Dosage must be in format: number + unit (allowed units: ${options.allowedUnits.join(', ')})`;
    }

    return 'Dosage must be in format: number + unit (e.g., 10 mg, 2.5 ml, 500 mcg)';
  }
}

/**
 * Dosage validation decorator
 *
 * @decorator IsDosage
 * @param {DosageValidationOptions} options - Validation options
 * @param {ValidationOptions} validationOptions - Class-validator options
 *
 * @example
 * class MedicationDto {
 *   @IsDosage()
 *   dosage: string;
 *
 *   @IsDosage({ allowedUnits: ['mg', 'mcg'], minValue: 0.1, maxValue: 1000 })
 *   maxDosage: string;
 * }
 */
export function IsDosage(
  options?: DosageValidationOptions,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isDosage',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [options],
      options: validationOptions,
      validator: IsDosageConstraint,
    });
  };
}
