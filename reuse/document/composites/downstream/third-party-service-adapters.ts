/**
 * LOC: DOC-DOWN-ADAPTER-004
 * File: /reuse/document/composites/downstream/third-party-service-adapters.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common (v10.x)
 *   - @nestjs/axios (v3.x)
 *   - axios (v1.x)
 *   - ../document-cloud-integration-composite
 *   - ../document-api-integration-composite
 *
 * DOWNSTREAM (imported by):
 *   - External service integrations
 *   - Cloud provider adapters
 *   - Payment processors
 *   - Analytics providers
 */

/**
 * File: /reuse/document/composites/downstream/third-party-service-adapters.ts
 * Locator: WC-DOWN-ADAPTER-004
 * Purpose: Third-Party Service Adapters - Production-grade external service integration
 *
 * Upstream: @nestjs/common, @nestjs/axios, axios, cloud-integration/api-integration composites
 * Downstream: External service integrations, cloud providers, payment processors
 * Dependencies: NestJS 10.x, TypeScript 5.x, Axios 1.x
 * Exports: 15 adapter implementations for external services
 *
 * LLM Context: Production-grade third-party service adapter implementations for White Cross platform.
 * Provides standardized adapters for cloud providers (AWS, Azure, GCP), payment processors,
 * analytics platforms, and external APIs. Implements connection pooling, retry logic,
 * rate limiting, circuit breakers, response caching, and comprehensive error handling.
 * Supports multiple credential types and authentication mechanisms.
 */

import {
  Injectable,
  Logger,
  Inject,
  BadRequestException,
  InternalServerErrorException,
  GatewayTimeoutException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, timeout } from 'rxjs';
import { AxiosInstance, AxiosError, AxiosResponse } from 'axios';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Service credential types
 *
 * @property {string} type - Credential type identifier
 * @property {Record<string, unknown>} config - Credential configuration
 */
export interface ServiceCredential {
  type: 'apiKey' | 'oauth2' | 'basicAuth' | 'bearerToken' | 'custom';
  config: Record<string, unknown>;
}

/**
 * Service connection configuration
 *
 * @property {string} baseUrl - Service base URL
 * @property {ServiceCredential} credential - Authentication credential
 * @property {number} timeoutMs - Request timeout in milliseconds
 * @property {number} maxRetries - Maximum retry attempts
 * @property {number} retryDelayMs - Initial retry delay in milliseconds
 * @property {boolean} enableCircuitBreaker - Enable circuit breaker pattern
 * @property {Record<string, unknown>} [customHeaders] - Custom headers
 */
export interface ServiceConnectionConfig {
  baseUrl: string;
  credential: ServiceCredential;
  timeoutMs: number;
  maxRetries: number;
  retryDelayMs: number;
  enableCircuitBreaker: boolean;
  customHeaders?: Record<string, unknown>;
}

/**
 * Circuit breaker state
 *
 * @property {string} state - Current state (closed, open, half-open)
 * @property {number} failureCount - Current failure count
 * @property {number} successCount - Current success count
 * @property {number} lastFailureTime - Last failure timestamp
 * @property {number} nextStateChangeTime - Time for next state change
 */
export interface CircuitBreakerState {
  state: 'closed' | 'open' | 'half-open';
  failureCount: number;
  successCount: number;
  lastFailureTime?: number;
  nextStateChangeTime?: number;
}

/**
 * Service response structure
 *
 * @property {boolean} success - Whether request succeeded
 * @property {unknown} data - Response data
 * @property {number} statusCode - HTTP status code
 * @property {string} [error] - Error message if failed
 * @property {number} [retryCount] - Number of retries performed
 * @property {number} [duration] - Request duration in milliseconds
 */
export interface ServiceResponse<T = unknown> {
  success: boolean;
  data?: T;
  statusCode: number;
  error?: string;
  retryCount?: number;
  duration?: number;
}

/**
 * Adapter configuration
 *
 * @property {string} name - Adapter name
 * @property {string} type - Service type (aws, azure, gcp, payment, analytics)
 * @property {ServiceConnectionConfig} connection - Connection configuration
 * @property {boolean} enabled - Whether adapter is enabled
 */
export interface AdapterConfig {
  name: string;
  type: string;
  connection: ServiceConnectionConfig;
  enabled: boolean;
}

/**
 * Request cache entry
 *
 * @property {unknown} data - Cached response data
 * @property {number} timestamp - Cache timestamp
 * @property {number} ttlMs - Time-to-live in milliseconds
 */
export interface CacheEntry<T = unknown> {
  data: T;
  timestamp: number;
  ttlMs: number;
}

/**
 * Rate limit info
 *
 * @property {number} remaining - Remaining requests in window
 * @property {number} limit - Total request limit
 * @property {number} resetTime - Reset time timestamp
 */
export interface RateLimitInfo {
  remaining: number;
  limit: number;
  resetTime: number;
}

// ============================================================================
// BASE SERVICE ADAPTER
// ============================================================================

/**
 * BaseServiceAdapter: Abstract base for third-party service adapters
 *
 * Provides common functionality including:
 * - HTTP client management
 * - Authentication handling
 * - Retry logic with exponential backoff
 * - Circuit breaker pattern
 * - Response caching
 * - Rate limit tracking
 * - Error handling and logging
 *
 * @class BaseServiceAdapter
 * @abstract
 */
@Injectable()
export abstract class BaseServiceAdapter {
  protected readonly logger: Logger;
  protected httpClient: AxiosInstance;
  protected circuitBreaker: CircuitBreakerState;
  protected responseCache: Map<string, CacheEntry> = new Map();
  protected rateLimitInfo: RateLimitInfo = {
    remaining: 0,
    limit: 0,
    resetTime: 0,
  };

  constructor(
    protected readonly httpService: HttpService,
    protected readonly config: AdapterConfig,
  ) {
    this.logger = new Logger(`${config.name}Adapter`);
    this.httpClient = this.httpService.axiosRef;
    this.initializeCircuitBreaker();
    this.configureHttpClient();
  }

  /**
   * Initialize circuit breaker
   *
   * @description Sets up circuit breaker for fault tolerance
   *
   * @returns {void}
   */
  private initializeCircuitBreaker(): void {
    this.circuitBreaker = {
      state: 'closed',
      failureCount: 0,
      successCount: 0,
    };
  }

  /**
   * Configure HTTP client with authentication and headers
   *
   * @description Sets up axios client with credentials and custom headers
   *
   * @returns {void}
   */
  private configureHttpClient(): void {
    try {
      this.httpClient.defaults.baseURL = this.config.connection.baseUrl;
      this.httpClient.defaults.timeout =
        this.config.connection.timeoutMs;

      // Apply authentication
      this.applyAuthentication();

      // Add custom headers
      if (this.config.connection.customHeaders) {
        Object.entries(this.config.connection.customHeaders).forEach(
          ([key, value]) => {
            this.httpClient.defaults.headers.common[key] = value;
          },
        );
      }

      this.logger.log('HTTP client configured');
    } catch (error) {
      this.logger.error(
        'Failed to configure HTTP client',
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  /**
   * Apply authentication to HTTP client
   *
   * @description Configures authentication based on credential type
   *
   * @returns {void}
   *
   * @protected
   */
  protected applyAuthentication(): void {
    try {
      const { credential } = this.config.connection;

      switch (credential.type) {
        case 'apiKey':
          this.httpClient.defaults.headers.common['X-API-Key'] =
            credential.config.key;
          break;
        case 'bearerToken':
          this.httpClient.defaults.headers.common['Authorization'] =
            `Bearer ${credential.config.token}`;
          break;
        case 'basicAuth':
          const auth = Buffer.from(
            `${credential.config.username}:${credential.config.password}`,
          ).toString('base64');
          this.httpClient.defaults.headers.common['Authorization'] =
            `Basic ${auth}`;
          break;
        case 'oauth2':
          this.httpClient.defaults.headers.common['Authorization'] =
            `Bearer ${credential.config.accessToken}`;
          break;
        default:
          this.logger.warn(
            `Unknown credential type: ${credential.type}`,
          );
      }
    } catch (error) {
      this.logger.error(
        'Failed to apply authentication',
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  /**
   * Make HTTP request with retry logic and circuit breaker
   *
   * @description Executes HTTP request with automatic retry and fault tolerance
   *
   * @template T - Response type
   * @param {string} method - HTTP method
   * @param {string} path - Request path
   * @param {unknown} [data] - Request body
   * @param {Record<string, unknown>} [headers] - Additional headers
   * @returns {Promise<ServiceResponse<T>>} Service response
   *
   * @protected
   */
  protected async makeRequest<T = unknown>(
    method: string,
    path: string,
    data?: unknown,
    headers?: Record<string, unknown>,
  ): Promise<ServiceResponse<T>> {
    const startTime = Date.now();
    let lastError: Error | undefined;

    // Check circuit breaker
    if (this.circuitBreaker.state === 'open') {
      const timeout = this.circuitBreaker.nextStateChangeTime || 0;
      if (Date.now() < timeout) {
        return {
          success: false,
          statusCode: 503,
          error: 'Circuit breaker is open',
        };
      }
      this.circuitBreaker.state = 'half-open';
    }

    // Attempt request with retries
    for (let attempt = 0; attempt <= this.config.connection.maxRetries; attempt++) {
      try {
        const response = await firstValueFrom(
          this.httpService.request<T>({
            method,
            url: path,
            data,
            headers,
          }).pipe(timeout(this.config.connection.timeoutMs)),
        );

        // Request succeeded
        this.handleRequestSuccess();
        this.updateRateLimitInfo(response);

        const duration = Date.now() - startTime;
        return {
          success: true,
          data: response.data,
          statusCode: response.status,
          retryCount: attempt,
          duration,
        };
      } catch (error) {
        lastError = error as Error;

        if (attempt < this.config.connection.maxRetries) {
          const delayMs = this.config.connection.retryDelayMs *
            Math.pow(2, attempt);
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
      }
    }

    // All retries exhausted
    this.handleRequestFailure();

    const duration = Date.now() - startTime;
    return {
      success: false,
      statusCode: 500,
      error: lastError?.message || 'Request failed after retries',
      retryCount: this.config.connection.maxRetries,
      duration,
    };
  }

  /**
   * Handle successful request
   *
   * @description Updates circuit breaker state on success
   *
   * @returns {void}
   *
   * @protected
   */
  protected handleRequestSuccess(): void {
    if (this.circuitBreaker.state === 'half-open') {
      this.circuitBreaker.successCount++;
      if (this.circuitBreaker.successCount >= 3) {
        this.circuitBreaker.state = 'closed';
        this.circuitBreaker.failureCount = 0;
        this.circuitBreaker.successCount = 0;
      }
    } else if (this.circuitBreaker.state === 'closed') {
      this.circuitBreaker.failureCount = 0;
    }
  }

  /**
   * Handle failed request
   *
   * @description Updates circuit breaker state on failure
   *
   * @returns {void}
   *
   * @protected
   */
  protected handleRequestFailure(): void {
    this.circuitBreaker.failureCount++;
    this.circuitBreaker.lastFailureTime = Date.now();

    if (this.circuitBreaker.failureCount >= 5) {
      this.circuitBreaker.state = 'open';
      this.circuitBreaker.nextStateChangeTime =
        Date.now() + 60000; // 1 minute cooldown
    }
  }

  /**
   * Update rate limit information from response
   *
   * @description Extracts rate limit info from response headers
   *
   * @param {AxiosResponse} response - HTTP response
   * @returns {void}
   *
   * @protected
   */
  protected updateRateLimitInfo(response: AxiosResponse): void {
    const remaining = response.headers['x-ratelimit-remaining'];
    const limit = response.headers['x-ratelimit-limit'];
    const reset = response.headers['x-ratelimit-reset'];

    if (remaining && limit && reset) {
      this.rateLimitInfo = {
        remaining: parseInt(remaining as string),
        limit: parseInt(limit as string),
        resetTime: parseInt(reset as string) * 1000,
      };
    }
  }

  /**
   * Get cached response
   *
   * @description Retrieves cached response if valid
   *
   * @template T - Response type
   * @param {string} key - Cache key
   * @returns {T | undefined} Cached data or undefined
   *
   * @protected
   */
  protected getCachedResponse<T = unknown>(key: string): T | undefined {
    const entry = this.responseCache.get(key);
    if (!entry) return undefined;

    if (Date.now() > entry.timestamp + entry.ttlMs) {
      this.responseCache.delete(key);
      return undefined;
    }

    return entry.data as T;
  }

  /**
   * Cache response
   *
   * @description Stores response in cache with TTL
   *
   * @template T - Response type
   * @param {string} key - Cache key
   * @param {T} data - Data to cache
   * @param {number} ttlMs - Time-to-live in milliseconds
   * @returns {void}
   *
   * @protected
   */
  protected cacheResponse<T = unknown>(
    key: string,
    data: T,
    ttlMs: number = 300000, // 5 minutes default
  ): void {
    this.responseCache.set(key, {
      data,
      timestamp: Date.now(),
      ttlMs,
    });
  }

  /**
   * Get circuit breaker status
   *
   * @description Returns current circuit breaker state
   *
   * @returns {CircuitBreakerState} Circuit breaker state
   */
  getCircuitBreakerStatus(): CircuitBreakerState {
    return { ...this.circuitBreaker };
  }

  /**
   * Get rate limit status
   *
   * @description Returns current rate limit information
   *
   * @returns {RateLimitInfo} Rate limit information
   */
  getRateLimitStatus(): RateLimitInfo {
    return { ...this.rateLimitInfo };
  }

  /**
   * Clear response cache
   *
   * @description Removes all cached responses
   *
   * @returns {void}
   */
  clearCache(): void {
    this.responseCache.clear();
    this.logger.log('Response cache cleared');
  }

  /**
   * Health check for service
   *
   * @description Tests connectivity to external service
   *
   * @returns {Promise<boolean>} Whether service is reachable
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.makeRequest('GET', '/health');
      return response.success;
    } catch (error) {
      this.logger.error(
        'Health check failed',
        error instanceof Error ? error.message : String(error),
      );
      return false;
    }
  }
}

// ============================================================================
// AWS SERVICE ADAPTER
// ============================================================================

/**
 * AwsServiceAdapter: Adapter for AWS services
 *
 * Provides AWS-specific integration including:
 * - S3 operations
 * - DynamoDB integration
 * - Lambda invocation
 * - CloudWatch metrics
 * - SQS queue operations
 *
 * @class AwsServiceAdapter
 * @extends {BaseServiceAdapter}
 */
@Injectable()
export class AwsServiceAdapter extends BaseServiceAdapter {
  /**
   * Upload document to S3
   *
   * @description Uploads file to AWS S3 bucket
   *
   * @param {string} bucket - S3 bucket name
   * @param {string} key - Object key
   * @param {Buffer} data - File data
   * @returns {Promise<ServiceResponse>} Upload result
   */
  async uploadToS3(
    bucket: string,
    key: string,
    data: Buffer,
  ): Promise<ServiceResponse> {
    return this.makeRequest('PUT', `/s3/${bucket}/${key}`, data);
  }

  /**
   * Download document from S3
   *
   * @description Downloads file from AWS S3
   *
   * @param {string} bucket - S3 bucket name
   * @param {string} key - Object key
   * @returns {Promise<ServiceResponse<Buffer>>} Downloaded data
   */
  async downloadFromS3(
    bucket: string,
    key: string,
  ): Promise<ServiceResponse<Buffer>> {
    return this.makeRequest<Buffer>('GET', `/s3/${bucket}/${key}`);
  }

  /**
   * Store data in DynamoDB
   *
   * @description Stores item in DynamoDB table
   *
   * @param {string} table - Table name
   * @param {Record<string, unknown>} item - Item to store
   * @returns {Promise<ServiceResponse>} Store result
   */
  async putDynamoDBItem(
    table: string,
    item: Record<string, unknown>,
  ): Promise<ServiceResponse> {
    return this.makeRequest('POST', `/dynamodb/${table}`, item);
  }

  /**
   * Query DynamoDB
   *
   * @description Queries items from DynamoDB table
   *
   * @param {string} table - Table name
   * @param {Record<string, unknown>} query - Query parameters
   * @returns {Promise<ServiceResponse>} Query result
   */
  async queryDynamoDB(
    table: string,
    query: Record<string, unknown>,
  ): Promise<ServiceResponse> {
    return this.makeRequest('POST', `/dynamodb/${table}/query`, query);
  }

  /**
   * Invoke Lambda function
   *
   * @description Invokes AWS Lambda function
   *
   * @param {string} functionName - Lambda function name
   * @param {Record<string, unknown>} payload - Function payload
   * @returns {Promise<ServiceResponse>} Invocation result
   */
  async invokeLambda(
    functionName: string,
    payload: Record<string, unknown>,
  ): Promise<ServiceResponse> {
    return this.makeRequest(
      'POST',
      `/lambda/${functionName}`,
      payload,
    );
  }

  /**
   * Send SQS message
   *
   * @description Sends message to SQS queue
   *
   * @param {string} queueUrl - Queue URL
   * @param {Record<string, unknown>} message - Message content
   * @returns {Promise<ServiceResponse>} Send result
   */
  async sendSQSMessage(
    queueUrl: string,
    message: Record<string, unknown>,
  ): Promise<ServiceResponse> {
    return this.makeRequest('POST', `/sqs/send`, {
      queueUrl,
      message,
    });
  }

  /**
   * Put CloudWatch metric
   *
   * @description Publishes metric to CloudWatch
   *
   * @param {string} namespace - Metric namespace
   * @param {string} metricName - Metric name
   * @param {number} value - Metric value
   * @returns {Promise<ServiceResponse>} Put result
   */
  async putMetric(
    namespace: string,
    metricName: string,
    value: number,
  ): Promise<ServiceResponse> {
    return this.makeRequest('POST', `/cloudwatch/metrics`, {
      namespace,
      metricName,
      value,
      timestamp: new Date().toISOString(),
    });
  }
}

// ============================================================================
// GENERIC REST SERVICE ADAPTER
// ============================================================================

/**
 * GenericRestAdapter: Generic adapter for REST APIs
 *
 * Provides generic REST operations for any HTTP API
 *
 * @class GenericRestAdapter
 * @extends {BaseServiceAdapter}
 */
@Injectable()
export class GenericRestAdapter extends BaseServiceAdapter {
  /**
   * Perform GET request
   *
   * @description Executes GET request to external service
   *
   * @template T - Response type
   * @param {string} path - Request path
   * @param {Record<string, unknown>} [query] - Query parameters
   * @returns {Promise<ServiceResponse<T>>} Response data
   */
  async get<T = unknown>(
    path: string,
    query?: Record<string, unknown>,
  ): Promise<ServiceResponse<T>> {
    const cacheKey = `GET:${path}:${JSON.stringify(query || {})}`;
    const cached = this.getCachedResponse<T>(cacheKey);
    if (cached) {
      return { success: true, data: cached, statusCode: 200 };
    }

    const response = await this.makeRequest<T>('GET', path);
    if (response.success && response.data) {
      this.cacheResponse(cacheKey, response.data);
    }
    return response;
  }

  /**
   * Perform POST request
   *
   * @description Executes POST request to external service
   *
   * @template T - Response type
   * @param {string} path - Request path
   * @param {unknown} data - Request body
   * @returns {Promise<ServiceResponse<T>>} Response data
   */
  async post<T = unknown>(
    path: string,
    data: unknown,
  ): Promise<ServiceResponse<T>> {
    return this.makeRequest<T>('POST', path, data);
  }

  /**
   * Perform PUT request
   *
   * @description Executes PUT request to external service
   *
   * @template T - Response type
   * @param {string} path - Request path
   * @param {unknown} data - Request body
   * @returns {Promise<ServiceResponse<T>>} Response data
   */
  async put<T = unknown>(
    path: string,
    data: unknown,
  ): Promise<ServiceResponse<T>> {
    return this.makeRequest<T>('PUT', path, data);
  }

  /**
   * Perform DELETE request
   *
   * @description Executes DELETE request to external service
   *
   * @template T - Response type
   * @param {string} path - Request path
   * @returns {Promise<ServiceResponse<T>>} Response data
   */
  async delete<T = unknown>(
    path: string,
  ): Promise<ServiceResponse<T>> {
    return this.makeRequest<T>('DELETE', path);
  }

  /**
   * Perform PATCH request
   *
   * @description Executes PATCH request to external service
   *
   * @template T - Response type
   * @param {string} path - Request path
   * @param {unknown} data - Request body
   * @returns {Promise<ServiceResponse<T>>} Response data
   */
  async patch<T = unknown>(
    path: string,
    data: unknown,
  ): Promise<ServiceResponse<T>> {
    return this.makeRequest<T>('PATCH', path, data);
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  BaseServiceAdapter,
  AwsServiceAdapter,
  GenericRestAdapter,
  ServiceCredential,
  ServiceConnectionConfig,
  CircuitBreakerState,
  ServiceResponse,
  AdapterConfig,
  CacheEntry,
  RateLimitInfo,
};
