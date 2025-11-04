/**
 * WF-COMP-343 | lodashUtils.strings.ts - String utility functions
 * Purpose: String manipulation and transformation utilities using lodash
 * Upstream: React, external libs | Dependencies: lodash
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: lodashUtils.ts, other utility modules
 * Exports: stringUtils | Key Features: case conversion, formatting, validation
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Component mount → Data processing → String operations
 * LLM Context: String utility module, part of refactored lodashUtils
 */

import _ from 'lodash';

/**
 * String utility functions for common operations
 * Provides type-safe lodash wrappers for string manipulation
 */
export const stringUtils = {
  /**
   * Capitalizes first letter of string
   */
  capitalize: (str: string) => _.capitalize(str),

  /**
   * Converts string to camelCase
   */
  camelCase: (str: string) => _.camelCase(str),

  /**
   * Converts string to kebab-case
   */
  kebabCase: (str: string) => _.kebabCase(str),

  /**
   * Converts string to snake_case
   */
  snakeCase: (str: string) => _.snakeCase(str),

  /**
   * Truncates string to specified length
   */
  truncate: (str: string, length: number) => _.truncate(str, { length }),

  /**
   * Pads string to specified length
   */
  padStart: (str: string, length: number, chars: string) => _.padStart(str, length, chars),

  /**
   * Removes leading and trailing whitespace
   */
  trim: (str: string) => _.trim(str),

  /**
   * Converts string to number
   */
  toNumber: (str: string) => _.toNumber(str),

  /**
   * Splits string by separator
   */
  split: (str: string, separator?: string | RegExp, limit?: number) => _.split(str, separator, limit),

  /**
   * Joins array of strings
   */
  join: (array: string[], separator?: string) => _.join(array, separator),

  /**
   * Replaces substring
   */
  replace: (str: string, pattern: string | RegExp, replacement: string) => _.replace(str, pattern, replacement),

  /**
   * Converts string to lowercase
   */
  toLower: (str: string) => _.toLower(str),

  /**
   * Converts string to uppercase
   */
  toUpper: (str: string) => _.toUpper(str),

  /**
   * Checks if string starts with substring
   */
  startsWith: (str: string, target: string, position?: number) => _.startsWith(str, target, position),

  /**
   * Checks if string ends with substring
   */
  endsWith: (str: string, target: string, position?: number) => _.endsWith(str, target, position),
};
