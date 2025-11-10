/**
 * @fileoverview HIPAA-Compliant Exception Filter
 * @module common/exceptions/filters/hipaa-exception
 * @description Global exception filter that sanitizes PHI from error responses while logging full details server-side
 *
 * SECURITY: HIPAA Compliance - Critical Component
 * - Removes all PHI patterns from client-facing error messages
 * - Logs complete error details server-side for debugging
 * - Prevents accidental PHI exposure through error messages
 * - Implements defense-in-depth for PHI protection
 */

import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Inject, Logger } from '@nestjs/common';
import type { Request, Response } from 'express';
import { ErrorCategory, ErrorResponse, ErrorSeverity } from '../types/error-response.types';
import { SystemErrorCodes } from '../constants/error-codes';
import { SentryService } from '../../../infrastructure/monitoring/sentry.service';
import { getRequestContext, getRequestId } from '../../middleware/request-context.middleware';

/**
 * HIPAA Exception Filter
 *
 * @class HipaaExceptionFilter
 * @implements {ExceptionFilter}
 *
 * @description Catches all exceptions and provides HIPAA-compliant error responses
 * by sanitizing PHI from error messages before sending to client
 *
 * PHI Patterns Sanitized:
 * - Social Security Numbers (SSN): XXX-XX-XXXX
 * - Medical Record Numbers (MRN): Alphanumeric patterns
 * - Email addresses: Protected Health Information
 * - Phone numbers: Contact information
 * - Dates of birth: Temporal identifiers
 * - Names: Person identifiers
 * - Addresses: Geographic identifiers
 * - Account numbers: Financial identifiers
 * - IP addresses: Network identifiers
 *
 * @example
 * // In main.ts
 * app.useGlobalFilters(new HipaaExceptionFilter(sentryService));
 */
@Catch()
export class HipaaExceptionFilter implements ExceptionFilter {
  private readonly logger: Logger;
  private readonly isDevelopment = process.env.NODE_ENV === 'development';
  private readonly enableDetailedErrors =
    process.env.ENABLE_DETAILED_ERRORS === 'true' || this.isDevelopment;

  // HIPAA: PHI redaction patterns
  private readonly phiPatterns = [
    // SSN patterns
    { pattern: /\b\d{3}-\d{2}-\d{4}\b/g, replacement: '***-**-****', name: 'SSN' },
    { pattern: /\b\d{9}\b/g, replacement: '[REDACTED_SSN]', name: 'SSN_NO_DASH' },

    // Medical Record Numbers (MRN) - various formats
    { pattern: /\bMRN[:\s]*[A-Z0-9]{6,12}\b/gi, replacement: 'MRN:[REDACTED]', name: 'MRN' },
    { pattern: /\b[A-Z]{2,3}\d{6,10}\b/g, replacement: '[REDACTED_MRN]', name: 'MRN_ALPHA' },

    // Email addresses
    { pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, replacement: '[EMAIL_REDACTED]', name: 'EMAIL' },

    // Phone numbers (various formats)
    { pattern: /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g, replacement: '[PHONE_REDACTED]', name: 'PHONE' },
    { pattern: /\b\(\d{3}\)\s*\d{3}[-.\s]?\d{4}\b/g, replacement: '[PHONE_REDACTED]', name: 'PHONE_PAREN' },
    { pattern: /\b1[-.\s]?\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g, replacement: '[PHONE_REDACTED]', name: 'PHONE_INT' },

    // Dates (MM/DD/YYYY, DD/MM/YYYY, YYYY-MM-DD)
    { pattern: /\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b/g, replacement: '[DATE_REDACTED]', name: 'DATE' },
    { pattern: /\b\d{4}[/-]\d{1,2}[/-]\d{1,2}\b/g, replacement: '[DATE_REDACTED]', name: 'DATE_ISO' },

    // Credit card numbers
    { pattern: /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g, replacement: '[CARD_REDACTED]', name: 'CREDIT_CARD' },

    // Account numbers (8-16 digits)
    { pattern: /\b(?:account|acct)[:\s#]*\d{8,16}\b/gi, replacement: 'Account:[REDACTED]', name: 'ACCOUNT' },

    // IP addresses
    { pattern: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g, replacement: '[IP_REDACTED]', name: 'IP_ADDRESS' },

    // IPv6 addresses
    { pattern: /\b(?:[A-F0-9]{1,4}:){7}[A-F0-9]{1,4}\b/gi, replacement: '[IPV6_REDACTED]', name: 'IPV6' },

    // Common name patterns in error messages (e.g., "user John Doe")
    { pattern: /\b(patient|user|doctor|provider|staff)\s+[A-Z][a-z]+\s+[A-Z][a-z]+\b/gi, replacement: '$1 [NAME_REDACTED]', name: 'NAME' },

    // Address patterns (simplified - street number + street name)
    { pattern: /\b\d+\s+[A-Za-z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr)\b/gi, replacement: '[ADDRESS_REDACTED]', name: 'ADDRESS' },

    // Zip codes (US)
    { pattern: /\b\d{5}(?:-\d{4})?\b/g, replacement: '[ZIP_REDACTED]', name: 'ZIP_CODE' },

    // Driver's license patterns (state + number)
    { pattern: /\b[A-Z]{2}[-\s]?\d{6,8}\b/g, replacement: '[DL_REDACTED]', name: 'DRIVERS_LICENSE' },

    // Prescription numbers
    { pattern: /\b(?:RX|Rx)[:\s#]*[A-Z0-9]{6,12}\b/gi, replacement: 'RX:[REDACTED]', name: 'PRESCRIPTION' },

    // Insurance policy numbers
    { pattern: /\b(?:policy|insurance)[:\s#]*[A-Z0-9]{6,20}\b/gi, replacement: 'Policy:[REDACTED]', name: 'INSURANCE' },
  ];

  constructor(
    @Inject(SentryService) private readonly sentryService: SentryService,
  ) {
    this.logger = new Logger(HipaaExceptionFilter.name);
  }

  /**
   * Catch and process all exceptions
   */
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Get request ID from context
    const requestId =
      getRequestId() ||
      (request.headers['x-request-id'] as string) ||
      this.generateRequestId();

    // SECURITY: Log full error server-side BEFORE sanitization
    this.logFullErrorServerSide(exception, request, requestId);

    // Determine status and extract error info
    const isHttpException = exception instanceof HttpException;
    const status = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorInfo = this.extractErrorInfo(exception, isHttpException);

    // HIPAA: Sanitize all error messages to remove PHI
    const sanitizedMessage = this.sanitizeMessage(errorInfo.message);
    const sanitizedError = this.sanitizeMessage(errorInfo.error);

    // Build HIPAA-compliant error response
    const errorResponse: ErrorResponse = {
      success: false,
      timestamp: new Date().toISOString(),
      path: this.sanitizePath(request.url), // Also sanitize URL paths
      method: request.method,
      statusCode: status,
      error: sanitizedError,
      message: sanitizedMessage,
      errorCode: errorInfo.errorCode,
      requestId,
    };

    // SECURITY: Only include stack traces in development
    // NEVER expose stack traces in production (could contain PHI in variables)
    if (this.isDevelopment && exception instanceof Error) {
      errorResponse.stack = this.sanitizeMessage(exception.stack || '');
    }

    // Log sanitized error for audit trail
    this.logSanitizedError(errorResponse, request);

    // Send HIPAA-compliant response to client
    response.status(status).json(errorResponse);
  }

  /**
   * Log full error details server-side (with PHI) for debugging
   * SECURITY: This never goes to the client
   */
  private logFullErrorServerSide(
    exception: unknown,
    request: Request,
    requestId: string,
  ): void {
    const context = getRequestContext();
    const userId = context?.userId || (request as any).user?.id;
    const organizationId =
      context?.organizationId || (request as any).user?.organizationId;

    const fullErrorLog = {
      message: exception instanceof Error ? exception.message : String(exception),
      stack: exception instanceof Error ? exception.stack : undefined,
      name: exception instanceof Error ? exception.name : typeof exception,
      path: request.url,
      method: request.method,
      requestId,
      userId,
      organizationId,
      userAgent: request.headers['user-agent'],
      ip: this.getClientIp(request),
      timestamp: new Date().toISOString(),
      category: ErrorCategory.SYSTEM,
      severity: ErrorSeverity.CRITICAL,
      containsPHI: true, // Mark as potentially containing PHI
    };

    // Log with Winston - full details for server-side debugging
    this.logger.error('EXCEPTION_CAUGHT', JSON.stringify(fullErrorLog, null, 2));

    // Report to Sentry for 5xx errors
    if (exception instanceof Error && this.shouldReportToSentry(exception)) {
      this.sentryService.captureException(exception, {
        userId,
        organizationId,
        tags: {
          category: ErrorCategory.SYSTEM,
          path: request.url,
          method: request.method,
        },
        extra: {
          requestId,
          userAgent: request.headers['user-agent'],
        },
        level: 'error',
      });
    }
  }

  /**
   * Log sanitized error for general audit trail
   */
  private logSanitizedError(errorResponse: ErrorResponse, request: Request): void {
    const context = getRequestContext();

    const auditLog = {
      ...errorResponse,
      userId: context?.userId || (request as any).user?.id,
      organizationId: context?.organizationId || (request as any).user?.organizationId,
      userAgent: request.headers['user-agent'],
      containsPHI: false, // Sanitized - no PHI
    };

    this.logger.warn('SANITIZED_ERROR_RESPONSE', JSON.stringify(auditLog));
  }

  /**
   * Extract error information from exception
   */
  private extractErrorInfo(
    exception: unknown,
    isHttpException: boolean,
  ): {
    error: string;
    message: string;
    errorCode: string;
  } {
    if (isHttpException) {
      const httpException = exception as HttpException;
      const response = httpException.getResponse();

      if (typeof response === 'string') {
        return {
          error: httpException.name,
          message: response,
          errorCode: this.getErrorCode(httpException.getStatus()),
        };
      }

      const responseObj = response as any;
      return {
        error: responseObj.error || httpException.name,
        message: responseObj.message || 'An error occurred',
        errorCode:
          responseObj.errorCode || this.getErrorCode(httpException.getStatus()),
      };
    }

    // Handle known error types
    if (exception instanceof Error) {
      return this.handleKnownError(exception);
    }

    // Unknown error type
    return {
      error: 'Internal Server Error',
      message: 'An unexpected error occurred',
      errorCode: SystemErrorCodes.INTERNAL_SERVER_ERROR,
    };
  }

  /**
   * Handle known error types
   */
  private handleKnownError(error: Error): {
    error: string;
    message: string;
    errorCode: string;
  } {
    const errorName = error.name.toLowerCase();

    // Database errors
    if (errorName.includes('sequelize') || errorName.includes('database')) {
      return {
        error: 'Database Error',
        message: this.isDevelopment
          ? error.message
          : 'A database error occurred. Please try again.',
        errorCode: SystemErrorCodes.DATABASE_ERROR,
      };
    }

    // Validation errors
    if (errorName.includes('validation')) {
      return {
        error: 'Validation Error',
        message: error.message,
        errorCode: 'VALID_001',
      };
    }

    // Timeout errors
    if (errorName.includes('timeout')) {
      return {
        error: 'Timeout Error',
        message: 'Request timeout. Please try again.',
        errorCode: SystemErrorCodes.TIMEOUT,
      };
    }

    // Configuration errors
    if (errorName.includes('config')) {
      return {
        error: 'Configuration Error',
        message: this.isDevelopment
          ? error.message
          : 'A configuration error occurred',
        errorCode: SystemErrorCodes.CONFIGURATION_ERROR,
      };
    }

    // Generic error
    return {
      error: error.name,
      message: this.isDevelopment
        ? error.message
        : 'An internal error occurred. Please try again.',
      errorCode: SystemErrorCodes.INTERNAL_SERVER_ERROR,
    };
  }

  /**
   * Sanitize message to remove all PHI patterns
   * SECURITY: Critical HIPAA compliance function
   */
  private sanitizeMessage(message: string | undefined): string {
    if (!message) {
      return 'An error occurred';
    }

    let sanitized = message;
    let redactionCount = 0;

    // Apply all PHI redaction patterns
    for (const { pattern, replacement, name } of this.phiPatterns) {
      const beforeLength = sanitized.length;
      sanitized = sanitized.replace(pattern, replacement);

      // Track redactions for audit
      if (sanitized.length !== beforeLength) {
        redactionCount++;
        this.logger.debug(`PHI_REDACTION: ${name} pattern redacted`);
      }
    }

    // Log if PHI was redacted
    if (redactionCount > 0) {
      this.logger.warn(`PHI_SANITIZATION: ${redactionCount} PHI patterns redacted from error message`);
    }

    // Additional generic sanitization for database values
    // Remove anything that looks like a database value dump
    sanitized = sanitized.replace(
      /\b(value|values|data|record|field)[:\s]*['"]\w+['"]/gi,
      '$1: [REDACTED]'
    );

    return sanitized;
  }

  /**
   * Sanitize URL path to remove any PHI in query parameters or path segments
   */
  private sanitizePath(path: string): string {
    try {
      const url = new URL(path, 'http://localhost');

      // Sanitize query parameters
      url.searchParams.forEach((value, key) => {
        const sanitizedValue = this.sanitizeMessage(value);
        if (sanitizedValue !== value) {
          url.searchParams.set(key, sanitizedValue);
        }
      });

      // Sanitize path segments (e.g., /patients/SSN/records)
      const sanitizedPathname = this.sanitizeMessage(url.pathname);

      return sanitizedPathname + url.search;
    } catch {
      // If URL parsing fails, sanitize the whole path
      return this.sanitizeMessage(path);
    }
  }

  /**
   * Get error code based on HTTP status
   */
  private getErrorCode(status: number): string {
    const errorCodeMap: Record<number, string> = {
      400: 'VALID_001',
      401: 'AUTH_001',
      403: 'AUTH_002',
      404: 'RES_001',
      409: 'CONFLICT_001',
      422: 'VALID_002',
      429: 'RATE_001',
      500: SystemErrorCodes.INTERNAL_SERVER_ERROR,
      503: SystemErrorCodes.SERVICE_UNAVAILABLE,
    };

    return errorCodeMap[status] || SystemErrorCodes.INTERNAL_SERVER_ERROR;
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
   * Generate request ID if not present
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Determine if exception should be reported to Sentry
   */
  private shouldReportToSentry(exception: Error): boolean {
    const errorName = exception.name.toLowerCase();

    // Don't report client errors (4xx) to Sentry
    if (
      errorName.includes('notfound') ||
      errorName.includes('badrequest') ||
      errorName.includes('unauthorized') ||
      errorName.includes('forbidden')
    ) {
      return false;
    }

    return true;
  }
}
