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
  HealthcareOperationType,
  ResilienceConfig,
  ResilienceError
} from '../resilience';

// Import new modular components
import { ResilientRequestExecutor } from './ResilientRequestExecutor';
import { ResilienceContextBuilder } from './ResilienceContextBuilder';
import { ResilienceMetricsCollector } from './ResilienceMetricsCollector';

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

  // Modular components
  private executor: ResilientRequestExecutor;
  private contextBuilder: ResilienceContextBuilder;
  private metricsCollector: ResilienceMetricsCollector;

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

    // Initialize modular components
    this.executor = new ResilientRequestExecutor({
      circuitBreakerRegistry: this.circuitBreakerRegistry,
      bulkhead: this.bulkhead,
      deduplicator: this.deduplicator,
      healthMonitor: this.healthMonitor,
      resilienceConfig: this.config
    });

    this.contextBuilder = new ResilienceContextBuilder();

    this.metricsCollector = new ResilienceMetricsCollector({
      circuitBreakerRegistry: this.circuitBreakerRegistry,
      bulkhead: this.bulkhead,
      deduplicator: this.deduplicator,
      healthMonitor: this.healthMonitor
    });

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
   * Generic request executor that wraps ApiClient methods with resilience patterns
   *
   * This method eliminates duplication by centralizing the creation of operation closures
   * and handling both methods with and without body data uniformly.
   *
   * @private
   * @template T - The response data type
   * @param method - HTTP method name (uppercase)
   * @param url - Request URL
   * @param operationType - Healthcare operation type for priority/resilience configuration
   * @param config - Axios request configuration
   * @param data - Request body data (optional, used by POST/PUT/PATCH)
   * @returns Promise resolving to API response with full resilience patterns applied
   */
  private async executeRequest<T = unknown>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    url: string,
    operationType: HealthcareOperationType | undefined,
    config: AxiosRequestConfig | undefined,
    data?: unknown
  ): Promise<ApiResponse<T>> {
    // Create operation closure based on method type
    const operation = () => {
      switch (method) {
        case 'GET':
          return this.apiClient.get<T>(url, config as any);
        case 'POST':
          return this.apiClient.post<T>(url, data, config as any);
        case 'PUT':
          return this.apiClient.put<T>(url, data, config as any);
        case 'PATCH':
          return this.apiClient.patch<T>(url, data, config as any);
        case 'DELETE':
          return this.apiClient.delete<T>(url, config as any);
      }
    };

    return this.executeWithResilience(
      method,
      url,
      operation,
      operationType,
      config,
      data
    );
  }

  /**
   * GET request with resilience patterns
   * @template T - The response data type
   * @param url - Request URL
   * @param operationType - Healthcare operation type for priority/resilience
   * @param config - Axios request configuration
   * @returns Promise resolving to API response
   */
  public async get<T = unknown>(
    url: string,
    operationType?: HealthcareOperationType,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.executeRequest<T>('GET', url, operationType, config);
  }

  /**
   * POST request with resilience patterns
   * @template T - The response data type
   * @param url - Request URL
   * @param data - Request body data
   * @param operationType - Healthcare operation type for priority/resilience
   * @param config - Axios request configuration
   * @returns Promise resolving to API response
   */
  public async post<T = unknown>(
    url: string,
    data?: unknown,
    operationType?: HealthcareOperationType,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.executeRequest<T>('POST', url, operationType, config, data);
  }

  /**
   * PUT request with resilience patterns
   * @template T - The response data type
   * @param url - Request URL
   * @param data - Request body data
   * @param operationType - Healthcare operation type for priority/resilience
   * @param config - Axios request configuration
   * @returns Promise resolving to API response
   */
  public async put<T = unknown>(
    url: string,
    data?: unknown,
    operationType?: HealthcareOperationType,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.executeRequest<T>('PUT', url, operationType, config, data);
  }

  /**
   * PATCH request with resilience patterns
   * @template T - The response data type
   * @param url - Request URL
   * @param data - Request body data
   * @param operationType - Healthcare operation type for priority/resilience
   * @param config - Axios request configuration
   * @returns Promise resolving to API response
   */
  public async patch<T = unknown>(
    url: string,
    data?: unknown,
    operationType?: HealthcareOperationType,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.executeRequest<T>('PATCH', url, operationType, config, data);
  }

  /**
   * DELETE request with resilience patterns
   * @template T - The response data type
   * @param url - Request URL
   * @param operationType - Healthcare operation type for priority/resilience
   * @param config - Axios request configuration
   * @returns Promise resolving to API response
   */
  public async delete<T = unknown>(
    url: string,
    operationType?: HealthcareOperationType,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.executeRequest<T>('DELETE', url, operationType, config);
  }

  /**
   * Execute request with full resilience pattern stack
   *
   * Delegates to ResilientRequestExecutor for the actual execution through:
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
    try {
      // Build execution context using the context builder
      const context = this.contextBuilder.build(method, url, operationType, config);

      // Execute through resilience stack using the executor
      const result = await this.executor.execute<T>(
        method,
        url,
        operation,
        context,
        data
      );

      return result;
    } catch (error) {
      // Emit error event if configured
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
   * Get health report
   */
  public getHealthReport() {
    return this.metricsCollector.getHealthReport();
  }

  /**
   * Get circuit breaker metrics
   */
  public getCircuitBreakerMetrics() {
    return this.metricsCollector.getCircuitBreakerMetrics();
  }

  /**
   * Get bulkhead metrics
   */
  public getBulkheadMetrics() {
    return this.metricsCollector.getBulkheadMetrics();
  }

  /**
   * Get deduplication metrics
   */
  public getDeduplicationMetrics() {
    return this.metricsCollector.getDeduplicationMetrics();
  }

  /**
   * Get all metrics (aggregated)
   */
  public getAllMetrics() {
    return this.metricsCollector.getAllMetrics();
  }

  /**
   * Get metrics summary for dashboards
   */
  public getMetricsSummary() {
    return this.metricsCollector.getSummary();
  }

  /**
   * Reset all metrics and breakers
   */
  public reset(): void {
    this.metricsCollector.resetAll();
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
    this.executor.updateConfig(config);
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
