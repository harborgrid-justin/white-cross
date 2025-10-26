/**
 * Base API Client
 *
 * Provides common functionality for external API integrations:
 * - Retry logic with exponential backoff
 * - Circuit breaker pattern
 * - Rate limiting
 * - Request/response logging
 * - Error handling
 *
 * @module integrations/clients/BaseApiClient
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import axiosRetry from 'axios-retry';
import { logger } from '../../utils/logger';

/**
 * Circuit breaker states
 */
enum CircuitState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN'
}

/**
 * Circuit breaker configuration
 */
interface CircuitBreakerConfig {
  failureThreshold: number;
  successThreshold: number;
  timeout: number;
}

/**
 * Rate limiter configuration
 */
interface RateLimiterConfig {
  maxRequests: number;
  windowMs: number;
}

/**
 * Base API Client class
 */
export abstract class BaseApiClient {
  protected client: AxiosInstance;
  protected name: string;

  // Circuit breaker state
  private circuitState: CircuitState = CircuitState.CLOSED;
  private failureCount = 0;
  private successCount = 0;
  private nextAttempt = Date.now();
  private circuitConfig: CircuitBreakerConfig = {
    failureThreshold: 5,
    successThreshold: 2,
    timeout: 60000 // 60 seconds
  };

  // Rate limiter state
  private requestTimestamps: number[] = [];
  private rateLimitConfig: RateLimiterConfig = {
    maxRequests: 100,
    windowMs: 60000 // 1 minute
  };

  /**
   * Constructor
   */
  constructor(
    name: string,
    baseURL: string,
    config?: {
      timeout?: number;
      headers?: Record<string, string>;
      circuitBreaker?: Partial<CircuitBreakerConfig>;
      rateLimit?: Partial<RateLimiterConfig>;
    }
  ) {
    this.name = name;

    // Create axios instance
    this.client = axios.create({
      baseURL,
      timeout: config?.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers
      }
    });

    // Configure circuit breaker
    if (config?.circuitBreaker) {
      this.circuitConfig = { ...this.circuitConfig, ...config.circuitBreaker };
    }

    // Configure rate limiter
    if (config?.rateLimit) {
      this.rateLimitConfig = { ...this.rateLimitConfig, ...config.rateLimit };
    }

    // Configure retry logic
    axiosRetry(this.client, {
      retries: 3,
      retryDelay: axiosRetry.exponentialDelay,
      retryCondition: (error: AxiosError) => {
        // Retry on network errors and 5xx errors
        return (
          axiosRetry.isNetworkOrIdempotentRequestError(error) ||
          (error.response?.status !== undefined && error.response.status >= 500)
        );
      },
      onRetry: (retryCount, error, requestConfig) => {
        logger.warn(`${this.name} API retry attempt ${retryCount}`, {
          url: requestConfig.url,
          method: requestConfig.method,
          error: error.message
        });
      }
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        logger.debug(`${this.name} API request`, {
          method: config.method,
          url: config.url,
          params: config.params
        });
        return config;
      },
      (error) => {
        logger.error(`${this.name} API request error`, error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        logger.debug(`${this.name} API response`, {
          status: response.status,
          url: response.config.url
        });
        return response;
      },
      (error: AxiosError) => {
        logger.error(`${this.name} API response error`, {
          status: error.response?.status,
          message: error.message,
          url: error.config?.url
        });
        return Promise.reject(error);
      }
    );
  }

  /**
   * Check circuit breaker state
   */
  private checkCircuitBreaker(): void {
    if (this.circuitState === CircuitState.OPEN) {
      if (Date.now() < this.nextAttempt) {
        throw new Error(`Circuit breaker is OPEN for ${this.name} API. Retry after ${new Date(this.nextAttempt).toISOString()}`);
      }
      // Transition to HALF_OPEN
      this.circuitState = CircuitState.HALF_OPEN;
      this.successCount = 0;
      logger.info(`${this.name} API circuit breaker: OPEN -> HALF_OPEN`);
    }
  }

  /**
   * Record successful request
   */
  private recordSuccess(): void {
    this.failureCount = 0;

    if (this.circuitState === CircuitState.HALF_OPEN) {
      this.successCount++;

      if (this.successCount >= this.circuitConfig.successThreshold) {
        this.circuitState = CircuitState.CLOSED;
        this.successCount = 0;
        logger.info(`${this.name} API circuit breaker: HALF_OPEN -> CLOSED`);
      }
    }
  }

  /**
   * Record failed request
   */
  private recordFailure(): void {
    this.failureCount++;

    if (this.failureCount >= this.circuitConfig.failureThreshold) {
      this.circuitState = CircuitState.OPEN;
      this.nextAttempt = Date.now() + this.circuitConfig.timeout;
      logger.error(`${this.name} API circuit breaker: CLOSED -> OPEN`, {
        failures: this.failureCount,
        nextAttempt: new Date(this.nextAttempt).toISOString()
      });
    }
  }

  /**
   * Check rate limit
   */
  private checkRateLimit(): void {
    const now = Date.now();
    const windowStart = now - this.rateLimitConfig.windowMs;

    // Remove old timestamps
    this.requestTimestamps = this.requestTimestamps.filter(ts => ts > windowStart);

    // Check if limit exceeded
    if (this.requestTimestamps.length >= this.rateLimitConfig.maxRequests) {
      const oldestTimestamp = this.requestTimestamps[0];
      const waitTime = oldestTimestamp + this.rateLimitConfig.windowMs - now;

      throw new Error(
        `Rate limit exceeded for ${this.name} API. ` +
        `Max ${this.rateLimitConfig.maxRequests} requests per ${this.rateLimitConfig.windowMs}ms. ` +
        `Retry after ${waitTime}ms`
      );
    }

    // Record this request
    this.requestTimestamps.push(now);
  }

  /**
   * Make HTTP request with circuit breaker and rate limiting
   */
  protected async request<T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    // Check circuit breaker
    this.checkCircuitBreaker();

    // Check rate limit
    this.checkRateLimit();

    try {
      const response = await this.client.request<T>(config);
      this.recordSuccess();
      return response;
    } catch (error) {
      this.recordFailure();
      throw error;
    }
  }

  /**
   * GET request
   */
  protected async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.request<T>({ ...config, method: 'GET', url });
  }

  /**
   * POST request
   */
  protected async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.request<T>({ ...config, method: 'POST', url, data });
  }

  /**
   * PUT request
   */
  protected async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.request<T>({ ...config, method: 'PUT', url, data });
  }

  /**
   * DELETE request
   */
  protected async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.request<T>({ ...config, method: 'DELETE', url });
  }

  /**
   * Get circuit breaker status
   */
  getCircuitStatus(): { state: CircuitState; failures: number; nextAttempt?: Date } {
    return {
      state: this.circuitState,
      failures: this.failureCount,
      nextAttempt: this.circuitState === CircuitState.OPEN ? new Date(this.nextAttempt) : undefined
    };
  }

  /**
   * Get rate limit status
   */
  getRateLimitStatus(): { current: number; max: number; window: number } {
    const now = Date.now();
    const windowStart = now - this.rateLimitConfig.windowMs;
    const currentRequests = this.requestTimestamps.filter(ts => ts > windowStart).length;

    return {
      current: currentRequests,
      max: this.rateLimitConfig.maxRequests,
      window: this.rateLimitConfig.windowMs
    };
  }

  /**
   * Reset circuit breaker (for testing or manual intervention)
   */
  resetCircuitBreaker(): void {
    this.circuitState = CircuitState.CLOSED;
    this.failureCount = 0;
    this.successCount = 0;
    logger.info(`${this.name} API circuit breaker reset to CLOSED`);
  }
}

export default BaseApiClient;
