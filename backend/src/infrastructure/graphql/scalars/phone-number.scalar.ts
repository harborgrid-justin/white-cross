/**
 * PhoneNumber Custom Scalar
 *
 * Validates and formats phone numbers in GraphQL.
 * Uses libphonenumber-js for comprehensive validation.
 *
 * Features:
 * - Validates phone number format
 * - Supports international formats
 * - Normalizes to E.164 format
 * - Country-specific validation
 *
 * @example
 * ```graphql
 * type Contact {
 *   phone: PhoneNumber
 *   mobile: PhoneNumber
 * }
 * ```
 *
 * @requires npm install libphonenumber-js
 */
import { CustomScalar, Scalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';
import { CountryCode, parsePhoneNumber } from 'libphonenumber-js';

@Scalar('PhoneNumber')
export class PhoneNumberScalar implements CustomScalar<string, string> {
  description = 'Valid phone number in E.164 format (+1234567890)';

  private readonly defaultCountry: CountryCode = 'US';

  /**
   * Parse value from client (variables)
   */
  parseValue(value: string): string {
    return this.validateAndFormatPhone(value);
  }

  /**
   * Serialize value to send to client
   */
  serialize(value: string): string {
    if (!value) {
      return value;
    }

    // Return in E.164 format
    return this.validateAndFormatPhone(value);
  }

  /**
   * Parse literal value in GraphQL query
   */
  parseLiteral(ast: ValueNode): string {
    if (ast.kind === Kind.STRING) {
      return this.validateAndFormatPhone(ast.value);
    }

    throw new Error('PhoneNumber must be a string');
  }

  /**
   * Validate and format phone number
   *
   * @param value - Phone number string
   * @returns Formatted phone number in E.164 format
   * @throws Error if phone number is invalid
   */
  private validateAndFormatPhone(value: string): string {
    if (!value) {
      throw new Error('PhoneNumber must be a non-empty string');
    }

    try {
      // Parse with default country
      const phoneNumber = parsePhoneNumber(value, this.defaultCountry);

      if (!phoneNumber || !phoneNumber.isValid()) {
        throw new Error(`Invalid phone number: ${value}`);
      }

      // Return in E.164 format (+1234567890)
      return phoneNumber.format('E.164');
    } catch (error) {
      throw new Error(
        `Invalid phone number format: ${value}. Expected format: +1 (555) 123-4567 or +15551234567`,
      );
    }
  }
}
