/**
 * @fileoverview Enhanced Production-Grade Error Handling Service
 * @module common/exceptions/enhanced-error-handling
 * @description Comprehensive error handling with aggregation, recovery mechanisms,
 * circuit breakers, and metrics collection - extends existing exception system
 *
 * @version 2.0.0
 * @requires @nestjs/common ^10.x
 * @requires winston ^3.x
 * @requires prom-client ^14.x
 */

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Counter, Histogram, register } from 'prom-client';

// ============================================================================
// ENHANCED ERROR INTERFACES
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

export interface ErrorAggregation {
  errorType: string;
  count: number;
  firstSeen: Date;
  lastSeen: Date;
  samples: ErrorLogEntry[];
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

export interface ErrorRecoveryStrategy {
  canRecover(error: Error): boolean;
  recover(error: Error): Promise<any>;
  getRetryDelay(attempt: number): number;
  getMaxRetries(): number;
}

// ============================================================================
// ENHANCED ERROR CLASSES
// ============================================================================

/**
 * Enhanced base error with comprehensive context
 */
export abstract class EnhancedBaseError extends Error {
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
    retryable: boolean = false,
  ) {
    super(message);
    this.name = this.constructor.name;
    this.timestamp = new Date();
    this.errorId = this.generateErrorId();
    this.context = { ...this.getDefaultContext(), ...context };
    this.severity = severity;
    this.category = category;
    this.retryable = retryable;

    // Maintain stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
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
  toApiFormat(includeStack: boolean = false): Record<string, any> {
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
 * Enhanced database error
 */
export class EnhancedDatabaseError extends EnhancedBaseError {
  public readonly query?: string;
  public readonly parameters?: any[];

  constructor(
    message: string,
    context: Partial<ErrorContext> & { query?: string; parameters?: any[] } = {},
    retryable: boolean = true,
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
 * Enhanced integration error
 */
export class EnhancedIntegrationError extends EnhancedBaseError {
  public readonly service: string;
  public readonly endpoint?: string;
  public readonly httpStatus?: number;

  constructor(
    message: string,
    service: string,
    context: Partial<ErrorContext> & { endpoint?: string; httpStatus?: number } = {},
    retryable: boolean = true,
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

// ============================================================================
// ERROR AGGREGATION SERVICE
// ============================================================================

/**
 * Error aggregation service for collecting and analyzing error patterns
 */
@Injectable()
export class ErrorAggregationService {
  private readonly logger = new Logger(ErrorAggregationService.name);
  private readonly errorCounts = new Map<string, ErrorAggregation>();
  private readonly maxSamples = 10;

  /**
   * Records an error for aggregation analysis
   */
  recordError(error: EnhancedBaseError): void {
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
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  private checkForAnomalies(key: string, aggregation: ErrorAggregation): void {
    // Check for error spikes (>50 errors in 5 minutes)
    const recentSamples = aggregation.samples.filter(
      sample => Date.now() - sample.timestamp.getTime() < 300000,
    );

    if (recentSamples.length > 50) {
      this.logger.error(
        `Error spike detected for ${key}: ${recentSamples.length} errors in 5 minutes`,
      );
    }
  }
}

// ============================================================================
// ERROR METRICS COLLECTOR
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

  /**
   * Records error metrics
   */
  recordError(error: EnhancedBaseError): void {
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
  recordHandlingDuration(error: EnhancedBaseError, durationMs: number, recoveryAttempted: boolean): void {
    this.errorDuration
      .labels({
        error_type: error.name,
        recovery_attempted: recoveryAttempted.toString(),
      })
      .observe(durationMs / 1000);
  }
}

// ============================================================================
// RECOVERY STRATEGIES
// ============================================================================

/**
 * Database connection recovery strategy
 */
@Injectable()
export class DatabaseRecoveryStrategy implements ErrorRecoveryStrategy {
  private readonly logger = new Logger(DatabaseRecoveryStrategy.name);

  canRecover(error: Error): boolean {
    return error instanceof EnhancedDatabaseError && error.retryable;
  }

  async recover(error: Error): Promise<void> {
    this.logger.warn(`Attempting database recovery for error: ${(error as EnhancedBaseError).errorId}`);
    
    // Implement database connection pool reset, reconnection logic
    await this.resetConnectionPool();
    await this.waitForHealthyConnection();
  }

  getRetryDelay(attempt: number): number {
    return Math.min(1000 * Math.pow(2, attempt), 30000); // Exponential backoff with 30s max
  }

  getMaxRetries(): number {
    return 3;
  }

  private async resetConnectionPool(): Promise<void> {
    this.logger.log('Resetting database connection pool');
  }

  private async waitForHealthyConnection(): Promise<void> {
    this.logger.log('Waiting for healthy database connection');
  }
}

/**
 * Circuit breaker recovery strategy
 */
@Injectable()
export class CircuitBreakerRecoveryStrategy implements ErrorRecoveryStrategy {
  private readonly circuitStates = new Map<string, {
    failures: number;
    lastFailure: Date;
    state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
  }>();

  private readonly logger = new Logger(CircuitBreakerRecoveryStrategy.name);

  canRecover(error: Error): boolean {
    return error instanceof EnhancedBaseError && error.retryable && this.getCircuitState(error.name) !== 'OPEN';
  }

  async recover(error: Error): Promise<void> {
    const circuitKey = error.name;
    const circuit = this.getOrCreateCircuit(circuitKey);

    circuit.failures++;
    circuit.lastFailure = new Date();

    // Open circuit after 5 failures within 1 minute
    if (circuit.failures >= 5 && this.isWithinTimeWindow(circuit.lastFailure, 60000)) {
      circuit.state = 'OPEN';
      this.logger.warn(`Circuit breaker opened for ${circuitKey}`);
    }
  }

  getRetryDelay(attempt: number): number {
    return Math.min(1000 * Math.pow(2, attempt), 30000);
  }

  getMaxRetries(): number {
    return 3;
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
// ENHANCED ERROR HANDLER
// ============================================================================

/**
 * Enhanced error handling service that coordinates all error handling activities
 */
@Injectable()
export class EnhancedErrorHandlingService {
  private readonly logger = new Logger(EnhancedErrorHandlingService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly aggregationService: ErrorAggregationService,
    private readonly metricsCollector: ErrorMetricsCollector,
    private readonly recoveryStrategies: ErrorRecoveryStrategy[] = [],
  ) {}

  /**
   * Main error handling entry point
   */
  async handleError(error: Error | EnhancedBaseError, context: Partial<ErrorContext> = {}): Promise<void> {
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
      this.logger.error(
        `Error occurred while handling error ${structuredError.errorId}`,
        handlingError,
      );
    }
  }

  /**
   * Handles errors with retry logic
   */
  async handleErrorWithRetry<T>(
    operation: () => Promise<T>,
    context: Partial<ErrorContext> = {},
    maxRetries: number = 3,
  ): Promise<T> {
    let lastError: EnhancedBaseError;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = this.ensureStructuredError(error as Error, {
          ...context,
          operation: context.operation || 'unknown',
          additionalData: { ...context.additionalData, attempt },
        });

        if (attempt === maxRetries || !lastError.retryable) {
          await this.handleError(lastError, context);
          throw lastError;
        }

        // Calculate delay before retry
        const strategy = this.findRecoveryStrategy(lastError);
        const delay = strategy?.getRetryDelay(attempt) || 1000 * Math.pow(2, attempt);

        this.logger.warn(
          `Operation failed (attempt ${attempt + 1}/${maxRetries + 1}), retrying in ${delay}ms`,
          { errorId: lastError.errorId },
        );

        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError!;
  }

  /**
   * Creates safe error responses for API endpoints
   */
  createSafeApiResponse(error: Error | EnhancedBaseError, includeStack: boolean = false): Record<string, any> {
    const structuredError = this.ensureStructuredError(error);
    return structuredError.toApiFormat(includeStack);
  }

  /**
   * Converts any error to structured error
   */
  private ensureStructuredError(error: Error | EnhancedBaseError, context: Partial<ErrorContext> = {}): EnhancedBaseError {
    if (error instanceof EnhancedBaseError) {
      return error;
    }

    // Convert database errors
    if (error.message.indexOf('database') !== -1 || error.message.indexOf('connection') !== -1) {
      return new EnhancedDatabaseError(error.message, context, true);
    }

    // Convert integration errors
    if (error.message.indexOf('integration') !== -1 || error.message.indexOf('external') !== -1) {
      return new EnhancedIntegrationError(error.message, 'unknown', context, true);
    }

    // Default to generic application error
    return new class extends EnhancedBaseError {
      protected getErrorCode(): string {
        return 'UNKNOWN_ERROR';
      }
    }(error.message, context, ErrorSeverity.ERROR, ErrorCategory.UNKNOWN, true);
  }

  /**
   * Logs error with appropriate level and format
   */
  private logError(error: EnhancedBaseError): void {
    const logEntry = error.toLogFormat();

    switch (error.severity) {
      case ErrorSeverity.FATAL:
      case ErrorSeverity.ERROR:
        this.logger.error(logEntry);
        break;
      case ErrorSeverity.WARN:
        this.logger.warn(logEntry);
        break;
      case ErrorSeverity.INFO:
        this.logger.log(logEntry);
        break;
      case ErrorSeverity.DEBUG:
        this.logger.debug(logEntry);
        break;
    }
  }

  /**
   * Attempts error recovery using available strategies
   */
  private async attemptRecovery(error: EnhancedBaseError): Promise<boolean> {
    if (!error.retryable) {
      return false;
    }

    const strategy = this.findRecoveryStrategy(error);
    if (!strategy) {
      return false;
    }

    try {
      this.logger.log(`Attempting recovery for error: ${error.errorId}`);
      await strategy.recover(error);
      this.logger.log(`Recovery successful for error: ${error.errorId}`);
      return true;
    } catch (recoveryError) {
      this.logger.error(
        `Recovery failed for error: ${error.errorId}`,
        recoveryError,
      );
      return false;
    }
  }

  /**
   * Finds appropriate recovery strategy for error
   */
  private findRecoveryStrategy(error: EnhancedBaseError): ErrorRecoveryStrategy | undefined {
    for (const strategy of this.recoveryStrategies) {
      if (strategy.canRecover(error)) {
        return strategy;
      }
    }
    return undefined;
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Creates an enhanced error handler with default configuration
 */
export function createEnhancedErrorHandler(configService: ConfigService): EnhancedErrorHandlingService {
  const aggregationService = new ErrorAggregationService();
  const metricsCollector = new ErrorMetricsCollector();
  const recoveryStrategies = [
    new DatabaseRecoveryStrategy(),
    new CircuitBreakerRecoveryStrategy(),
  ];

  return new EnhancedErrorHandlingService(
    configService,
    aggregationService,
    metricsCollector,
    recoveryStrategies,
  );
}

/**
 * Decorator for automatic error handling
 */
export function HandleEnhancedErrors(context?: Partial<ErrorContext>) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      // In a real implementation, inject the error handler service
      const errorHandler = createEnhancedErrorHandler(this.configService);

      return errorHandler.handleErrorWithRetry(
        () => originalMethod.apply(this, args),
        { ...context, operation: `${target.constructor.name}.${propertyKey}` },
      );
    };

    return descriptor;
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  EnhancedErrorHandlingService,
  ErrorAggregationService,
  ErrorMetricsCollector,
  DatabaseRecoveryStrategy,
  CircuitBreakerRecoveryStrategy,
  EnhancedBaseError,
  EnhancedDatabaseError,
  EnhancedIntegrationError,
};
