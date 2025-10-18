import _ from 'lodash';

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
export const truncate = (str: string, length: number) => _.truncate(str, { length });

/**
 * Pads string to specified length
 */
export const padStart = (str: string, length: number, chars: string) => _.padStart(str, length, chars);

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
  toNumber
};