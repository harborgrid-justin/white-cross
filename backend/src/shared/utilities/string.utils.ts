/**
 * LOC: B6B2149730
 * File: /backend/src/shared/utils/string.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node)
 *
 * DOWNSTREAM (imported by):
 *   - lodashUtils.ts (utils/lodashUtils.ts)
 */

/**
 * File: /backend/src/shared/utils/string.ts
 * Locator: WC-UTL-STR-074
 * Purpose: Healthcare String Utilities - Medical data formatting and sanitization
 *
 * Upstream: lodash library, independent utility module
 * Downstream: ../services/*, data validation, name formatting, medical record processing
 * Dependencies: lodash, string manipulation functions
 * Exports: capitalize, camelCase, kebabCase, snakeCase, truncate, padStart, trim, toNumber
 *
 * LLM Context: String manipulation utilities for White Cross healthcare system.
 * Handles patient name formatting, medical code processing, data sanitization.
 * Essential for HIPAA-compliant data handling and consistent text formatting.
 */

import * as _ from 'lodash';

/**
 * Shared string utility functions using lodash
 * Provides type-safe lodash wrappers for frequently used string operations
 */

/**
 * Capitalizes the first letter of a string and lowercases the rest.
 *
 * @param {string} str - String to capitalize
 * @returns {string} String with first letter uppercase, rest lowercase
 *
 * @example
 * ```typescript
 * capitalize('john');           // 'John'
 * capitalize('MARY');           // 'Mary'
 * capitalize('john doe');       // 'John doe'
 * capitalize('');               // ''
 * ```
 */
export const capitalize = (str: string) => _.capitalize(str);

/**
 * Converts string to camelCase format.
 * Useful for JavaScript variable names and API payloads.
 *
 * @param {string} str - String to convert
 * @returns {string} String in camelCase format
 *
 * @example
 * ```typescript
 * camelCase('Patient Name');        // 'patientName'
 * camelCase('medication-dosage');   // 'medicationDosage'
 * camelCase('STUDENT_GRADE');       // 'studentGrade'
 * camelCase('health record type');  // 'healthRecordType'
 * ```
 */
export const camelCase = (str: string) => _.camelCase(str);

/**
 * Converts string to kebab-case format (lowercase with hyphens).
 * Commonly used for URLs, CSS classes, and file names.
 *
 * @param {string} str - String to convert
 * @returns {string} String in kebab-case format
 *
 * @example
 * ```typescript
 * kebabCase('Patient Name');        // 'patient-name'
 * kebabCase('medicationDosage');    // 'medication-dosage'
 * kebabCase('STUDENT_GRADE');       // 'student-grade'
 * kebabCase('healthRecordType');    // 'health-record-type'
 * ```
 */
export const kebabCase = (str: string) => _.kebabCase(str);

/**
 * Converts string to snake_case format (lowercase with underscores).
 * Commonly used for database column names and environment variables.
 *
 * @param {string} str - String to convert
 * @returns {string} String in snake_case format
 *
 * @example
 * ```typescript
 * snakeCase('Patient Name');        // 'patient_name'
 * snakeCase('medicationDosage');    // 'medication_dosage'
 * snakeCase('STUDENT-GRADE');       // 'student_grade'
 * snakeCase('healthRecordType');    // 'health_record_type'
 * ```
 */
export const snakeCase = (str: string) => _.snakeCase(str);

/**
 * Truncates string to specified length, adding ellipsis (...) if truncated.
 * Useful for displaying long text in UI with limited space.
 *
 * @param {string} str - String to truncate
 * @param {number} length - Maximum length (includes ellipsis in count)
 * @returns {string} Truncated string with '...' if length exceeded
 *
 * @example
 * ```typescript
 * truncate('This is a very long patient note', 20);
 * // Result: 'This is a very lo...'
 *
 * truncate('Short text', 50);
 * // Result: 'Short text'
 *
 * truncate('Medication administration notes for student', 25);
 * // Result: 'Medication administra...'
 * ```
 */
export const truncate = (str: string, length: number) =>
  _.truncate(str, { length });

/**
 * Pads string at the start to reach specified length with provided characters.
 * Useful for formatting IDs, medical record numbers, or time values.
 *
 * @param {string} str - String to pad
 * @param {number} length - Target length
 * @param {string} chars - Characters to use for padding
 * @returns {string} Padded string
 *
 * @example
 * ```typescript
 * padStart('5', 3, '0');           // '005'
 * padStart('42', 5, '0');          // '00042'
 * padStart('ID123', 10, 'X');      // 'XXXXXID123'
 * padStart('7', 2, '0');           // '07' (useful for time: 07:30)
 * ```
 */
export const padStart = (str: string, length: number, chars: string) =>
  _.padStart(str, length, chars);

/**
 * Removes leading and trailing whitespace from string.
 * Essential for sanitizing user input and preventing injection attacks.
 *
 * @param {string} str - String to trim
 * @returns {string} String with leading/trailing whitespace removed
 *
 * @example
 * ```typescript
 * trim('  John Doe  ');           // 'John Doe'
 * trim('\n\tPatient Name\t\n');   // 'Patient Name'
 * trim('  Aspirin ');             // 'Aspirin'
 * ```
 *
 * @remarks
 * Always use trim on user input before validation or storage to ensure data consistency.
 */
export const trim = (str: string) => _.trim(str);

/**
 * Converts string to number.
 * Handles numeric strings, returning NaN for invalid input.
 *
 * @param {string} str - String to convert to number
 * @returns {number} Numeric value or NaN if conversion fails
 *
 * @example
 * ```typescript
 * toNumber('42');           // 42
 * toNumber('3.14');         // 3.14
 * toNumber('98.6');         // 98.6 (temperature)
 * toNumber('invalid');      // NaN
 * toNumber('');             // 0
 * ```
 *
 * @remarks
 * Always validate the result with isNaN() or Number.isFinite() for safety.
 * For parsing user input, consider using parseInt() or parseFloat() with radix.
 */
export const toNumber = (str: string) => _.toNumber(str);

export default {
  capitalize,
  camelCase,
  kebabCase,
  snakeCase,
  truncate,
  padStart,
  trim,
  toNumber,
};
