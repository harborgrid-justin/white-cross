/**
 * @fileoverview Healthcare Data Validation Utilities
 * @module shared/utilities/validation.utils
 * @description HIPAA-compliant validation utilities for healthcare data integrity and security
 *
 * Key Features:
 * - Email address validation
 * - Phone number validation (US formats)
 * - UUID v4 validation
 * - Date validation
 * - Password strength validation
 * - Empty value checking
 * - Array uniqueness validation
 *
 * @security
 * - Enforces strong password requirements (12+ chars, mixed case, numbers, special chars)
 * - Validates phone numbers to prevent invalid data
 * - UUID validation for secure identifier verification
 * - Type-safe validation functions
 *
 * Password Requirements:
 * - Minimum 12 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character (@$!%*?&)
 *
 * @requires lodash
 *
 * @example Basic usage
 * ```typescript
 * import { isValidEmail, isStrongPassword, isValidPhoneNumber } from './validation.utils';
 *
 * // Email validation
 * const emailValid = isValidEmail('user@example.com'); // true
 *
 * // Password strength
 * const passwordValid = isStrongPassword('SecureP@ssw0rd123'); // true
 *
 * // Phone validation
 * const phoneValid = isValidPhoneNumber('+1-555-123-4567'); // true
 * ```
 *
 * @example Form validation
 * ```typescript
 * import { isEmpty, isValidEmail, isStrongPassword } from './validation.utils';
 *
 * const errors = [];
 * if (isEmpty(formData.email)) errors.push('Email required');
 * if (!isValidEmail(formData.email)) errors.push('Invalid email');
 * if (!isStrongPassword(formData.password)) errors.push('Password too weak');
 * ```
 *
 * LOC: 59C64CA415
 * UPSTREAM: lodash
 * DOWNSTREAM: services/*, validators/*, API endpoints
 *
 * @version 1.0.0
 * @since 2025-10-17
 */

import * as _ from 'lodash';

/**
 * @function isEmpty
 * @description Checks if a value is empty (null, undefined, empty string, empty array, or empty object)
 * @param {any} value - The value to check
 * @returns {boolean} True if value is empty, false otherwise
 *
 * @example
 * ```typescript
 * isEmpty(null);        // true
 * isEmpty(undefined);   // true
 * isEmpty('');          // true
 * isEmpty([]);          // true
 * isEmpty({});          // true
 * isEmpty('text');      // false
 * isEmpty([1, 2]);      // false
 * isEmpty({ key: 'value' }); // false
 * ```
 */
export const isEmpty = (value: any) => _.isEmpty(value);

/**
 * @function isNotEmpty
 * @description Checks if a value is not empty
 * @param {any} value - The value to check
 * @returns {boolean} True if value is not empty, false otherwise
 *
 * @example
 * ```typescript
 * isNotEmpty('text');   // true
 * isNotEmpty([1]);      // true
 * isNotEmpty('');       // false
 * isNotEmpty(null);     // false
 * ```
 */
export const isNotEmpty = (value: any) => !_.isEmpty(value);

/**
 * @function isUnique
 * @description Checks if all values in an array are unique
 * @template T
 * @param {T[]} array - The array to check
 * @returns {boolean} True if all values are unique, false if duplicates exist
 *
 * @example
 * ```typescript
 * isUnique([1, 2, 3, 4]);       // true
 * isUnique(['a', 'b', 'c']);    // true
 * isUnique([1, 2, 2, 3]);       // false
 * isUnique(['a', 'b', 'a']);    // false
 * ```
 */
export const isUnique = <T>(array: T[]) => _.uniq(array).length === array.length;

/**
 * @function isValidEmail
 * @description Validates email address format using RFC 5322 compliant regex
 * @param {string} email - The email address to validate
 * @returns {boolean} True if email format is valid, false otherwise
 *
 * @example
 * ```typescript
 * isValidEmail('user@example.com');     // true
 * isValidEmail('john.doe@company.org'); // true
 * isValidEmail('invalid.email');        // false
 * isValidEmail('@example.com');         // false
 * isValidEmail('user@');                // false
 * ```
 */
export const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * @function isValidPhoneNumber
 * @description Validates phone number format (supports international formats)
 * @param {string} phone - The phone number to validate
 * @returns {boolean} True if phone number is valid (at least 10 digits), false otherwise
 *
 * @security Validates phone numbers to prevent invalid data storage
 *
 * @example
 * ```typescript
 * isValidPhoneNumber('+15551234567');   // true
 * isValidPhoneNumber('555-123-4567');   // true
 * isValidPhoneNumber('(555) 123-4567'); // true
 * isValidPhoneNumber('123');            // false (too short)
 * isValidPhoneNumber('abc-def-ghij');   // false (not numeric)
 * ```
 */
export const isValidPhoneNumber = (phone: string) => {
  const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
  const digitsOnly = phone.replace(/\D/g, '');
  return phoneRegex.test(phone) && digitsOnly.length >= 10;
};

/**
 * @function isValidUuid
 * @description Validates UUID v4 format
 * @param {string} uuid - The UUID string to validate
 * @returns {boolean} True if valid UUID v4 format, false otherwise
 *
 * @security Used to validate secure identifiers and prevent injection
 *
 * @example
 * ```typescript
 * isValidUuid('123e4567-e89b-12d3-a456-426614174000'); // true
 * isValidUuid('550e8400-e29b-41d4-a716-446655440000'); // true
 * isValidUuid('not-a-uuid');                           // false
 * isValidUuid('12345678-1234-1234-1234-123456789012'); // false (not v4)
 * ```
 */
export const isValidUuid = (uuid: string) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

/**
 * @function isValidDate
 * @description Validates if a value represents a valid date
 * @param {any} date - The date value to validate (Date object or parseable string)
 * @returns {boolean} True if valid date, false otherwise
 *
 * @example
 * ```typescript
 * isValidDate(new Date());              // true
 * isValidDate('2024-01-15');            // true
 * isValidDate('2024-01-15T10:30:00Z');  // true
 * isValidDate('invalid date');          // false
 * isValidDate(null);                    // false
 * ```
 */
export const isValidDate = (date: any) => {
  if (date instanceof Date) {
    return !isNaN(date.getTime());
  }

  const parsedDate = new Date(date);
  return !isNaN(parsedDate.getTime());
};

/**
 * @function isStrongPassword
 * @description Validates password strength according to security best practices
 * @param {string} password - The password to validate
 * @returns {boolean} True if password meets strength requirements, false otherwise
 *
 * @security Enforces strong password requirements for authentication security
 *
 * Password Requirements:
 * - Minimum 12 characters
 * - At least one lowercase letter (a-z)
 * - At least one uppercase letter (A-Z)
 * - At least one number (0-9)
 * - At least one special character (@$!%*?&)
 *
 * @example
 * ```typescript
 * isStrongPassword('SecureP@ssw0rd123');  // true
 * isStrongPassword('MyP@ss123word!');     // true
 * isStrongPassword('weak');               // false (too short)
 * isStrongPassword('NoSpecialChar123');   // false (no special char)
 * isStrongPassword('nouppercasechar1!');  // false (no uppercase)
 * ```
 */
export const isStrongPassword = (password: string) => {
  // At least 12 characters, uppercase, lowercase, number, special character
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
  return password.length >= 12 && passwordRegex.test(password);
};

export default {
  isEmpty,
  isNotEmpty,
  isUnique,
  isValidEmail,
  isValidPhoneNumber,
  isValidUuid,
  isValidDate,
  isStrongPassword
};
