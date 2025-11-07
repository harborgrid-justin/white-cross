/**
 * @fileoverview Type Guards - Runtime Type Checking Utilities
 * @module shared/types/guards
 * @description Berty-inspired runtime type validation with type guards
 *
 * Provides type-safe runtime validation for:
 * - API request/response validation
 * - Database model validation
 * - External data validation
 * - Type narrowing for TypeScript
 *
 * @author White-Cross Platform Team
 * @version 1.0.0
 * @since 2025-10-23
 */

/**
 * Basic type guards
 */

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

export function isNull(value: unknown): value is null {
  return value === null;
}

export function isUndefined(value: unknown): value is undefined {
  return value === undefined;
}

export function isNullOrUndefined(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

export function isFunction(value: unknown): value is Function {
  return typeof value === 'function';
}

export function isDate(value: unknown): value is Date {
  return value instanceof Date && !isNaN(value.getTime());
}

export function isError(value: unknown): value is Error {
  return value instanceof Error;
}

/**
 * Advanced type guards
 */

export function isStringArray(value: unknown): value is string[] {
  return isArray(value) && value.every(isString);
}

export function isNumberArray(value: unknown): value is number[] {
  return isArray(value) && value.every(isNumber);
}

export function isNonEmptyString(value: unknown): value is string {
  return isString(value) && value.trim().length > 0;
}

export function isNonEmptyArray<T>(value: unknown): value is [T, ...T[]] {
  return isArray(value) && value.length > 0;
}

export function isUUID(value: unknown): value is string {
  if (!isString(value)) return false;
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
}

export function isEmail(value: unknown): value is string {
  if (!isString(value)) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}

export function isPhoneNumber(value: unknown): value is string {
  if (!isString(value)) return false;
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
  return phoneRegex.test(value) && value.replace(/\D/g, '').length >= 10;
}

export function isISO8601(value: unknown): value is string {
  if (!isString(value)) return false;
  try {
    const date = new Date(value);
    return date.toISOString() === value;
  } catch {
    return false;
  }
}

export function isValidDate(value: unknown): value is Date | string {
  if (isDate(value)) return true;
  if (isString(value)) {
    const date = new Date(value);
    return !isNaN(date.getTime());
  }
  return false;
}

/**
 * Object shape guards
 */

export function hasProperty<K extends PropertyKey>(
  obj: unknown,
  key: K,
): obj is Record<K, unknown> {
  return isObject(obj) && key in obj;
}

export function hasProperties<K extends PropertyKey>(
  obj: unknown,
  keys: K[],
): obj is Record<K, unknown> {
  return isObject(obj) && keys.every((key) => key in obj);
}

export function hasStringProperty<K extends PropertyKey>(
  obj: unknown,
  key: K,
): obj is Record<K, string> {
  return hasProperty(obj, key) && isString(obj[key]);
}

export function hasNumberProperty<K extends PropertyKey>(
  obj: unknown,
  key: K,
): obj is Record<K, number> {
  return hasProperty(obj, key) && isNumber(obj[key]);
}

/**
 * Healthcare-specific type guards
 */

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  grade?: string;
  active: boolean;
}

export function isStudent(obj: unknown): obj is Student {
  return (
    isObject(obj) &&
    hasStringProperty(obj, 'id') &&
    hasStringProperty(obj, 'firstName') &&
    hasStringProperty(obj, 'lastName') &&
    hasProperty(obj, 'active') &&
    isBoolean(obj.active)
  );
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  unit: string;
  route: string;
}

export function isMedication(obj: unknown): obj is Medication {
  return (
    isObject(obj) &&
    hasStringProperty(obj, 'id') &&
    hasStringProperty(obj, 'name') &&
    hasStringProperty(obj, 'dosage') &&
    hasStringProperty(obj, 'unit') &&
    hasStringProperty(obj, 'route')
  );
}

export interface MedicationLog {
  id: string;
  medicationId: string;
  studentId: string;
  scheduledTime: Date | string;
  administeredAt?: Date | string;
  administeredBy?: string;
}

export function isMedicationLog(obj: unknown): obj is MedicationLog {
  return (
    isObject(obj) &&
    hasStringProperty(obj, 'id') &&
    hasStringProperty(obj, 'medicationId') &&
    hasStringProperty(obj, 'studentId') &&
    hasProperty(obj, 'scheduledTime') &&
    isValidDate(obj.scheduledTime)
  );
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  type: 'guardian' | 'emergency' | 'staff' | 'vendor';
  relationTo?: string;
}

export function isContact(obj: unknown): obj is Contact {
  return (
    isObject(obj) &&
    hasStringProperty(obj, 'id') &&
    hasStringProperty(obj, 'firstName') &&
    hasStringProperty(obj, 'lastName') &&
    hasStringProperty(obj, 'type') &&
    ['guardian', 'emergency', 'staff', 'vendor'].includes(obj.type)
  );
}

export interface HealthRecord {
  id: string;
  studentId: string;
  type: string;
  date: Date | string;
  description?: string;
  locked: boolean;
}

export function isHealthRecord(obj: unknown): obj is HealthRecord {
  return (
    isObject(obj) &&
    hasStringProperty(obj, 'id') &&
    hasStringProperty(obj, 'studentId') &&
    hasStringProperty(obj, 'type') &&
    hasProperty(obj, 'date') &&
    isValidDate(obj.date) &&
    hasProperty(obj, 'locked') &&
    isBoolean(obj.locked)
  );
}

/**
 * API request/response guards
 */

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export function isPaginatedResponse<T>(
  obj: unknown,
  itemGuard: (item: unknown) => item is T,
): obj is PaginatedResponse<T> {
  return (
    isObject(obj) &&
    hasProperty(obj, 'data') &&
    isArray(obj.data) &&
    obj.data.every(itemGuard) &&
    hasNumberProperty(obj, 'total') &&
    hasNumberProperty(obj, 'page') &&
    hasNumberProperty(obj, 'pageSize') &&
    hasProperty(obj, 'hasMore') &&
    isBoolean(obj.hasMore)
  );
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export function isApiError(obj: unknown): obj is ApiError {
  return (
    isObject(obj) &&
    hasStringProperty(obj, 'code') &&
    hasStringProperty(obj, 'message')
  );
}

/**
 * Validation helpers
 */

export function assertString(
  value: unknown,
  name: string,
): asserts value is string {
  if (!isString(value)) {
    throw new TypeError(`Expected ${name} to be a string, got ${typeof value}`);
  }
}

export function assertNumber(
  value: unknown,
  name: string,
): asserts value is number {
  if (!isNumber(value)) {
    throw new TypeError(`Expected ${name} to be a number, got ${typeof value}`);
  }
}

export function assertBoolean(
  value: unknown,
  name: string,
): asserts value is boolean {
  if (!isBoolean(value)) {
    throw new TypeError(
      `Expected ${name} to be a boolean, got ${typeof value}`,
    );
  }
}

export function assertObject(
  value: unknown,
  name: string,
): asserts value is Record<string, unknown> {
  if (!isObject(value)) {
    throw new TypeError(
      `Expected ${name} to be an object, got ${typeof value}`,
    );
  }
}

export function assertArray(
  value: unknown,
  name: string,
): asserts value is unknown[] {
  if (!isArray(value)) {
    throw new TypeError(`Expected ${name} to be an array, got ${typeof value}`);
  }
}

export function assertNonNull<T>(
  value: T | null | undefined,
  name: string,
): asserts value is T {
  if (isNullOrUndefined(value)) {
    throw new TypeError(`Expected ${name} to be non-null, got ${value}`);
  }
}

export function assertUUID(
  value: unknown,
  name: string,
): asserts value is string {
  if (!isUUID(value)) {
    throw new TypeError(`Expected ${name} to be a valid UUID, got ${value}`);
  }
}

export function assertEmail(
  value: unknown,
  name: string,
): asserts value is string {
  if (!isEmail(value)) {
    throw new TypeError(`Expected ${name} to be a valid email, got ${value}`);
  }
}

/**
 * Utility type guards
 */

export function isDefined<T>(value: T | null | undefined): value is T {
  return !isNullOrUndefined(value);
}

export function isOneOf<T>(value: unknown, options: T[]): value is T {
  return options.includes(value as T);
}

export function isInRange(
  value: unknown,
  min: number,
  max: number,
): value is number {
  return isNumber(value) && value >= min && value <= max;
}

export function isMinLength(
  value: unknown,
  minLength: number,
): value is string {
  return isString(value) && value.length >= minLength;
}

export function isMaxLength(
  value: unknown,
  maxLength: number,
): value is string {
  return isString(value) && value.length <= maxLength;
}

export function matches(value: unknown, pattern: RegExp): value is string {
  return isString(value) && pattern.test(value);
}

/**
 * Branded types for stronger type safety
 */

export type StudentId = string & { readonly __brand: 'StudentId' };
export type MedicationId = string & { readonly __brand: 'MedicationId' };
export type UserId = string & { readonly __brand: 'UserId' };
export type ContactId = string & { readonly __brand: 'ContactId' };
export type HealthRecordId = string & { readonly __brand: 'HealthRecordId' };

export function brandStudentId(id: string): StudentId {
  return id as StudentId;
}

export function brandMedicationId(id: string): MedicationId {
  return id as MedicationId;
}

export function brandUserId(id: string): UserId {
  return id as UserId;
}

export function brandContactId(id: string): ContactId {
  return id as ContactId;
}

export function brandHealthRecordId(id: string): HealthRecordId {
  return id as HealthRecordId;
}

export function isStudentId(value: unknown): value is StudentId {
  return isUUID(value);
}

export function isMedicationId(value: unknown): value is MedicationId {
  return isUUID(value);
}

export function isUserId(value: unknown): value is UserId {
  return isUUID(value);
}

export function isContactId(value: unknown): value is ContactId {
  return isUUID(value);
}

export function isHealthRecordId(value: unknown): value is HealthRecordId {
  return isUUID(value);
}

/**
 * Export all guards
 */
export default {
  // Basic
  isString,
  isNumber,
  isBoolean,
  isNull,
  isUndefined,
  isNullOrUndefined,
  isObject,
  isArray,
  isFunction,
  isDate,
  isError,

  // Advanced
  isStringArray,
  isNumberArray,
  isNonEmptyString,
  isNonEmptyArray,
  isUUID,
  isEmail,
  isPhoneNumber,
  isISO8601,
  isValidDate,

  // Object shape
  hasProperty,
  hasProperties,
  hasStringProperty,
  hasNumberProperty,

  // Healthcare-specific
  isStudent,
  isMedication,
  isMedicationLog,
  isContact,
  isHealthRecord,

  // API
  isPaginatedResponse,
  isApiError,

  // Assertions
  assertString,
  assertNumber,
  assertBoolean,
  assertObject,
  assertArray,
  assertNonNull,
  assertUUID,
  assertEmail,

  // Utility
  isDefined,
  isOneOf,
  isInRange,
  isMinLength,
  isMaxLength,
  matches,

  // Branded types
  brandStudentId,
  brandMedicationId,
  brandUserId,
  brandContactId,
  brandHealthRecordId,
  isStudentId,
  isMedicationId,
  isUserId,
  isContactId,
  isHealthRecordId,
};
