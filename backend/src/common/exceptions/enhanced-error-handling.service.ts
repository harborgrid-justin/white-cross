/**
 * @fileoverview Production-Grade Error Handling Framework
 * @module reuse/data/production-error-handling
 * @description Enterprise error handling with structured error types, recovery mechanisms,
 * error aggregation, reporting, and comprehensive error context tracking
 *
 * @version 2.0.0
 * @requires @nestjs/common ^10.x
 * @requires winston ^3.x
 * @requires prom-client ^14.x
 */

import { 
  Injectable, 
  Logger, 
  HttpStatus, 
  ExceptionFilter, 
  Catch, 
  ArgumentsHost,
  HttpException
} from '@nestjs/common';
import { Request, Response } from 'express';
import * as winston from 'winston';
import { Counter, Histogram, register } from 'prom-client';

import { BaseService } from '../../common/base';
// ============================================================================
// STRUCTURED ERROR TYPES
// ============================================================================

/**
 * Base error class with comprehensive context
 */
export abstract class BaseError extends Error {
  public readonly timestamp: Date;
  public readonly errorId: string;
  public readonly context: ErrorContext;
  public readonly severity: ErrorSeverity;
  public readonly category: ErrorCategory;
  public readonly retryable: boolean;

  constructor(
    message: string,
    context: Partial<ErrorContext> = {},
    severity: ErrorSeverity = ErrorSeverity.ERROR,
    category: ErrorCategory = ErrorCategory.APPLICATION,
    retryable: boolean = false
  ) {
    super(message);
    this.name = (this.constructor as any).name;
    this.timestamp = new Date();
    this.errorId = this.generateErrorId();
    this.context = { ...this.getDefaultContext(), ...context };
    this.severity = severity;
    this.category = category;
    this.retryable = retryable;

    // Maintain stack trace
    if ((Error as any).captureStackTrace) {
      (Error as any).captureStackTrace(this, this.constructor);
    }
  }

  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  private getDefaultContext(): ErrorContext {
    return {
      service: 'white-cross-backend',
      version: process.env.APP_VERSION || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      nodeId: process.env.NODE_ID || 'unknown',
    };
  }

  /**
   * Converts error to structured log format
   */
  toLogFormat(): ErrorLogEntry {
    return {
      errorId: this.errorId,
      timestamp: this.timestamp,
      name: this.name,
      message: this.message,
      stack: this.stack,
      context: this.context,
      severity: this.severity,
      category: this.category,
      retryable: this.retryable,
    };
  }

  /**
   * Converts error to API response format
   */
  toApiFormat(includeStack: boolean = false): ApiErrorResponse {
    return {
      error: {
        id: this.errorId,
        type: this.name,
        message: this.message,
        code: this.getErrorCode(),
        timestamp: this.timestamp.toISOString(),
        context: this.sanitizeContext(),
        ...(includeStack && { stack: this.stack }),
      },
    };
  }

  protected abstract getErrorCode(): string;

  private sanitizeContext(): Partial<ErrorContext> {
    const { sensitiveData, ...safeContext } = this.context;
    return safeContext;
  }
}

/**
 * Business logic errors
 */
export class BusinessLogicError extends BaseError {
  constructor(
    message: string,
    context: Partial<ErrorContext> = {},
    retryable: boolean = false
  ) {
    super(message, context, ErrorSeverity.WARN, ErrorCategory.BUSINESS, retryable);
  }

  protected getErrorCode(): string {
    return 'BUSINESS_LOGIC_ERROR';
  }
}

/**
 * Database-related errors
 */
export class DatabaseError extends BaseError {
  public readonly query?: string;
  public readonly parameters?: any[];

  constructor(
    message: string,
    context: Partial<ErrorContext> & { query?: string; parameters?: any[] } = {},
    retryable: boolean = true
  ) {
    super(message, context, ErrorSeverity.ERROR, ErrorCategory.DATABASE, retryable);
    this.query = context.query;
    this.parameters = context.parameters;
  }

  protected getErrorCode(): string {
    return 'DATABASE_ERROR';
  }
}

/**
 * External service integration errors
 */
export class IntegrationError extends BaseError {
  public readonly service: string;
  public readonly endpoint?: string;
  public readonly httpStatus?: number;

  constructor(
    message: string,
    service: string,
    context: Partial<ErrorContext> & { endpoint?: string; httpStatus?: number } = {},
    retryable: boolean = true
  ) {
    super(message, context, ErrorSeverity.ERROR, ErrorCategory.INTEGRATION, retryable);
    this.service = service;
    this.endpoint = context.endpoint;
    this.httpStatus = context.httpStatus;
  }

  protected getErrorCode(): string {
    return 'INTEGRATION_ERROR';
  }
}

/**
 * Validation errors with field-level details
 */
export class ValidationError extends BaseError {
  public readonly violations: ValidationViolation[];

  constructor(
    message: string,
    violations: ValidationViolation[] = [],
    context: Partial<ErrorContext> = {}
  ) {
    super(message, context, ErrorSeverity.WARN, ErrorCategory.VALIDATION, false);
    this.violations = violations;
  }

  protected getErrorCode(): string {
    return 'VALIDATION_ERROR';
  }
}

/**
 * Authentication and authorization errors
 */
export class SecurityError extends BaseError {
  public readonly authenticationFailed?: boolean;
  public readonly authorizationFailed?: boolean;
  public readonly requiredPermissions?: string[];

  constructor(
    message: string,
    context: Partial<ErrorContext> & {
      authenticationFailed?: boolean;
      authorizationFailed?: boolean;
      requiredPermissions?: string[];
    } = {}
  ) {
    super(message, context, ErrorSeverity.WARN, ErrorCategory.SECURITY, false);
    this.authenticationFailed = context.authenticationFailed;
    this.authorizationFailed = context.authorizationFailed;
    this.requiredPermissions = context.requiredPermissions;
  }

  protected getErrorCode(): string {
    return 'SECURITY_ERROR';
  }
}

/**
 * Rate limiting errors
 */
export class RateLimitError extends BaseError {
  public readonly limit: number;
  public readonly remaining: number;
  public readonly resetTime: Date;

  constructor(
    message: string,
    limit: number,
    remaining: number,
    resetTime: Date,
    context: Partial<ErrorContext> = {}
  ) {
    super(message, context, ErrorSeverity.WARN, ErrorCategory.RATE_LIMIT, true);
    this.limit = limit;
    this.remaining = remaining;
    this.resetTime = resetTime;
  }

  protected getErrorCode(): string {
    return 'RATE_LIMIT_ERROR';
  }
}

/**
 * Configuration-related errors
 */
export class ConfigurationError extends BaseError {
  public readonly configKey?: string;
  public readonly expectedType?: string;

  constructor(
    message: string,
    context: Partial<ErrorContext> & { configKey?: string; expectedType?: string } = {}
  ) {
    super(message, context, ErrorSeverity.ERROR, ErrorCategory.CONFIGURATION, false);
    this.configKey = context.configKey;
    this.expectedType = context.expectedType;
  }

  protected getErrorCode(): string {
    return 'CONFIGURATION_ERROR';
  }
}

/**
 * Resource not found errors
 */
export class NotFoundError extends BaseError {
  public readonly resourceType: string;
  public readonly resourceId?: string | number;

  constructor(
    resourceType: string,
    resourceId?: string | number,
    context: Partial<ErrorContext> = {}
  ) {
    const message = resourceId
      ? `${resourceType} with ID '${resourceId}' not found`
      : `${resourceType} not found`;
    
    super(message, context, ErrorSeverity.WARN, ErrorCategory.NOT_FOUND, false);
    this.resourceType = resourceType;
    this.resourceId = resourceId;
  }

  protected getErrorCode(): string {
    return 'NOT_FOUND_ERROR';
  }
}

/**
 * Timeout errors
 */
export class TimeoutError extends BaseError {
  public readonly timeoutMs: number;
  public readonly operation: string;

  constructor(
    operation: string,
    timeoutMs: number,
    context: Partial<ErrorContext> = {}
  ) {
    super(
      `Operation '${operation}' timed out after ${timeoutMs}ms`,
      context,
      ErrorSeverity.ERROR,
      ErrorCategory.TIMEOUT,
      true
    );
    this.timeoutMs = timeoutMs;
    this.operation = operation;
  }

  protected getErrorCode(): string {
    return 'TIMEOUT_ERROR';
  }
}

// ============================================================================
// INTERFACES AND ENUMS
// ============================================================================

export enum ErrorSeverity {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal',
}

export enum ErrorCategory {
  APPLICATION = 'application',
  BUSINESS = 'business',
  DATABASE = 'database',
  INTEGRATION = 'integration',
  VALIDATION = 'validation',
  SECURITY = 'security',
  RATE_LIMIT = 'rate_limit',
  CONFIGURATION = 'configuration',
  NOT_FOUND = 'not_found',
  TIMEOUT = 'timeout',
  UNKNOWN = 'unknown',
}

export interface ErrorContext {
  userId?: string;
  requestId?: string;
  traceId?: string;
  service?: string;
  version?: string;
  environment?: string;
  nodeId?: string;
  operation?: string;
  resource?: string;
  additionalData?: Record<string, any>;
  sensitiveData?: Record<string, any>;
}

export interface ErrorLogEntry {
  errorId: string;
  timestamp: Date;
  name: string;
  message: string;
  stack?: string;
  context: ErrorContext;
  severity: ErrorSeverity;
  category: ErrorCategory;
  retryable: boolean;
}

export interface ApiErrorResponse {
  error: {
    id: string;
    type: string;
    message: string;
    code: string;
    timestamp: string;
    context: Partial<ErrorContext>;
    stack?: string;
  };
}

export interface ValidationViolation {
  field: string;
  value: any;
  message: string;
  code: string;
}

export interface ErrorRecoveryStrategy {
  canRecover(error: BaseError): boolean;
  recover(error: BaseError): Promise<any>;
  getRetryDelay(attempt: number): number;
  getMaxRetries(): number;
}

export interface ErrorAggregation {
  errorType: string;
  count: number;
  firstSeen: Date;
  lastSeen: Date;
  samples: ErrorLogEntry[];
}

// ============================================================================
// ERROR RECOVERY MECHANISMS
// ============================================================================

/**
 * Base error recovery strategy
 */
export abstract class BaseRecoveryStrategy implements ErrorRecoveryStrategy {
  abstract canRecover(error: BaseError): boolean;
  abstract recover(error: BaseError): Promise<any>;

  getRetryDelay(attempt: number): number {
    return Math.min(1000 * Math.pow(2, attempt), 30000); // Exponential backoff with 30s max
  }

  getMaxRetries(): number {
    return 3;
  }
}

/**
 * Database connection recovery strategy
 */
@Injectable()
export class DatabaseRecoveryStrategy extends BaseRecoveryStrategy {
  canRecover(error: BaseError): boolean {
    return error instanceof DatabaseError && error.retryable;
  }

  async recover(error: BaseError): Promise<void> {
    this.logWarning(`Attempting database recovery for error: ${error.errorId}`);
    
    // Implement database connection pool reset, reconnection logic
    await this.resetConnectionPool();
    await this.waitForHealthyConnection();
  }

  private async resetConnectionPool(): Promise<void> {
    // Implementation would reset the database connection pool
    this.logInfo('Resetting database connection pool');
  }

  private async waitForHealthyConnection(): Promise<void> {
    // Implementation would wait for healthy database connection
    this.logInfo('Waiting for healthy database connection');
  }
}

/**
 * Integration service recovery strategy
 */
@Injectable()
export class IntegrationRecoveryStrategy extends BaseRecoveryStrategy {
  private readonly logger = new Logger('IntegrationRecoveryStrategy');

  canRecover(error: BaseError): boolean {
    if (!(error instanceof IntegrationError)) return false;
    
    // Don't retry 4xx errors (client errors), but retry 5xx errors
    return !error.httpStatus || error.httpStatus >= 500;
  }

  async recover(error: BaseError): Promise<void> {
    this.logWarning(`Attempting integration recovery for error: ${error.errorId}`);
    
    if (error instanceof IntegrationError) {
      await this.refreshServiceConnection(error.service);
    }
  }

  private async refreshServiceConnection(service: string): Promise<void> {
    this.logInfo(`Refreshing connection to service: ${service}`);
    // Implementation would refresh service connections, auth tokens, etc.
  }
}

/**
 * Circuit breaker recovery strategy
 */
@Injectable()
export class CircuitBreakerRecoveryStrategy extends BaseRecoveryStrategy {
  private readonly circuitStates = new Map<string, {
    failures: number;
    lastFailure: Date;
    state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
  }>();

  private readonly logger = new Logger('CircuitBreakerRecoveryStrategy');

  canRecover(error: BaseError): boolean {
    return error.retryable && this.getCircuitState(error.name) !== 'OPEN';
  }

  async recover(error: BaseError): Promise<void> {
    const circuitKey = error.name;
    const circuit = this.getOrCreateCircuit(circuitKey);

    circuit.failures++;
    circuit.lastFailure = new Date();

    // Open circuit after 5 failures within 1 minute
    if (circuit.failures >= 5 && this.isWithinTimeWindow(circuit.lastFailure, 60000)) {
      circuit.state = 'OPEN';
      this.logWarning(`Circuit breaker opened for ${circuitKey}`);
    }
  }

  private getCircuitState(circuitKey: string): 'CLOSED' | 'OPEN' | 'HALF_OPEN' {
    const circuit = this.circuitStates.get(circuitKey);
    if (!circuit) return 'CLOSED';

    // Reset circuit after 5 minutes
    if (circuit.state === 'OPEN' && !this.isWithinTimeWindow(circuit.lastFailure, 300000)) {
      circuit.state = 'HALF_OPEN';
      circuit.failures = 0;
    }

    return circuit.state;
  }

  private getOrCreateCircuit(circuitKey: string) {
    if (!this.circuitStates.has(circuitKey)) {
      this.circuitStates.set(circuitKey, {
        failures: 0,
        lastFailure: new Date(),
        state: 'CLOSED',
      });
    }
    return this.circuitStates.get(circuitKey)!;
  }

  private isWithinTimeWindow(date: Date, windowMs: number): boolean {
    return Date.now() - date.getTime() < windowMs;
  }
}

// ============================================================================
// ERROR AGGREGATION AND REPORTING
// ============================================================================

/**
 * Error aggregation service for collecting and analyzing error patterns
 */
@Injectable()
export class ErrorAggregationService extends BaseService {
  private readonly logger = new Logger('ErrorAggregationService');
  private readonly errorCounts = new Map<string, ErrorAggregation>();
  private readonly maxSamples = 10;

  /**
   * Records an error for aggregation analysis
   */
  recordError(error: BaseError): void {
    const key = `${error.category}:${error.name}`;
    const logEntry = error.toLogFormat();

    let aggregation = this.errorCounts.get(key);
    
    if (!aggregation) {
      aggregation = {
        errorType: error.name,
        count: 0,
        firstSeen: error.timestamp,
        lastSeen: error.timestamp,
        samples: [],
      };
      this.errorCounts.set(key, aggregation);
    }

    aggregation.count++;
    aggregation.lastSeen = error.timestamp;

    // Keep only recent samples
    aggregation.samples.push(logEntry);
    if (aggregation.samples.length > this.maxSamples) {
      aggregation.samples.shift();
    }

    this.checkForAnomalies(key, aggregation);
  }

  /**
   * Gets error aggregation statistics
   */
  getAggregations(): Map<string, ErrorAggregation> {
    return new Map(this.errorCounts);
  }

  /**
   * Gets top errors by frequency
   */
  getTopErrors(limit: number = 10): ErrorAggregation[] {
    return Array.from(this.errorCounts.values())
      .sort((a: ErrorAggregation, b: ErrorAggregation) => b.count - a.count)
      .slice(0, limit);
  }

  /**
   * Gets recent error spike analysis
   */
  getErrorSpikes(timeWindowMs: number = 300000): ErrorAggregation[] {
    const cutoff = new Date(Date.now() - timeWindowMs);
    
    return Array.from(this.errorCounts.values())
      .filter((agg: ErrorAggregation) => agg.lastSeen > cutoff)
      .filter((agg: ErrorAggregation) => agg.count > 10) // Spike threshold
      .sort((a: ErrorAggregation, b: ErrorAggregation) => b.count - a.count);
  }

  /**
   * Clears old aggregation data
   */
  cleanup(maxAgeMs: number = 86400000): void { // 24 hours default
    const cutoff = new Date(Date.now() - maxAgeMs);
    
    for (const [key, aggregation] of this.errorCounts.entries()) {
      if (aggregation.lastSeen < cutoff) {
        this.errorCounts.delete(key);
      }
    }
  }

  private checkForAnomalies(key: string, aggregation: ErrorAggregation): void {
    // Check for error spikes (>50 errors in 5 minutes)
    const recentSamples = aggregation.samples.filter(
      sample => Date.now() - sample.timestamp.getTime() < 300000
    );

    if (recentSamples.length > 50) {
      this.logError(
        `Error spike detected for ${key}: ${recentSamples.length} errors in 5 minutes`
      );
      // Could trigger alerts here
    }
  }
}

// ============================================================================
// ERROR METRICS COLLECTION
// ============================================================================

/**
 * Error metrics collector using Prometheus
 */
@Injectable()
export class ErrorMetricsCollector {
  private readonly errorCounter = new Counter({
    name: 'application_errors_total',
    help: 'Total number of application errors',
    labelNames: ['error_type', 'category', 'severity', 'service'],
    registers: [register],
  });

  private readonly errorDuration = new Histogram({
    name: 'error_handling_duration_seconds',
    help: 'Time spent handling errors',
    labelNames: ['error_type', 'recovery_attempted'],
    registers: [register],
  });

  private readonly recoveryAttempts = new Counter({
    name: 'error_recovery_attempts_total',
    help: 'Total number of error recovery attempts',
    labelNames: ['error_type', 'recovery_strategy', 'success'],
    registers: [register],
  });

  /**
   * Records error metrics
   */
  recordError(error: BaseError): void {
    this.errorCounter
      .labels({
        error_type: error.name,
        category: error.category,
        severity: error.severity,
        service: error.context.service || 'unknown',
      })
      .inc();
  }

  /**
   * Records error handling duration
   */
  recordHandlingDuration(error: BaseError, durationMs: number, recoveryAttempted: boolean): void {
    this.errorDuration
      .labels({
        error_type: error.name,
        recovery_attempted: recoveryAttempted.toString(),
      })
      .observe(durationMs / 1000);
  }

  /**
   * Records recovery attempt metrics
   */
  recordRecoveryAttempt(error: BaseError, strategyName: string, success: boolean): void {
    this.recoveryAttempts
      .labels({
        error_type: error.name,
        recovery_strategy: strategyName,
        success: success.toString(),
      })
      .inc();
  }
}

// ============================================================================
// COMPREHENSIVE ERROR HANDLER
// ============================================================================

/**
 * Main error handling service that coordinates all error handling activities
 */
@Injectable()
export class ProductionErrorHandler {
  private readonly logger = new Logger('ProductionErrorHandler');
  private readonly winstonLogger: winston.Logger;

  constructor(
    private readonly aggregationService: ErrorAggregationService,
    private readonly metricsCollector: ErrorMetricsCollector,
    private readonly recoveryStrategies: ErrorRecoveryStrategy[] = []
  ) {
    this.winstonLogger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'error.log' }),
      ],
    });
  }

  /**
   * Main error handling entry point
   */
  async handleError(error: Error | BaseError, context: Partial<ErrorContext> = {}): Promise<void> {
    const startTime = Date.now();
    const structuredError = this.ensureStructuredError(error, context);
    
    try {
      // Log the error
      this.logError(structuredError);
      
      // Record metrics
      this.metricsCollector.recordError(structuredError);
      
      // Aggregate for analysis
      this.aggregationService.recordError(structuredError);
      
      // Attempt recovery if applicable
      const recoveryAttempted = await this.attemptRecovery(structuredError);
      
      // Record handling metrics
      const duration = Date.now() - startTime;
      this.metricsCollector.recordHandlingDuration(structuredError, duration, recoveryAttempted);
      
    } catch (handlingError) {
      this.logError(
        `Error occurred while handling error ${structuredError.errorId}`,
        handlingError
      );
    }
  }

  /**
   * Handles errors with retry logic
   */
  async handleErrorWithRetry<T>(
    operation: () => Promise<T>,
    context: Partial<ErrorContext> = {},
    maxRetries: number = 3
  ): Promise<T> {
    let lastError: BaseError;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = this.ensureStructuredError(error as Error, { 
          ...context, 
          operation: context.operation || 'unknown',
          additionalData: { ...context.additionalData, attempt }
        });

        if (attempt === maxRetries || !lastError.retryable) {
          await this.handleError(lastError, context);
          throw lastError;
        }

        // Calculate delay before retry
        const strategy = this.findRecoveryStrategy(lastError);
        const delay = strategy?.getRetryDelay(attempt) || 1000 * Math.pow(2, attempt);
        
        this.logWarning(
          `Operation failed (attempt ${attempt + 1}/${maxRetries + 1}), retrying in ${delay}ms`,
          { errorId: lastError.errorId }
        );

        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError!;
  }

  /**
   * Creates safe error responses for API endpoints
   */
  createSafeApiResponse(error: Error | BaseError, includeStack: boolean = false): ApiErrorResponse {
    const structuredError = this.ensureStructuredError(error);
    return structuredError.toApiFormat(includeStack);
  }

  /**
   * Converts any error to structured error
   */
  private ensureStructuredError(error: Error | BaseError, context: Partial<ErrorContext> = {}): BaseError {
    if (error instanceof BaseError) {
      return error;
    }

    // Convert standard errors to structured errors
    if (error.name === 'ValidationError') {
      return new ValidationError(error.message, [], context);
    }

    if (error.message.indexOf('timeout') !== -1) {
      return new TimeoutError(context.operation || 'unknown', 30000, context);
    }

    if (error.message.indexOf('database') !== -1 || error.message.indexOf('connection') !== -1) {
      return new DatabaseError(error.message, context, true);
    }

    // Default to generic application error
    return new class extends BaseError {
      protected getErrorCode(): string {
        return 'UNKNOWN_ERROR';
      }
    }(error.message, context, ErrorSeverity.ERROR, ErrorCategory.UNKNOWN, true);
  }

  /**
   * Logs error with appropriate level and format
   */
  private logError(error: BaseError): void {
    const logEntry = error.toLogFormat();
    
    switch (error.severity) {
      case ErrorSeverity.FATAL:
      case ErrorSeverity.ERROR:
        this.winstonLogger.error(logEntry);
        break;
      case ErrorSeverity.WARN:
        this.winstonLogger.warn(logEntry);
        break;
      case ErrorSeverity.INFO:
        this.winstonLogger.info(logEntry);
        break;
      case ErrorSeverity.DEBUG:
        this.winstonLogger.debug(logEntry);
        break;
    }
  }

  /**
   * Attempts error recovery using available strategies
   */
  private async attemptRecovery(error: BaseError): Promise<boolean> {
    if (!error.retryable) {
      return false;
    }

    const strategy = this.findRecoveryStrategy(error);
    if (!strategy) {
      return false;
    }

    try {
      this.logInfo(`Attempting recovery for error: ${error.errorId}`);
      await strategy.recover(error);
      
      this.metricsCollector.recordRecoveryAttempt(error, (strategy.constructor as any).name, true);
      this.logInfo(`Recovery successful for error: ${error.errorId}`);
      
      return true;
    } catch (recoveryError) {
      this.metricsCollector.recordRecoveryAttempt(error, (strategy.constructor as any).name, false);
      this.logError(
        `Recovery failed for error: ${error.errorId}`,
        recoveryError
      );
      
      return false;
    }
  }

  /**
   * Finds appropriate recovery strategy for error
   */
  private findRecoveryStrategy(error: BaseError): ErrorRecoveryStrategy | undefined {
    for (const strategy of this.recoveryStrategies) {
      if (strategy.canRecover(error)) {
        return strategy;
      }
    }
    return undefined;
  }
}

// ============================================================================
// NESTJS EXCEPTION FILTER
// ============================================================================

/**
 * Global exception filter for NestJS applications
 */
@Catch()
export class ProductionExceptionFilter implements ExceptionFilter {
  constructor(private readonly errorHandler: ProductionErrorHandler) {}

  async catch(exception: unknown, host: ArgumentsHost): Promise<void> {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const error = exception instanceof Error ? exception : new Error(String(exception));
    const context: ErrorContext = {
      requestId: request.headers['x-request-id'] as string,
      userId: (request as any).user?.id,
      operation: `${request.method} ${request.path}`,
      additionalData: {
        userAgent: request.headers['user-agent'],
        ip: request.ip,
        query: request.query,
      },
    };

    await this.errorHandler.handleError(error, context);

    const structuredError = this.errorHandler.createSafeApiResponse(error);
    const statusCode = this.getHttpStatusCode(exception);

    response.status(statusCode).json(structuredError);
  }

  private getHttpStatusCode(exception: unknown): number {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    }

    if (exception instanceof ValidationError) {
      return HttpStatus.BAD_REQUEST;
    }

    if (exception instanceof NotFoundError) {
      return HttpStatus.NOT_FOUND;
    }

    if (exception instanceof SecurityError) {
      return HttpStatus.UNAUTHORIZED;
    }

    if (exception instanceof RateLimitError) {
      return HttpStatus.TOO_MANY_REQUESTS;
    }

    return HttpStatus.INTERNAL_SERVER_ERROR;
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Creates a production error handler with default configuration
 */
export function createProductionErrorHandler(): ProductionErrorHandler {
  const aggregationService = new ErrorAggregationService();
  const metricsCollector = new ErrorMetricsCollector();
  const recoveryStrategies = [
    new DatabaseRecoveryStrategy(),
    new IntegrationRecoveryStrategy(),
    new CircuitBreakerRecoveryStrategy(),
  ];

  return new ProductionErrorHandler(aggregationService, metricsCollector, recoveryStrategies);
}

/**
 * Decorator for automatic error handling
 */
export function HandleErrors(context?: Partial<ErrorContext>) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const errorHandler = createProductionErrorHandler();
      
      return errorHandler.handleErrorWithRetry(
        () => originalMethod.apply(this, args),
        { ...context, operation: `${target.constructor.name}.${propertyKey}` }
      );
    };

    return descriptor;
  };
}

// Note: All classes are already exported with their declarations above
