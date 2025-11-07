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
