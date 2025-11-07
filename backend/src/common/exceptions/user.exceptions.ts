/**
 * @fileoverview User-Related Exception Classes
 * @module common/exceptions/user
 * @description Typed exception classes for user management and authentication operations.
 *
 * @since 1.0.0
 * @category Exceptions
 * @security All user operations require proper authentication and authorization
 */

import {
  NotFoundException,
  ConflictException,
  UnauthorizedException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';

/**
 * Context information for user-related errors.
 *
 * @interface UserErrorContext
 * @category Error Context
 *
 * @property {string} [userId] - User UUID
 * @property {string} [email] - User email
 * @property {string} [role] - User role
 * @property {string} [operation] - Operation being performed
 * @property {Record<string, unknown>} [additionalInfo] - Extra context
 */
export interface UserErrorContext {
  userId?: string;
  email?: string;
  role?: string;
  operation?: string;
  additionalInfo?: Record<string, unknown>;
}

/**
 * Exception thrown when a user is not found.
 *
 * @class UserNotFoundException
 * @extends {NotFoundException}
 * @category User Exceptions
 *
 * @param {string} identifier - User ID or email
 * @param {UserErrorContext} [context] - Additional error context
 *
 * @example
 * ```typescript
 * throw new UserNotFoundException('user@example.com', {
 *   operation: 'getUserByEmail'
 * });
 * ```
 *
 * @remarks
 * - HTTP Status: 404 Not Found
 * - Error code: USER_NOT_FOUND
 *
 * @since 1.0.0
 */
export class UserNotFoundException extends NotFoundException {
  public readonly code = 'USER_NOT_FOUND';
  public readonly context?: UserErrorContext;

  constructor(identifier: string, context?: UserErrorContext) {
    super('User not found');
    this.name = 'UserNotFoundException';
    this.context = context;
  }
}

/**
 * Exception thrown when email already exists.
 *
 * @class EmailConflictException
 * @extends {ConflictException}
 * @category User Exceptions
 *
 * @param {string} email - Duplicate email address
 * @param {UserErrorContext} [context] - Additional error context
 *
 * @example
 * ```typescript
 * throw new EmailConflictException('user@example.com', {
 *   operation: 'createUser'
 * });
 * ```
 *
 * @remarks
 * - HTTP Status: 409 Conflict
 * - Error code: EMAIL_CONFLICT
 *
 * @since 1.0.0
 */
export class EmailConflictException extends ConflictException {
  public readonly code = 'EMAIL_CONFLICT';
  public readonly context?: UserErrorContext;

  constructor(email: string, context?: UserErrorContext) {
    super('Email address is already in use');
    this.name = 'EmailConflictException';
    this.context = context;
  }
}

/**
 * Exception thrown when password validation fails.
 *
 * @class InvalidPasswordException
 * @extends {UnauthorizedException}
 * @category User Exceptions
 *
 * @param {string} reason - Reason for password invalidity
 * @param {UserErrorContext} [context] - Additional error context
 *
 * @example
 * ```typescript
 * throw new InvalidPasswordException('Current password is incorrect', {
 *   userId: 'uuid-123',
 *   operation: 'changePassword'
 * });
 * ```
 *
 * @remarks
 * - HTTP Status: 401 Unauthorized
 * - Error code: INVALID_PASSWORD
 * - Security: Do not expose password requirements in error messages
 *
 * @since 1.0.0
 */
export class InvalidPasswordException extends UnauthorizedException {
  public readonly code = 'INVALID_PASSWORD';
  public readonly context?: UserErrorContext;

  constructor(reason: string, context?: UserErrorContext) {
    super(reason);
    this.name = 'InvalidPasswordException';
    this.context = context;
  }
}

/**
 * Exception thrown when user lacks required permissions.
 *
 * @class InsufficientPermissionsException
 * @extends {ForbiddenException}
 * @category User Exceptions
 *
 * @param {string} requiredRole - Role required for the operation
 * @param {UserErrorContext} [context] - Additional error context
 *
 * @example
 * ```typescript
 * throw new InsufficientPermissionsException('ADMIN', {
 *   userId: 'uuid-123',
 *   role: 'NURSE',
 *   operation: 'deleteUser'
 * });
 * ```
 *
 * @remarks
 * - HTTP Status: 403 Forbidden
 * - Error code: INSUFFICIENT_PERMISSIONS
 *
 * @since 1.0.0
 */
export class InsufficientPermissionsException extends ForbiddenException {
  public readonly code = 'INSUFFICIENT_PERMISSIONS';
  public readonly context?: UserErrorContext;

  constructor(requiredRole: string, context?: UserErrorContext) {
    super(`Insufficient permissions. Required role: ${requiredRole}`);
    this.name = 'InsufficientPermissionsException';
    this.context = context;
  }
}

/**
 * Exception thrown when account is locked.
 *
 * @class AccountLockedException
 * @extends {ForbiddenException}
 * @category User Exceptions
 *
 * @param {string} reason - Reason for account lockout
 * @param {UserErrorContext} [context] - Additional error context
 *
 * @example
 * ```typescript
 * throw new AccountLockedException('Too many failed login attempts', {
 *   email: 'user@example.com',
 *   additionalInfo: { lockoutExpires: new Date('2025-11-08') }
 * });
 * ```
 *
 * @remarks
 * - HTTP Status: 403 Forbidden
 * - Error code: ACCOUNT_LOCKED
 * - Security: Part of account lockout policy after failed login attempts
 *
 * @since 1.0.0
 */
export class AccountLockedException extends ForbiddenException {
  public readonly code = 'ACCOUNT_LOCKED';
  public readonly context?: UserErrorContext;

  constructor(reason: string, context?: UserErrorContext) {
    super(reason);
    this.name = 'AccountLockedException';
    this.context = context;
  }
}

/**
 * Exception thrown when user account is inactive.
 *
 * @class InactiveAccountException
 * @extends {ForbiddenException}
 * @category User Exceptions
 *
 * @param {UserErrorContext} [context] - Additional error context
 *
 * @example
 * ```typescript
 * throw new InactiveAccountException({
 *   userId: 'uuid-123',
 *   email: 'user@example.com'
 * });
 * ```
 *
 * @remarks
 * - HTTP Status: 403 Forbidden
 * - Error code: INACTIVE_ACCOUNT
 *
 * @since 1.0.0
 */
export class InactiveAccountException extends ForbiddenException {
  public readonly code = 'INACTIVE_ACCOUNT';
  public readonly context?: UserErrorContext;

  constructor(context?: UserErrorContext) {
    super('This account is inactive. Please contact an administrator.');
    this.name = 'InactiveAccountException';
    this.context = context;
  }
}
