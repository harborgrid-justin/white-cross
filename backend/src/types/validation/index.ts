/**
 * Validation types barrel export.
 * Central export point for validation and error handling type definitions.
 *
 * @module types/validation
 *
 * @remarks
 * Re-exports all validation error types, error codes, and API response structures.
 * Provides strongly-typed error handling across the application.
 *
 * @example
 * ```typescript
 * import { ValidationError, ValidationErrorCode } from '@/types/validation';
 *
 * const error: ValidationError = {
 *   field: 'email',
 *   message: 'Invalid email format',
 *   code: ValidationErrorCode.INVALID_FORMAT
 * };
 * ```
 */

export * from './error.types';
