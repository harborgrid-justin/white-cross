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

import * as _ from 'lodash';

/**
 * Shared object utility functions using lodash
 * Provides type-safe lodash wrappers for frequently used object operations
 */

/**
 * Creates a deep clone of an object, recursively copying all nested properties.
 * Essential for HIPAA-compliant data handling to prevent unintended mutations of PHI.
 *
 * @template T - The type of object to clone
 * @param {T} obj - Object to deep clone
 * @returns {T} Deep copy of the object with no shared references
 *
 * @example
 * ```typescript
 * interface Patient { id: string; records: { type: string; date: Date }[] }
 * const original: Patient = {
 *   id: 'P1',
 *   records: [{ type: 'allergy', date: new Date() }]
 * };
 * const copy = cloneDeep(original);
 * copy.records[0].type = 'immunization'; // Does not affect original
 * console.log(original.records[0].type); // Still 'allergy'
 * ```
 *
 * @remarks
 * Use this when you need to manipulate healthcare data without affecting the original.
 * Performance note: Deep cloning large objects can be expensive; use judiciously.
 */
export const cloneDeep = <T>(obj: T) => _.cloneDeep(obj);

/**
 * Recursively merges source objects into target object.
 * Properties in later sources override properties in earlier sources.
 *
 * @template T - The type of target object
 * @param {T} target - Target object to merge into
 * @param {...Partial<T>[]} sources - Source objects to merge from
 * @returns {T} Merged object (mutates target)
 *
 * @example
 * ```typescript
 * interface Config { api: { timeout: number; retries: number }; debug: boolean }
 * const defaults: Config = { api: { timeout: 5000, retries: 3 }, debug: false };
 * const overrides = { api: { retries: 5 } };
 * const config = merge(defaults, overrides);
 * // Result: { api: { timeout: 5000, retries: 5 }, debug: false }
 * ```
 *
 * @remarks
 * Warning: This function mutates the target object. Use cloneDeep first if immutability is required.
 */
export const merge = <T>(target: T, ...sources: Partial<T>[]) =>
  _.merge(target, ...sources);

/**
 * Creates new object with only specified properties from source object.
 * Useful for sanitizing API responses and excluding sensitive PHI fields.
 *
 * @template T - The type of source object
 * @template K - Keys to pick from the object
 * @param {T} obj - Source object
 * @param {K[]} keys - Array of keys to pick
 * @returns {Pick<T, K>} New object with only specified keys
 *
 * @example
 * ```typescript
 * interface Student {
 *   id: string;
 *   name: string;
 *   ssn: string;  // PHI
 *   medicalHistory: string[];  // PHI
 * }
 * const student: Student = {
 *   id: 'S1',
 *   name: 'John Doe',
 *   ssn: '123-45-6789',
 *   medicalHistory: ['asthma']
 * };
 * const publicData = pick(student, ['id', 'name']);
 * // Result: { id: 'S1', name: 'John Doe' } - PHI excluded
 * ```
 */
export const pick = <T, K extends keyof T>(obj: T, keys: K[]) =>
  _.pick(obj, keys);

/**
 * Creates new object excluding specified properties from source object.
 * Inverse of pick - useful for removing sensitive fields from responses.
 *
 * @template T - The type of source object
 * @template K - Keys to omit from the object
 * @param {T} obj - Source object
 * @param {K[]} keys - Array of keys to omit
 * @returns {Omit<T, K>} New object without specified keys
 *
 * @example
 * ```typescript
 * interface UserWithPassword {
 *   id: string;
 *   email: string;
 *   passwordHash: string;
 *   salt: string;
 * }
 * const user: UserWithPassword = {
 *   id: 'U1',
 *   email: 'user@example.com',
 *   passwordHash: 'hashed',
 *   salt: 'salt'
 * };
 * const safeUser = omit(user, ['passwordHash', 'salt']);
 * // Result: { id: 'U1', email: 'user@example.com' }
 * ```
 */
export const omit = <T extends object, K extends keyof T>(obj: T, keys: K[]) =>
  _.omit(obj, keys);

/**
 * Checks if object has all specified keys.
 *
 * @template T - The type of object to check
 * @param {T} obj - Object to check
 * @param {string[]} keys - Array of keys to check for
 * @returns {boolean} True if object has all specified keys
 *
 * @example
 * ```typescript
 * const patient = { id: 'P1', name: 'Jane Doe', age: 25 };
 * has(patient, ['id', 'name']); // true
 * has(patient, ['id', 'ssn']);  // false
 * ```
 */
export const has = <T>(obj: T, keys: string[]) => _.has(obj, keys);

/**
 * Safely retrieves value from nested object path.
 * Returns defaultValue if path does not exist, preventing runtime errors.
 *
 * @template T - The type of object to access
 * @param {T} obj - Object to access
 * @param {string} path - Dot-notation or array path (e.g., 'user.address.city' or ['user', 'address', 'city'])
 * @param {any} [defaultValue] - Value to return if path doesn't exist
 * @returns {any} Value at path or defaultValue
 *
 * @example
 * ```typescript
 * interface Patient {
 *   contact: { emergency: { phone?: string; name?: string } }
 * }
 * const patient: Patient = {
 *   contact: { emergency: { name: 'John' } }
 * };
 * get(patient, 'contact.emergency.phone', 'N/A'); // 'N/A'
 * get(patient, 'contact.emergency.name');         // 'John'
 * get(patient, 'contact.primary.phone', null);    // null
 * ```
 */
export const get = <T>(obj: T, path: string, defaultValue?: any) =>
  _.get(obj, path, defaultValue);

/**
 * Safely sets value at nested object path, creating intermediate objects as needed.
 *
 * @template T - The type of object to modify
 * @param {T} obj - Object to modify
 * @param {string} path - Dot-notation or array path
 * @param {unknown} value - Value to set
 * @returns {T} Modified object (mutates original)
 *
 * @example
 * ```typescript
 * const patient: any = { id: 'P1' };
 * set(patient, 'contact.emergency.phone', '555-0123');
 * // Result: { id: 'P1', contact: { emergency: { phone: '555-0123' } } }
 *
 * set(patient, 'allergies[0]', 'peanuts');
 * // Result: { ..., allergies: ['peanuts'] }
 * ```
 *
 * @remarks
 * Warning: This function mutates the object. Use cloneDeep first if immutability is required.
 */
export const set = <T extends object>(obj: T, path: string, value: unknown) =>
  _.set(obj, path, value);

/**
 * Checks if path exists in object (including inherited properties).
 * More thorough than 'has' as it checks the prototype chain.
 *
 * @template T - The type of object to check
 * @param {T} obj - Object to check
 * @param {string} path - Dot-notation or array path
 * @returns {boolean} True if path exists in object or its prototype chain
 *
 * @example
 * ```typescript
 * const patient = { id: 'P1', records: { allergies: [] } };
 * hasIn(patient, 'records.allergies');      // true
 * hasIn(patient, 'records.medications');    // false
 * hasIn(patient, 'toString');               // true (inherited from Object)
 * ```
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
  hasIn,
};
