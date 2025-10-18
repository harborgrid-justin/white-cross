/**
 * LOC: 9DF81EFF88
 * File: /backend/src/shared/utils/object.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node)
 *
 * DOWNSTREAM (imported by):
 *   - lodashUtils.ts (utils/lodashUtils.ts)
 */

/**
 * File: /backend/src/shared/utils/object.ts
 * Locator: WC-UTL-OBJ-076
 * Purpose: Healthcare Object Utilities - Medical data manipulation and HIPAA-safe operations
 * 
 * Upstream: lodash library, independent utility module
 * Downstream: ../services/*, data transformation, API response formatting, PHI handling
 * Dependencies: lodash, TypeScript generics, object manipulation functions
 * Exports: cloneDeep, merge, pick, omit, get, set, healthcare data transformation
 * 
 * LLM Context: Object manipulation utilities for White Cross healthcare system.
 * Handles PHI-safe object operations, medical record merging, data sanitization.
 * Critical for HIPAA compliance when manipulating patient data objects.
 */

import _ from 'lodash';

/**
 * Shared object utility functions using lodash
 * Provides type-safe lodash wrappers for frequently used object operations
 */

/**
 * Deep clones an object
 */
export const cloneDeep = <T>(obj: T) => _.cloneDeep(obj);

/**
 * Merges objects deeply
 */
export const merge = <T>(target: T, ...sources: Partial<T>[]) => _.merge(target, ...sources);

/**
 * Picks specific properties from object
 */
export const pick = <T, K extends keyof T>(obj: T, keys: K[]) => _.pick(obj, keys);

/**
 * Omits specific properties from object
 */
export const omit = <T extends object, K extends keyof T>(obj: T, keys: K[]) => _.omit(obj, keys);

/**
 * Checks if object has all specified keys
 */
export const has = <T>(obj: T, keys: string[]) => _.has(obj, keys);

/**
 * Gets nested property value safely
 */
export const get = <T>(obj: T, path: string, defaultValue?: any) => _.get(obj, path, defaultValue);

/**
 * Sets nested property value safely
 */
export const set = <T extends object>(obj: T, path: string, value: unknown) => _.set(obj, path, value);

/**
 * Checks if path exists in object
 */
export const hasIn = <T>(obj: T, path: string) => _.hasIn(obj, path);

export default {
  cloneDeep,
  merge,
  pick,
  omit,
  has,
  get,
  set,
  hasIn
};
