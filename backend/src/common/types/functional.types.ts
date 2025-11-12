/**
 * @fileoverview Functional Programming Types
 * @module common/types/functional
 * @description Provides functional programming patterns like Result/Either and Optional/Maybe.
 *
 * @since 1.0.0
 * @category Functional Programming
 */

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
