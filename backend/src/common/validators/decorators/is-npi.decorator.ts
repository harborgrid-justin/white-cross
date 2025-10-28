/**
 * @fileoverview National Provider Identifier Validator Decorator
 * @module common/validators/decorators/is-npi
 * @description Custom decorator for NPI validation with Luhn algorithm check
 */

import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

/**
 * NPI validation options
 */
export interface NPIValidationOptions {
  /** Perform Luhn checksum validation */
  validateChecksum?: boolean;
}

/**
 * NPI validator constraint
 *
 * @description Validates National Provider Identifier (NPI)
 * NPI is a 10-digit number assigned to healthcare providers
 * @see https://www.cms.gov/Regulations-and-Guidance/Administrative-Simplification/NationalProvIdentStand
 */
@ValidatorConstraint({ name: 'isNPI', async: false })
export class IsNPIConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments): boolean {
    if (typeof value !== 'string') return false;

    const options: NPIValidationOptions = args.constraints[0] || {
      validateChecksum: true,
    };

    // NPI must be exactly 10 digits
    if (!/^\d{10}$/.test(value)) return false;

    // NPI cannot start with 0
    if (value.startsWith('0')) return false;

    // Validate checksum using Luhn algorithm
    if (options.validateChecksum) {
      return this.validateLuhnChecksum(value);
    }

    return true;
  }

  /**
   * Validate NPI using Luhn algorithm (mod 10)
   *
   * @description The Luhn algorithm is used to validate NPI numbers
   * @see https://www.cms.gov/Regulations-and-Guidance/Administrative-Simplification/NationalProvIdentStand/Downloads/NPIcheckdigit.pdf
   */
  private validateLuhnChecksum(npi: string): boolean {
    // Add constant prefix '80840' per NPI specification
    const fullNumber = '80840' + npi.substring(0, 9);

    let sum = 0;
    let shouldDouble = true; // Start from right, first digit is doubled

    // Process from right to left (excluding check digit)
    for (let i = fullNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(fullNumber[i], 10);

      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      shouldDouble = !shouldDouble;
    }

    // Calculate check digit
    const calculatedCheckDigit = (10 - (sum % 10)) % 10;
    const providedCheckDigit = parseInt(npi[9], 10);

    return calculatedCheckDigit === providedCheckDigit;
  }

  defaultMessage(): string {
    return 'NPI must be a valid 10-digit National Provider Identifier';
  }
}

/**
 * NPI validation decorator
 *
 * @decorator IsNPI
 * @param {NPIValidationOptions} options - Validation options
 * @param {ValidationOptions} validationOptions - Class-validator options
 *
 * @example
 * class ProviderDto {
 *   @IsNPI()
 *   npi: string;
 *
 *   @IsNPI({ validateChecksum: false })
 *   backupNPI: string;
 * }
 */
export function IsNPI(
  options?: NPIValidationOptions,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isNPI',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [options],
      options: validationOptions,
      validator: IsNPIConstraint,
    });
  };
}
