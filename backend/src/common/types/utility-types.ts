/**
 * @fileoverview Common Utility Types for Type-Safe API Development
 * @module common/types/utility-types
 * @description Provides reusable generic types for API responses, pagination,
 * error handling, and data transformation across the application.
 *
 * @since 1.0.0
 * @category Type Utilities
 */

/**
 * Pagination metadata for paginated API responses.
 *
 * @interface PaginationMeta
 * @category Pagination
 *
 * @property {number} page - Current page number (1-indexed)
 * @property {number} limit - Maximum items per page
 * @property {number} total - Total number of items across all pages
 * @property {number} pages - Total number of pages available
 *
 * @example
 * ```typescript
 * const meta: PaginationMeta = {
 *   page: 1,
 *   limit: 20,
 *   total: 156,
 *   pages: 8
 * };
 * ```
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

/**
 * Paginated response wrapper for list endpoints.
 *
 * @template T - The entity type being paginated
 * @interface PaginatedResponse
 * @category Pagination
 *
 * @property {T[]} data - Array of entities for the current page
 * @property {PaginationMeta} meta - Pagination metadata
 *
 * @example
 * ```typescript
 * interface Student {
 *   id: string;
 *   firstName: string;
 *   lastName: string;
 * }
 *
 * const response: PaginatedResponse<Student> = {
 *   data: [
 *     { id: 'uuid-1', firstName: 'John', lastName: 'Doe' },
 *     { id: 'uuid-2', firstName: 'Jane', lastName: 'Smith' }
 *   ],
 *   meta: {
 *     page: 1,
 *     limit: 20,
 *     total: 156,
 *     pages: 8
 *   }
 * };
 * ```
 *
 * @see {@link PaginationMeta}
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

/**
 * Standardized API error response structure.
 *
 * @interface ApiError
 * @category Error Handling
 *
 * @property {string} code - Machine-readable error code (e.g., 'STUDENT_NOT_FOUND')
 * @property {string} message - Human-readable error message
 * @property {Record<string, unknown>} [details] - Additional error context
 * @property {Date} timestamp - When the error occurred
 * @property {string} [path] - API endpoint where error occurred
 *
 * @example
 * ```typescript
 * const error: ApiError = {
 *   code: 'VALIDATION_ERROR',
 *   message: 'Student number must be unique',
 *   details: {
 *     field: 'studentNumber',
 *     value: 'STU2025001',
 *     constraint: 'unique'
 *   },
 *   timestamp: new Date(),
 *   path: '/api/students'
 * };
 * ```
 */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: Date;
  path?: string;
}

/**
 * Generic API response wrapper with optional metadata.
 *
 * @template T - The response data type
 * @interface ApiResponse
 * @category API Response
 *
 * @property {boolean} success - Indicates if the operation succeeded
 * @property {T} [data] - Response data (present on success)
 * @property {ApiError} [error] - Error details (present on failure)
 * @property {Record<string, unknown>} [metadata] - Additional response metadata
 *
 * @example
 * ```typescript
 * // Success response
 * const successResponse: ApiResponse<Student> = {
 *   success: true,
 *   data: {
 *     id: 'uuid-1',
 *     firstName: 'John',
 *     lastName: 'Doe'
 *   },
 *   metadata: {
 *     processingTime: 45,
 *     cached: false
 *   }
 * };
 *
 * // Error response
 * const errorResponse: ApiResponse<Student> = {
 *   success: false,
 *   error: {
 *     code: 'STUDENT_NOT_FOUND',
 *     message: 'Student with ID uuid-999 not found',
 *     timestamp: new Date(),
 *     path: '/api/students/uuid-999'
 *   }
 * };
 * ```
 *
 * @see {@link ApiError}
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  metadata?: Record<string, unknown>;
}

/**
 * Result type for operations that may fail.
 * Inspired by functional programming Result/Either pattern.
 *
 * @template T - Success value type
 * @template E - Error type (defaults to Error)
 * @type Result
 * @category Functional Programming
 *
 * @example
 * ```typescript
 * function parseStudentNumber(input: string): Result<string, ValidationError> {
 *   if (input.length < 4) {
 *     return {
 *       success: false,
 *       error: new ValidationError('Student number too short')
 *     };
 *   }
 *   return {
 *     success: true,
 *     value: input.toUpperCase()
 *   };
 * }
 *
 * const result = parseStudentNumber('STU001');
 * if (result.success) {
 *   console.log(result.value); // 'STU001'
 * } else {
 *   console.error(result.error);
 * }
 * ```
 */
export type Result<T, E = Error> =
  | { success: true; value: T }
  | { success: false; error: E };

/**
 * Represents a value that may or may not exist.
 * Safer alternative to null/undefined with explicit optionality.
 *
 * @template T - The wrapped value type
 * @type Optional
 * @category Functional Programming
 *
 * @example
 * ```typescript
 * function findStudentById(id: string): Optional<Student> {
 *   const student = database.get(id);
 *   return student ? { hasValue: true, value: student } : { hasValue: false };
 * }
 *
 * const result = findStudentById('uuid-1');
 * if (result.hasValue) {
 *   console.log(result.value.firstName);
 * } else {
 *   console.log('Student not found');
 * }
 * ```
 */
export type Optional<T> =
  | { hasValue: true; value: T }
  | { hasValue: false };

/**
 * Makes all properties of T partial except the ones specified in K.
 *
 * @template T - The base type
 * @template K - Keys to keep required
 * @type PartialExcept
 * @category Type Transformations
 *
 * @example
 * ```typescript
 * interface Student {
 *   id: string;
 *   firstName: string;
 *   lastName: string;
 *   email: string;
 *   grade: string;
 * }
 *
 * // Only id is required, all others optional
 * type UpdateStudent = PartialExcept<Student, 'id'>;
 *
 * const update: UpdateStudent = {
 *   id: 'uuid-1',
 *   firstName: 'John' // Other fields are optional
 * };
 * ```
 */
export type PartialExcept<T, K extends keyof T> = Partial<Omit<T, K>> &
  Pick<T, K>;

/**
 * Makes specified properties of T required.
 *
 * @template T - The base type
 * @template K - Keys to make required
 * @type RequireFields
 * @category Type Transformations
 *
 * @example
 * ```typescript
 * interface Student {
 *   id?: string;
 *   firstName?: string;
 *   lastName?: string;
 * }
 *
 * // firstName and lastName are now required
 * type RequiredStudent = RequireFields<Student, 'firstName' | 'lastName'>;
 *
 * const student: RequiredStudent = {
 *   firstName: 'John', // Required
 *   lastName: 'Doe',   // Required
 *   // id is still optional
 * };
 * ```
 */
export type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Extracts all keys from T that have values assignable to V.
 *
 * @template T - The object type
 * @template V - The value type to match
 * @type KeysOfType
 * @category Type Introspection
 *
 * @example
 * ```typescript
 * interface Student {
 *   id: string;
 *   firstName: string;
 *   age: number;
 *   enrollmentDate: Date;
 *   isActive: boolean;
 * }
 *
 * type StringKeys = KeysOfType<Student, string>; // 'id' | 'firstName'
 * type BooleanKeys = KeysOfType<Student, boolean>; // 'isActive'
 * ```
 */
export type KeysOfType<T, V> = {
  [K in keyof T]-?: T[K] extends V ? K : never;
}[keyof T];

/**
 * Creates a deeply readonly version of T.
 *
 * @template T - The type to make deeply readonly
 * @type DeepReadonly
 * @category Immutability
 *
 * @example
 * ```typescript
 * interface Student {
 *   id: string;
 *   profile: {
 *     firstName: string;
 *     address: {
 *       street: string;
 *       city: string;
 *     };
 *   };
 * }
 *
 * const student: DeepReadonly<Student> = {
 *   id: 'uuid-1',
 *   profile: {
 *     firstName: 'John',
 *     address: {
 *       street: '123 Main St',
 *       city: 'Boston'
 *     }
 *   }
 * };
 *
 * // All assignments below will cause TypeScript errors:
 * // student.id = 'new-id';
 * // student.profile.firstName = 'Jane';
 * // student.profile.address.city = 'NYC';
 * ```
 */
export type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};

/**
 * Creates a deeply partial version of T.
 *
 * @template T - The type to make deeply partial
 * @type DeepPartial
 * @category Type Transformations
 *
 * @example
 * ```typescript
 * interface Student {
 *   id: string;
 *   profile: {
 *     firstName: string;
 *     lastName: string;
 *     contact: {
 *       email: string;
 *       phone: string;
 *     };
 *   };
 * }
 *
 * const partialUpdate: DeepPartial<Student> = {
 *   profile: {
 *     contact: {
 *       email: 'new@email.com'
 *       // phone is optional at all levels
 *     }
 *   }
 * };
 * ```
 */
export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

/**
 * Constructs a type with all properties of T set to nullable.
 *
 * @template T - The base type
 * @type Nullable
 * @category Type Transformations
 *
 * @example
 * ```typescript
 * interface Student {
 *   id: string;
 *   firstName: string;
 *   middleName: string;
 * }
 *
 * type NullableStudent = Nullable<Student>;
 * // Equivalent to:
 * // {
 * //   id: string | null;
 * //   firstName: string | null;
 * //   middleName: string | null;
 * // }
 * ```
 */
export type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

/**
 * Constructs a type by excluding null from all properties of T.
 *
 * @template T - The base type with potentially null properties
 * @type NonNullableFields
 * @category Type Transformations
 *
 * @example
 * ```typescript
 * interface Student {
 *   id: string | null;
 *   firstName: string | null;
 *   age: number | null;
 * }
 *
 * type NonNullStudent = NonNullableFields<Student>;
 * // Equivalent to:
 * // {
 * //   id: string;
 * //   firstName: string;
 * //   age: number;
 * // }
 * ```
 */
export type NonNullableFields<T> = {
  [K in keyof T]: NonNullable<T[K]>;
};

/**
 * Type guard to check if a Result is successful.
 *
 * @template T - Success value type
 * @template E - Error type
 * @param {Result<T, E>} result - The result to check
 * @returns {boolean} true if result is successful
 *
 * @example
 * ```typescript
 * const result = parseStudentNumber('STU001');
 * if (isSuccess(result)) {
 *   // TypeScript knows result.value exists here
 *   console.log(result.value.toUpperCase());
 * }
 * ```
 *
 * @category Type Guards
 */
export function isSuccess<T, E>(result: Result<T, E>): result is { success: true; value: T } {
  return result.success === true;
}

/**
 * Type guard to check if a Result is an error.
 *
 * @template T - Success value type
 * @template E - Error type
 * @param {Result<T, E>} result - The result to check
 * @returns {boolean} true if result is an error
 *
 * @example
 * ```typescript
 * const result = parseStudentNumber('XYZ');
 * if (isError(result)) {
 *   // TypeScript knows result.error exists here
 *   console.error(result.error.message);
 * }
 * ```
 *
 * @category Type Guards
 */
export function isError<T, E>(result: Result<T, E>): result is { success: false; error: E } {
  return result.success === false;
}

/**
 * Type guard to check if an Optional has a value.
 *
 * @template T - The wrapped value type
 * @param {Optional<T>} optional - The optional to check
 * @returns {boolean} true if optional has a value
 *
 * @example
 * ```typescript
 * const maybeStudent = findStudentById('uuid-1');
 * if (hasValue(maybeStudent)) {
 *   // TypeScript knows maybeStudent.value exists here
 *   console.log(maybeStudent.value.firstName);
 * }
 * ```
 *
 * @category Type Guards
 */
export function hasValue<T>(optional: Optional<T>): optional is { hasValue: true; value: T } {
  return optional.hasValue === true;
}

/**
 * Filters out null and undefined values from an array.
 *
 * @template T - The array element type
 * @param {(T | null | undefined)[]} array - Array with potential null/undefined values
 * @returns {T[]} Array with all null/undefined values removed
 *
 * @example
 * ```typescript
 * const students: (Student | null)[] = [
 *   { id: '1', name: 'John' },
 *   null,
 *   { id: '2', name: 'Jane' },
 *   undefined
 * ];
 *
 * const validStudents = filterNullish(students);
 * // validStudents: Student[] = [{ id: '1', name: 'John' }, { id: '2', name: 'Jane' }]
 * ```
 *
 * @category Array Utilities
 */
export function filterNullish<T>(array: (T | null | undefined)[]): T[] {
  return array.filter((item): item is T => item !== null && item !== undefined);
}

/**
 * JSON-compatible primitive values
 * @category JSON Types
 */
export type JsonPrimitive = string | number | boolean | null;

/**
 * JSON-compatible object
 * @category JSON Types
 */
export interface JsonObject {
  [key: string]: JsonValue;
}

/**
 * JSON-compatible array
 * @category JSON Types
 */
export type JsonArray = JsonValue[];

/**
 * Any JSON-serializable value
 * Use this instead of 'any' for data that will be JSON serialized
 * @category JSON Types
 */
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;

/**
 * Value that can be transformed/sanitized
 * Covers most input types from HTTP requests
 * @category Transformation Types
 */
export type TransformableValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | TransformableObject
  | TransformableArray;

/**
 * Object with transformable values
 * @category Transformation Types
 */
export interface TransformableObject {
  [key: string]: TransformableValue;
}

/**
 * Array of transformable values
 * @category Transformation Types
 */
export type TransformableArray = TransformableValue[];

/**
 * Sanitizable string value types
 * @category Sanitization Types
 */
export type SanitizableValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | SanitizableObject
  | SanitizableArray;

/**
 * Object with sanitizable values
 * @category Sanitization Types
 */
export interface SanitizableObject {
  [key: string]: SanitizableValue;
}

/**
 * Array of sanitizable values
 * @category Sanitization Types
 */
export type SanitizableArray = SanitizableValue[];

/**
 * Error details union type
 * Provides type-safe error detail structures
 * @category Error Types
 */
export type ErrorDetails =
  | string[]
  | Record<string, string | number | boolean | string[]>
  | undefined;

/**
 * User authentication context from request
 * @category Authentication Types
 */
export interface RequestUser {
  id: string;
  email?: string;
  organizationId?: string;
  roles?: string[];
  permissions?: string[];
}

/**
 * Extended request with user context
 * @category Authentication Types
 */
export interface AuthenticatedRequest {
  user?: RequestUser;
  connection?: {
    remoteAddress?: string;
  };
  socket?: {
    remoteAddress?: string;
  };
  headers: Record<string, string | string[] | undefined>;
  method: string;
  url: string;
  body?: unknown;
  query?: Record<string, unknown>;
  params?: Record<string, string>;
}

/**
 * Validation error from class-validator
 * @category Validation Types
 */
export interface ClassValidatorError {
  target?: Record<string, unknown>;
  property: string;
  value?: unknown;
  constraints?: Record<string, string>;
  children?: ClassValidatorError[];
  contexts?: Record<string, unknown>;
}

/**
 * Sequelize validation error detail
 * @category Database Types
 */
export interface SequelizeValidationError {
  message: string;
  type?: string;
  path?: string;
  value?: unknown;
  origin?: string;
  instance?: unknown;
  validatorKey?: string;
  validatorName?: string;
  validatorArgs?: unknown[];
  original?: unknown;
}

/**
 * Database error with field information
 * @category Database Types
 */
export interface DatabaseError {
  name: string;
  message: string;
  errors?: SequelizeValidationError[];
  original?: unknown;
  sql?: string;
  fields?: string[];
  table?: string;
}

/**
 * Generic metadata record
 * Use for flexible but type-safe metadata
 * @category Utility Types
 */
export type MetadataRecord = Record<
  string,
  string | number | boolean | null | undefined | string[] | number[]
>;

/**
 * Generic context record
 * Use for error contexts and logging contexts
 * @category Utility Types
 */
export type ContextRecord = Record<
  string,
  string | number | boolean | null | undefined | MetadataRecord
>;

/**
 * Default value types for pipes
 * @category Pipe Types
 */
export type DefaultValue = string | number | boolean | null | string[] | number[];

/**
 * HTTP exception response from NestJS
 * @category Error Types
 */
export interface HttpExceptionResponse {
  statusCode: number;
  message: string | string[];
  error?: string;
  [key: string]: unknown;
}

/**
 * Type guard to check if value is JsonValue
 * @category Type Guards
 */
export function isJsonValue(value: unknown): value is JsonValue {
  if (value === null) return true;
  if (typeof value === 'string') return true;
  if (typeof value === 'number') return true;
  if (typeof value === 'boolean') return true;
  if (Array.isArray(value)) return value.every(isJsonValue);
  if (typeof value === 'object') {
    return Object.values(value).every(isJsonValue);
  }
  return false;
}

/**
 * Type guard to check if value is a record
 * @category Type Guards
 */
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Type guard to check if value is TransformableValue
 * @category Type Guards
 */
export function isTransformableValue(value: unknown): value is TransformableValue {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return true;
  if (typeof value === 'number') return true;
  if (typeof value === 'boolean') return true;
  if (Array.isArray(value)) return value.every(isTransformableValue);
  if (typeof value === 'object') {
    return Object.values(value).every(isTransformableValue);
  }
  return false;
}

/**
 * Type guard for RequestUser
 * @category Type Guards
 */
export function isRequestUser(value: unknown): value is RequestUser {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    (value.email === undefined || typeof value.email === 'string') &&
    (value.organizationId === undefined || typeof value.organizationId === 'string')
  );
}
