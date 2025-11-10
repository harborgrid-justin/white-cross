/**
 * LOC: ERRHDL1234567
 * File: /reuse/error-handling-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - NestJS exception filters
 *   - Backend error handlers
 *   - API controllers and services
 */

/**
 * File: /reuse/error-handling-kit.ts
 * Locator: WC-UTL-ERRHDL-001
 * Purpose: Comprehensive Error Handling Utilities - custom exceptions, filters, transformations, retry strategies, circuit breakers
 *
 * Upstream: Independent utility module for error handling implementation
 * Downstream: ../backend/*, API controllers, services, middleware, exception filters
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 40+ utility functions for error handling, retry strategies, circuit breakers, error logging, notifications
 *
 * LLM Context: Comprehensive error handling utilities for production-ready NestJS applications.
 * Provides custom exception classes, global filters, error transformation, HTTP responses, validation formatting,
 * database error handling, retry strategies, circuit breakers, error aggregation, notifications (Sentry/Bugsnag),
 * user-friendly messages, code standardization, stack trace sanitization, context enrichment, and graceful degradation.
 */

import { Request, Response } from 'express';
import { Model, DataTypes, Sequelize, ValidationError as SequelizeValidationError } from 'sequelize';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface ErrorContext {
  requestId?: string;
  userId?: string;
  timestamp?: string;
  path?: string;
  method?: string;
  userAgent?: string;
  ip?: string;
  metadata?: Record<string, any>;
}

interface ErrorResponse {
  code: string;
  message: string;
  statusCode: number;
  timestamp: string;
  traceId?: string;
  path?: string;
  details?: any[];
  stack?: string;
  context?: ErrorContext;
}

interface ValidationErrorDetail {
  field: string;
  value: any;
  constraint: string;
  message: string;
}

interface RetryOptions {
  maxAttempts: number;
  initialDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  retryableErrors?: string[];
  onRetry?: (error: Error, attempt: number) => void;
}

interface CircuitBreakerConfig {
  failureThreshold: number;
  resetTimeout: number;
  monitoringPeriod: number;
  halfOpenRequests?: number;
}

interface CircuitBreakerState {
  status: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
  failureCount: number;
  successCount: number;
  lastFailureTime?: number;
  nextAttemptTime?: number;
}

interface ErrorAggregation {
  errorCode: string;
  count: number;
  firstOccurrence: string;
  lastOccurrence: string;
  affectedUsers: Set<string>;
  contexts: ErrorContext[];
}

interface NotificationConfig {
  provider: 'sentry' | 'bugsnag' | 'custom';
  dsn?: string;
  apiKey?: string;
  environment?: string;
  release?: string;
  enabled: boolean;
  sampleRate?: number;
}

interface ErrorCodeMapping {
  internal: string;
  http: number;
  userMessage: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
}

interface SanitizationOptions {
  includeStack: boolean;
  includeSensitiveData: boolean;
  maxStackFrames?: number;
  allowedPaths?: string[];
}

interface DegradationStrategy {
  feature: string;
  fallback: () => Promise<any>;
  timeout: number;
  enabled: boolean;
}

interface DatabaseErrorInfo {
  type: 'connection' | 'validation' | 'constraint' | 'query' | 'transaction' | 'timeout';
  originalError: Error;
  query?: string;
  table?: string;
  constraint?: string;
  fields?: string[];
}

// ============================================================================
// SEQUELIZE MODELS (1-2)
// ============================================================================

/**
 * Sequelize model for Error Logs with context, stack traces, and categorization.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ErrorLog model
 *
 * @example
 * ```typescript
 * const ErrorLog = createErrorLogModel(sequelize);
 * const log = await ErrorLog.create({
 *   errorCode: 'USR_001',
 *   message: 'User not found',
 *   statusCode: 404,
 *   stack: error.stack,
 *   context: { userId: '123', path: '/api/users/456' }
 * });
 * ```
 */
export const createErrorLogModel = (sequelize: Sequelize) => {
  class ErrorLog extends Model {
    public id!: number;
    public errorCode!: string;
    public message!: string;
    public statusCode!: number;
    public severity!: string;
    public category!: string;
    public stack!: string | null;
    public context!: ErrorContext;
    public userId!: string | null;
    public requestId!: string | null;
    public path!: string | null;
    public method!: string | null;
    public userAgent!: string | null;
    public ip!: string | null;
    public resolved!: boolean;
    public resolvedAt!: Date | null;
    public resolvedBy!: string | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  ErrorLog.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      errorCode: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Standardized error code',
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Error message',
      },
      statusCode: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'HTTP status code',
      },
      severity: {
        type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
        allowNull: false,
        defaultValue: 'medium',
        comment: 'Error severity level',
      },
      category: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: 'general',
        comment: 'Error category for grouping',
      },
      stack: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Error stack trace',
      },
      context: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Error context information',
      },
      userId: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'User ID if applicable',
      },
      requestId: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Request trace ID',
      },
      path: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: 'Request path',
      },
      method: {
        type: DataTypes.STRING(10),
        allowNull: true,
        comment: 'HTTP method',
      },
      userAgent: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: 'User agent string',
      },
      ip: {
        type: DataTypes.STRING(45),
        allowNull: true,
        comment: 'Client IP address',
      },
      resolved: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether error has been resolved',
      },
      resolvedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Resolution timestamp',
      },
      resolvedBy: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'User who resolved the error',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'error_logs',
      timestamps: true,
      indexes: [
        { fields: ['errorCode'] },
        { fields: ['severity'] },
        { fields: ['category'] },
        { fields: ['userId'] },
        { fields: ['requestId'] },
        { fields: ['resolved'] },
        { fields: ['createdAt'] },
      ],
    },
  );

  return ErrorLog;
};

/**
 * Sequelize model for Error Reports with aggregation and trend analysis.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} ErrorReport model
 *
 * @example
 * ```typescript
 * const ErrorReport = createErrorReportModel(sequelize);
 * const report = await ErrorReport.create({
 *   errorCode: 'DB_001',
 *   occurrenceCount: 15,
 *   affectedUserCount: 8,
 *   firstOccurrence: new Date(),
 *   lastOccurrence: new Date(),
 *   trend: 'increasing'
 * });
 * ```
 */
export const createErrorReportModel = (sequelize: Sequelize) => {
  class ErrorReport extends Model {
    public id!: number;
    public errorCode!: string;
    public errorCategory!: string;
    public occurrenceCount!: number;
    public affectedUserCount!: number;
    public firstOccurrence!: Date;
    public lastOccurrence!: Date;
    public averageSeverity!: string;
    public trend!: string;
    public topPaths!: string[];
    public topUserAgents!: string[];
    public resolutionStatus!: string;
    public assignedTo!: string | null;
    public notes!: string | null;
    public metadata!: Record<string, any>;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }

  ErrorReport.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      errorCode: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        comment: 'Unique error code',
      },
      errorCategory: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Error category',
      },
      occurrenceCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Total number of occurrences',
      },
      affectedUserCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Number of unique users affected',
      },
      firstOccurrence: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'First occurrence timestamp',
      },
      lastOccurrence: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Last occurrence timestamp',
      },
      averageSeverity: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'medium',
        comment: 'Average severity level',
      },
      trend: {
        type: DataTypes.ENUM('increasing', 'decreasing', 'stable', 'spike'),
        allowNull: false,
        defaultValue: 'stable',
        comment: 'Error occurrence trend',
      },
      topPaths: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Most common paths where error occurs',
      },
      topUserAgents: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        comment: 'Most common user agents',
      },
      resolutionStatus: {
        type: DataTypes.ENUM('open', 'investigating', 'resolved', 'wontfix'),
        allowNull: false,
        defaultValue: 'open',
        comment: 'Current resolution status',
      },
      assignedTo: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'User assigned to resolve',
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Investigation notes',
      },
      metadata: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Additional metadata',
      },
    },
    {
      sequelize,
      tableName: 'error_reports',
      timestamps: true,
      indexes: [
        { fields: ['errorCode'], unique: true },
        { fields: ['errorCategory'] },
        { fields: ['trend'] },
        { fields: ['resolutionStatus'] },
        { fields: ['lastOccurrence'] },
      ],
    },
  );

  return ErrorReport;
};

// ============================================================================
// CUSTOM EXCEPTION CLASSES (1-6)
// ============================================================================

/**
 * Base application exception class with error code and context support.
 *
 * @param {string} message - Error message
 * @param {string} code - Error code
 * @param {number} statusCode - HTTP status code
 * @param {ErrorContext} [context] - Additional context
 * @returns {AppException} Custom exception instance
 *
 * @example
 * ```typescript
 * throw new AppException(
 *   'Resource not found',
 *   'RES_NOT_FOUND',
 *   404,
 *   { userId: '123', resourceId: '456' }
 * );
 * ```
 */
export class AppException extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number,
    public readonly context?: ErrorContext,
    public readonly severity: 'low' | 'medium' | 'high' | 'critical' = 'medium',
  ) {
    super(message);
    this.name = 'AppException';
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Business logic validation exception for domain rule violations.
 *
 * @param {string} message - Validation error message
 * @param {ValidationErrorDetail[]} details - Validation error details
 * @param {ErrorContext} [context] - Additional context
 * @returns {BusinessValidationException} Validation exception instance
 *
 * @example
 * ```typescript
 * throw new BusinessValidationException(
 *   'Invalid order total',
 *   [{ field: 'total', value: -10, constraint: 'min', message: 'Total must be positive' }],
 *   { orderId: '789' }
 * );
 * ```
 */
export class BusinessValidationException extends AppException {
  constructor(
    message: string,
    public readonly details: ValidationErrorDetail[],
    context?: ErrorContext,
  ) {
    super(message, 'BUSINESS_VALIDATION_ERROR', 422, context, 'medium');
    this.name = 'BusinessValidationException';
  }
}

/**
 * External service integration exception for third-party API failures.
 *
 * @param {string} service - Service name that failed
 * @param {string} message - Error message
 * @param {Error} [originalError] - Original error from service
 * @param {ErrorContext} [context] - Additional context
 * @returns {ExternalServiceException} Service exception instance
 *
 * @example
 * ```typescript
 * throw new ExternalServiceException(
 *   'PaymentGateway',
 *   'Payment processing failed',
 *   originalError,
 *   { transactionId: 'tx_123' }
 * );
 * ```
 */
export class ExternalServiceException extends AppException {
  constructor(
    public readonly service: string,
    message: string,
    public readonly originalError?: Error,
    context?: ErrorContext,
  ) {
    super(message, 'EXTERNAL_SERVICE_ERROR', 503, context, 'high');
    this.name = 'ExternalServiceException';
  }
}

/**
 * Resource conflict exception for concurrent modification issues.
 *
 * @param {string} resource - Resource type
 * @param {string} resourceId - Resource identifier
 * @param {string} message - Conflict description
 * @param {ErrorContext} [context] - Additional context
 * @returns {ResourceConflictException} Conflict exception instance
 *
 * @example
 * ```typescript
 * throw new ResourceConflictException(
 *   'Order',
 *   'ord_456',
 *   'Order has been modified by another user',
 *   { version: 2, expectedVersion: 1 }
 * );
 * ```
 */
export class ResourceConflictException extends AppException {
  constructor(
    public readonly resource: string,
    public readonly resourceId: string,
    message: string,
    context?: ErrorContext,
  ) {
    super(message, 'RESOURCE_CONFLICT', 409, context, 'medium');
    this.name = 'ResourceConflictException';
  }
}

/**
 * Rate limit exceeded exception for throttling scenarios.
 *
 * @param {string} message - Rate limit message
 * @param {number} retryAfter - Seconds until retry allowed
 * @param {ErrorContext} [context] - Additional context
 * @returns {RateLimitException} Rate limit exception instance
 *
 * @example
 * ```typescript
 * throw new RateLimitException(
 *   'Too many requests',
 *   60,
 *   { limit: 100, window: '1 minute' }
 * );
 * ```
 */
export class RateLimitException extends AppException {
  constructor(
    message: string,
    public readonly retryAfter: number,
    context?: ErrorContext,
  ) {
    super(message, 'RATE_LIMIT_EXCEEDED', 429, context, 'low');
    this.name = 'RateLimitException';
  }
}

/**
 * Database operation exception for database-specific errors.
 *
 * @param {string} operation - Database operation type
 * @param {string} message - Error message
 * @param {Error} [originalError] - Original database error
 * @param {ErrorContext} [context] - Additional context
 * @returns {DatabaseException} Database exception instance
 *
 * @example
 * ```typescript
 * throw new DatabaseException(
 *   'INSERT',
 *   'Unique constraint violation',
 *   dbError,
 *   { table: 'users', field: 'email' }
 * );
 * ```
 */
export class DatabaseException extends AppException {
  constructor(
    public readonly operation: string,
    message: string,
    public readonly originalError?: Error,
    context?: ErrorContext,
  ) {
    super(message, 'DATABASE_ERROR', 500, context, 'high');
    this.name = 'DatabaseException';
  }
}

// ============================================================================
// GLOBAL EXCEPTION FILTERS (7-10)
// ============================================================================

/**
 * Creates a global exception filter for NestJS applications.
 *
 * @param {Function} logger - Logging function
 * @param {boolean} includeStack - Whether to include stack traces
 * @returns {Function} Exception filter function
 *
 * @example
 * ```typescript
 * const filter = createGlobalExceptionFilter(console.error, false);
 * app.useGlobalFilters(new HttpExceptionFilter(filter));
 * ```
 */
export const createGlobalExceptionFilter = (
  logger: (message: string, context?: any) => void,
  includeStack = false,
) => {
  return (exception: Error, req: Request, res: Response): void => {
    const errorResponse = transformErrorToResponse(exception, req, includeStack);

    logger('Exception occurred', {
      error: errorResponse,
      request: {
        method: req.method,
        url: req.url,
        headers: req.headers,
      },
    });

    res.status(errorResponse.statusCode).json(errorResponse);
  };
};

/**
 * Transforms any error type into a standardized error response.
 *
 * @param {Error} error - Error to transform
 * @param {Request} [req] - Express request object
 * @param {boolean} [includeStack=false] - Whether to include stack trace
 * @returns {ErrorResponse} Standardized error response
 *
 * @example
 * ```typescript
 * const response = transformErrorToResponse(error, req, true);
 * // Returns standardized error with code, message, statusCode, etc.
 * ```
 */
export const transformErrorToResponse = (
  error: Error,
  req?: Request,
  includeStack = false,
): ErrorResponse => {
  const timestamp = new Date().toISOString();
  const context: ErrorContext = req ? extractErrorContext(req) : {};

  // Handle AppException instances
  if (error instanceof AppException) {
    return {
      code: error.code,
      message: error.message,
      statusCode: error.statusCode,
      timestamp,
      path: req?.path,
      stack: includeStack ? error.stack : undefined,
      context: { ...context, ...error.context },
    };
  }

  // Handle Sequelize validation errors
  if (error instanceof SequelizeValidationError) {
    return {
      code: 'VALIDATION_ERROR',
      message: 'Validation failed',
      statusCode: 422,
      timestamp,
      path: req?.path,
      details: error.errors.map(e => ({
        field: e.path,
        message: e.message,
        type: e.type,
        value: e.value,
      })),
      context,
    };
  }

  // Default error response
  return {
    code: 'INTERNAL_SERVER_ERROR',
    message: error.message || 'An unexpected error occurred',
    statusCode: 500,
    timestamp,
    path: req?.path,
    stack: includeStack ? error.stack : undefined,
    context,
  };
};

/**
 * Filters errors by severity level for conditional handling.
 *
 * @param {Error} error - Error to check
 * @param {string[]} severityLevels - Allowed severity levels
 * @returns {boolean} Whether error matches severity criteria
 *
 * @example
 * ```typescript
 * if (filterBySeverity(error, ['high', 'critical'])) {
 *   await sendUrgentAlert(error);
 * }
 * ```
 */
export const filterBySeverity = (
  error: Error,
  severityLevels: Array<'low' | 'medium' | 'high' | 'critical'>,
): boolean => {
  if (error instanceof AppException) {
    return severityLevels.includes(error.severity);
  }
  // Default to high severity for unknown errors
  return severityLevels.includes('high');
};

/**
 * Creates error response middleware for Express/NestJS.
 *
 * @param {SanitizationOptions} options - Sanitization options
 * @returns {Function} Middleware function
 *
 * @example
 * ```typescript
 * const middleware = createErrorResponseMiddleware({
 *   includeStack: false,
 *   includeSensitiveData: false,
 *   maxStackFrames: 10
 * });
 * app.use(middleware);
 * ```
 */
export const createErrorResponseMiddleware = (options: SanitizationOptions) => {
  return (err: Error, req: Request, res: Response, next: any): void => {
    const errorResponse = transformErrorToResponse(err, req, options.includeStack);

    if (!options.includeSensitiveData) {
      delete errorResponse.context?.ip;
      delete errorResponse.context?.userAgent;
    }

    if (errorResponse.stack && options.maxStackFrames) {
      const frames = errorResponse.stack.split('\n');
      errorResponse.stack = frames.slice(0, options.maxStackFrames + 1).join('\n');
    }

    res.status(errorResponse.statusCode).json(errorResponse);
  };
};

// ============================================================================
// ERROR TRANSFORMATION AND MAPPING (11-15)
// ============================================================================

/**
 * Maps internal error codes to standardized HTTP status codes and messages.
 *
 * @param {string} errorCode - Internal error code
 * @param {Map<string, ErrorCodeMapping>} mappings - Code mapping configuration
 * @returns {ErrorCodeMapping} Mapped error information
 *
 * @example
 * ```typescript
 * const mapping = mapErrorCode('USR_NOT_FOUND', errorMappings);
 * // Returns: { internal: 'USR_NOT_FOUND', http: 404, userMessage: 'User not found', ... }
 * ```
 */
export const mapErrorCode = (
  errorCode: string,
  mappings: Map<string, ErrorCodeMapping>,
): ErrorCodeMapping => {
  return mappings.get(errorCode) || {
    internal: errorCode,
    http: 500,
    userMessage: 'An unexpected error occurred',
    severity: 'medium',
    category: 'general',
  };
};

/**
 * Creates default error code mappings for common scenarios.
 *
 * @returns {Map<string, ErrorCodeMapping>} Default error mappings
 *
 * @example
 * ```typescript
 * const mappings = createDefaultErrorMappings();
 * const mapping = mappings.get('AUTH_FAILED');
 * ```
 */
export const createDefaultErrorMappings = (): Map<string, ErrorCodeMapping> => {
  const mappings = new Map<string, ErrorCodeMapping>();

  mappings.set('AUTH_FAILED', {
    internal: 'AUTH_FAILED',
    http: 401,
    userMessage: 'Authentication failed. Please log in again.',
    severity: 'medium',
    category: 'authentication',
  });

  mappings.set('FORBIDDEN', {
    internal: 'FORBIDDEN',
    http: 403,
    userMessage: 'You do not have permission to access this resource.',
    severity: 'medium',
    category: 'authorization',
  });

  mappings.set('NOT_FOUND', {
    internal: 'NOT_FOUND',
    http: 404,
    userMessage: 'The requested resource was not found.',
    severity: 'low',
    category: 'resource',
  });

  mappings.set('VALIDATION_ERROR', {
    internal: 'VALIDATION_ERROR',
    http: 422,
    userMessage: 'The provided data is invalid. Please check your input.',
    severity: 'low',
    category: 'validation',
  });

  mappings.set('RATE_LIMIT', {
    internal: 'RATE_LIMIT',
    http: 429,
    userMessage: 'Too many requests. Please try again later.',
    severity: 'low',
    category: 'rate_limit',
  });

  mappings.set('DATABASE_ERROR', {
    internal: 'DATABASE_ERROR',
    http: 500,
    userMessage: 'A system error occurred. Please try again later.',
    severity: 'high',
    category: 'database',
  });

  return mappings;
};

/**
 * Transforms database errors into application-specific exceptions.
 *
 * @param {Error} dbError - Database error
 * @returns {AppException} Transformed application exception
 *
 * @example
 * ```typescript
 * try {
 *   await User.create({ email: 'duplicate@test.com' });
 * } catch (error) {
 *   throw transformDatabaseError(error);
 * }
 * ```
 */
export const transformDatabaseError = (dbError: Error): AppException => {
  const message = dbError.message.toLowerCase();

  // Unique constraint violation
  if (message.includes('unique') || message.includes('duplicate')) {
    return new AppException(
      'A record with this value already exists',
      'DUPLICATE_ENTRY',
      409,
      { originalError: dbError.message },
      'medium',
    );
  }

  // Foreign key constraint
  if (message.includes('foreign key')) {
    return new AppException(
      'Related record not found',
      'FOREIGN_KEY_VIOLATION',
      400,
      { originalError: dbError.message },
      'medium',
    );
  }

  // Connection error
  if (message.includes('connection') || message.includes('connect')) {
    return new AppException(
      'Database connection failed',
      'DB_CONNECTION_ERROR',
      503,
      { originalError: dbError.message },
      'critical',
    );
  }

  // Timeout
  if (message.includes('timeout')) {
    return new AppException(
      'Database operation timed out',
      'DB_TIMEOUT',
      504,
      { originalError: dbError.message },
      'high',
    );
  }

  // Generic database error
  return new DatabaseException(
    'UNKNOWN',
    'Database operation failed',
    dbError,
    { originalError: dbError.message },
  );
};

/**
 * Enriches error with additional context from request and application state.
 *
 * @param {Error} error - Error to enrich
 * @param {Request} req - Express request object
 * @param {Record<string, any>} [additionalContext] - Additional context data
 * @returns {Error} Enriched error with context
 *
 * @example
 * ```typescript
 * const enrichedError = enrichErrorContext(error, req, {
 *   tenantId: 'tenant_123',
 *   operation: 'CREATE_ORDER'
 * });
 * ```
 */
export const enrichErrorContext = (
  error: Error,
  req: Request,
  additionalContext?: Record<string, any>,
): Error => {
  const context = extractErrorContext(req);

  if (error instanceof AppException) {
    return new AppException(
      error.message,
      error.code,
      error.statusCode,
      { ...error.context, ...context, ...additionalContext },
      error.severity,
    );
  }

  // Add context as property for non-AppException errors
  (error as any).context = { ...context, ...additionalContext };
  return error;
};

/**
 * Chains multiple error transformers for complex error handling pipelines.
 *
 * @param {Error} error - Error to transform
 * @param {Function[]} transformers - Array of transformer functions
 * @returns {Error} Transformed error
 *
 * @example
 * ```typescript
 * const error = chainErrorTransformers(originalError, [
 *   transformDatabaseError,
 *   (e) => enrichErrorContext(e, req),
 *   sanitizeError
 * ]);
 * ```
 */
export const chainErrorTransformers = (
  error: Error,
  transformers: Array<(error: Error) => Error>,
): Error => {
  return transformers.reduce((err, transformer) => transformer(err), error);
};

// ============================================================================
// HTTP ERROR RESPONSES (16-19)
// ============================================================================

/**
 * Creates standardized HTTP error response object.
 *
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {string} [code] - Error code
 * @param {any} [details] - Additional details
 * @returns {ErrorResponse} HTTP error response
 *
 * @example
 * ```typescript
 * const response = createHttpErrorResponse(404, 'User not found', 'USR_NOT_FOUND');
 * res.status(404).json(response);
 * ```
 */
export const createHttpErrorResponse = (
  statusCode: number,
  message: string,
  code?: string,
  details?: any,
): ErrorResponse => {
  return {
    code: code || `HTTP_${statusCode}`,
    message,
    statusCode,
    timestamp: new Date().toISOString(),
    details: details ? [details] : undefined,
  };
};

/**
 * Formats validation errors into user-friendly HTTP response.
 *
 * @param {ValidationErrorDetail[]} errors - Validation errors
 * @returns {ErrorResponse} Formatted validation error response
 *
 * @example
 * ```typescript
 * const response = formatValidationErrors([
 *   { field: 'email', value: 'invalid', constraint: 'email', message: 'Invalid email format' }
 * ]);
 * ```
 */
export const formatValidationErrors = (errors: ValidationErrorDetail[]): ErrorResponse => {
  return {
    code: 'VALIDATION_ERROR',
    message: 'Validation failed',
    statusCode: 422,
    timestamp: new Date().toISOString(),
    details: errors.map(err => ({
      field: err.field,
      message: err.message,
      constraint: err.constraint,
      receivedValue: err.value,
    })),
  };
};

/**
 * Sends JSON error response with proper headers and formatting.
 *
 * @param {Response} res - Express response object
 * @param {ErrorResponse} errorResponse - Error response object
 * @returns {void}
 *
 * @example
 * ```typescript
 * sendJsonErrorResponse(res, {
 *   code: 'AUTH_FAILED',
 *   message: 'Invalid credentials',
 *   statusCode: 401,
 *   timestamp: new Date().toISOString()
 * });
 * ```
 */
export const sendJsonErrorResponse = (res: Response, errorResponse: ErrorResponse): void => {
  res
    .status(errorResponse.statusCode)
    .setHeader('Content-Type', 'application/json')
    .setHeader('X-Error-Code', errorResponse.code)
    .json(errorResponse);
};

/**
 * Creates problem details response following RFC 7807 standard.
 *
 * @param {Error} error - Error object
 * @param {Request} req - Express request object
 * @returns {object} RFC 7807 problem details
 *
 * @example
 * ```typescript
 * const problemDetails = createProblemDetails(error, req);
 * res.status(problemDetails.status).json(problemDetails);
 * ```
 */
export const createProblemDetails = (error: Error, req: Request): object => {
  const statusCode = error instanceof AppException ? error.statusCode : 500;
  const code = error instanceof AppException ? error.code : 'INTERNAL_ERROR';

  return {
    type: `https://api.example.com/errors/${code}`,
    title: error.message,
    status: statusCode,
    detail: error.message,
    instance: req.path,
    timestamp: new Date().toISOString(),
    traceId: (req as any).id || generateTraceId(),
  };
};

// ============================================================================
// DATABASE ERROR HANDLING (20-24)
// ============================================================================

/**
 * Parses Sequelize error into structured database error information.
 *
 * @param {Error} error - Sequelize error
 * @returns {DatabaseErrorInfo} Parsed error information
 *
 * @example
 * ```typescript
 * const dbError = parseSequelizeError(error);
 * if (dbError.type === 'constraint') {
 *   console.log('Constraint violation on:', dbError.constraint);
 * }
 * ```
 */
export const parseSequelizeError = (error: Error): DatabaseErrorInfo => {
  const message = error.message.toLowerCase();

  if (error instanceof SequelizeValidationError) {
    return {
      type: 'validation',
      originalError: error,
      fields: error.errors.map(e => e.path || ''),
    };
  }

  if (message.includes('unique constraint') || message.includes('duplicate')) {
    const constraintMatch = error.message.match(/constraint\s+"([^"]+)"/i);
    return {
      type: 'constraint',
      originalError: error,
      constraint: constraintMatch ? constraintMatch[1] : 'unknown',
    };
  }

  if (message.includes('foreign key')) {
    return {
      type: 'constraint',
      originalError: error,
      constraint: 'foreign_key',
    };
  }

  if (message.includes('connection')) {
    return {
      type: 'connection',
      originalError: error,
    };
  }

  if (message.includes('timeout')) {
    return {
      type: 'timeout',
      originalError: error,
    };
  }

  return {
    type: 'query',
    originalError: error,
  };
};

/**
 * Handles database connection errors with retry logic.
 *
 * @param {Error} error - Connection error
 * @param {Function} reconnectFn - Reconnection function
 * @param {RetryOptions} options - Retry configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await handleDatabaseConnectionError(error, () => sequelize.authenticate(), {
 *   maxAttempts: 3,
 *   initialDelay: 1000,
 *   maxDelay: 10000,
 *   backoffMultiplier: 2
 * });
 * ```
 */
export const handleDatabaseConnectionError = async (
  error: Error,
  reconnectFn: () => Promise<void>,
  options: RetryOptions,
): Promise<void> => {
  console.error('Database connection error:', error.message);

  try {
    await retryWithBackoff(reconnectFn, options);
  } catch (retryError) {
    throw new DatabaseException(
      'CONNECTION',
      'Failed to reconnect to database after multiple attempts',
      error,
      { attempts: options.maxAttempts },
    );
  }
};

/**
 * Extracts constraint name and affected columns from database error.
 *
 * @param {Error} error - Database error
 * @returns {{ constraint: string | null; columns: string[] }} Constraint info
 *
 * @example
 * ```typescript
 * const { constraint, columns } = extractConstraintInfo(error);
 * console.log(`Constraint ${constraint} violated on columns:`, columns);
 * ```
 */
export const extractConstraintInfo = (
  error: Error,
): { constraint: string | null; columns: string[] } => {
  const message = error.message;

  // Extract constraint name
  const constraintMatch = message.match(/constraint\s+"?([^"\s]+)"?/i);
  const constraint = constraintMatch ? constraintMatch[1] : null;

  // Extract column names
  const columnMatches = message.match(/column\s+"?([^"\s,]+)"?/gi) || [];
  const columns = columnMatches.map(match => {
    const col = match.match(/"?([^"\s,]+)"?/);
    return col ? col[1] : '';
  }).filter(Boolean);

  return { constraint, columns };
};

/**
 * Creates user-friendly message from database error for end users.
 *
 * @param {Error} error - Database error
 * @returns {string} User-friendly error message
 *
 * @example
 * ```typescript
 * const message = createUserFriendlyDbError(error);
 * // Returns: "This email address is already registered"
 * ```
 */
export const createUserFriendlyDbError = (error: Error): string => {
  const dbError = parseSequelizeError(error);

  switch (dbError.type) {
    case 'constraint':
      if (dbError.constraint?.includes('unique') || dbError.constraint?.includes('email')) {
        return 'This email address is already registered.';
      }
      if (dbError.constraint?.includes('foreign')) {
        return 'The referenced item does not exist.';
      }
      return 'This value is already in use.';

    case 'validation':
      return 'The provided data is invalid. Please check your input.';

    case 'connection':
      return 'We are experiencing connectivity issues. Please try again later.';

    case 'timeout':
      return 'The operation took too long. Please try again.';

    default:
      return 'An error occurred while processing your request.';
  }
};

/**
 * Logs database error with query details for debugging.
 *
 * @param {Error} error - Database error
 * @param {string} [query] - SQL query that caused error
 * @param {any[]} [params] - Query parameters
 * @returns {void}
 *
 * @example
 * ```typescript
 * logDatabaseError(error, 'SELECT * FROM users WHERE id = ?', [userId]);
 * ```
 */
export const logDatabaseError = (error: Error, query?: string, params?: any[]): void => {
  const dbError = parseSequelizeError(error);

  console.error('Database Error:', {
    type: dbError.type,
    message: error.message,
    constraint: dbError.constraint,
    fields: dbError.fields,
    query: query ? query.substring(0, 200) : undefined,
    params: params ? JSON.stringify(params).substring(0, 200) : undefined,
    stack: error.stack?.split('\n').slice(0, 5).join('\n'),
  });
};

// ============================================================================
// RETRY STRATEGIES (25-28)
// ============================================================================

/**
 * Retries a function with exponential backoff strategy.
 *
 * @param {Function} fn - Function to retry
 * @param {RetryOptions} options - Retry configuration
 * @returns {Promise<T>} Result of successful execution
 *
 * @example
 * ```typescript
 * const result = await retryWithBackoff(
 *   () => fetchUserData(userId),
 *   { maxAttempts: 3, initialDelay: 1000, maxDelay: 10000, backoffMultiplier: 2 }
 * );
 * ```
 */
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  options: RetryOptions,
): Promise<T> => {
  let lastError: Error | undefined;
  let delay = options.initialDelay;

  for (let attempt = 1; attempt <= options.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Check if error is retryable
      if (options.retryableErrors) {
        const isRetryable = options.retryableErrors.some(code =>
          error instanceof AppException ? error.code === code : false,
        );
        if (!isRetryable) {
          throw error;
        }
      }

      // Call retry callback
      if (options.onRetry) {
        options.onRetry(error as Error, attempt);
      }

      // Don't delay after last attempt
      if (attempt < options.maxAttempts) {
        await sleep(delay);
        delay = Math.min(delay * options.backoffMultiplier, options.maxDelay);
      }
    }
  }

  throw lastError || new Error('Retry failed without error');
};

/**
 * Creates retry decorator for class methods.
 *
 * @param {RetryOptions} options - Retry configuration
 * @returns {Function} Method decorator
 *
 * @example
 * ```typescript
 * class UserService {
 *   @Retry({ maxAttempts: 3, initialDelay: 1000 })
 *   async fetchUser(id: string) {
 *     return await api.getUser(id);
 *   }
 * }
 * ```
 */
export const Retry = (options: RetryOptions) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      return retryWithBackoff(() => originalMethod.apply(this, args), options);
    };

    return descriptor;
  };
};

/**
 * Determines if an error is retryable based on error type and configuration.
 *
 * @param {Error} error - Error to check
 * @param {string[]} [retryableErrors] - List of retryable error codes
 * @returns {boolean} Whether error is retryable
 *
 * @example
 * ```typescript
 * if (isRetryableError(error, ['TIMEOUT', 'SERVICE_UNAVAILABLE'])) {
 *   await retry(() => operation());
 * }
 * ```
 */
export const isRetryableError = (error: Error, retryableErrors?: string[]): boolean => {
  // Network errors are generally retryable
  if (error.message.includes('ECONNREFUSED') || error.message.includes('ETIMEDOUT')) {
    return true;
  }

  // Check specific error codes if provided
  if (retryableErrors && error instanceof AppException) {
    return retryableErrors.includes(error.code);
  }

  // 5xx errors are retryable, 4xx are not
  if (error instanceof AppException) {
    return error.statusCode >= 500;
  }

  return false;
};

/**
 * Creates jittered delay to prevent thundering herd problem.
 *
 * @param {number} baseDelay - Base delay in milliseconds
 * @param {number} [jitterFactor=0.1] - Jitter factor (0-1)
 * @returns {number} Jittered delay
 *
 * @example
 * ```typescript
 * const delay = createJitteredDelay(1000, 0.2);
 * await sleep(delay); // 800-1200ms random delay
 * ```
 */
export const createJitteredDelay = (baseDelay: number, jitterFactor = 0.1): number => {
  const jitter = baseDelay * jitterFactor;
  return baseDelay + (Math.random() * 2 - 1) * jitter;
};

// ============================================================================
// CIRCUIT BREAKER PATTERN (29-32)
// ============================================================================

/**
 * Creates a circuit breaker for protecting against cascading failures.
 *
 * @param {CircuitBreakerConfig} config - Circuit breaker configuration
 * @returns {object} Circuit breaker instance with execute method
 *
 * @example
 * ```typescript
 * const breaker = createCircuitBreaker({
 *   failureThreshold: 5,
 *   resetTimeout: 60000,
 *   monitoringPeriod: 10000
 * });
 * const result = await breaker.execute(() => callExternalAPI());
 * ```
 */
export const createCircuitBreaker = (config: CircuitBreakerConfig) => {
  const state: CircuitBreakerState = {
    status: 'CLOSED',
    failureCount: 0,
    successCount: 0,
  };

  const execute = async <T>(fn: () => Promise<T>): Promise<T> => {
    // Check if circuit is open
    if (state.status === 'OPEN') {
      if (Date.now() < (state.nextAttemptTime || 0)) {
        throw new AppException(
          'Circuit breaker is open',
          'CIRCUIT_OPEN',
          503,
          { nextAttemptTime: state.nextAttemptTime },
          'high',
        );
      }
      // Transition to half-open
      state.status = 'HALF_OPEN';
      state.successCount = 0;
    }

    try {
      const result = await fn();

      // Record success
      state.successCount++;

      if (state.status === 'HALF_OPEN') {
        const halfOpenRequests = config.halfOpenRequests || 3;
        if (state.successCount >= halfOpenRequests) {
          state.status = 'CLOSED';
          state.failureCount = 0;
        }
      } else {
        state.failureCount = 0;
      }

      return result;
    } catch (error) {
      state.failureCount++;
      state.lastFailureTime = Date.now();

      if (state.failureCount >= config.failureThreshold) {
        state.status = 'OPEN';
        state.nextAttemptTime = Date.now() + config.resetTimeout;
      }

      throw error;
    }
  };

  const getState = () => ({ ...state });
  const reset = () => {
    state.status = 'CLOSED';
    state.failureCount = 0;
    state.successCount = 0;
    state.lastFailureTime = undefined;
    state.nextAttemptTime = undefined;
  };

  return { execute, getState, reset };
};

/**
 * Gets current state of circuit breaker.
 *
 * @param {object} breaker - Circuit breaker instance
 * @returns {CircuitBreakerState} Current state
 *
 * @example
 * ```typescript
 * const state = getCircuitBreakerState(breaker);
 * if (state.status === 'OPEN') {
 *   console.log('Circuit is open, requests will fail');
 * }
 * ```
 */
export const getCircuitBreakerState = (breaker: { getState: () => CircuitBreakerState }): CircuitBreakerState => {
  return breaker.getState();
};

/**
 * Resets circuit breaker to initial closed state.
 *
 * @param {object} breaker - Circuit breaker instance
 * @returns {void}
 *
 * @example
 * ```typescript
 * resetCircuitBreaker(breaker);
 * // Circuit is now closed and ready to accept requests
 * ```
 */
export const resetCircuitBreaker = (breaker: { reset: () => void }): void => {
  breaker.reset();
};

/**
 * Creates circuit breaker decorator for class methods.
 *
 * @param {CircuitBreakerConfig} config - Circuit breaker configuration
 * @returns {Function} Method decorator
 *
 * @example
 * ```typescript
 * class PaymentService {
 *   @CircuitBreaker({ failureThreshold: 5, resetTimeout: 60000 })
 *   async processPayment(orderId: string) {
 *     return await paymentGateway.charge(orderId);
 *   }
 * }
 * ```
 */
export const CircuitBreaker = (config: CircuitBreakerConfig) => {
  const breaker = createCircuitBreaker(config);

  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      return breaker.execute(() => originalMethod.apply(this, args));
    };

    return descriptor;
  };
};

// ============================================================================
// ERROR AGGREGATION AND GROUPING (33-35)
// ============================================================================

/**
 * Aggregates errors by error code for trend analysis.
 *
 * @param {Error[]} errors - Array of errors
 * @returns {Map<string, ErrorAggregation>} Aggregated errors by code
 *
 * @example
 * ```typescript
 * const aggregation = aggregateErrorsByCode(errors);
 * aggregation.forEach((stats, code) => {
 *   console.log(`${code}: ${stats.count} occurrences`);
 * });
 * ```
 */
export const aggregateErrorsByCode = (errors: Error[]): Map<string, ErrorAggregation> => {
  const aggregation = new Map<string, ErrorAggregation>();

  errors.forEach(error => {
    const code = error instanceof AppException ? error.code : 'UNKNOWN';
    const context = error instanceof AppException ? error.context : undefined;

    if (!aggregation.has(code)) {
      aggregation.set(code, {
        errorCode: code,
        count: 0,
        firstOccurrence: new Date().toISOString(),
        lastOccurrence: new Date().toISOString(),
        affectedUsers: new Set<string>(),
        contexts: [],
      });
    }

    const stats = aggregation.get(code)!;
    stats.count++;
    stats.lastOccurrence = new Date().toISOString();

    if (context?.userId) {
      stats.affectedUsers.add(context.userId);
    }

    if (context) {
      stats.contexts.push(context);
    }
  });

  return aggregation;
};

/**
 * Groups errors by time window for spike detection.
 *
 * @param {Error[]} errors - Array of errors with timestamps
 * @param {number} windowMs - Time window in milliseconds
 * @returns {Map<string, Error[]>} Errors grouped by time window
 *
 * @example
 * ```typescript
 * const groups = groupErrorsByTimeWindow(errors, 60000); // 1 minute windows
 * ```
 */
export const groupErrorsByTimeWindow = (
  errors: Array<Error & { timestamp?: Date }>,
  windowMs: number,
): Map<string, Error[]> => {
  const groups = new Map<string, Error[]>();

  errors.forEach(error => {
    const timestamp = error.timestamp || new Date();
    const windowStart = Math.floor(timestamp.getTime() / windowMs) * windowMs;
    const windowKey = new Date(windowStart).toISOString();

    if (!groups.has(windowKey)) {
      groups.set(windowKey, []);
    }
    groups.get(windowKey)!.push(error);
  });

  return groups;
};

/**
 * Detects error spikes based on historical baseline.
 *
 * @param {Map<string, Error[]>} timeWindows - Errors grouped by time
 * @param {number} thresholdMultiplier - Spike threshold multiplier
 * @returns {Array<{ window: string; count: number; isSpike: boolean }>} Spike detection results
 *
 * @example
 * ```typescript
 * const spikes = detectErrorSpikes(timeWindows, 2.5);
 * spikes.filter(s => s.isSpike).forEach(spike => {
 *   console.log(`Spike detected in window ${spike.window}: ${spike.count} errors`);
 * });
 * ```
 */
export const detectErrorSpikes = (
  timeWindows: Map<string, Error[]>,
  thresholdMultiplier = 2.0,
): Array<{ window: string; count: number; isSpike: boolean }> => {
  const counts = Array.from(timeWindows.entries()).map(([window, errors]) => ({
    window,
    count: errors.length,
  }));

  // Calculate baseline (average excluding current window)
  const totalCount = counts.reduce((sum, { count }) => sum + count, 0);
  const average = totalCount / counts.length;
  const threshold = average * thresholdMultiplier;

  return counts.map(({ window, count }) => ({
    window,
    count,
    isSpike: count > threshold,
  }));
};

// ============================================================================
// ERROR NOTIFICATION (36-38)
// ============================================================================

/**
 * Sends error notification to configured provider (Sentry, Bugsnag, etc.).
 *
 * @param {Error} error - Error to notify
 * @param {NotificationConfig} config - Notification configuration
 * @param {ErrorContext} [context] - Additional context
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await notifyError(error, {
 *   provider: 'sentry',
 *   dsn: 'https://key@sentry.io/project',
 *   environment: 'production',
 *   enabled: true
 * });
 * ```
 */
export const notifyError = async (
  error: Error,
  config: NotificationConfig,
  context?: ErrorContext,
): Promise<void> => {
  if (!config.enabled) {
    return;
  }

  // Sample rate check
  if (config.sampleRate && Math.random() > config.sampleRate) {
    return;
  }

  const errorData = {
    message: error.message,
    stack: error.stack,
    code: error instanceof AppException ? error.code : 'UNKNOWN',
    severity: error instanceof AppException ? error.severity : 'medium',
    context,
    environment: config.environment,
    release: config.release,
    timestamp: new Date().toISOString(),
  };

  try {
    switch (config.provider) {
      case 'sentry':
        await sendToSentry(errorData, config);
        break;
      case 'bugsnag':
        await sendToBugsnag(errorData, config);
        break;
      case 'custom':
        console.log('Error notification:', errorData);
        break;
    }
  } catch (notifyError) {
    console.error('Failed to send error notification:', notifyError);
  }
};

/**
 * Sends error to Sentry with proper formatting.
 *
 * @param {object} errorData - Error data to send
 * @param {NotificationConfig} config - Sentry configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await sendToSentry(errorData, { dsn: 'https://...', environment: 'prod' });
 * ```
 */
const sendToSentry = async (errorData: any, config: NotificationConfig): Promise<void> => {
  // In a real implementation, use @sentry/node
  console.log('Would send to Sentry:', { errorData, dsn: config.dsn });

  // Example implementation:
  // const Sentry = require('@sentry/node');
  // Sentry.captureException(new Error(errorData.message), {
  //   level: errorData.severity,
  //   contexts: { custom: errorData.context },
  //   tags: { code: errorData.code }
  // });
};

/**
 * Sends error to Bugsnag with proper formatting.
 *
 * @param {object} errorData - Error data to send
 * @param {NotificationConfig} config - Bugsnag configuration
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await sendToBugsnag(errorData, { apiKey: 'xxx', environment: 'prod' });
 * ```
 */
const sendToBugsnag = async (errorData: any, config: NotificationConfig): Promise<void> => {
  // In a real implementation, use @bugsnag/js
  console.log('Would send to Bugsnag:', { errorData, apiKey: config.apiKey });

  // Example implementation:
  // const Bugsnag = require('@bugsnag/js');
  // Bugsnag.notify(new Error(errorData.message), event => {
  //   event.severity = errorData.severity;
  //   event.context = errorData.code;
  //   event.addMetadata('custom', errorData.context);
  // });
};

// ============================================================================
// USER-FRIENDLY ERROR MESSAGES (39-40)
// ============================================================================

/**
 * Converts technical error into user-friendly message.
 *
 * @param {Error} error - Technical error
 * @param {Map<string, string>} [customMessages] - Custom message mappings
 * @returns {string} User-friendly error message
 *
 * @example
 * ```typescript
 * const message = createUserFriendlyMessage(error);
 * // Returns: "We're having trouble connecting. Please try again."
 * ```
 */
export const createUserFriendlyMessage = (
  error: Error,
  customMessages?: Map<string, string>,
): string => {
  if (error instanceof AppException && customMessages?.has(error.code)) {
    return customMessages.get(error.code)!;
  }

  if (error instanceof AppException) {
    const mappings = createDefaultErrorMappings();
    const mapping = mappings.get(error.code);
    if (mapping) {
      return mapping.userMessage;
    }
  }

  // Database errors
  if (error instanceof DatabaseException) {
    return createUserFriendlyDbError(error);
  }

  // Network errors
  if (error.message.includes('ECONNREFUSED') || error.message.includes('network')) {
    return "We're having trouble connecting. Please try again in a moment.";
  }

  // Timeout errors
  if (error.message.includes('timeout')) {
    return 'This is taking longer than expected. Please try again.';
  }

  // Generic fallback
  return 'Something went wrong. Please try again or contact support if the problem persists.';
};

/**
 * Translates error messages to different languages.
 *
 * @param {Error} error - Error to translate
 * @param {string} locale - Target locale (e.g., 'en', 'es', 'fr')
 * @param {Map<string, Map<string, string>>} translations - Translation mappings
 * @returns {string} Translated error message
 *
 * @example
 * ```typescript
 * const message = translateErrorMessage(error, 'es', translations);
 * // Returns: "No se encontró el usuario"
 * ```
 */
export const translateErrorMessage = (
  error: Error,
  locale: string,
  translations: Map<string, Map<string, string>>,
): string => {
  const code = error instanceof AppException ? error.code : 'UNKNOWN';
  const localeTranslations = translations.get(locale);

  if (localeTranslations?.has(code)) {
    return localeTranslations.get(code)!;
  }

  // Fallback to English or original message
  return error.message;
};

// ============================================================================
// STACK TRACE SANITIZATION (41-42)
// ============================================================================

/**
 * Sanitizes stack trace to remove sensitive information.
 *
 * @param {string} stack - Stack trace string
 * @param {SanitizationOptions} options - Sanitization options
 * @returns {string} Sanitized stack trace
 *
 * @example
 * ```typescript
 * const sanitized = sanitizeStackTrace(error.stack, {
 *   includeStack: true,
 *   maxStackFrames: 10,
 *   allowedPaths: ['/app/src']
 * });
 * ```
 */
export const sanitizeStackTrace = (
  stack: string | undefined,
  options: SanitizationOptions,
): string => {
  if (!stack || !options.includeStack) {
    return '';
  }

  const lines = stack.split('\n');
  let frames = lines.slice(0, options.maxStackFrames ? options.maxStackFrames + 1 : undefined);

  // Filter by allowed paths
  if (options.allowedPaths && options.allowedPaths.length > 0) {
    frames = frames.filter(line => {
      return options.allowedPaths!.some(path => line.includes(path));
    });
  }

  // Remove absolute paths, keep relative
  frames = frames.map(line => {
    return line.replace(/\/home\/[^\/]+\//g, '~/').replace(/C:\\Users\\[^\\]+\\/g, '~\\');
  });

  return frames.join('\n');
};

/**
 * Removes sensitive data from error objects before logging.
 *
 * @param {Error} error - Error to sanitize
 * @param {string[]} sensitiveFields - Fields to remove
 * @returns {Error} Sanitized error
 *
 * @example
 * ```typescript
 * const sanitized = removeSensitiveData(error, ['password', 'apiKey', 'token']);
 * ```
 */
export const removeSensitiveData = (error: Error, sensitiveFields: string[]): Error => {
  if (error instanceof AppException && error.context) {
    const sanitizedContext = { ...error.context };

    sensitiveFields.forEach(field => {
      if (field in sanitizedContext) {
        sanitizedContext[field] = '[REDACTED]';
      }
      if (sanitizedContext.metadata && field in sanitizedContext.metadata) {
        sanitizedContext.metadata[field] = '[REDACTED]';
      }
    });

    return new AppException(
      error.message,
      error.code,
      error.statusCode,
      sanitizedContext,
      error.severity,
    );
  }

  return error;
};

// ============================================================================
// ERROR CONTEXT ENRICHMENT (43-44)
// ============================================================================

/**
 * Extracts error context from Express request object.
 *
 * @param {Request} req - Express request object
 * @returns {ErrorContext} Extracted context
 *
 * @example
 * ```typescript
 * const context = extractErrorContext(req);
 * // Returns: { requestId, userId, path, method, userAgent, ip, ... }
 * ```
 */
export const extractErrorContext = (req: Request): ErrorContext => {
  return {
    requestId: (req as any).id || req.headers['x-request-id'] as string,
    userId: (req as any).user?.id,
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method,
    userAgent: req.headers['user-agent'],
    ip: req.ip || req.headers['x-forwarded-for'] as string,
    metadata: {
      query: req.query,
      params: req.params,
    },
  };
};

/**
 * Adds request correlation ID to error for distributed tracing.
 *
 * @param {Error} error - Error to enrich
 * @param {string} correlationId - Correlation/trace ID
 * @returns {Error} Error with correlation ID
 *
 * @example
 * ```typescript
 * const enriched = addCorrelationId(error, req.headers['x-correlation-id']);
 * ```
 */
export const addCorrelationId = (error: Error, correlationId: string): Error => {
  if (error instanceof AppException) {
    return new AppException(
      error.message,
      error.code,
      error.statusCode,
      { ...error.context, traceId: correlationId },
      error.severity,
    );
  }

  (error as any).correlationId = correlationId;
  return error;
};

// ============================================================================
// GRACEFUL DEGRADATION HELPERS (45-47)
// ============================================================================

/**
 * Executes function with fallback on error.
 *
 * @param {Function} fn - Primary function to execute
 * @param {Function} fallback - Fallback function on error
 * @returns {Promise<T>} Result from primary or fallback
 *
 * @example
 * ```typescript
 * const data = await executeWithFallback(
 *   () => fetchFromCache(key),
 *   () => fetchFromDatabase(key)
 * );
 * ```
 */
export const executeWithFallback = async <T>(
  fn: () => Promise<T>,
  fallback: () => Promise<T>,
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    console.warn('Primary operation failed, using fallback:', error);
    return await fallback();
  }
};

/**
 * Creates degraded service response when feature is unavailable.
 *
 * @param {string} feature - Feature name
 * @param {any} [partialData] - Partial data if available
 * @returns {object} Degraded response
 *
 * @example
 * ```typescript
 * return createDegradedResponse('recommendations', { default: ['item1', 'item2'] });
 * ```
 */
export const createDegradedResponse = (feature: string, partialData?: any): object => {
  return {
    status: 'degraded',
    feature,
    message: `${feature} is temporarily unavailable`,
    partialData,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Implements graceful degradation strategy for a feature.
 *
 * @param {DegradationStrategy} strategy - Degradation strategy configuration
 * @returns {Promise<any>} Result or fallback
 *
 * @example
 * ```typescript
 * const result = await implementGracefulDegradation({
 *   feature: 'UserRecommendations',
 *   fallback: () => getDefaultRecommendations(),
 *   timeout: 3000,
 *   enabled: true
 * });
 * ```
 */
export const implementGracefulDegradation = async (
  strategy: DegradationStrategy,
): Promise<any> => {
  if (!strategy.enabled) {
    throw new AppException(
      `Feature ${strategy.feature} is disabled`,
      'FEATURE_DISABLED',
      503,
      { feature: strategy.feature },
      'medium',
    );
  }

  try {
    return await Promise.race([
      strategy.fallback(),
      timeoutPromise(strategy.timeout),
    ]);
  } catch (error) {
    console.warn(`Graceful degradation for ${strategy.feature}:`, error);
    return createDegradedResponse(strategy.feature);
  }
};

// ============================================================================
// HELPER UTILITIES
// ============================================================================

/**
 * Sleeps for specified milliseconds.
 */
const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Creates a promise that rejects after timeout.
 */
const timeoutPromise = (ms: number): Promise<never> => {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Operation timed out')), ms);
  });
};

/**
 * Generates a unique trace ID for request tracking.
 */
export const generateTraceId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
};

/**
 * Default export with all utilities.
 */
export default {
  // Models
  createErrorLogModel,
  createErrorReportModel,

  // Exception Classes
  AppException,
  BusinessValidationException,
  ExternalServiceException,
  ResourceConflictException,
  RateLimitException,
  DatabaseException,

  // Global Filters
  createGlobalExceptionFilter,
  transformErrorToResponse,
  filterBySeverity,
  createErrorResponseMiddleware,

  // Error Transformation
  mapErrorCode,
  createDefaultErrorMappings,
  transformDatabaseError,
  enrichErrorContext,
  chainErrorTransformers,

  // HTTP Responses
  createHttpErrorResponse,
  formatValidationErrors,
  sendJsonErrorResponse,
  createProblemDetails,

  // Database Error Handling
  parseSequelizeError,
  handleDatabaseConnectionError,
  extractConstraintInfo,
  createUserFriendlyDbError,
  logDatabaseError,

  // Retry Strategies
  retryWithBackoff,
  Retry,
  isRetryableError,
  createJitteredDelay,

  // Circuit Breaker
  createCircuitBreaker,
  getCircuitBreakerState,
  resetCircuitBreaker,
  CircuitBreaker,

  // Error Aggregation
  aggregateErrorsByCode,
  groupErrorsByTimeWindow,
  detectErrorSpikes,

  // Error Notification
  notifyError,

  // User-Friendly Messages
  createUserFriendlyMessage,
  translateErrorMessage,

  // Stack Trace Sanitization
  sanitizeStackTrace,
  removeSensitiveData,

  // Context Enrichment
  extractErrorContext,
  addCorrelationId,

  // Graceful Degradation
  executeWithFallback,
  createDegradedResponse,
  implementGracefulDegradation,

  // Utilities
  generateTraceId,
};
