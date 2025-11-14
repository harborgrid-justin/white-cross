/**
 * @fileoverview Exception Handling Exports
 * @module common/exceptions
 * @description Centralized modern exception handling system
 *
 * MIGRATION NOTE: This is the ONLY exception system that should be used.
 * Legacy systems at /errors and /shared/errors are DEPRECATED.
 */

// Exception filters
export * from './filters/http-exception.filter';
export * from './filters/all-exceptions.filter';

// Custom exceptions
export * from './exceptions/business.exception';
export * from './exceptions/validation.exception';
export * from './exceptions/healthcare.exception';
export * from './exceptions/retryable.exception';

// Domain-specific exceptions
export * from './student.exceptions';
export * from './user.exceptions';

// Exception strategies
export * from './exception-filter-strategies.service';

// Types
export * from './types/error-response.types';

// Constants
export * from './constants/error-codes';
