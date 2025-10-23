/**
 * @fileoverview Errors Module - Centralized Error Handling
 * @module shared/errors
 * @description Exports all error-related utilities
 */

export {
  ErrorCode,
  AppError,
  WithCode,
  isAppError,
  hasErrorCode,
  getErrorCodes,
  ErrorFactory,
} from './ErrorCode';

export { default as ErrorCodeModule } from './ErrorCode';
