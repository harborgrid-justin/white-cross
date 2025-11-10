/**
 * Type Guard Definitions
 *
 * TypeScript type guard functions for runtime type checking.
 * These guards provide type narrowing and runtime validation.
 *
 * @module types/guards
 */

/**
 * Check if value is defined (not null or undefined)
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * Check if value is null
 */
export function isNull(value: unknown): value is null {
  return value === null;
}

/**
 * Check if value is undefined
 */
export function isUndefined(value: unknown): value is undefined {
  return value === undefined;
}

/**
 * Check if value is a string
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * Check if value is a number
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !Number.isNaN(value);
}

/**
 * Check if value is a boolean
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

/**
 * Check if value is a function
 */
export function isFunction(value: unknown): value is Function {
  return typeof value === 'function';
}

/**
 * Check if value is an object (excluding null and arrays)
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Check if value is an array
 */
export function isArray<T = unknown>(value: unknown): value is T[] {
  return Array.isArray(value);
}

/**
 * Check if value is a Date object
 */
export function isDate(value: unknown): value is Date {
  return value instanceof Date && !isNaN(value.getTime());
}

/**
 * Check if value is a Promise
 */
export function isPromise<T = any>(value: unknown): value is Promise<T> {
  return (
    value instanceof Promise ||
    (isObject(value) && isFunction((value as any).then))
  );
}

/**
 * Check if value is a valid email string
 */
export function isEmail(value: unknown): value is string {
  if (!isString(value)) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}

/**
 * Check if value is a valid UUID
 */
export function isUUID(value: unknown): value is string {
  if (!isString(value)) return false;
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
}

/**
 * Check if value is a valid ISO date string
 */
export function isISODate(value: unknown): value is string {
  if (!isString(value)) return false;
  const date = new Date(value);
  return !isNaN(date.getTime()) && value === date.toISOString();
}

/**
 * Check if value is a valid URL
 */
export function isURL(value: unknown): value is string {
  if (!isString(value)) return false;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if value is an empty object
 */
export function isEmptyObject(value: unknown): boolean {
  return isObject(value) && Object.keys(value).length === 0;
}

/**
 * Check if value is an empty array
 */
export function isEmptyArray(value: unknown): boolean {
  return isArray(value) && value.length === 0;
}

/**
 * Check if object has a specific key
 */
export function hasKey<K extends string>(
  obj: unknown,
  key: K,
): obj is Record<K, unknown> {
  return isObject(obj) && key in obj;
}

/**
 * Check if object has all specified keys
 */
export function hasKeys<K extends string>(
  obj: unknown,
  keys: K[],
): obj is Record<K, unknown> {
  return isObject(obj) && keys.every((key) => key in obj);
}

/**
 * Check if value is a valid JSON string
 */
export function isJSONString(value: unknown): value is string {
  if (!isString(value)) return false;
  try {
    JSON.parse(value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if value is a Record with string keys
 */
export function isRecord(value: unknown): value is Record<string, unknown> {
  return isObject(value);
}

/**
 * Check if value is nullable (null or undefined)
 */
export function isNullable(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

/**
 * Check if value is an error object
 */
export function isError(value: unknown): value is Error {
  return value instanceof Error;
}

/**
 * Type guard for checking if an object is of a specific class
 */
export function isInstanceOf<T>(
  value: unknown,
  constructor: new (...args: any[]) => T,
): value is T {
  return value instanceof constructor;
}

/**
 * Create a custom type guard from a validation function
 */
export function createTypeGuard<T>(
  validator: (value: unknown) => boolean,
): (value: unknown) => value is T {
  return (value: unknown): value is T => validator(value);
}
