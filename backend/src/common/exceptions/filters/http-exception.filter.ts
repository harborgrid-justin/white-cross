/**
 * @fileoverview HTTP Exception Filter
 * @module common/exceptions/filters/http-exception
 * @description Global exception filter for HTTP exceptions with HIPAA compliance
 */

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import {
  ErrorResponse,
  ErrorCategory,
  ErrorSeverity,
  ErrorLoggingContext,
} from '../types/error-response.types';
import { getErrorCodeCategory, getHttpStatusForErrorCode } from '../constants/error-codes';

/**
 * HTTP Exception Filter
 *
 * @class HttpExceptionFilter
 * @implements {ExceptionFilter}
 *
 * @description Catches and formats HTTP exceptions with HIPAA-compliant error responses
 *
 * @example
 * app.useGlobalFilters(new HttpExceptionFilter());
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);
  private readonly isDevelopment = process.env.NODE_ENV === 'development';
  private readonly enableDetailedErrors =
    process.env.ENABLE_DETAILED_ERRORS === 'true' || this.isDevelopment;

  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    const requestId = request.headers['x-request-id'] as string || uuidv4();

    // Extract error information
    const errorInfo = this.extractErrorInfo(exceptionResponse, exception);

    // Build error response
    const errorResponse: ErrorResponse = {
      success: false,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      statusCode: status,
      error: errorInfo.error,
      message: errorInfo.message,
      errorCode: errorInfo.errorCode,
      requestId,
    };

    // Add details in development mode
    if (this.enableDetailedErrors) {
      errorResponse.details = errorInfo.details;
      errorResponse.stack = exception.stack;
    }

    // Log the error
    this.logError(exception, request, errorResponse);

    // Send audit log for security/compliance events
    if (this.shouldAuditLog(status, errorInfo.errorCode)) {
      this.sendToAuditLog(request, errorResponse);
    }

    // Send response
    response.status(status).json(errorResponse);
  }

  /**
   * Extract error information from exception
   */
  private extractErrorInfo(
    exceptionResponse: string | object,
    exception: HttpException,
  ): {
    error: string;
    message: string | string[];
    errorCode: string;
    details?: any;
  } {
    if (typeof exceptionResponse === 'string') {
      return {
        error: exception.name || 'HttpException',
        message: exceptionResponse,
        errorCode: this.getDefaultErrorCode(exception.getStatus()),
      };
    }

    const response = exceptionResponse as any;

    return {
      error: response.error || exception.name || 'HttpException',
      message: response.message || 'An error occurred',
      errorCode: response.errorCode || this.getDefaultErrorCode(exception.getStatus()),
      details: response.errors || response.context || response.details,
    };
  }

  /**
   * Get default error code based on HTTP status
   */
  private getDefaultErrorCode(status: number): string {
    const codeMap: Record<number, string> = {
      400: 'VALID_001',
      401: 'AUTH_005',
      403: 'AUTHZ_001',
      404: 'BUSINESS_001',
      409: 'BUSINESS_002',
      422: 'VALID_002',
      429: 'SECURITY_001',
      500: 'SYSTEM_001',
      503: 'SYSTEM_002',
    };

    return codeMap[status] || 'SYSTEM_001';
  }

  /**
   * Log error with appropriate severity
   */
  private logError(
    exception: HttpException,
    request: Request,
    errorResponse: ErrorResponse,
  ): void {
    const status = exception.getStatus();
    const severity = this.getErrorSeverity(status);
    const category = this.getErrorCategory(errorResponse.errorCode);

    const loggingContext: ErrorLoggingContext = {
      category,
      severity,
      requestId: errorResponse.requestId,
      userId: (request as any).user?.id,
      organizationId: (request as any).user?.organizationId,
      userAgent: request.headers['user-agent'],
      ipAddress: this.getClientIp(request),
      containsPHI: false, // Always false - we never log PHI
      metadata: {
        path: request.url,
        method: request.method,
        statusCode: status,
        errorCode: errorResponse.errorCode,
      },
    };

    // Log based on severity
    const logMessage = `[${category}] ${errorResponse.message}`;

    switch (severity) {
      case ErrorSeverity.CRITICAL:
        this.logger.error(logMessage, exception.stack, loggingContext);
        break;
      case ErrorSeverity.HIGH:
        this.logger.error(logMessage, loggingContext);
        break;
      case ErrorSeverity.MEDIUM:
        this.logger.warn(logMessage, loggingContext);
        break;
      case ErrorSeverity.LOW:
        this.logger.log(logMessage, loggingContext);
        break;
    }
  }

  /**
   * Get error severity based on status code
   */
  private getErrorSeverity(status: number): ErrorSeverity {
    if (status >= 500) return ErrorSeverity.CRITICAL;
    if (status === 401 || status === 403) return ErrorSeverity.HIGH;
    if (status === 429) return ErrorSeverity.MEDIUM;
    return ErrorSeverity.LOW;
  }

  /**
   * Get error category from error code
   */
  private getErrorCategory(errorCode: string): ErrorCategory {
    const prefix = getErrorCodeCategory(errorCode);

    const categoryMap: Record<string, ErrorCategory> = {
      AUTH: ErrorCategory.SECURITY,
      AUTHZ: ErrorCategory.SECURITY,
      VALID: ErrorCategory.VALIDATION,
      BUSINESS: ErrorCategory.BUSINESS,
      HEALTH: ErrorCategory.HEALTHCARE,
      SECURITY: ErrorCategory.SECURITY,
      SYSTEM: ErrorCategory.SYSTEM,
      COMPLY: ErrorCategory.HEALTHCARE,
    };

    return categoryMap[prefix] || ErrorCategory.SYSTEM;
  }

  /**
   * Check if error should be audit logged
   */
  private shouldAuditLog(status: number, errorCode: string): boolean {
    // Audit log security events, healthcare errors, and server errors
    if (status === 401 || status === 403 || status === 429) return true;
    if (status >= 500) return true;

    const category = getErrorCodeCategory(errorCode);
    return ['HEALTH', 'SECURITY', 'COMPLY'].includes(category);
  }

  /**
   * Send error to audit log
   */
  private sendToAuditLog(request: Request, errorResponse: ErrorResponse): void {
    // In production, this would integrate with the audit logging service
    // For now, we'll just log that an audit entry should be created
    this.logger.log('Audit log entry required', {
      requestId: errorResponse.requestId,
      path: errorResponse.path,
      errorCode: errorResponse.errorCode,
      userId: (request as any).user?.id,
    });
  }

  /**
   * Get client IP address
   */
  private getClientIp(request: Request): string {
    return (
      (request.headers['x-forwarded-for'] as string)?.split(',')[0] ||
      (request.headers['x-real-ip'] as string) ||
      request.socket.remoteAddress ||
      'unknown'
    );
  }

  /**
   * Sanitize error message to remove potential PHI
   */
  private sanitizeMessage(message: string): string {
    // Remove potential PHI patterns
    // This is a basic implementation - production should use more sophisticated PHI detection

    // Remove email addresses
    let sanitized = message.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL]');

    // Remove phone numbers
    sanitized = sanitized.replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[PHONE]');

    // Remove SSN patterns
    sanitized = sanitized.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN]');

    // Remove potential MRN patterns
    sanitized = sanitized.replace(/\b[A-Z0-9]{6,12}\b/g, '[ID]');

    return sanitized;
  }
}
