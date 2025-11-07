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
 * Capitalizes first letter of string
 */
export const capitalize = (str: string) => _.capitalize(str);

/**
 * Converts string to camelCase
 */
export const camelCase = (str: string) => _.camelCase(str);

/**
 * Converts string to kebab-case
 */
export const kebabCase = (str: string) => _.kebabCase(str);

/**
 * Converts string to snake_case
 */
export const snakeCase = (str: string) => _.snakeCase(str);

/**
 * Truncates string to specified length
 */
export const truncate = (str: string, length: number) =>
  _.truncate(str, { length });

/**
 * Pads string to specified length
 */
export const padStart = (str: string, length: number, chars: string) =>
  _.padStart(str, length, chars);

/**
 * Removes leading and trailing whitespace
 */
export const trim = (str: string) => _.trim(str);

/**
 * Converts string to number
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
