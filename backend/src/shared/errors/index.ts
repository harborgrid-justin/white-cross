/**
 * @fileoverview Errors Module - Centralized Error Handling
 * @module shared/errors
 * @description Exports all error-related utilities
 */

// Base error code system (existing)
export {
  ErrorCode,
  AppError,
  isAppError,
  hasErrorCode,
  getErrorCodes,
  ErrorFactory,
} from './ErrorCode';

export type { WithCode } from './ErrorCode';

export { default as ErrorCodeModule } from './ErrorCode';

// Service error classes with retry semantics (new)
export {
  ServiceError,
  ValidationError,
  NotFoundError,
  DatabaseError,
  TimeoutError,
  ConflictError,
  isServiceError,
  isRetryable,
  ServiceErrorFactory,
} from './ServiceErrors';
