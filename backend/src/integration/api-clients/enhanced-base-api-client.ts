import { Injectable, Logger } from '@nestjs/common';
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios';
import axiosRetry from 'axios-retry';
import { CircuitBreakerService } from '../services/circuit-breaker.service';
import { RateLimiterService } from '../services/rate-limiter.service';

/**
 * Enhanced Base API Client
 * Provides common functionality for external API integrations:
 * - Circuit breaker pattern
 * - Rate limiting with sliding window
 * - Retry logic with exponential backoff
 * - Request/response logging
 * - Error handling
 */
@Injectable()
export class EnhancedBaseApiClient {
  protected client: AxiosInstance;
  protected readonly logger: Logger;
  protected serviceName: string;

  constructor(
    serviceName: string,
    baseURL: string,
    private readonly circuitBreaker: CircuitBreakerService,
    private readonly rateLimiter: RateLimiterService,
    config?: {
      timeout?: number;
      headers?: Record<string, string>;
      retryAttempts?: number;
      circuitBreaker?: { failureThreshold?: number; timeout?: number };
      rateLimit?: { maxRequests?: number; windowMs?: number };
    },
  ) {
    this.serviceName = serviceName;
    this.logger = new Logger(`${serviceName}ApiClient`);

    // Create axios instance
    this.client = axios.create({
      baseURL,
      timeout: config?.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      },
    });

    // Initialize circuit breaker
    this.circuitBreaker.initialize(serviceName, config?.circuitBreaker);

    // Initialize rate limiter
    this.rateLimiter.initialize(serviceName, config?.rateLimit);

    // Configure retry logic
    axiosRetry(this.client, {
      retries: config?.retryAttempts || 3,
      retryDelay: axiosRetry.exponentialDelay,
      retryCondition: (error: AxiosError) => {
        return (
          axiosRetry.isNetworkOrIdempotentRequestError(error) ||
          (error.response?.status !== undefined && error.response.status >= 500)
        );
      },
      onRetry: (retryCount, error, requestConfig) => {
        this.logger.warn(
          `${this.serviceName} API retry attempt ${retryCount}`,
          {
            url: requestConfig.url,
            method: requestConfig.method,
            error: error.message,
          },
        );
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        this.logger.debug(`${this.serviceName} API request`, {
          method: config.method,
          url: config.url,
          params: config.params,
        });
        return config;
      },
      (error) => {
        this.logger.error(`${this.serviceName} API request error`, error);
        return Promise.reject(error);
      },
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        this.logger.debug(`${this.serviceName} API response`, {
          status: response.status,
          url: response.config.url,
        });
        return response;
      },
      (error: AxiosError) => {
        this.logger.error(`${this.serviceName} API response error`, {
          status: error.response?.status,
          message: error.message,
          url: error.config?.url,
        });
        return Promise.reject(error);
      },
    );
  }

  /**
   * Make HTTP request with circuit breaker and rate limiting
   */
  protected async request<T = any>(
    config: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    // Check rate limit
    await this.rateLimiter.checkLimit(this.serviceName);

    // Execute with circuit breaker protection
    return this.circuitBreaker.execute(this.serviceName, async () => {
      return this.client.request<T>(config);
    });
  }

  /**
   * GET request
   */
  protected async get<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.request<T>({ ...config, method: 'GET', url });
  }

  /**
   * POST request
   */
  protected async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.request<T>({ ...config, method: 'POST', url, data });
  }

  /**
   * PUT request
   */
  protected async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.request<T>({ ...config, method: 'PUT', url, data });
  }

  /**
   * DELETE request
   */
  protected async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.request<T>({ ...config, method: 'DELETE', url });
  }

  /**
   * PATCH request
   */
  protected async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.request<T>({ ...config, method: 'PATCH', url, data });
  }

  /**
   * Get circuit breaker status
   */
  getCircuitStatus() {
    return this.circuitBreaker.getStatus(this.serviceName);
  }

  /**
   * Get rate limit status
   */
  getRateLimitStatus() {
    return this.rateLimiter.getStatus(this.serviceName);
  }

  /**
   * Reset circuit breaker
   */
  resetCircuitBreaker(): void {
    this.circuitBreaker.reset(this.serviceName);
  }

  /**
   * Reset rate limiter
   */
  resetRateLimiter(): void {
    this.rateLimiter.reset(this.serviceName);
  }
}
