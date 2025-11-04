/**
 * WF-COMP-343 | lodashUtils.objects.ts - Object utility functions
 * Purpose: Object manipulation and transformation utilities using lodash
 * Upstream: React, external libs | Dependencies: lodash
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: lodashUtils.ts, other utility modules
 * Exports: objectUtils | Key Features: deep operations, property access
 * Last Updated: 2025-11-04 | File Type: .ts
 * Critical Path: Component mount → Data processing → Object operations
 * LLM Context: Object utility module, part of refactored lodashUtils
 */

import _ from 'lodash';

/**
 * Object utility functions for common operations
 * Provides type-safe lodash wrappers for object manipulation
 */
export const objectUtils = {
  /**
   * Deep clones an object
   */
  cloneDeep: <T>(obj: T) => _.cloneDeep(obj),

  /**
   * Merges objects deeply
   */
  merge: <T>(target: T, ...sources: Partial<T>[]) => _.merge(target, ...sources),

  /**
   * Picks specific properties from object
   */
  pick: <T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]) => _.pick(obj, keys),

  /**
   * Omits specific properties from object
   */
  omit: <T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]) => _.omit(obj, keys),

  /**
   * Checks if object has all specified keys
   */
  has: <T extends Record<string, any>>(obj: T, keys: string[]) => _.has(obj, keys),

  /**
   * Gets nested property value safely
   */
  get: <T extends Record<string, any>>(obj: T, path: string, defaultValue?: any) => _.get(obj, path, defaultValue),

  /**
   * Sets nested property value safely
   */
  set: <T extends Record<string, any>>(obj: T, path: string, value: any) => _.set(obj, path, value),

  /**
   * Checks if path exists in object
   */
  hasIn: <T extends Record<string, any>>(obj: T, path: string) => _.hasIn(obj, path),

  /**
   * Maps object values
   */
  mapValues: <T extends Record<string, any>, TResult>(obj: T, fn: (value: any) => TResult) => _.mapValues(obj, fn),

  /**
   * Maps object keys
   */
  mapKeys: <T extends Record<string, any>>(obj: T, fn: (value: any, key: string) => string) => _.mapKeys(obj, fn),
};
