/**
 * WF-COMP-343 | lodashUtils.arrays.ts - Array utility functions
 * Purpose: Array manipulation and transformation utilities using lodash
 * Upstream: React, external libs | Dependencies: lodash
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: lodashUtils.ts, other utility modules
 * Exports: arrayUtils | Key Features: grouping, filtering, transformations
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Component mount → Data processing → Array operations
 * LLM Context: Array utility module, part of refactored lodashUtils
 */

import _ from 'lodash';

/**
 * Array utility functions for common operations
 * Provides type-safe lodash wrappers for array manipulation
 */
export const arrayUtils = {
  /**
   * Groups array of objects by a key
   */
  groupBy: <T>(array: T[], key: keyof T) => _.groupBy(array, key),

  /**
   * Removes duplicates from array of objects by a key
   */
  uniqBy: <T>(array: T[], key: keyof T) => _.uniqBy(array, key),

  /**
   * Chunks array into smaller arrays of specified size
   */
  chunk: <T>(array: T[], size: number) => _.chunk(array, size),

  /**
   * Finds intersection of multiple arrays
   */
  intersection: <T>(arrays: T[][]) => _.intersection(...arrays),

  /**
   * Removes falsy values from array
   */
  compact: <T>(array: (T | null | undefined | false | 0 | '')[]) => _.compact(array),

  /**
   * Flattens nested arrays
   */
  flatten: <T>(array: (T | T[])[]) => _.flatten(array),

  /**
   * Deep flattens nested arrays
   */
  flattenDeep: (array: readonly unknown[]) => _.flattenDeep(array),

  /**
   * Takes first N elements from array
   */
  take: <T>(array: T[], n: number) => _.take(array, n),

  /**
   * Takes elements from array while predicate returns true
   */
  takeWhile: <T>(array: T[], predicate: (value: T) => boolean) => _.takeWhile(array, predicate),

  /**
   * Drops first N elements from array
   */
  drop: <T>(array: T[], n: number) => _.drop(array, n),

  /**
   * Drops elements from array while predicate returns true
   */
  dropWhile: <T>(array: T[], predicate: (value: T) => boolean) => _.dropWhile(array, predicate),
};
