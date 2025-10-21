/**
 * LOC: 59C64CA415
 * File: /backend/src/shared/utils/validation.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node)
 *
 * DOWNSTREAM (imported by):
 *   - lodashUtils.ts (utils/lodashUtils.ts)
 */

/**
 * File: /backend/src/shared/utils/validation.ts
 * Locator: WC-UTL-VAL-075
 * Purpose: Healthcare Data Validation - HIPAA-compliant input validation and security
 * 
 * Upstream: lodash library, independent validation module
 * Downstream: ../services/*, ../validators/*, API endpoints, data sanitization
 * Dependencies: lodash, regex patterns, healthcare validation rules
 * Exports: isEmpty, isValidEmail, isValidPhoneNumber, isValidUuid, isStrongPassword
 * 
 * LLM Context: Critical validation utilities for White Cross healthcare system.
 * Ensures data integrity, HIPAA compliance, security validation. Handles email,
 * phone, UUID, password strength validation. Essential for patient data protection.
 */

import * as _ from 'lodash';

/**
 * Shared validation utility functions
 * Provides validation functions for common data types
 */

/**
 * Checks if value is empty (null, undefined, empty string, empty array, empty object)
 */
export const isEmpty = (value: any) => _.isEmpty(value);

/**
 * Checks if value is not empty
 */
export const isNotEmpty = (value: any) => !_.isEmpty(value);

/**
 * Checks if all values in array are unique
 */
export const isUnique = <T>(array: T[]) => _.uniq(array).length === array.length;

/**
 * Validates email format
 */
export const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates phone number format
 */
export const isValidPhoneNumber = (phone: string) => {
  const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
  const digitsOnly = phone.replace(/\D/g, '');
  return phoneRegex.test(phone) && digitsOnly.length >= 10;
};

/**
 * Validates UUID format
 */
export const isValidUuid = (uuid: string) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

/**
 * Validates date format
 */
export const isValidDate = (date: any) => {
  if (date instanceof Date) {
    return !isNaN(date.getTime());
  }
  
  const parsedDate = new Date(date);
  return !isNaN(parsedDate.getTime());
};

/**
 * Validates password strength
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
