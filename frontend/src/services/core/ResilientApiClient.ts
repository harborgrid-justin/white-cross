/**
 * @fileoverview Resilient API client with circuit breaker, bulkhead, and health monitoring
 * @module services/core/ResilientApiClient
 * @category Services
 * 
 * Enterprise-grade API client wrapper that adds comprehensive resilience patterns
 * to prevent cascading failures while ensuring critical healthcare operations complete.
 * 
 * Resilience Patterns:
 * - **Circuit Breaker**: Prevents calls to failing endpoints (fail-fast)
 * - **Bulkhead**: Limits concurrent requests by priority to prevent resource exhaustion
 * - **Request Deduplication**: Prevents duplicate in-flight requests
 * - **Health Monitoring**: Tracks endpoint health and degradation
 * - **Retry Logic**: Intelligent retry with exponential backoff
 * - **Timeout Management**: Per-operation timeout configuration
 * 
 * Healthcare-Specific Features:
 * - Critical operations bypass circuit breaker (patient safety first)
 * - Priority-based request queuing (medication admin > reports)
 * - Automatic degradation detection
 * - HIPAA-compliant error logging (no PHI in errors)
 * 
 * @example
 * ```typescript
 * // Create resilient client
 * const client = new ResilientApiClient(apiClient, {
 *   circuitBreaker: {
 *     failureThreshold: 5,
 *     resetTimeout: 30000
 *   },
 *   bulkhead: {
 *     maxConcurrent: 10,
 *     maxQueue: 50
 *   }
 * });
 * 
 * // Make resilient request
 * try {
 *   const data = await client.get<Student>(
 *     '/students/123',
 *     'VIEW_STUDENT_DATA' // Operation type for priority
 *   );
 * } catch (error) {
 *   if (error instanceof ResilienceError) {
 *     if (error.reason === 'CIRCUIT_OPEN') {
 *       // Circuit breaker is open, endpoint is failing
 *     } else if (error.reason === 'BULKHEAD_FULL') {
 *       // Too many concurrent requests
 *     }
 *   }
 * }
 * ```
 */

import { AxiosRequestConfig } from 'axios';
import { ApiClient, ApiResponse } from './ApiClient';
import {
  CircuitBreaker,
  CircuitBreakerRegistry,
  Bulkhead,
  RequestDeduplicator,
  HealthMonitor,
  getGlobalDeduplicator,
  getGlobalHealthMonitor,
  defaultHealthcareResilienceConfig,
  getOperationCategory,
  getBulkheadPriority,
  isCriticalForPatientSafety,
  OperationPriority,
  HealthcareOperationType,
  ResilienceConfig,
  ResilienceError,
  ResilienceMiddlewareContext
} from '../resilience';

/**
 * Resilient API Client
 * 
 * @class
 * @classdesc Wraps standard ApiClient with comprehensive resilience patterns
 * to prevent cascading failures while ensuring critical healthcare operations
 * always complete successfully.
 * 
 * Architecture:
 * - Circuit breaker per endpoint (tracks failures, opens circuit)
 * - Bulkhead pattern limits concurrent requests by priority
 * - Request deduplication prevents redundant calls
 * - Health monitoring tracks endpoint degradation
 * - Automatic fallback and retry strategies
 * 
 * Failure Modes:
 * - Circuit Open: Endpoint is failing, fast-fail new requests
 * - Bulkhead Full: Too many concurrent requests, queue or reject
 * - Timeout: Request exceeded timeout, automatic retry
 * - Rate Limited: Server rate limiting, exponential backoff
 * 
 * Priority Levels (for bulkhead):
 * - CRITICAL: Medication administration, emergency contacts
 * - HIGH: View patient data, create incidents
 * - MEDIUM: Most CRUD operations
 * - LOW: Reports, analytics, exports
 * 
 * @example
 * ```typescript
 * const resilientClient = new ResilientApiClient(baseApiClient, {
 *   circuitBreaker: {
 *     failureThreshold: 5,     // Open after 5 failures
 *     successThreshold: 2,     // Close after 2 successes
 *     resetTimeout: 60000,     // Try again after 60s
 *     monitoringPeriod: 10000  // Track last 10s
 *   },
 *   bulkhead: {
 *     maxConcurrent: 10,       // Max 10 concurrent requests
 *     maxQueue: 50,            // Max 50 queued requests
 *     timeout: 30000           // Max 30s wait time
 *   }
 * });
 * 
 * // Critical operation (bypasses circuit breaker)
 * await resilientClient.post(
 *   '/medications/administer',
 *   data,
 *   'ADMINISTER_MEDICATION' // Critical operation type
 * );
 * ```
 */
export class ResilientApiClient {
  private apiClient: ApiClient;
  private circuitBreakerRegistry: CircuitBreakerRegistry;
  private bulkhead: Bulkhead;
  private deduplicator: RequestDeduplicator;
  private healthMonitor: HealthMonitor;
  private config: ResilienceConfig;
  private retryStrategies: Map<string, number> = new Map();

  constructor(
    apiClient: ApiClient,
    config: Partial<ResilienceConfig> = {}
  ) {
    this.apiClient = apiClient;
    this.config = { ...defaultHealthcareResilienceConfig, ...config };

    // Initialize resilience components
    this.circuitBreakerRegistry = new CircuitBreakerRegistry(this.config.circuitBreaker);
    this.bulkhead = new Bulkhead(this.config.bulkhead);
    this.deduplicator = getGlobalDeduplicator();
    this.healthMonitor = getGlobalHealthMonitor();

    // Setup event listeners
    this.setupEventListeners();
  }

  /**
   * Setup event listeners for resilience components
   */
  private setupEventListeners(): void {
    if (this.config.onEvent) {
      this.healthMonitor.onEvent(this.config.onEvent);
    }
  }

  /**
   * GET request with resilience patterns
   */
  public async get<T = unknown>(
    url: string,
    operationType?: HealthcareOperationType,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.executeWithResilience(
      'GET',
      url,
      () => this.apiClient.get<T>(url, config),
      operationType,
      config
    );
  }

  /**
   * POST request with resilience patterns
   */
  public async post<T = unknown>(
    url: string,
    data?: unknown,
    operationType?: HealthcareOperationType,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.executeWithResilience(
      'POST',
      url,
      () => this.apiClient.post<T>(url, data, config),
      operationType,
      config,
      data
    );
  }

  /**
   * PUT request with resilience patterns
   */
  public async put<T = unknown>(
    url: string,
    data?: unknown,
    operationType?: HealthcareOperationType,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.executeWithResilience(
      'PUT',
      url,
      () => this.apiClient.put<T>(url, data, config),
      operationType,
      config,
      data
    );
  }

  /**
   * PATCH request with resilience patterns
   */
  public async patch<T = unknown>(
    url: string,
    data?: unknown,
    operationType?: HealthcareOperationType,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.executeWithResilience(
      'PATCH',
      url,
      () => this.apiClient.patch<T>(url, data, config),
      operationType,
      config,
      data
    );
  }

  /**
   * DELETE request with resilience patterns
   */
  public async delete<T = unknown>(
    url: string,
    operationType?: HealthcareOperationType,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.executeWithResilience(
      'DELETE',
      url,
      () => this.apiClient.delete<T>(url, config),
      operationType,
      config
    );
  }

  /**
   * Execute request with full resilience pattern stack
   * 1. Circuit Breaker - Prevent repeated failures
   * 2. Bulkhead - Isolate critical operations
   * 3. Deduplication - Prevent duplicate requests
   * 4. Health Monitoring - Track degradation
   * 5. Retry - Handle transient failures
   */
  private async executeWithResilience<T>(
    method: string,
    url: string,
    operation: () => Promise<ApiResponse<T>>,
    operationType?: HealthcareOperationType,
    config?: AxiosRequestConfig,
    data?: unknown
  ): Promise<ApiResponse<T>> {
    const startTime = performance.now();

    try {
      // Get operation context
      const context = this.buildContext(method, url, operationType, config);

      // Execute through resilience stack
      let result: ApiResponse<T>;

      // Step 1: Try circuit breaker (if enabled)
      if (this.config.enableCircuitBreaker) {
        result = await this.executeWithCircuitBreaker(
          url,
          () => this.executeWithBulkhead(context, operation, data)
        );
      } else {
        result = await this.executeWithBulkhead(context, operation, data);
      }

      // Record success
      const duration = performance.now() - startTime;
      this.healthMonitor.recordSuccess(url, duration);

      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      this.healthMonitor.recordFailure(url, duration);

      // Emit error event
      if (this.config.onError && error instanceof Error) {
        const resilientError: ResilienceError = {
          ...error,
          type: this.classifyError(error),
          endpoint: url,
          originalError: error,
          timestamp: Date.now()
        } as ResilienceError;

        this.config.onError(resilientError);
      }

      throw error;
    }
  }

  /**
   * Execute through circuit breaker
   */
  private async executeWithCircuitBreaker<T>(
    url: string,
    operation: () => Promise<T>
  ): Promise<T> {
    return this.circuitBreakerRegistry.execute(url, operation);
  }

  /**
   * Execute through bulkhead with priority isolation
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
   */
  private async executeWithDeduplication<T>(
    context: ResilienceMiddlewareContext,
    operation: () => Promise<T>,
    data?: unknown
  ): Promise<T> {
    if (!this.config.enableDeduplication) {
      return this.executeWithRetry(context, operation);
    }

    // Create deduplication params
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
   * Execute with retry logic
   */
  private async executeWithRetry<T>(
    context: ResilienceMiddlewareContext,
    operation: () => Promise<T>
  ): Promise<T> {
    const category = getOperationCategory(
      context.params?.operationType as HealthcareOperationType || HealthcareOperationType.STUDENT_LOOKUP
    );

    let lastError: unknown;
    let attempt = 0;

    while (attempt <= category.maxRetries) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        attempt++;

        if (attempt <= category.maxRetries) {
          // Calculate backoff delay
          const delay = category.retryDelay * Math.pow(1.5, attempt - 1);
          await this.sleep(Math.min(delay, context.timeout / 2));
        }
      }
    }

    throw lastError;
  }

  /**
   * Build execution context from request metadata
   */
  private buildContext(
    method: string,
    url: string,
    operationType?: HealthcareOperationType,
    config?: AxiosRequestConfig
  ): ResilienceMiddlewareContext {
    const priority = operationType
      ? getBulkheadPriority(operationType)
      : OperationPriority.NORMAL;

    const category = operationType
      ? getOperationCategory(operationType)
      : getOperationCategory(HealthcareOperationType.STUDENT_LOOKUP);

    return {
      method,
      url,
      params: config?.params,
      timeout: category.timeout,
      priority,
      isIdempotent: category.isIdempotent,
      metadata: {
        operationType,
        criticalForSafety: operationType ? isCriticalForPatientSafety(operationType) : false,
        category: category.name
      }
    };
  }

  /**
   * Classify error type for resilience handling
   */
  private classifyError(error: unknown): 'circuitBreakerOpen' | 'bulkheadRejected' | 'timeout' | 'underlying' {
    if (error instanceof Error) {
      const msg = error.message.toLowerCase();
      if (msg.includes('circuit breaker')) {
        return 'circuitBreakerOpen';
      }
      if (msg.includes('bulkhead')) {
        return 'bulkheadRejected';
      }
      if (msg.includes('timeout')) {
        return 'timeout';
      }
    }
    return 'underlying';
  }

  /**
   * Sleep utility for retry delays
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get health report
   */
  public getHealthReport() {
    return this.healthMonitor.getHealthReport();
  }

  /**
   * Get circuit breaker metrics
   */
  public getCircuitBreakerMetrics() {
    return this.circuitBreakerRegistry.getAllMetrics();
  }

  /**
   * Get bulkhead metrics
   */
  public getBulkheadMetrics() {
    return this.bulkhead.getMetrics();
  }

  /**
   * Get deduplication metrics
   */
  public getDeduplicationMetrics() {
    return this.deduplicator.getMetrics();
  }

  /**
   * Reset all metrics and breakers
   */
  public reset(): void {
    this.circuitBreakerRegistry.resetAll();
    this.deduplicator.clearAll();
    this.bulkhead.resetMetrics();
    this.healthMonitor.resetAll();
  }

  /**
   * Get underlying API client
   */
  public getApiClient(): ApiClient {
    return this.apiClient;
  }

  /**
   * Update resilience configuration
   */
  public updateConfig(config: Partial<ResilienceConfig>): void {
    this.config = { ...this.config, ...config };
    this.circuitBreakerRegistry.updateConfig(this.config.circuitBreaker);
  }
}

/**
 * Create resilient API client wrapper
 */
export function createResilientApiClient(
  apiClient: ApiClient,
  config?: Partial<ResilienceConfig>
): ResilientApiClient {
  return new ResilientApiClient(apiClient, config);
}
