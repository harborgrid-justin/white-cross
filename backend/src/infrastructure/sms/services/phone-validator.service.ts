/**
 * @fileoverview Phone Number Validator Service
 * @module infrastructure/sms/services/phone-validator.service
 * @description Validates and normalizes phone numbers using libphonenumber-js
 */

import { Injectable, Logger } from '@nestjs/common';
import { CountryCode, isValidPhoneNumber, parsePhoneNumber, PhoneNumber as LibPhoneNumber } from 'libphonenumber-js';
import { PhoneNumberType, PhoneNumberValidationResult } from '../dto/phone-number.dto';

import { BaseService } from '../../../common/base';
/**
 * Phone Number Validator Service
 * Provides comprehensive phone number validation and formatting for international numbers
 */
@Injectable()
export class PhoneValidatorService extends BaseService {
  /**
   * Validate a phone number and return detailed information
   *
   * @param phoneNumber - Phone number to validate (any format)
   * @param defaultCountry - Default country code if not included in number
   * @returns Validation result with formatted number and metadata
   *
   * @example
   * ```typescript
   * const result = await phoneValidator.validatePhoneNumber('+1 (555) 123-4567');
   * // Returns: { isValid: true, e164Format: '+15551234567', countryCode: 'US', ... }
   * ```
   */
  async validatePhoneNumber(
    phoneNumber: string,
    defaultCountry?: string,
  ): Promise<PhoneNumberValidationResult> {
    try {
      // Remove any whitespace and validate input
      const cleanedNumber = phoneNumber.trim();

      if (!cleanedNumber) {
        return {
          isValid: false,
          error: 'Phone number is empty',
        };
      }

      // Check if valid using quick validation
      const country = defaultCountry
        ? (defaultCountry.toUpperCase() as CountryCode)
        : undefined;
      const isValid = isValidPhoneNumber(cleanedNumber, country);

      if (!isValid) {
        return {
          isValid: false,
          error: 'Invalid phone number format',
        };
      }

      // Parse the phone number for detailed information
      const parsedNumber = parsePhoneNumber(cleanedNumber, country);

      if (!parsedNumber) {
        return {
          isValid: false,
          error: 'Unable to parse phone number',
        };
      }

      // Extract detailed information
      const result: PhoneNumberValidationResult = {
        isValid: true,
        e164Format: parsedNumber.format('E.164'),
        countryCode: parsedNumber.country,
        nationalFormat: parsedNumber.formatNational(),
        type: this.mapPhoneNumberType(parsedNumber),
      };

      this.logDebug(
        `Validated phone number: ${result.e164Format} (${result.countryCode})`,
      );

      return result;
    } catch (error) {
      this.logWarning(
        `Phone validation error for ${phoneNumber}: ${error.message}`,
      );
      return {
        isValid: false,
        error: error.message || 'Phone number validation failed',
      };
    }
  }

  /**
   * Normalize phone number to E.164 format
   *
   * @param phoneNumber - Phone number in any format
   * @param defaultCountry - Default country code if not included
   * @returns Phone number in E.164 format or null if invalid
   *
   * @example
   * ```typescript
   * const e164 = await phoneValidator.normalizeToE164('(555) 123-4567', 'US');
   * // Returns: '+15551234567'
   * ```
   */
  async normalizeToE164(
    phoneNumber: string,
    defaultCountry?: string,
  ): Promise<string | null> {
    const result = await this.validatePhoneNumber(phoneNumber, defaultCountry);
    return result.isValid ? result.e164Format! : null;
  }

  /**
   * Get country code from phone number
   *
   * @param phoneNumber - Phone number in any format
   * @returns ISO 3166-1 alpha-2 country code or null
   *
   * @example
   * ```typescript
   * const country = await phoneValidator.getCountryCode('+15551234567');
   * // Returns: 'US'
   * ```
   */
  async getCountryCode(phoneNumber: string): Promise<string | null> {
    const result = await this.validatePhoneNumber(phoneNumber);
    return result.isValid ? result.countryCode! : null;
  }

  /**
   * Get phone number type (mobile, landline, etc.)
   *
   * @param phoneNumber - Phone number in any format
   * @param defaultCountry - Default country code if not included
   * @returns Phone number type or null
   *
   * @example
   * ```typescript
   * const type = await phoneValidator.getNumberType('+15551234567');
   * // Returns: PhoneNumberType.MOBILE
   * ```
   */
  async getNumberType(
    phoneNumber: string,
    defaultCountry?: string,
  ): Promise<PhoneNumberType | null> {
    const result = await this.validatePhoneNumber(phoneNumber, defaultCountry);
    return result.isValid ? result.type! : null;
  }

  /**
   * Check if phone number is a mobile number
   * This is important for SMS as landlines cannot receive SMS
   *
   * @param phoneNumber - Phone number to check
   * @param defaultCountry - Default country code
   * @returns True if mobile, false otherwise
   */
  async isMobileNumber(
    phoneNumber: string,
    defaultCountry?: string,
  ): Promise<boolean> {
    const type = await this.getNumberType(phoneNumber, defaultCountry);
    return (
      type === PhoneNumberType.MOBILE ||
      type === PhoneNumberType.FIXED_LINE_OR_MOBILE
    );
  }

  /**
   * Validate multiple phone numbers in batch
   *
   * @param phoneNumbers - Array of phone numbers to validate
   * @param defaultCountry - Default country code for all numbers
   * @returns Array of validation results
   */
  async validateBatch(
    phoneNumbers: string[],
    defaultCountry?: string,
  ): Promise<PhoneNumberValidationResult[]> {
    const results = await Promise.all(
      phoneNumbers.map((number) =>
        this.validatePhoneNumber(number, defaultCountry),
      ),
    );

    const validCount = results.filter((r) => r.isValid).length;
    this.logInfo(
      `Batch validation: ${validCount}/${phoneNumbers.length} valid numbers`,
    );

    return results;
  }

  /**
   * Format phone number for display
   *
   * @param phoneNumber - Phone number to format
   * @param format - Format type ('national' or 'international')
   * @param defaultCountry - Default country code
   * @returns Formatted phone number or null if invalid
   */
  async formatPhoneNumber(
    phoneNumber: string,
    format: 'national' | 'international' = 'international',
    defaultCountry?: string,
  ): Promise<string | null> {
    try {
      const country = defaultCountry
        ? (defaultCountry.toUpperCase() as CountryCode)
        : undefined;
      const parsedNumber = parsePhoneNumber(phoneNumber, country);

      if (!parsedNumber) {
        return null;
      }

      return format === 'national'
        ? parsedNumber.formatNational()
        : parsedNumber.formatInternational();
    } catch (error) {
      this.logWarning(`Phone formatting error: ${error.message}`);
      return null;
    }
  }

  // ==================== Private Helper Methods ====================

  /**
   * Map libphonenumber-js type to our PhoneNumberType enum
   *
   * @param parsedNumber - Parsed phone number from libphonenumber-js
   * @returns PhoneNumberType enum value
   * @private
   */
  private mapPhoneNumberType(parsedNumber: LibPhoneNumber): PhoneNumberType {
    const type = parsedNumber.getType();

    switch (type) {
      case 'MOBILE':
        return PhoneNumberType.MOBILE;
      case 'FIXED_LINE':
        return PhoneNumberType.FIXED_LINE;
      case 'FIXED_LINE_OR_MOBILE':
        return PhoneNumberType.FIXED_LINE_OR_MOBILE;
      case 'TOLL_FREE':
        return PhoneNumberType.TOLL_FREE;
      case 'PREMIUM_RATE':
        return PhoneNumberType.PREMIUM_RATE;
      case 'VOIP':
        return PhoneNumberType.VOIP;
      default:
        return PhoneNumberType.UNKNOWN;
    }
  }
}
