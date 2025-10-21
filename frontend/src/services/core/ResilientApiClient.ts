/**
 * Resilient API Client
 * Integrates circuit breaker, bulkhead, request deduplication, and health monitoring
 * Provides enterprise-grade fault tolerance for healthcare operations
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
 * Wraps standard ApiClient with comprehensive resilience patterns
 * Prevents cascading failures while ensuring critical operations complete
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
