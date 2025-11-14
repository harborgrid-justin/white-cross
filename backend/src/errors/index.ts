/**
 * Barrel file for errors module
 *
 * @deprecated This module is DEPRECATED.
 * All error handling has been migrated to /common/exceptions/
 *
 * @see /common/exceptions/exceptions/business.exception.ts - For business logic errors
 * @see /common/exceptions/exceptions/validation.exception.ts - For validation errors
 * @see /common/exceptions/exceptions/healthcare.exception.ts - For healthcare domain errors
 * @see /common/exceptions/exceptions/retryable.exception.ts - For retryable errors
 *
 * MIGRATION GUIDE:
 * ================
 *
 * Old ServiceError System -> New BusinessException System
 * --------------------------------------------------------
 *
 * 1. ServiceError -> BusinessException
 *    Before: throw new ServiceError('Error message', 400, 'ERROR_CODE')
 *    After:  throw new BusinessException('Error message', ErrorCodes.OPERATION_NOT_ALLOWED)
 *
 * 2. NotFoundError -> BusinessException.notFound()
 *    Before: throw new NotFoundError('User not found')
 *    After:  throw BusinessException.notFound('User', userId)
 *
 * 3. ConflictError -> BusinessException.alreadyExists()
 *    Before: throw new ConflictError('User already exists')
 *    After:  throw BusinessException.alreadyExists('User', email)
 *
 * 4. ValidationError -> ValidationException
 *    Before: throw new ValidationError('Validation failed')
 *    After:  throw new ValidationException('Validation failed', [
 *              { field: 'email', message: 'Invalid email format' }
 *            ])
 *
 * 5. AuthenticationError -> NestJS UnauthorizedException
 *    Before: throw new AuthenticationError('Authentication failed')
 *    After:  throw new UnauthorizedException('Invalid credentials')
 *
 * 6. AuthorizationError -> NestJS ForbiddenException
 *    Before: throw new AuthorizationError('Not authorized')
 *    After:  throw new ForbiddenException('Insufficient permissions')
 *
 * BENEFITS OF NEW SYSTEM:
 * =======================
 * - Structured error codes with ErrorCodes constant
 * - Factory methods for common error scenarios
 * - Better TypeScript typing and IDE support
 * - HIPAA-compliant PHI sanitization
 * - Consistent error response format
 * - Better integration with NestJS exception filters
 * - Automatic Sentry error tracking
 * - Audit logging integration
 *
 * For complete documentation, see:
 * /common/exceptions/README.md (if exists)
 * /common/exceptions/constants/error-codes.ts
 */

// Re-export new exception system for backward compatibility during transition
export { BusinessException } from '../common/exceptions/exceptions/business.exception';
export { ValidationException } from '../common/exceptions/exceptions/validation.exception';
export { RetryableException } from '../common/exceptions/exceptions/retryable.exception';
export { HealthcareException } from '../common/exceptions/exceptions/healthcare.exception';
export { ErrorCodes, ErrorCode } from '../common/exceptions/constants/error-codes';

// Import NestJS exceptions for reference
import {
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

/**
 * Re-export NestJS exceptions for convenience
 * Use these for standard HTTP errors instead of custom error classes
 */
export {
  UnauthorizedException,    // Use for authentication errors (401)
  ForbiddenException,        // Use for authorization errors (403)
  NotFoundException,         // Use for resource not found (404)
  BadRequestException,       // Use for bad request errors (400)
  ConflictException,         // Use for resource conflicts (409)
  InternalServerErrorException, // Use for internal server errors (500)
};

/**
 * @deprecated - Type aliases for backward compatibility
 * These will be removed in a future version
 * Please migrate to the new exception system
 */

/** @deprecated Use BusinessException.notFound() instead */
export const NotFoundError = NotFoundException;

/** @deprecated Use BusinessException.alreadyExists() or ConflictException instead */
export const ConflictError = ConflictException;

/** @deprecated Use ValidationException instead */
export const ValidationError = BadRequestException;

/** @deprecated Use UnauthorizedException instead */
export const AuthenticationError = UnauthorizedException;

/** @deprecated Use ForbiddenException instead */
export const AuthorizationError = ForbiddenException;

/** @deprecated Use BusinessException or appropriate NestJS exception instead */
export const ServiceError = InternalServerErrorException;
