"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTraceId = exports.implementGracefulDegradation = exports.createDegradedResponse = exports.executeWithFallback = exports.addCorrelationId = exports.extractErrorContext = exports.removeSensitiveData = exports.sanitizeStackTrace = exports.translateErrorMessage = exports.createUserFriendlyMessage = exports.notifyError = exports.detectErrorSpikes = exports.groupErrorsByTimeWindow = exports.aggregateErrorsByCode = exports.CircuitBreaker = exports.resetCircuitBreaker = exports.getCircuitBreakerState = exports.createCircuitBreaker = exports.createJitteredDelay = exports.isRetryableError = exports.Retry = exports.retryWithBackoff = exports.logDatabaseError = exports.createUserFriendlyDbError = exports.extractConstraintInfo = exports.handleDatabaseConnectionError = exports.parseSequelizeError = exports.createProblemDetails = exports.sendJsonErrorResponse = exports.formatValidationErrors = exports.createHttpErrorResponse = exports.chainErrorTransformers = exports.enrichErrorContext = exports.transformDatabaseError = exports.createDefaultErrorMappings = exports.mapErrorCode = exports.createErrorResponseMiddleware = exports.filterBySeverity = exports.transformErrorToResponse = exports.createGlobalExceptionFilter = exports.DatabaseException = exports.RateLimitException = exports.ResourceConflictException = exports.ExternalServiceException = exports.BusinessValidationException = exports.AppException = exports.createErrorReportModel = exports.createErrorLogModel = void 0;
const sequelize_1 = require("sequelize");
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
const createErrorLogModel = (sequelize) => {
    class ErrorLog extends sequelize_1.Model {
    }
    ErrorLog.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        errorCode: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Standardized error code',
        },
        message: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
            comment: 'Error message',
        },
        statusCode: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            comment: 'HTTP status code',
        },
        severity: {
            type: sequelize_1.DataTypes.ENUM('low', 'medium', 'high', 'critical'),
            allowNull: false,
            defaultValue: 'medium',
            comment: 'Error severity level',
        },
        category: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            defaultValue: 'general',
            comment: 'Error category for grouping',
        },
        stack: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Error stack trace',
        },
        context: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Error context information',
        },
        userId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'User ID if applicable',
        },
        requestId: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'Request trace ID',
        },
        path: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: true,
            comment: 'Request path',
        },
        method: {
            type: sequelize_1.DataTypes.STRING(10),
            allowNull: true,
            comment: 'HTTP method',
        },
        userAgent: {
            type: sequelize_1.DataTypes.STRING(500),
            allowNull: true,
            comment: 'User agent string',
        },
        ip: {
            type: sequelize_1.DataTypes.STRING(45),
            allowNull: true,
            comment: 'Client IP address',
        },
        resolved: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Whether error has been resolved',
        },
        resolvedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Resolution timestamp',
        },
        resolvedBy: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'User who resolved the error',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
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
    });
    return ErrorLog;
};
exports.createErrorLogModel = createErrorLogModel;
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
const createErrorReportModel = (sequelize) => {
    class ErrorReport extends sequelize_1.Model {
    }
    ErrorReport.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        errorCode: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            comment: 'Unique error code',
        },
        errorCategory: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Error category',
        },
        occurrenceCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Total number of occurrences',
        },
        affectedUserCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Number of unique users affected',
        },
        firstOccurrence: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'First occurrence timestamp',
        },
        lastOccurrence: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            comment: 'Last occurrence timestamp',
        },
        averageSeverity: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: false,
            defaultValue: 'medium',
            comment: 'Average severity level',
        },
        trend: {
            type: sequelize_1.DataTypes.ENUM('increasing', 'decreasing', 'stable', 'spike'),
            allowNull: false,
            defaultValue: 'stable',
            comment: 'Error occurrence trend',
        },
        topPaths: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Most common paths where error occurs',
        },
        topUserAgents: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Most common user agents',
        },
        resolutionStatus: {
            type: sequelize_1.DataTypes.ENUM('open', 'investigating', 'resolved', 'wontfix'),
            allowNull: false,
            defaultValue: 'open',
            comment: 'Current resolution status',
        },
        assignedTo: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: true,
            comment: 'User assigned to resolve',
        },
        notes: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Investigation notes',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
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
    });
    return ErrorReport;
};
exports.createErrorReportModel = createErrorReportModel;
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
class AppException extends Error {
    constructor(message, code, statusCode, context, severity = 'medium') {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
        this.context = context;
        this.severity = severity;
        this.name = 'AppException';
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppException = AppException;
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
class BusinessValidationException extends AppException {
    constructor(message, details, context) {
        super(message, 'BUSINESS_VALIDATION_ERROR', 422, context, 'medium');
        this.details = details;
        this.name = 'BusinessValidationException';
    }
}
exports.BusinessValidationException = BusinessValidationException;
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
class ExternalServiceException extends AppException {
    constructor(service, message, originalError, context) {
        super(message, 'EXTERNAL_SERVICE_ERROR', 503, context, 'high');
        this.service = service;
        this.originalError = originalError;
        this.name = 'ExternalServiceException';
    }
}
exports.ExternalServiceException = ExternalServiceException;
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
class ResourceConflictException extends AppException {
    constructor(resource, resourceId, message, context) {
        super(message, 'RESOURCE_CONFLICT', 409, context, 'medium');
        this.resource = resource;
        this.resourceId = resourceId;
        this.name = 'ResourceConflictException';
    }
}
exports.ResourceConflictException = ResourceConflictException;
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
class RateLimitException extends AppException {
    constructor(message, retryAfter, context) {
        super(message, 'RATE_LIMIT_EXCEEDED', 429, context, 'low');
        this.retryAfter = retryAfter;
        this.name = 'RateLimitException';
    }
}
exports.RateLimitException = RateLimitException;
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
class DatabaseException extends AppException {
    constructor(operation, message, originalError, context) {
        super(message, 'DATABASE_ERROR', 500, context, 'high');
        this.operation = operation;
        this.originalError = originalError;
        this.name = 'DatabaseException';
    }
}
exports.DatabaseException = DatabaseException;
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
const createGlobalExceptionFilter = (logger, includeStack = false) => {
    return (exception, req, res) => {
        const errorResponse = (0, exports.transformErrorToResponse)(exception, req, includeStack);
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
exports.createGlobalExceptionFilter = createGlobalExceptionFilter;
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
const transformErrorToResponse = (error, req, includeStack = false) => {
    const timestamp = new Date().toISOString();
    const context = req ? (0, exports.extractErrorContext)(req) : {};
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
    if (error instanceof sequelize_1.ValidationError) {
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
exports.transformErrorToResponse = transformErrorToResponse;
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
const filterBySeverity = (error, severityLevels) => {
    if (error instanceof AppException) {
        return severityLevels.includes(error.severity);
    }
    // Default to high severity for unknown errors
    return severityLevels.includes('high');
};
exports.filterBySeverity = filterBySeverity;
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
const createErrorResponseMiddleware = (options) => {
    return (err, req, res, next) => {
        const errorResponse = (0, exports.transformErrorToResponse)(err, req, options.includeStack);
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
exports.createErrorResponseMiddleware = createErrorResponseMiddleware;
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
const mapErrorCode = (errorCode, mappings) => {
    return mappings.get(errorCode) || {
        internal: errorCode,
        http: 500,
        userMessage: 'An unexpected error occurred',
        severity: 'medium',
        category: 'general',
    };
};
exports.mapErrorCode = mapErrorCode;
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
const createDefaultErrorMappings = () => {
    const mappings = new Map();
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
exports.createDefaultErrorMappings = createDefaultErrorMappings;
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
const transformDatabaseError = (dbError) => {
    const message = dbError.message.toLowerCase();
    // Unique constraint violation
    if (message.includes('unique') || message.includes('duplicate')) {
        return new AppException('A record with this value already exists', 'DUPLICATE_ENTRY', 409, { originalError: dbError.message }, 'medium');
    }
    // Foreign key constraint
    if (message.includes('foreign key')) {
        return new AppException('Related record not found', 'FOREIGN_KEY_VIOLATION', 400, { originalError: dbError.message }, 'medium');
    }
    // Connection error
    if (message.includes('connection') || message.includes('connect')) {
        return new AppException('Database connection failed', 'DB_CONNECTION_ERROR', 503, { originalError: dbError.message }, 'critical');
    }
    // Timeout
    if (message.includes('timeout')) {
        return new AppException('Database operation timed out', 'DB_TIMEOUT', 504, { originalError: dbError.message }, 'high');
    }
    // Generic database error
    return new DatabaseException('UNKNOWN', 'Database operation failed', dbError, { originalError: dbError.message });
};
exports.transformDatabaseError = transformDatabaseError;
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
const enrichErrorContext = (error, req, additionalContext) => {
    const context = (0, exports.extractErrorContext)(req);
    if (error instanceof AppException) {
        return new AppException(error.message, error.code, error.statusCode, { ...error.context, ...context, ...additionalContext }, error.severity);
    }
    // Add context as property for non-AppException errors
    error.context = { ...context, ...additionalContext };
    return error;
};
exports.enrichErrorContext = enrichErrorContext;
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
const chainErrorTransformers = (error, transformers) => {
    return transformers.reduce((err, transformer) => transformer(err), error);
};
exports.chainErrorTransformers = chainErrorTransformers;
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
const createHttpErrorResponse = (statusCode, message, code, details) => {
    return {
        code: code || `HTTP_${statusCode}`,
        message,
        statusCode,
        timestamp: new Date().toISOString(),
        details: details ? [details] : undefined,
    };
};
exports.createHttpErrorResponse = createHttpErrorResponse;
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
const formatValidationErrors = (errors) => {
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
exports.formatValidationErrors = formatValidationErrors;
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
const sendJsonErrorResponse = (res, errorResponse) => {
    res
        .status(errorResponse.statusCode)
        .setHeader('Content-Type', 'application/json')
        .setHeader('X-Error-Code', errorResponse.code)
        .json(errorResponse);
};
exports.sendJsonErrorResponse = sendJsonErrorResponse;
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
const createProblemDetails = (error, req) => {
    const statusCode = error instanceof AppException ? error.statusCode : 500;
    const code = error instanceof AppException ? error.code : 'INTERNAL_ERROR';
    return {
        type: `https://api.example.com/errors/${code}`,
        title: error.message,
        status: statusCode,
        detail: error.message,
        instance: req.path,
        timestamp: new Date().toISOString(),
        traceId: req.id || (0, exports.generateTraceId)(),
    };
};
exports.createProblemDetails = createProblemDetails;
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
const parseSequelizeError = (error) => {
    const message = error.message.toLowerCase();
    if (error instanceof sequelize_1.ValidationError) {
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
exports.parseSequelizeError = parseSequelizeError;
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
const handleDatabaseConnectionError = async (error, reconnectFn, options) => {
    console.error('Database connection error:', error.message);
    try {
        await (0, exports.retryWithBackoff)(reconnectFn, options);
    }
    catch (retryError) {
        throw new DatabaseException('CONNECTION', 'Failed to reconnect to database after multiple attempts', error, { attempts: options.maxAttempts });
    }
};
exports.handleDatabaseConnectionError = handleDatabaseConnectionError;
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
const extractConstraintInfo = (error) => {
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
exports.extractConstraintInfo = extractConstraintInfo;
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
const createUserFriendlyDbError = (error) => {
    const dbError = (0, exports.parseSequelizeError)(error);
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
exports.createUserFriendlyDbError = createUserFriendlyDbError;
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
const logDatabaseError = (error, query, params) => {
    const dbError = (0, exports.parseSequelizeError)(error);
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
exports.logDatabaseError = logDatabaseError;
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
const retryWithBackoff = async (fn, options) => {
    let lastError;
    let delay = options.initialDelay;
    for (let attempt = 1; attempt <= options.maxAttempts; attempt++) {
        try {
            return await fn();
        }
        catch (error) {
            lastError = error;
            // Check if error is retryable
            if (options.retryableErrors) {
                const isRetryable = options.retryableErrors.some(code => error instanceof AppException ? error.code === code : false);
                if (!isRetryable) {
                    throw error;
                }
            }
            // Call retry callback
            if (options.onRetry) {
                options.onRetry(error, attempt);
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
exports.retryWithBackoff = retryWithBackoff;
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
const Retry = (options) => {
    return (target, propertyKey, descriptor) => {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args) {
            return (0, exports.retryWithBackoff)(() => originalMethod.apply(this, args), options);
        };
        return descriptor;
    };
};
exports.Retry = Retry;
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
const isRetryableError = (error, retryableErrors) => {
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
exports.isRetryableError = isRetryableError;
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
const createJitteredDelay = (baseDelay, jitterFactor = 0.1) => {
    const jitter = baseDelay * jitterFactor;
    return baseDelay + (Math.random() * 2 - 1) * jitter;
};
exports.createJitteredDelay = createJitteredDelay;
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
const createCircuitBreaker = (config) => {
    const state = {
        status: 'CLOSED',
        failureCount: 0,
        successCount: 0,
    };
    const execute = async (fn) => {
        // Check if circuit is open
        if (state.status === 'OPEN') {
            if (Date.now() < (state.nextAttemptTime || 0)) {
                throw new AppException('Circuit breaker is open', 'CIRCUIT_OPEN', 503, { nextAttemptTime: state.nextAttemptTime }, 'high');
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
            }
            else {
                state.failureCount = 0;
            }
            return result;
        }
        catch (error) {
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
exports.createCircuitBreaker = createCircuitBreaker;
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
const getCircuitBreakerState = (breaker) => {
    return breaker.getState();
};
exports.getCircuitBreakerState = getCircuitBreakerState;
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
const resetCircuitBreaker = (breaker) => {
    breaker.reset();
};
exports.resetCircuitBreaker = resetCircuitBreaker;
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
const CircuitBreaker = (config) => {
    const breaker = (0, exports.createCircuitBreaker)(config);
    return (target, propertyKey, descriptor) => {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args) {
            return breaker.execute(() => originalMethod.apply(this, args));
        };
        return descriptor;
    };
};
exports.CircuitBreaker = CircuitBreaker;
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
const aggregateErrorsByCode = (errors) => {
    const aggregation = new Map();
    errors.forEach(error => {
        const code = error instanceof AppException ? error.code : 'UNKNOWN';
        const context = error instanceof AppException ? error.context : undefined;
        if (!aggregation.has(code)) {
            aggregation.set(code, {
                errorCode: code,
                count: 0,
                firstOccurrence: new Date().toISOString(),
                lastOccurrence: new Date().toISOString(),
                affectedUsers: new Set(),
                contexts: [],
            });
        }
        const stats = aggregation.get(code);
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
exports.aggregateErrorsByCode = aggregateErrorsByCode;
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
const groupErrorsByTimeWindow = (errors, windowMs) => {
    const groups = new Map();
    errors.forEach(error => {
        const timestamp = error.timestamp || new Date();
        const windowStart = Math.floor(timestamp.getTime() / windowMs) * windowMs;
        const windowKey = new Date(windowStart).toISOString();
        if (!groups.has(windowKey)) {
            groups.set(windowKey, []);
        }
        groups.get(windowKey).push(error);
    });
    return groups;
};
exports.groupErrorsByTimeWindow = groupErrorsByTimeWindow;
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
const detectErrorSpikes = (timeWindows, thresholdMultiplier = 2.0) => {
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
exports.detectErrorSpikes = detectErrorSpikes;
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
const notifyError = async (error, config, context) => {
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
    }
    catch (notifyError) {
        console.error('Failed to send error notification:', notifyError);
    }
};
exports.notifyError = notifyError;
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
const sendToSentry = async (errorData, config) => {
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
const sendToBugsnag = async (errorData, config) => {
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
const createUserFriendlyMessage = (error, customMessages) => {
    if (error instanceof AppException && customMessages?.has(error.code)) {
        return customMessages.get(error.code);
    }
    if (error instanceof AppException) {
        const mappings = (0, exports.createDefaultErrorMappings)();
        const mapping = mappings.get(error.code);
        if (mapping) {
            return mapping.userMessage;
        }
    }
    // Database errors
    if (error instanceof DatabaseException) {
        return (0, exports.createUserFriendlyDbError)(error);
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
exports.createUserFriendlyMessage = createUserFriendlyMessage;
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
const translateErrorMessage = (error, locale, translations) => {
    const code = error instanceof AppException ? error.code : 'UNKNOWN';
    const localeTranslations = translations.get(locale);
    if (localeTranslations?.has(code)) {
        return localeTranslations.get(code);
    }
    // Fallback to English or original message
    return error.message;
};
exports.translateErrorMessage = translateErrorMessage;
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
const sanitizeStackTrace = (stack, options) => {
    if (!stack || !options.includeStack) {
        return '';
    }
    const lines = stack.split('\n');
    let frames = lines.slice(0, options.maxStackFrames ? options.maxStackFrames + 1 : undefined);
    // Filter by allowed paths
    if (options.allowedPaths && options.allowedPaths.length > 0) {
        frames = frames.filter(line => {
            return options.allowedPaths.some(path => line.includes(path));
        });
    }
    // Remove absolute paths, keep relative
    frames = frames.map(line => {
        return line.replace(/\/home\/[^\/]+\//g, '~/').replace(/C:\\Users\\[^\\]+\\/g, '~\\');
    });
    return frames.join('\n');
};
exports.sanitizeStackTrace = sanitizeStackTrace;
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
const removeSensitiveData = (error, sensitiveFields) => {
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
        return new AppException(error.message, error.code, error.statusCode, sanitizedContext, error.severity);
    }
    return error;
};
exports.removeSensitiveData = removeSensitiveData;
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
const extractErrorContext = (req) => {
    return {
        requestId: req.id || req.headers['x-request-id'],
        userId: req.user?.id,
        timestamp: new Date().toISOString(),
        path: req.path,
        method: req.method,
        userAgent: req.headers['user-agent'],
        ip: req.ip || req.headers['x-forwarded-for'],
        metadata: {
            query: req.query,
            params: req.params,
        },
    };
};
exports.extractErrorContext = extractErrorContext;
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
const addCorrelationId = (error, correlationId) => {
    if (error instanceof AppException) {
        return new AppException(error.message, error.code, error.statusCode, { ...error.context, traceId: correlationId }, error.severity);
    }
    error.correlationId = correlationId;
    return error;
};
exports.addCorrelationId = addCorrelationId;
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
const executeWithFallback = async (fn, fallback) => {
    try {
        return await fn();
    }
    catch (error) {
        console.warn('Primary operation failed, using fallback:', error);
        return await fallback();
    }
};
exports.executeWithFallback = executeWithFallback;
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
const createDegradedResponse = (feature, partialData) => {
    return {
        status: 'degraded',
        feature,
        message: `${feature} is temporarily unavailable`,
        partialData,
        timestamp: new Date().toISOString(),
    };
};
exports.createDegradedResponse = createDegradedResponse;
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
const implementGracefulDegradation = async (strategy) => {
    if (!strategy.enabled) {
        throw new AppException(`Feature ${strategy.feature} is disabled`, 'FEATURE_DISABLED', 503, { feature: strategy.feature }, 'medium');
    }
    try {
        return await Promise.race([
            strategy.fallback(),
            timeoutPromise(strategy.timeout),
        ]);
    }
    catch (error) {
        console.warn(`Graceful degradation for ${strategy.feature}:`, error);
        return (0, exports.createDegradedResponse)(strategy.feature);
    }
};
exports.implementGracefulDegradation = implementGracefulDegradation;
// ============================================================================
// HELPER UTILITIES
// ============================================================================
/**
 * Sleeps for specified milliseconds.
 */
const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};
/**
 * Creates a promise that rejects after timeout.
 */
const timeoutPromise = (ms) => {
    return new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Operation timed out')), ms);
    });
};
/**
 * Generates a unique trace ID for request tracking.
 */
const generateTraceId = () => {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
};
exports.generateTraceId = generateTraceId;
/**
 * Default export with all utilities.
 */
exports.default = {
    // Models
    createErrorLogModel: exports.createErrorLogModel,
    createErrorReportModel: exports.createErrorReportModel,
    // Exception Classes
    AppException,
    BusinessValidationException,
    ExternalServiceException,
    ResourceConflictException,
    RateLimitException,
    DatabaseException,
    // Global Filters
    createGlobalExceptionFilter: exports.createGlobalExceptionFilter,
    transformErrorToResponse: exports.transformErrorToResponse,
    filterBySeverity: exports.filterBySeverity,
    createErrorResponseMiddleware: exports.createErrorResponseMiddleware,
    // Error Transformation
    mapErrorCode: exports.mapErrorCode,
    createDefaultErrorMappings: exports.createDefaultErrorMappings,
    transformDatabaseError: exports.transformDatabaseError,
    enrichErrorContext: exports.enrichErrorContext,
    chainErrorTransformers: exports.chainErrorTransformers,
    // HTTP Responses
    createHttpErrorResponse: exports.createHttpErrorResponse,
    formatValidationErrors: exports.formatValidationErrors,
    sendJsonErrorResponse: exports.sendJsonErrorResponse,
    createProblemDetails: exports.createProblemDetails,
    // Database Error Handling
    parseSequelizeError: exports.parseSequelizeError,
    handleDatabaseConnectionError: exports.handleDatabaseConnectionError,
    extractConstraintInfo: exports.extractConstraintInfo,
    createUserFriendlyDbError: exports.createUserFriendlyDbError,
    logDatabaseError: exports.logDatabaseError,
    // Retry Strategies
    retryWithBackoff: exports.retryWithBackoff,
    Retry: exports.Retry,
    isRetryableError: exports.isRetryableError,
    createJitteredDelay: exports.createJitteredDelay,
    // Circuit Breaker
    createCircuitBreaker: exports.createCircuitBreaker,
    getCircuitBreakerState: exports.getCircuitBreakerState,
    resetCircuitBreaker: exports.resetCircuitBreaker,
    CircuitBreaker: exports.CircuitBreaker,
    // Error Aggregation
    aggregateErrorsByCode: exports.aggregateErrorsByCode,
    groupErrorsByTimeWindow: exports.groupErrorsByTimeWindow,
    detectErrorSpikes: exports.detectErrorSpikes,
    // Error Notification
    notifyError: exports.notifyError,
    // User-Friendly Messages
    createUserFriendlyMessage: exports.createUserFriendlyMessage,
    translateErrorMessage: exports.translateErrorMessage,
    // Stack Trace Sanitization
    sanitizeStackTrace: exports.sanitizeStackTrace,
    removeSensitiveData: exports.removeSensitiveData,
    // Context Enrichment
    extractErrorContext: exports.extractErrorContext,
    addCorrelationId: exports.addCorrelationId,
    // Graceful Degradation
    executeWithFallback: exports.executeWithFallback,
    createDegradedResponse: exports.createDegradedResponse,
    implementGracefulDegradation: exports.implementGracefulDegradation,
    // Utilities
    generateTraceId: exports.generateTraceId,
};
//# sourceMappingURL=error-handling-kit.js.map