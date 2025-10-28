/**
 * @fileoverview Business Logic Exception
 * @module common/exceptions/exceptions/business
 * @description Custom exception for business rule violations
 */

import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCodes, ErrorCode } from '../constants/error-codes';

/**
 * Business Logic Exception
 *
 * @class BusinessException
 * @extends {HttpException}
 *
 * @description Exception thrown when business rules are violated
 *
 * @example
 * throw new BusinessException(
 *   'Cannot delete student with active appointments',
 *   ErrorCodes.DEPENDENCY_EXISTS,
 *   { studentId, activeAppointments: 3 }
 * );
 */
export class BusinessException extends HttpException {
  public readonly errorCode: ErrorCode;
  public readonly rule?: string;
  public readonly context?: Record<string, any>;

  constructor(
    message: string,
    errorCode: ErrorCode = ErrorCodes.OPERATION_NOT_ALLOWED,
    context?: Record<string, any>,
    rule?: string,
  ) {
    const response = {
      success: false,
      error: 'Business Logic Error',
      message,
      errorCode,
      rule,
      context,
    };

    super(response, HttpStatus.BAD_REQUEST);

    this.errorCode = errorCode;
    this.rule = rule;
    this.context = context;
    this.name = 'BusinessException';
  }

  /**
   * Create exception for resource not found
   */
  static notFound(resource: string, identifier?: string | number): BusinessException {
    const message = identifier
      ? `${resource} with identifier '${identifier}' not found`
      : `${resource} not found`;

    return new BusinessException(
      message,
      ErrorCodes.RESOURCE_NOT_FOUND,
      { resource, identifier },
    );
  }

  /**
   * Create exception for resource already exists
   */
  static alreadyExists(resource: string, identifier?: string | number): BusinessException {
    const message = identifier
      ? `${resource} with identifier '${identifier}' already exists`
      : `${resource} already exists`;

    return new BusinessException(
      message,
      ErrorCodes.RESOURCE_ALREADY_EXISTS,
      { resource, identifier },
    );
  }

  /**
   * Create exception for invalid state transition
   */
  static invalidStateTransition(
    resource: string,
    currentState: string,
    targetState: string,
  ): BusinessException {
    return new BusinessException(
      `Cannot transition ${resource} from ${currentState} to ${targetState}`,
      ErrorCodes.INVALID_STATE_TRANSITION,
      { resource, currentState, targetState },
    );
  }

  /**
   * Create exception for dependency violation
   */
  static dependencyExists(
    resource: string,
    dependency: string,
    count?: number,
  ): BusinessException {
    const message = count
      ? `Cannot delete ${resource}: ${count} ${dependency} exist`
      : `Cannot delete ${resource}: ${dependency} exist`;

    return new BusinessException(
      message,
      ErrorCodes.DEPENDENCY_EXISTS,
      { resource, dependency, count },
    );
  }

  /**
   * Create exception for missing dependency
   */
  static dependencyMissing(
    resource: string,
    dependency: string,
  ): BusinessException {
    return new BusinessException(
      `Cannot create ${resource}: required ${dependency} not found`,
      ErrorCodes.DEPENDENCY_MISSING,
      { resource, dependency },
    );
  }

  /**
   * Create exception for quota exceeded
   */
  static quotaExceeded(
    resource: string,
    limit: number,
    current: number,
  ): BusinessException {
    return new BusinessException(
      `${resource} quota exceeded: ${current}/${limit}`,
      ErrorCodes.QUOTA_EXCEEDED,
      { resource, limit, current },
    );
  }

  /**
   * Create exception for concurrent modification
   */
  static concurrentModification(resource: string): BusinessException {
    return new BusinessException(
      `${resource} was modified by another user. Please refresh and try again.`,
      ErrorCodes.CONCURRENT_MODIFICATION,
      { resource },
    );
  }
}
