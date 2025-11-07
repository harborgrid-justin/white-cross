/**
 * Base API Client
 *
 * Provides common functionality for external API integrations with enterprise-grade features:
 * - Circuit breaker pattern to prevent cascading failures
 * - Rate limiting to respect API quotas
 * - Exponential backoff retry logic for resilient communication
 * - Comprehensive request/response logging
 * - Structured error handling
 *
 * This abstract class should be extended by specific API client implementations.
 * It integrates with NestJS's HttpService and Logger for seamless DI support.
 *
 * @module integrations/clients/BaseApiClient
 * @example
 * ```typescript
 * @Injectable()
 * export class MyApiClient extends BaseApiClient {
 *   constructor(httpService: HttpService, logger: Logger) {
 *     super('MyAPI', 'https://api.example.com', httpService, logger, {
 *       timeout: 30000,
 *       headers: { 'X-API-Key': 'secret' },
 *       circuitBreaker: { failureThreshold: 5 },
 *       rateLimit: { maxRequests: 100 }
 *     });
 *   }
 * }
 * ```
 */

import { HttpService } from '@nestjs/axios';
import { Logger } from '@nestjs/common';
import { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import { catchError, map, retry, delay } from 'rxjs/operators';
import { throwError } from 'rxjs';
import {
  CircuitState,
  CircuitBreakerConfig,
  CircuitBreakerStatus,
  RateLimiterConfig,
  RateLimiterStatus,
} from '../interfaces';

/**
 * Configuration options for BaseApiClient initialization
 */
export interface BaseApiClientConfig {
  /**
   * Request timeout in milliseconds
   * @default 30000 (30 seconds)
   */
  timeout?: number;

  /**
   * Default headers to include in all requests
   */
  headers?: Record<string, string>;

  /**
   * Circuit breaker configuration overrides
   */
  circuitBreaker?: Partial<CircuitBreakerConfig>;

  /**
   * Rate limiter configuration overrides
   */
  rateLimit?: Partial<RateLimiterConfig>;

  /**
   * Number of retry attempts for failed requests
   * @default 3
   */
  retryAttempts?: number;

  /**
   * Delay between retry attempts in milliseconds
   * @default 1000 (1 second)
   */
  retryDelay?: number;
}

/**
 * Base API Client abstract class
 *
 * Implements circuit breaker, rate limiting, and retry logic for robust API communication.
 * Designed to be extended by specific API client implementations.
 */
export abstract class BaseApiClient {
  /** API client name for logging and monitoring */
  protected readonly name: string;

  /** Base URL for the API */
  protected readonly baseURL: string;

  /** NestJS HttpService for making HTTP requests */
  protected readonly httpService: HttpService;

  /** NestJS Logger instance */
  protected readonly logger: Logger;

  /** Request configuration */
  protected readonly config: BaseApiClientConfig;

  // Circuit breaker state
  private circuitState: CircuitState = CircuitState.CLOSED;
  private failureCount = 0;
  private successCount = 0;
  private nextAttempt = Date.now();
  private circuitConfig: CircuitBreakerConfig = {
    failureThreshold: 5,
    successThreshold: 2,
    timeout: 60000, // 60 seconds
  };

  // Rate limiter state
  private requestTimestamps: number[] = [];
  private rateLimitConfig: RateLimiterConfig = {
    maxRequests: 100,
    windowMs: 60000, // 1 minute
  };

  /**
   * Constructor
   *
   * @param name - Name of the API client for logging
   * @param baseURL - Base URL for the API
   * @param httpService - NestJS HttpService instance
   * @param logger - NestJS Logger instance
   * @param config - Optional configuration overrides
   */
  constructor(
    name: string,
    baseURL: string,
    httpService: HttpService,
    logger: Logger,
    config?: BaseApiClientConfig,
  ) {
    this.name = name;
    this.baseURL = baseURL;
    this.httpService = httpService;
    this.logger = logger;
    this.config = {
      timeout: config?.timeout || 30000,
      headers: config?.headers || {},
      retryAttempts: config?.retryAttempts || 3,
      retryDelay: config?.retryDelay || 1000,
      ...config,
    };

    // Configure circuit breaker
    if (config?.circuitBreaker) {
      this.circuitConfig = {
        ...this.circuitConfig,
        ...config.circuitBreaker,
      };
    }

    // Configure rate limiter
    if (config?.rateLimit) {
      this.rateLimitConfig = {
        ...this.rateLimitConfig,
        ...config.rateLimit,
      };
    }
  }

  /**
   * Check circuit breaker state before making request
   *
   * @throws {Error} If circuit is OPEN and cooldown period hasn't elapsed
   * @private
   */
  private checkCircuitBreaker(): void {
    if (this.circuitState === CircuitState.OPEN) {
      if (Date.now() < this.nextAttempt) {
        const retryAfter = new Date(this.nextAttempt).toISOString();
        throw new Error(
          `Circuit breaker is OPEN for ${this.name} API. Retry after ${retryAfter}`,
        );
      }
      // Transition to HALF_OPEN to test if service has recovered
      this.circuitState = CircuitState.HALF_OPEN;
      this.successCount = 0;
      this.logger.log(
        `${this.name} API circuit breaker: OPEN -> HALF_OPEN`,
        BaseApiClient.name,
      );
    }
  }

  /**
   * Record successful request for circuit breaker state management
   *
   * @private
   */
  private recordSuccess(): void {
    this.failureCount = 0;

    if (this.circuitState === CircuitState.HALF_OPEN) {
      this.successCount++;

      // If enough successes in HALF_OPEN state, close the circuit
      if (this.successCount >= this.circuitConfig.successThreshold) {
        this.circuitState = CircuitState.CLOSED;
        this.successCount = 0;
        this.logger.log(
          `${this.name} API circuit breaker: HALF_OPEN -> CLOSED`,
          BaseApiClient.name,
        );
      }
    }
  }

  /**
   * Record failed request for circuit breaker state management
   *
   * @private
   */
  private recordFailure(): void {
    this.failureCount++;

    // If failure threshold exceeded, open the circuit
    if (this.failureCount >= this.circuitConfig.failureThreshold) {
      this.circuitState = CircuitState.OPEN;
      this.nextAttempt = Date.now() + this.circuitConfig.timeout;
      this.logger.error(
        `${this.name} API circuit breaker: CLOSED -> OPEN. ` +
          `Failures: ${this.failureCount}, Next attempt: ${new Date(this.nextAttempt).toISOString()}`,
        undefined,
        BaseApiClient.name,
      );
    }
  }

  /**
   * Check rate limit before making request
   *
   * @throws {Error} If rate limit is exceeded
   * @private
   */
  private checkRateLimit(): void {
    const now = Date.now();
    const windowStart = now - this.rateLimitConfig.windowMs;

    // Remove timestamps outside the current window
    this.requestTimestamps = this.requestTimestamps.filter(
      (ts) => ts > windowStart,
    );

    // Check if limit exceeded
    if (this.requestTimestamps.length >= this.rateLimitConfig.maxRequests) {
      const oldestTimestamp = this.requestTimestamps[0]!;
      const waitTime = oldestTimestamp + this.rateLimitConfig.windowMs - now;

      throw new Error(
        `Rate limit exceeded for ${this.name} API. ` +
          `Max ${this.rateLimitConfig.maxRequests} requests per ${this.rateLimitConfig.windowMs}ms. ` +
          `Retry after ${waitTime}ms`,
      );
    }

    // Record this request timestamp
    this.requestTimestamps.push(now);
  }

  /**
   * Build full URL from base URL and path
   *
   * @param url - URL path or full URL
   * @returns Full URL string
   * @private
   */
  private buildUrl(url: string): string {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    const baseUrl = this.baseURL.endsWith('/')
      ? this.baseURL.slice(0, -1)
      : this.baseURL;
    const path = url.startsWith('/') ? url : `/${url}`;
    return `${baseUrl}${path}`;
  }

  /**
   * Make HTTP request with circuit breaker, rate limiting, and retry logic
   *
   * @param config - Axios request configuration
   * @returns Promise resolving to Axios response
   * @throws {Error} If circuit is open, rate limit exceeded, or request fails after retries
   * @protected
   */
  protected async request<T = unknown>(
    config: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    // Check circuit breaker
    this.checkCircuitBreaker();

    // Check rate limit
    this.checkRateLimit();

    // Build full URL
    const url = this.buildUrl(config.url || '');

    // Merge with default config
    const requestConfig: AxiosRequestConfig = {
      ...config,
      url,
      timeout: config.timeout || this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
        ...this.config.headers,
        ...config.headers,
      },
    };

    this.logger.debug(
      `${this.name} API request: ${requestConfig.method?.toUpperCase()} ${url}`,
      BaseApiClient.name,
    );

    try {
      // Make request with retry logic using RxJS operators
      const response = await firstValueFrom(
        this.httpService.request<T>(requestConfig).pipe(
          retry({
            count: this.config.retryAttempts!,
            delay: (error: AxiosError, retryCount: number) => {
              // Only retry on network errors and 5xx errors
              const shouldRetry =
                !error.response ||
                (error.response.status >= 500 && error.response.status < 600);

              if (shouldRetry) {
                const delayMs =
                  this.config.retryDelay! * Math.pow(2, retryCount - 1);
                this.logger.warn(
                  `${this.name} API retry attempt ${retryCount} after ${delayMs}ms. Error: ${error.message}`,
                  BaseApiClient.name,
                );
                return throwError(() => error).pipe(delay(delayMs));
              }

              return throwError(() => error);
            },
          }),
          map((response) => {
            this.logger.debug(
              `${this.name} API response: ${response.status} ${url}`,
              BaseApiClient.name,
            );
            return response;
          }),
          catchError((error: AxiosError) => {
            this.logger.error(
              `${this.name} API error: ${error.message} ${url}`,
              error.stack,
              BaseApiClient.name,
            );
            return throwError(() => error);
          }),
        ),
      );

      this.recordSuccess();
      return response;
    } catch (error) {
      this.recordFailure();
      throw error;
    }
  }

  /**
   * Make GET request
   *
   * @param url - Request URL path
   * @param config - Optional Axios request configuration
   * @returns Promise resolving to Axios response
   * @protected
   */
  protected async get<T = unknown>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.request<T>({ ...config, method: 'GET', url });
  }

  /**
   * Make POST request
   *
   * @param url - Request URL path
   * @param data - Request body data
   * @param config - Optional Axios request configuration
   * @returns Promise resolving to Axios response
   * @protected
   */
  protected async post<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.request<T>({ ...config, method: 'POST', url, data });
  }

  /**
   * Make PUT request
   *
   * @param url - Request URL path
   * @param data - Request body data
   * @param config - Optional Axios request configuration
   * @returns Promise resolving to Axios response
   * @protected
   */
  protected async put<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.request<T>({ ...config, method: 'PUT', url, data });
  }

  /**
   * Make DELETE request
   *
   * @param url - Request URL path
   * @param config - Optional Axios request configuration
   * @returns Promise resolving to Axios response
   * @protected
   */
  protected async delete<T = unknown>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.request<T>({ ...config, method: 'DELETE', url });
  }

  /**
   * Get current circuit breaker status
   *
   * @returns Circuit breaker status information
   * @public
   */
  public getCircuitStatus(): CircuitBreakerStatus {
    return {
      state: this.circuitState,
      failures: this.failureCount,
      nextAttempt:
        this.circuitState === CircuitState.OPEN
          ? new Date(this.nextAttempt)
          : undefined,
    };
  }

  /**
   * Get current rate limit status
   *
   * @returns Rate limit status information
   * @public
   */
  public getRateLimitStatus(): RateLimiterStatus {
    const now = Date.now();
    const windowStart = now - this.rateLimitConfig.windowMs;
    const currentRequests = this.requestTimestamps.filter(
      (ts) => ts > windowStart,
    ).length;

    return {
      current: currentRequests,
      max: this.rateLimitConfig.maxRequests,
      window: this.rateLimitConfig.windowMs,
    };
  }

  /**
   * Reset circuit breaker to CLOSED state
   *
   * Useful for testing or manual intervention when you know the service has recovered.
   *
   * @public
   */
  public resetCircuitBreaker(): void {
    this.circuitState = CircuitState.CLOSED;
    this.failureCount = 0;
    this.successCount = 0;
    this.logger.log(
      `${this.name} API circuit breaker reset to CLOSED`,
      BaseApiClient.name,
    );
  }
}
