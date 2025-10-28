/**
 * @fileoverview Phone Number Validator Decorator
 * @module common/validators/decorators/is-phone
 * @description Custom decorator for US phone number validation
 */

import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

/**
 * Phone number format options
 */
export interface PhoneValidationOptions {
  /** Allow extensions (ext, x) */
  allowExtension?: boolean;
  /** Require country code */
  requireCountryCode?: boolean;
  /** Allow international format */
  allowInternational?: boolean;
}

/**
 * Phone number validator constraint
 */
@ValidatorConstraint({ name: 'isPhone', async: false })
export class IsPhoneConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments): boolean {
    if (typeof value !== 'string') return false;

    const options: PhoneValidationOptions = args.constraints[0] || {};

    // US phone number patterns
    const patterns = {
      // Standard US: (555) 123-4567, 555-123-4567, 555.123.4567
      standard: /^(\+1[-.\s]?)?(\([0-9]{3}\)|[0-9]{3})[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$/,

      // With optional extension
      withExtension: /^(\+1[-.\s]?)?(\([0-9]{3}\)|[0-9]{3})[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}(\s?(ext|x)\s?\d{1,5})?$/i,

      // International format
      international: /^\+[1-9]\d{1,14}$/,
    };

    let pattern = patterns.standard;

    if (options.allowExtension) {
      pattern = patterns.withExtension;
    }

    if (options.allowInternational) {
      return patterns.international.test(value) || pattern.test(value);
    }

    const isValid = pattern.test(value);

    // Additional validation: check if country code is required
    if (isValid && options.requireCountryCode) {
      return value.startsWith('+1') || value.startsWith('1');
    }

    return isValid;
  }

  defaultMessage(args: ValidationArguments): string {
    const options: PhoneValidationOptions = args.constraints[0] || {};

    if (options.requireCountryCode) {
      return 'Phone number must include country code (+1)';
    }

    if (options.allowInternational) {
      return 'Phone number must be in valid US or international format';
    }

    if (options.allowExtension) {
      return 'Phone number must be in valid US format (e.g., (555) 123-4567 ext 123)';
    }

    return 'Phone number must be in valid US format (e.g., (555) 123-4567, 555-123-4567)';
  }
}

/**
 * Phone number validation decorator
 *
 * @decorator IsPhone
 * @param {PhoneValidationOptions} options - Validation options
 * @param {ValidationOptions} validationOptions - Class-validator options
 *
 * @example
 * class CreateContactDto {
 *   @IsPhone()
 *   phone: string;
 *
 *   @IsPhone({ allowExtension: true })
 *   workPhone: string;
 *
 *   @IsPhone({ allowInternational: true })
 *   emergencyPhone: string;
 * }
 */
export function IsPhone(
  options?: PhoneValidationOptions,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isPhone',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [options],
      options: validationOptions,
      validator: IsPhoneConstraint,
    });
  };
}
