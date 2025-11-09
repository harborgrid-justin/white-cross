/**
 * @fileoverview Error Handling & Recovery Kit - Advanced error management and recovery strategies
 * @module reuse/error-handling-recovery-kit
 * @description Comprehensive error handling, recovery, and resilience patterns for production-ready
 * NestJS applications with healthcare compliance, HIPAA considerations, and advanced retry mechanisms.
 *
 * Key Features:
 * - Custom exception classes with context enrichment
 * - Advanced exception filters and transformers
 * - Error serialization and sanitization
 * - Structured error logging with correlation tracking
 * - Exponential backoff and retry mechanisms
 * - Multiple fallback strategies
 * - Circuit breaker pattern implementation
 * - Error recovery workflows and orchestration
 * - Graceful degradation strategies
 * - Error aggregation and trend analysis
 * - Multi-channel error notification
 * - Stack trace sanitization and security
 * - Error rate limiting and throttling
 * - Distributed tracing with correlation IDs
 * - User-friendly error message generation
 * - HIPAA-compliant error handling
 *
 * @target NestJS 10.x, TypeScript 5.x, Node 18+
 *
 * @security
 * - PHI data sanitization in error logs
 * - Secure error message generation
 * - Stack trace filtering for production
 * - Sensitive data redaction
 * - Audit trail for critical errors
 * - Rate limiting for error endpoints
 *
 * @example Basic error handling
 * ```typescript
 * import {
 *   HealthcareBusinessException,
 *   createHealthcareErrorFilter,
 *   sanitizeHealthcareError
 * } from './error-handling-recovery-kit';
 *
 * // Throw healthcare-specific exception
 * throw new HealthcareBusinessException(
 *   'Patient record access denied',
 *   'PATIENT_ACCESS_DENIED',
 *   403,
 *   { patientId: 'P-123', userId: 'U-456' },
 *   'high'
 * );
 *
 * // Create global filter
 * const filter = createHealthcareErrorFilter({
 *   includeStack: false,
 *   sanitizePHI: true,
 *   auditCriticalErrors: true
 * });
 * ```
 *
 * @example Advanced recovery patterns
 * ```typescript
 * import {
 *   retryWithExponentialBackoff,
 *   createCircuitBreaker,
 *   executeWithFallbackChain,
 *   createErrorRecoveryPipeline
 * } from './error-handling-recovery-kit';
 *
 * // Retry with exponential backoff
 * const result = await retryWithExponentialBackoff(
 *   () => fetchPatientData(patientId),
 *   { maxAttempts: 3, baseDelay: 1000, maxDelay: 10000 }
 * );
 *
 * // Circuit breaker
 * const breaker = createCircuitBreaker({
 *   failureThreshold: 5,
 *   successThreshold: 2,
 *   timeout: 60000,
 *   halfOpenDelay: 5000
 * });
 *
 * const data = await breaker.execute(() => externalAPICall());
 *
 * // Fallback chain
 * const result = await executeWithFallbackChain([
 *   () => fetchFromPrimaryDB(),
 *   () => fetchFromReplicaDB(),
 *   () => fetchFromCache(),
 *   () => getDefaultData()
 * ]);
 * ```
 *
 * LOC: ERR-RECOVERY-001
 * UPSTREAM: @nestjs/common, sequelize, @types/node
 * DOWNSTREAM: exception filters, service providers, middleware, controllers
 *
 * @version 1.0.0
 * @since 2025-11-08
 */
import { Request } from 'express';
/**
 * @enum ErrorSeverity
 * @description Error severity levels for healthcare applications
 */
export declare enum ErrorSeverity {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    CRITICAL = "CRITICAL"
}
/**
 * @enum ErrorCategory
 * @description Error categorization for better tracking and handling
 */
export declare enum ErrorCategory {
    AUTHENTICATION = "AUTHENTICATION",
    AUTHORIZATION = "AUTHORIZATION",
    VALIDATION = "VALIDATION",
    BUSINESS_LOGIC = "BUSINESS_LOGIC",
    DATABASE = "DATABASE",
    EXTERNAL_SERVICE = "EXTERNAL_SERVICE",
    NETWORK = "NETWORK",
    CONFIGURATION = "CONFIGURATION",
    SYSTEM = "SYSTEM",
    HIPAA_VIOLATION = "HIPAA_VIOLATION",
    DATA_INTEGRITY = "DATA_INTEGRITY"
}
/**
 * @interface ErrorContext
 * @description Comprehensive error context with healthcare-specific fields
 */
export interface ErrorContext {
    correlationId?: string;
    traceId?: string;
    spanId?: string;
    userId?: string;
    patientId?: string;
    facilityId?: string;
    sessionId?: string;
    requestId?: string;
    timestamp?: Date;
    path?: string;
    method?: string;
    ipAddress?: string;
    userAgent?: string;
    metadata?: Record<string, any>;
    phi?: boolean;
    auditRequired?: boolean;
}
/**
 * @interface ErrorDetails
 * @description Detailed error information
 */
export interface ErrorDetails {
    field?: string;
    value?: any;
    constraint?: string;
    message: string;
    code?: string;
}
/**
 * @interface SerializedError
 * @description Standardized error response format
 */
export interface SerializedError {
    code: string;
    message: string;
    statusCode: number;
    severity: ErrorSeverity;
    category: ErrorCategory;
    timestamp: string;
    correlationId?: string;
    path?: string;
    details?: ErrorDetails[];
    stack?: string;
    context?: Partial<ErrorContext>;
    userMessage?: string;
}
/**
 * @interface RetryConfig
 * @description Configuration for retry mechanisms
 */
export interface RetryConfig {
    maxAttempts: number;
    baseDelay: number;
    maxDelay: number;
    backoffMultiplier: number;
    jitterFactor?: number;
    retryableErrorCodes?: string[];
    retryableStatusCodes?: number[];
    onRetry?: (error: Error, attempt: number, delay: number) => void | Promise<void>;
    shouldRetry?: (error: Error) => boolean;
}
/**
 * @interface CircuitBreakerConfig
 * @description Circuit breaker configuration
 */
export interface CircuitBreakerConfig {
    failureThreshold: number;
    successThreshold: number;
    timeout: number;
    halfOpenDelay: number;
    monitoringWindow?: number;
    onStateChange?: (from: CircuitState, to: CircuitState) => void;
    onFailure?: (error: Error) => void;
    onSuccess?: () => void;
}
/**
 * @enum CircuitState
 * @description Circuit breaker states
 */
export declare enum CircuitState {
    CLOSED = "CLOSED",
    OPEN = "OPEN",
    HALF_OPEN = "HALF_OPEN"
}
/**
 * @interface CircuitBreakerInstance
 * @description Circuit breaker instance with state management
 */
export interface CircuitBreakerInstance {
    execute<T>(operation: () => Promise<T>): Promise<T>;
    getState(): CircuitState;
    getStats(): CircuitBreakerStats;
    reset(): void;
    forceOpen(): void;
    forceClose(): void;
}
/**
 * @interface CircuitBreakerStats
 * @description Circuit breaker statistics
 */
export interface CircuitBreakerStats {
    state: CircuitState;
    failureCount: number;
    successCount: number;
    totalCalls: number;
    lastFailureTime?: Date;
    lastSuccessTime?: Date;
    nextAttemptTime?: Date;
}
/**
 * @interface FallbackOptions
 * @description Fallback strategy configuration
 */
export interface FallbackOptions {
    timeout?: number;
    retryConfig?: Partial<RetryConfig>;
    useCircuitBreaker?: boolean;
    circuitBreakerConfig?: Partial<CircuitBreakerConfig>;
    logFallback?: boolean;
}
/**
 * @interface ErrorAggregation
 * @description Error aggregation for monitoring
 */
export interface ErrorAggregation {
    errorCode: string;
    category: ErrorCategory;
    count: number;
    firstOccurrence: Date;
    lastOccurrence: Date;
    affectedUsers: Set<string>;
    affectedPatients: Set<string>;
    contexts: ErrorContext[];
    trend: 'INCREASING' | 'DECREASING' | 'STABLE' | 'SPIKE';
}
/**
 * @interface ErrorNotificationConfig
 * @description Error notification configuration
 */
export interface ErrorNotificationConfig {
    enabled: boolean;
    channels: NotificationChannel[];
    severityThreshold: ErrorSeverity;
    rateLimitPerMinute?: number;
    aggregationWindow?: number;
    includeStackTrace?: boolean;
    sanitizePHI?: boolean;
}
/**
 * @enum NotificationChannel
 * @description Available notification channels
 */
export declare enum NotificationChannel {
    EMAIL = "EMAIL",
    SLACK = "SLACK",
    PAGER_DUTY = "PAGER_DUTY",
    SENTRY = "SENTRY",
    CLOUDWATCH = "CLOUDWATCH",
    CUSTOM_WEBHOOK = "CUSTOM_WEBHOOK"
}
/**
 * @interface SanitizationConfig
 * @description Configuration for error sanitization
 */
export interface SanitizationConfig {
    includeStack: boolean;
    maxStackFrames?: number;
    sanitizePHI: boolean;
    sanitizeCredentials: boolean;
    allowedPaths?: string[];
    redactPatterns?: RegExp[];
    customSanitizer?: (error: Error) => Error;
}
/**
 * @interface ErrorRateLimitConfig
 * @description Rate limiting configuration for error handling
 */
export interface ErrorRateLimitConfig {
    maxErrorsPerMinute: number;
    maxErrorsPerHour: number;
    maxSameErrorPerMinute: number;
    blockDuration?: number;
    onLimitExceeded?: (errorCode: string) => void;
}
/**
 * @interface RecoveryAction
 * @description Recovery action definition
 */
export interface RecoveryAction {
    name: string;
    execute: () => Promise<void>;
    onSuccess?: () => void;
    onFailure?: (error: Error) => void;
    timeout?: number;
}
/**
 * @interface ErrorRecoveryPipeline
 * @description Error recovery pipeline configuration
 */
export interface ErrorRecoveryPipeline {
    errorCode: string;
    actions: RecoveryAction[];
    continueOnFailure?: boolean;
    timeout?: number;
}
/**
 * Base application exception with enhanced context and healthcare support
 *
 * @class ApplicationException
 * @extends Error
 *
 * @example
 * ```typescript
 * throw new ApplicationException(
 *   'Patient record not found',
 *   'PATIENT_NOT_FOUND',
 *   404,
 *   ErrorCategory.BUSINESS_LOGIC,
 *   ErrorSeverity.MEDIUM,
 *   { patientId: 'P-123', userId: 'U-456' }
 * );
 * ```
 */
export declare class ApplicationException extends Error {
    readonly code: string;
    readonly statusCode: number;
    readonly category: ErrorCategory;
    readonly severity: ErrorSeverity;
    readonly context?: ErrorContext;
    readonly timestamp: Date;
    constructor(message: string, code: string, statusCode: number, category: ErrorCategory, severity: ErrorSeverity, context?: ErrorContext);
}
/**
 * Healthcare-specific business exception with HIPAA compliance support
 *
 * @class HealthcareBusinessException
 * @extends ApplicationException
 *
 * @example
 * ```typescript
 * throw new HealthcareBusinessException(
 *   'Prescription authorization required',
 *   'PRESCRIPTION_AUTH_REQUIRED',
 *   403,
 *   { patientId: 'P-123', medicationId: 'M-456', phi: true },
 *   ErrorSeverity.HIGH
 * );
 * ```
 */
export declare class HealthcareBusinessException extends ApplicationException {
    constructor(message: string, code: string, statusCode: number, context?: ErrorContext, severity?: ErrorSeverity);
}
/**
 * External service integration exception with retry indication
 *
 * @class ExternalServiceException
 * @extends ApplicationException
 *
 * @example
 * ```typescript
 * throw new ExternalServiceException(
 *   'HL7 interface unavailable',
 *   'HL7_SERVICE_DOWN',
 *   503,
 *   { serviceName: 'HL7-Gateway', endpoint: '/api/adt' },
 *   true // isRetryable
 * );
 * ```
 */
export declare class ExternalServiceException extends ApplicationException {
    readonly isRetryable: boolean;
    readonly serviceName: string;
    constructor(message: string, code: string, statusCode: number, context?: ErrorContext & {
        serviceName?: string;
    }, isRetryable?: boolean, severity?: ErrorSeverity);
}
/**
 * HIPAA compliance violation exception
 *
 * @class HIPAAViolationException
 * @extends ApplicationException
 *
 * @example
 * ```typescript
 * throw new HIPAAViolationException(
 *   'Unauthorized PHI access attempt',
 *   'HIPAA_UNAUTHORIZED_ACCESS',
 *   { userId: 'U-123', patientId: 'P-456', action: 'READ' }
 * );
 * ```
 */
export declare class HIPAAViolationException extends ApplicationException {
    constructor(message: string, code: string, context?: ErrorContext);
}
/**
 * Data integrity exception for validation and constraint violations
 *
 * @class DataIntegrityException
 * @extends ApplicationException
 *
 * @example
 * ```typescript
 * throw new DataIntegrityException(
 *   'Duplicate patient MRN',
 *   'DUPLICATE_MRN',
 *   { mrn: '12345', facilityId: 'F-001' },
 *   [{ field: 'mrn', message: 'MRN already exists', constraint: 'unique' }]
 * );
 * ```
 */
export declare class DataIntegrityException extends ApplicationException {
    readonly details: ErrorDetails[];
    constructor(message: string, code: string, context?: ErrorContext, details?: ErrorDetails[]);
}
/**
 * Serializes error to standardized format with healthcare compliance
 *
 * @param {Error} error - Error to serialize
 * @param {Partial<SanitizationConfig>} [config] - Sanitization configuration
 * @returns {SerializedError} Serialized error object
 *
 * @example
 * ```typescript
 * const serialized = serializeError(error, {
 *   includeStack: false,
 *   sanitizePHI: true,
 *   maxStackFrames: 10
 * });
 * ```
 */
export declare const serializeError: (error: Error, config?: Partial<SanitizationConfig>) => SerializedError;
/**
 * Transforms database errors to application exceptions
 *
 * @param {Error} dbError - Database error
 * @param {ErrorContext} [context] - Additional context
 * @returns {ApplicationException} Transformed application exception
 *
 * @example
 * ```typescript
 * try {
 *   await Patient.create({ mrn: duplicateMRN });
 * } catch (error) {
 *   throw transformDatabaseError(error, { facilityId: 'F-001' });
 * }
 * ```
 */
export declare const transformDatabaseError: (dbError: Error, context?: ErrorContext) => ApplicationException;
/**
 * Enriches error with correlation ID and trace information
 *
 * @param {Error} error - Error to enrich
 * @param {Request} req - Express request object
 * @param {Record<string, any>} [additionalContext] - Additional context
 * @returns {Error} Enriched error
 *
 * @example
 * ```typescript
 * const enriched = enrichErrorWithContext(error, req, {
 *   patientId: 'P-123',
 *   operationType: 'CREATE_PRESCRIPTION'
 * });
 * ```
 */
export declare const enrichErrorWithContext: (error: Error, req: Request, additionalContext?: Record<string, any>) => Error;
/**
 * Chains multiple error transformers
 *
 * @param {Error} error - Initial error
 * @param {Array<(error: Error) => Error>} transformers - Array of transformer functions
 * @returns {Error} Transformed error
 *
 * @example
 * ```typescript
 * const transformed = chainErrorTransformers(error, [
 *   (e) => transformDatabaseError(e),
 *   (e) => enrichErrorWithContext(e, req),
 *   (e) => sanitizeHealthcareError(e)
 * ]);
 * ```
 */
export declare const chainErrorTransformers: (error: Error, transformers: Array<(error: Error) => Error>) => Error;
/**
 * Creates error response for HTTP endpoints
 *
 * @param {Error} error - Error to convert to HTTP response
 * @param {Request} req - Express request object
 * @param {Partial<SanitizationConfig>} [config] - Sanitization config
 * @returns {SerializedError} HTTP error response
 *
 * @example
 * ```typescript
 * const response = createHttpErrorResponse(error, req, {
 *   includeStack: false,
 *   sanitizePHI: true
 * });
 * res.status(response.statusCode).json(response);
 * ```
 */
export declare const createHttpErrorResponse: (error: Error, req: Request, config?: Partial<SanitizationConfig>) => SerializedError;
/**
 * Sanitizes error context to remove PHI data
 *
 * @param {ErrorContext} [context] - Error context
 * @returns {Partial<ErrorContext>} Sanitized context
 *
 * @example
 * ```typescript
 * const sanitized = sanitizeContextPHI({
 *   patientId: 'P-123',
 *   userId: 'U-456',
 *   metadata: { ssn: '123-45-6789' }
 * });
 * // patientId and ssn are redacted
 * ```
 */
export declare const sanitizeContextPHI: (context?: ErrorContext) => Partial<ErrorContext> | undefined;
/**
 * Sanitizes stack trace for production use
 *
 * @param {string | undefined} stack - Stack trace
 * @param {Partial<SanitizationConfig>} config - Sanitization config
 * @returns {string | undefined} Sanitized stack trace
 *
 * @example
 * ```typescript
 * const sanitized = sanitizeStackTrace(error.stack, {
 *   maxStackFrames: 5,
 *   allowedPaths: ['/app/src']
 * });
 * ```
 */
export declare const sanitizeStackTrace: (stack: string | undefined, config: Partial<SanitizationConfig>) => string | undefined;
/**
 * Removes sensitive data from error objects
 *
 * @param {Error} error - Error to sanitize
 * @param {string[]} [sensitiveFields] - Fields to redact
 * @returns {Error} Sanitized error
 *
 * @example
 * ```typescript
 * const sanitized = removeSensitiveData(error, [
 *   'password', 'apiKey', 'token', 'ssn', 'creditCard'
 * ]);
 * ```
 */
export declare const removeSensitiveData: (error: Error, sensitiveFields?: string[]) => Error;
/**
 * Sanitizes healthcare-specific errors for logging and display
 *
 * @param {Error} error - Error to sanitize
 * @returns {Error} Sanitized error
 *
 * @example
 * ```typescript
 * const sanitized = sanitizeHealthcareError(error);
 * logger.error(sanitized); // Safe to log without PHI
 * ```
 */
export declare const sanitizeHealthcareError: (error: Error) => Error;
/**
 * Redacts patterns from error messages using regex
 *
 * @param {string} message - Error message
 * @param {RegExp[]} [patterns] - Patterns to redact
 * @returns {string} Redacted message
 *
 * @example
 * ```typescript
 * const redacted = redactPatterns(
 *   'Error with email user@example.com and SSN 123-45-6789',
 *   [/\b\d{3}-\d{2}-\d{4}\b/g, /\b[\w\.-]+@[\w\.-]+\.\w+\b/g]
 * );
 * // Result: 'Error with email [REDACTED] and SSN [REDACTED]'
 * ```
 */
export declare const redactPatterns: (message: string, patterns?: RegExp[]) => string;
/**
 * Retries operation with exponential backoff
 *
 * @param {Function} operation - Operation to retry
 * @param {Partial<RetryConfig>} [config] - Retry configuration
 * @returns {Promise<T>} Operation result
 *
 * @example
 * ```typescript
 * const result = await retryWithExponentialBackoff(
 *   () => fetchPatientData(patientId),
 *   {
 *     maxAttempts: 3,
 *     baseDelay: 1000,
 *     maxDelay: 10000,
 *     backoffMultiplier: 2,
 *     onRetry: (error, attempt, delay) => {
 *       console.log(`Retry ${attempt} after ${delay}ms`);
 *     }
 *   }
 * );
 * ```
 */
export declare const retryWithExponentialBackoff: <T>(operation: () => Promise<T>, config?: Partial<RetryConfig>) => Promise<T>;
/**
 * Creates retry decorator for methods
 *
 * @param {Partial<RetryConfig>} config - Retry configuration
 * @returns {MethodDecorator} Method decorator
 *
 * @example
 * ```typescript
 * class PatientService {
 *   @Retry({ maxAttempts: 3, baseDelay: 1000 })
 *   async fetchPatient(id: string) {
 *     return await this.patientRepository.findById(id);
 *   }
 * }
 * ```
 */
export declare const Retry: (config?: Partial<RetryConfig>) => MethodDecorator;
/**
 * Determines if error is retryable
 *
 * @param {Error} error - Error to check
 * @returns {boolean} True if retryable
 *
 * @example
 * ```typescript
 * if (isRetryableError(error)) {
 *   await retryOperation();
 * } else {
 *   throw error;
 * }
 * ```
 */
export declare const isRetryableError: (error: Error) => boolean;
/**
 * Calculates jittered delay to prevent thundering herd
 *
 * @param {number} baseDelay - Base delay in milliseconds
 * @param {number} [jitterFactor=0.1] - Jitter factor (0-1)
 * @returns {number} Jittered delay
 *
 * @example
 * ```typescript
 * const delay = calculateJitteredDelay(1000, 0.2);
 * await sleep(delay); // 800-1200ms
 * ```
 */
export declare const calculateJitteredDelay: (baseDelay: number, jitterFactor?: number) => number;
/**
 * Creates retry policy based on error type
 *
 * @param {Error} error - Error to analyze
 * @returns {Partial<RetryConfig>} Recommended retry config
 *
 * @example
 * ```typescript
 * const policy = createRetryPolicy(error);
 * await retryWithExponentialBackoff(operation, policy);
 * ```
 */
export declare const createRetryPolicy: (error: Error) => Partial<RetryConfig>;
/**
 * Creates circuit breaker instance
 *
 * @param {Partial<CircuitBreakerConfig>} [config] - Circuit breaker config
 * @returns {CircuitBreakerInstance} Circuit breaker instance
 *
 * @example
 * ```typescript
 * const breaker = createCircuitBreaker({
 *   failureThreshold: 5,
 *   successThreshold: 2,
 *   timeout: 60000,
 *   halfOpenDelay: 5000,
 *   onStateChange: (from, to) => {
 *     console.log(`Circuit breaker: ${from} -> ${to}`);
 *   }
 * });
 *
 * const result = await breaker.execute(() => externalAPICall());
 * ```
 */
export declare const createCircuitBreaker: (config?: Partial<CircuitBreakerConfig>) => CircuitBreakerInstance;
/**
 * Creates circuit breaker decorator for methods
 *
 * @param {Partial<CircuitBreakerConfig>} [config] - Circuit breaker config
 * @returns {MethodDecorator} Method decorator
 *
 * @example
 * ```typescript
 * class ExternalAPIService {
 *   @CircuitBreaker({ failureThreshold: 5, timeout: 60000 })
 *   async fetchData(endpoint: string) {
 *     return await this.httpClient.get(endpoint);
 *   }
 * }
 * ```
 */
export declare const CircuitBreaker: (config?: Partial<CircuitBreakerConfig>) => MethodDecorator;
/**
 * Monitors circuit breaker health
 *
 * @param {CircuitBreakerInstance} breaker - Circuit breaker instance
 * @returns {object} Health status
 *
 * @example
 * ```typescript
 * const health = monitorCircuitBreakerHealth(breaker);
 * console.log(`Circuit state: ${health.state}, Health: ${health.healthScore}`);
 * ```
 */
export declare const monitorCircuitBreakerHealth: (breaker: CircuitBreakerInstance) => {
    state: CircuitState;
    healthScore: number;
    isHealthy: boolean;
    stats: CircuitBreakerStats;
};
/**
 * Creates multiple circuit breakers for different services
 *
 * @param {Record<string, Partial<CircuitBreakerConfig>>} configs - Configs by service name
 * @returns {Record<string, CircuitBreakerInstance>} Circuit breakers by service
 *
 * @example
 * ```typescript
 * const breakers = createMultipleCircuitBreakers({
 *   hl7Gateway: { failureThreshold: 5, timeout: 60000 },
 *   fhirAPI: { failureThreshold: 3, timeout: 30000 },
 *   labInterface: { failureThreshold: 10, timeout: 120000 }
 * });
 *
 * await breakers.hl7Gateway.execute(() => sendHL7Message(msg));
 * ```
 */
export declare const createMultipleCircuitBreakers: (configs: Record<string, Partial<CircuitBreakerConfig>>) => Record<string, CircuitBreakerInstance>;
/**
 * Combines circuit breaker with retry logic
 *
 * @param {Function} operation - Operation to execute
 * @param {CircuitBreakerInstance} breaker - Circuit breaker
 * @param {Partial<RetryConfig>} [retryConfig] - Retry configuration
 * @returns {Promise<T>} Operation result
 *
 * @example
 * ```typescript
 * const result = await executeWithCircuitBreakerAndRetry(
 *   () => externalAPICall(),
 *   circuitBreaker,
 *   { maxAttempts: 3, baseDelay: 1000 }
 * );
 * ```
 */
export declare const executeWithCircuitBreakerAndRetry: <T>(operation: () => Promise<T>, breaker: CircuitBreakerInstance, retryConfig?: Partial<RetryConfig>) => Promise<T>;
/**
 * Executes operation with fallback
 *
 * @param {Function} primary - Primary operation
 * @param {Function} fallback - Fallback operation
 * @param {Partial<FallbackOptions>} [options] - Fallback options
 * @returns {Promise<T>} Result from primary or fallback
 *
 * @example
 * ```typescript
 * const data = await executeWithFallback(
 *   () => fetchFromPrimaryDB(patientId),
 *   () => fetchFromCache(patientId),
 *   { timeout: 5000, logFallback: true }
 * );
 * ```
 */
export declare const executeWithFallback: <T>(primary: () => Promise<T>, fallback: () => Promise<T>, options?: Partial<FallbackOptions>) => Promise<T>;
/**
 * Executes operation with multiple fallback levels
 *
 * @param {Array<() => Promise<T>>} operations - Operations in priority order
 * @param {Partial<FallbackOptions>} [options] - Fallback options
 * @returns {Promise<T>} Result from first successful operation
 *
 * @example
 * ```typescript
 * const data = await executeWithFallbackChain([
 *   () => fetchFromPrimaryDB(patientId),
 *   () => fetchFromReplicaDB(patientId),
 *   () => fetchFromCache(patientId),
 *   () => getDefaultPatientData()
 * ]);
 * ```
 */
export declare const executeWithFallbackChain: <T>(operations: Array<() => Promise<T>>, options?: Partial<FallbackOptions>) => Promise<T>;
/**
 * Creates degraded response when feature unavailable
 *
 * @param {string} feature - Feature name
 * @param {any} [partialData] - Partial data if available
 * @param {string} [reason] - Degradation reason
 * @returns {object} Degraded response
 *
 * @example
 * ```typescript
 * return createDegradedResponse(
 *   'PatientRecommendations',
 *   { defaultRecommendations: ['rec1', 'rec2'] },
 *   'ML service unavailable'
 * );
 * ```
 */
export declare const createDegradedResponse: <T = any>(feature: string, partialData?: T, reason?: string) => {
    status: "degraded";
    feature: string;
    message: string;
    reason?: string;
    data?: T;
    timestamp: string;
};
/**
 * Implements graceful degradation with timeout
 *
 * @param {Function} operation - Operation to execute
 * @param {Function} degradedFallback - Degraded mode fallback
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<T>} Result or degraded response
 *
 * @example
 * ```typescript
 * const result = await executeWithGracefulDegradation(
 *   () => generatePersonalizedReport(patientId),
 *   () => generateStandardReport(patientId),
 *   5000
 * );
 * ```
 */
export declare const executeWithGracefulDegradation: <T>(operation: () => Promise<T>, degradedFallback: () => Promise<T>, timeout: number) => Promise<T>;
/**
 * Creates fallback cache for service failures
 *
 * @param {Function} operation - Primary operation
 * @param {string} cacheKey - Cache key
 * @param {number} [ttl=300000] - Cache TTL in milliseconds
 * @returns {Promise<T>} Result from operation or cache
 *
 * @example
 * ```typescript
 * const data = await executeWithCacheFallback(
 *   () => fetchPatientData(patientId),
 *   `patient:${patientId}`,
 *   300000
 * );
 * ```
 */
export declare const executeWithCacheFallback: <T>(operation: () => Promise<T>, cacheKey: string, ttl?: number) => Promise<T>;
/**
 * Creates error recovery pipeline
 *
 * @param {ErrorRecoveryPipeline} pipeline - Recovery pipeline config
 * @returns {Promise<void>} Recovery execution result
 *
 * @example
 * ```typescript
 * await executeErrorRecoveryPipeline({
 *   errorCode: 'DB_CONNECTION_ERROR',
 *   actions: [
 *     {
 *       name: 'CloseStaleConnections',
 *       execute: async () => { await closeStaleConnections(); }
 *     },
 *     {
 *       name: 'ReconnectToDatabase',
 *       execute: async () => { await reconnectToDatabase(); }
 *     },
 *     {
 *       name: 'VerifyConnection',
 *       execute: async () => { await verifyDatabaseConnection(); }
 *     }
 *   ],
 *   timeout: 30000
 * });
 * ```
 */
export declare const executeErrorRecoveryPipeline: (pipeline: ErrorRecoveryPipeline) => Promise<void>;
/**
 * Auto-recovers from common database errors
 *
 * @param {Error} error - Database error
 * @param {Function} operation - Operation to retry after recovery
 * @returns {Promise<T>} Operation result
 *
 * @example
 * ```typescript
 * try {
 *   return await dbQuery();
 * } catch (error) {
 *   return await autoRecoverDatabaseError(error, () => dbQuery());
 * }
 * ```
 */
export declare const autoRecoverDatabaseError: <T>(error: Error, operation: () => Promise<T>) => Promise<T>;
/**
 * Implements health check based recovery
 *
 * @param {Function} healthCheck - Health check function
 * @param {Function} recovery - Recovery function
 * @param {number} [maxAttempts=3] - Max recovery attempts
 * @returns {Promise<boolean>} Recovery success status
 *
 * @example
 * ```typescript
 * const recovered = await healthCheckRecovery(
 *   async () => await database.ping(),
 *   async () => await database.reconnect(),
 *   3
 * );
 * ```
 */
export declare const healthCheckRecovery: (healthCheck: () => Promise<boolean>, recovery: () => Promise<void>, maxAttempts?: number) => Promise<boolean>;
/**
 * Implements automatic service restart on critical errors
 *
 * @param {Error} error - Critical error
 * @param {Function} restartService - Service restart function
 * @param {number} [cooldown=5000] - Cooldown before restart
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * try {
 *   await criticalOperation();
 * } catch (error) {
 *   if (isCriticalError(error)) {
 *     await autoRestartService(error, () => restartMessageQueue());
 *   }
 * }
 * ```
 */
export declare const autoRestartService: (error: Error, restartService: () => Promise<void>, cooldown?: number) => Promise<void>;
/**
 * Creates recovery strategy based on error pattern
 *
 * @param {Error} error - Error to analyze
 * @returns {ErrorRecoveryPipeline | null} Recovery pipeline or null
 *
 * @example
 * ```typescript
 * const pipeline = createRecoveryStrategy(error);
 * if (pipeline) {
 *   await executeErrorRecoveryPipeline(pipeline);
 * }
 * ```
 */
export declare const createRecoveryStrategy: (error: Error) => ErrorRecoveryPipeline | null;
/**
 * Aggregates errors by code and category
 *
 * @param {Error[]} errors - Errors to aggregate
 * @param {number} [windowMs=3600000] - Time window in milliseconds
 * @returns {Map<string, ErrorAggregation>} Aggregated errors
 *
 * @example
 * ```typescript
 * const aggregation = aggregateErrors(recentErrors, 3600000);
 * aggregation.forEach((stats, code) => {
 *   console.log(`${code}: ${stats.count} occurrences, trend: ${stats.trend}`);
 * });
 * ```
 */
export declare const aggregateErrors: (errors: Error[], windowMs?: number) => Map<string, ErrorAggregation>;
/**
 * Detects error spikes and anomalies
 *
 * @param {Map<string, ErrorAggregation>} aggregation - Error aggregation
 * @param {number} [threshold=2.0] - Spike threshold multiplier
 * @returns {Array<{code: string; spike: boolean; severity: string}>} Spike detection results
 *
 * @example
 * ```typescript
 * const spikes = detectErrorSpikes(aggregation, 2.5);
 * spikes.filter(s => s.spike).forEach(spike => {
 *   console.log(`ALERT: Error spike detected for ${spike.code}`);
 * });
 * ```
 */
export declare const detectErrorSpikes: (aggregation: Map<string, ErrorAggregation>, threshold?: number) => Array<{
    code: string;
    spike: boolean;
    severity: string;
    count: number;
}>;
/**
 * Groups errors by time window
 *
 * @param {Error[]} errors - Errors to group
 * @param {number} windowMs - Window size in milliseconds
 * @returns {Map<string, Error[]>} Errors grouped by time window
 *
 * @example
 * ```typescript
 * const grouped = groupErrorsByTimeWindow(errors, 60000); // 1 minute windows
 * grouped.forEach((windowErrors, timestamp) => {
 *   console.log(`${timestamp}: ${windowErrors.length} errors`);
 * });
 * ```
 */
export declare const groupErrorsByTimeWindow: (errors: Error[], windowMs: number) => Map<string, Error[]>;
/**
 * Calculates error rate metrics
 *
 * @param {Error[]} errors - Errors to analyze
 * @param {number} totalRequests - Total number of requests
 * @returns {object} Error rate metrics
 *
 * @example
 * ```typescript
 * const metrics = calculateErrorRateMetrics(errors, 10000);
 * console.log(`Error rate: ${metrics.errorRate}%`);
 * console.log(`Critical errors: ${metrics.criticalErrorRate}%`);
 * ```
 */
export declare const calculateErrorRateMetrics: (errors: Error[], totalRequests: number) => {
    errorRate: number;
    criticalErrorRate: number;
    errorsByCategory: Record<ErrorCategory, number>;
    errorsBySeverity: Record<ErrorSeverity, number>;
};
/**
 * Generates error monitoring report
 *
 * @param {Error[]} errors - Errors to analyze
 * @param {number} windowMs - Analysis window in milliseconds
 * @returns {object} Comprehensive error report
 *
 * @example
 * ```typescript
 * const report = generateErrorReport(recentErrors, 3600000);
 * console.log(`Total errors: ${report.summary.totalErrors}`);
 * console.log(`Top error: ${report.topErrors[0].code}`);
 * ```
 */
export declare const generateErrorReport: (errors: Error[], windowMs: number) => {
    summary: {
        totalErrors: number;
        uniqueErrorCodes: number;
        criticalErrors: number;
        affectedUsers: number;
        timeWindow: string;
    };
    topErrors: Array<{
        code: string;
        count: number;
        severity: ErrorSeverity;
    }>;
    trends: Map<string, ErrorAggregation>;
    spikes: Array<{
        code: string;
        spike: boolean;
        severity: string;
    }>;
};
/**
 * Sends error notification through configured channels
 *
 * @param {Error} error - Error to notify
 * @param {Partial<ErrorNotificationConfig>} config - Notification config
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await notifyError(error, {
 *   enabled: true,
 *   channels: [NotificationChannel.SLACK, NotificationChannel.PAGER_DUTY],
 *   severityThreshold: ErrorSeverity.HIGH,
 *   sanitizePHI: true
 * });
 * ```
 */
export declare const notifyError: (error: Error, config: Partial<ErrorNotificationConfig>) => Promise<void>;
/**
 * Rate limits error notifications
 *
 * @param {string} errorCode - Error code to rate limit
 * @param {Partial<ErrorRateLimitConfig>} config - Rate limit config
 * @returns {boolean} True if notification should be sent
 *
 * @example
 * ```typescript
 * if (shouldSendNotification(error.code, {
 *   maxErrorsPerMinute: 10,
 *   maxSameErrorPerMinute: 3
 * })) {
 *   await notifyError(error, notificationConfig);
 * }
 * ```
 */
export declare const shouldSendNotification: (errorCode: string, config: Partial<ErrorRateLimitConfig>) => boolean;
/**
 * Creates alert severity mapping
 *
 * @param {ErrorSeverity} severity - Error severity
 * @returns {string} Alert severity for external systems
 *
 * @example
 * ```typescript
 * const alertSeverity = mapToAlertSeverity(ErrorSeverity.CRITICAL);
 * // Returns: 'critical' for PagerDuty, Sentry, etc.
 * ```
 */
export declare const mapToAlertSeverity: (severity: ErrorSeverity) => "info" | "warning" | "error" | "critical";
/**
 * Formats error for user-friendly display
 *
 * @param {Error} error - Error to format
 * @param {string} [locale='en'] - Locale for message
 * @returns {string} User-friendly error message
 *
 * @example
 * ```typescript
 * const message = generateUserFriendlyMessage(error, 'en');
 * res.status(error.statusCode).json({ message });
 * ```
 */
export declare const generateUserFriendlyMessage: (error: Error, locale?: string) => string;
/**
 * Default export with all utilities
 */
declare const _default: {
    ApplicationException: typeof ApplicationException;
    HealthcareBusinessException: typeof HealthcareBusinessException;
    ExternalServiceException: typeof ExternalServiceException;
    HIPAAViolationException: typeof HIPAAViolationException;
    DataIntegrityException: typeof DataIntegrityException;
    serializeError: (error: Error, config?: Partial<SanitizationConfig>) => SerializedError;
    transformDatabaseError: (dbError: Error, context?: ErrorContext) => ApplicationException;
    enrichErrorWithContext: (error: Error, req: Request, additionalContext?: Record<string, any>) => Error;
    chainErrorTransformers: (error: Error, transformers: Array<(error: Error) => Error>) => Error;
    createHttpErrorResponse: (error: Error, req: Request, config?: Partial<SanitizationConfig>) => SerializedError;
    sanitizeContextPHI: (context?: ErrorContext) => Partial<ErrorContext> | undefined;
    sanitizeStackTrace: (stack: string | undefined, config: Partial<SanitizationConfig>) => string | undefined;
    removeSensitiveData: (error: Error, sensitiveFields?: string[]) => Error;
    sanitizeHealthcareError: (error: Error) => Error;
    redactPatterns: (message: string, patterns?: RegExp[]) => string;
    retryWithExponentialBackoff: <T>(operation: () => Promise<T>, config?: Partial<RetryConfig>) => Promise<T>;
    Retry: (config?: Partial<RetryConfig>) => MethodDecorator;
    isRetryableError: (error: Error) => boolean;
    calculateJitteredDelay: (baseDelay: number, jitterFactor?: number) => number;
    createRetryPolicy: (error: Error) => Partial<RetryConfig>;
    createCircuitBreaker: (config?: Partial<CircuitBreakerConfig>) => CircuitBreakerInstance;
    CircuitBreaker: (config?: Partial<CircuitBreakerConfig>) => MethodDecorator;
    monitorCircuitBreakerHealth: (breaker: CircuitBreakerInstance) => {
        state: CircuitState;
        healthScore: number;
        isHealthy: boolean;
        stats: CircuitBreakerStats;
    };
    createMultipleCircuitBreakers: (configs: Record<string, Partial<CircuitBreakerConfig>>) => Record<string, CircuitBreakerInstance>;
    executeWithCircuitBreakerAndRetry: <T>(operation: () => Promise<T>, breaker: CircuitBreakerInstance, retryConfig?: Partial<RetryConfig>) => Promise<T>;
    executeWithFallback: <T>(primary: () => Promise<T>, fallback: () => Promise<T>, options?: Partial<FallbackOptions>) => Promise<T>;
    executeWithFallbackChain: <T>(operations: Array<() => Promise<T>>, options?: Partial<FallbackOptions>) => Promise<T>;
    createDegradedResponse: <T = any>(feature: string, partialData?: T, reason?: string) => {
        status: "degraded";
        feature: string;
        message: string;
        reason?: string;
        data?: T;
        timestamp: string;
    };
    executeWithGracefulDegradation: <T>(operation: () => Promise<T>, degradedFallback: () => Promise<T>, timeout: number) => Promise<T>;
    executeWithCacheFallback: <T>(operation: () => Promise<T>, cacheKey: string, ttl?: number) => Promise<T>;
    executeErrorRecoveryPipeline: (pipeline: ErrorRecoveryPipeline) => Promise<void>;
    autoRecoverDatabaseError: <T>(error: Error, operation: () => Promise<T>) => Promise<T>;
    healthCheckRecovery: (healthCheck: () => Promise<boolean>, recovery: () => Promise<void>, maxAttempts?: number) => Promise<boolean>;
    autoRestartService: (error: Error, restartService: () => Promise<void>, cooldown?: number) => Promise<void>;
    createRecoveryStrategy: (error: Error) => ErrorRecoveryPipeline | null;
    aggregateErrors: (errors: Error[], windowMs?: number) => Map<string, ErrorAggregation>;
    detectErrorSpikes: (aggregation: Map<string, ErrorAggregation>, threshold?: number) => Array<{
        code: string;
        spike: boolean;
        severity: string;
        count: number;
    }>;
    groupErrorsByTimeWindow: (errors: Error[], windowMs: number) => Map<string, Error[]>;
    calculateErrorRateMetrics: (errors: Error[], totalRequests: number) => {
        errorRate: number;
        criticalErrorRate: number;
        errorsByCategory: Record<ErrorCategory, number>;
        errorsBySeverity: Record<ErrorSeverity, number>;
    };
    generateErrorReport: (errors: Error[], windowMs: number) => {
        summary: {
            totalErrors: number;
            uniqueErrorCodes: number;
            criticalErrors: number;
            affectedUsers: number;
            timeWindow: string;
        };
        topErrors: Array<{
            code: string;
            count: number;
            severity: ErrorSeverity;
        }>;
        trends: Map<string, ErrorAggregation>;
        spikes: Array<{
            code: string;
            spike: boolean;
            severity: string;
        }>;
    };
    notifyError: (error: Error, config: Partial<ErrorNotificationConfig>) => Promise<void>;
    shouldSendNotification: (errorCode: string, config: Partial<ErrorRateLimitConfig>) => boolean;
    mapToAlertSeverity: (severity: ErrorSeverity) => "info" | "warning" | "error" | "critical";
    generateUserFriendlyMessage: (error: Error, locale?: string) => string;
    ErrorSeverity: typeof ErrorSeverity;
    ErrorCategory: typeof ErrorCategory;
    CircuitState: typeof CircuitState;
    NotificationChannel: typeof NotificationChannel;
};
export default _default;
//# sourceMappingURL=error-handling-recovery-kit.d.ts.map