/**
 * @fileoverview Request executor with retry logic and resilience pattern orchestration
 * @module services/core/ResilientRequestExecutor
 * @category Services
 *
 * Responsible for executing requests through the resilience stack:
 * - Circuit breaker integration
 * - Bulkhead pattern (request isolation)
 * - Request deduplication
 * - Retry logic with exponential backoff
 * - Health monitoring
 *
 * This module extracts the execution logic from ResilientApiClient
 * to maintain single responsibility and improve testability.
 */

import type { ApiResponse } from './ApiClient';
import type {
  CircuitBreakerRegistry,
  Bulkhead,
  RequestDeduplicator,
  HealthMonitor,
  ResilienceConfig,
  ResilienceMiddlewareContext,
  HealthcareOperationType
} from '../resilience';
import { getOperationCategory, HealthcareOperationType as OperationType } from '../resilience';

/**
 * Configuration for request execution
 */
export interface RequestExecutorConfig {
  circuitBreakerRegistry: CircuitBreakerRegistry;
  bulkhead: Bulkhead;
  deduplicator: RequestDeduplicator;
  healthMonitor: HealthMonitor;
  resilienceConfig: ResilienceConfig;
}

/**
 * Request Executor with Resilience Patterns
 *
 * Orchestrates the execution of requests through multiple resilience layers:
 * 1. Circuit Breaker - Fast-fail for failing endpoints
 * 2. Bulkhead - Request isolation by priority
 * 3. Deduplication - Prevent duplicate in-flight requests
 * 4. Retry - Handle transient failures
 * 5. Health Monitoring - Track endpoint health
 *
 * @example
 * ```typescript
 * const executor = new ResilientRequestExecutor({
 *   circuitBreakerRegistry,
 *   bulkhead,
 *   deduplicator,
 *   healthMonitor,
 *   resilienceConfig
 * });
 *
 * const result = await executor.execute(
 *   'GET',
 *   '/api/students',
 *   async () => apiClient.get('/api/students'),
 *   context
 * );
 * ```
 */
export class ResilientRequestExecutor {
  private circuitBreakerRegistry: CircuitBreakerRegistry;
  private bulkhead: Bulkhead;
  private deduplicator: RequestDeduplicator;
  private healthMonitor: HealthMonitor;
  private config: ResilienceConfig;

  constructor(config: RequestExecutorConfig) {
    this.circuitBreakerRegistry = config.circuitBreakerRegistry;
    this.bulkhead = config.bulkhead;
    this.deduplicator = config.deduplicator;
    this.healthMonitor = config.healthMonitor;
    this.config = config.resilienceConfig;
  }

  /**
   * Execute request through the full resilience stack
   *
   * @template T - Response data type
   * @param method - HTTP method (GET, POST, etc.)
   * @param url - Request URL
   * @param operation - Function that performs the actual HTTP request
   * @param context - Resilience context with priority, timeout, etc.
   * @param data - Optional request body data
   * @returns Promise resolving to API response
   */
  public async execute<T>(
    method: string,
    url: string,
    operation: () => Promise<ApiResponse<T>>,
    context: ResilienceMiddlewareContext,
    data?: unknown
  ): Promise<ApiResponse<T>> {
    const startTime = performance.now();

    try {
      // Execute through resilience layers
      let result: ApiResponse<T>;

      if (this.config.enableCircuitBreaker) {
        result = await this.executeWithCircuitBreaker(
          url,
          () => this.executeWithBulkhead(context, operation, data)
        );
      } else {
        result = await this.executeWithBulkhead(context, operation, data);
      }

      // Record success metrics
      const duration = performance.now() - startTime;
      this.healthMonitor.recordSuccess(url, duration);

      return result;
    } catch (error) {
      // Record failure metrics
      const duration = performance.now() - startTime;
      this.healthMonitor.recordFailure(url, duration);

      throw error;
    }
  }

  /**
   * Execute through circuit breaker
   *
   * Circuit breaker prevents calls to failing endpoints by failing fast
   * when the failure threshold is exceeded.
   */
  private async executeWithCircuitBreaker<T>(
    url: string,
    operation: () => Promise<T>
  ): Promise<T> {
    return this.circuitBreakerRegistry.execute(url, operation);
  }

  /**
   * Execute through bulkhead with priority isolation
   *
   * Bulkhead limits concurrent requests based on priority to prevent
   * resource exhaustion and ensure critical operations complete.
   */
  private async executeWithBulkhead<T>(
    context: ResilienceMiddlewareContext,
    operation: () => Promise<T>,
    data?: unknown
  ): Promise<T> {
    if (!this.config.enableBulkhead) {
      return this.executeWithDeduplication(context, operation, data);
    }

    return this.bulkhead.submit(
      () => this.executeWithDeduplication(context, operation, data),
      context.priority,
      context.timeout
    );
  }

  /**
   * Execute through request deduplicator
   *
   * Deduplicator prevents duplicate in-flight requests by caching
   * pending promises and returning the same promise for identical requests.
   */
  private async executeWithDeduplication<T>(
    context: ResilienceMiddlewareContext,
    operation: () => Promise<T>,
    data?: unknown
  ): Promise<T> {
    if (!this.config.enableDeduplication) {
      return this.executeWithRetry(context, operation);
    }

    // Create deduplication params (include body for non-GET requests)
    const params = {
      ...context.params,
      ...(data && context.method !== 'GET' ? { __body: data } : {})
    };

    return this.deduplicator.execute(
      context.method,
      context.url,
      params,
      () => this.executeWithRetry(context, operation),
      context.timeout
    );
  }

  /**
   * Execute with intelligent retry logic
   *
   * Retries failed requests using exponential backoff based on the
   * operation category (critical operations get more retries).
   */
  private async executeWithRetry<T>(
    context: ResilienceMiddlewareContext,
    operation: () => Promise<T>
  ): Promise<T> {
    // Get operation category for retry configuration
    const operationType = context.params?.operationType as HealthcareOperationType;
    const category = getOperationCategory(operationType || OperationType.STUDENT_LOOKUP);

    let lastError: unknown;
    let attempt = 0;

    while (attempt <= category.maxRetries) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        attempt++;

        // Only retry if we haven't exceeded max retries
        if (attempt <= category.maxRetries) {
          // Calculate exponential backoff delay
          const delay = category.retryDelay * Math.pow(1.5, attempt - 1);

          // Cap delay at half the timeout to ensure we don't exceed it
          const cappedDelay = Math.min(delay, context.timeout / 2);

          await this.sleep(cappedDelay);
        }
      }
    }

    // All retries exhausted, throw the last error
    throw lastError;
  }

  /**
   * Sleep utility for retry delays
   * @param ms - Milliseconds to sleep
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Update resilience configuration
   */
  public updateConfig(config: Partial<ResilienceConfig>): void {
    this.config = { ...this.config, ...config };
  }
}
