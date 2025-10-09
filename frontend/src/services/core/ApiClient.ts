/**
 * Enhanced API Client with enterprise-grade error handling and interceptors
 * Provides type-safe HTTP methods with comprehensive error handling
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { API_CONFIG } from '../../constants/config';
import { API_ENDPOINTS, HTTP_STATUS } from '../../constants/api';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiErrorResponse {
  message: string;
  code?: string;
  status?: number;
  details?: unknown;
  field?: string;
  traceId?: string;
  timestamp?: string;
}

export class ApiClientError extends Error {
  public readonly code?: string;
  public readonly status?: number;
  public readonly details?: unknown;
  public readonly traceId?: string;
  public readonly isNetworkError: boolean;
  public readonly isServerError: boolean;
  public readonly isValidationError: boolean;

  constructor(error: ApiErrorResponse) {
    super(error.message);
    this.name = 'ApiClientError';
    this.code = error.code;
    this.status = error.status;
    this.details = error.details;
    this.traceId = error.traceId;

    // Classify error types
    this.isNetworkError = error.code === 'NETWORK_ERROR';
    this.isServerError = (error.status ?? 0) >= 500;
    this.isValidationError = error.status === 400;

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiClientError);
    }
  }
}

// ==========================================
// INTERCEPTOR TYPES
// ==========================================

export interface RequestInterceptor {
  onFulfilled?: (config: AxiosRequestConfig) => AxiosRequestConfig | Promise<AxiosRequestConfig>;
  onRejected?: (error: unknown) => unknown;
}

export interface ResponseInterceptor {
  onFulfilled?: (response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>;
  onRejected?: (error: unknown) => unknown;
}

// ==========================================
// API CLIENT CONFIGURATION
// ==========================================

export interface ApiClientConfig {
  baseURL?: string;
  timeout?: number;
  withCredentials?: boolean;
  enableLogging?: boolean;
  enableRetry?: boolean;
  maxRetries?: number;
  retryDelay?: number;
  requestInterceptors?: RequestInterceptor[];
  responseInterceptors?: ResponseInterceptor[];
}

// ==========================================
// API CLIENT CLASS
// ==========================================

export class ApiClient {
  private instance: AxiosInstance;
  private enableLogging: boolean;
  private enableRetry: boolean;
  private maxRetries: number;
  private retryDelay: number;
  private requestInterceptorIds: number[] = [];
  private responseInterceptorIds: number[] = [];

  constructor(config: ApiClientConfig = {}) {
    this.enableLogging = config.enableLogging ?? true;
    this.enableRetry = config.enableRetry ?? true;
    this.maxRetries = config.maxRetries ?? API_CONFIG.RETRY_ATTEMPTS;
    this.retryDelay = config.retryDelay ?? API_CONFIG.RETRY_DELAY;

    // Create axios instance
    this.instance = axios.create({
      baseURL: config.baseURL ?? API_CONFIG.BASE_URL,
      timeout: config.timeout ?? API_CONFIG.TIMEOUT,
      withCredentials: config.withCredentials ?? true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Setup default interceptors
    this.setupDefaultInterceptors();

    // Add custom interceptors
    if (config.requestInterceptors) {
      config.requestInterceptors.forEach(interceptor => this.addRequestInterceptor(interceptor));
    }
    if (config.responseInterceptors) {
      config.responseInterceptors.forEach(interceptor => this.addResponseInterceptor(interceptor));
    }
  }

  // ==========================================
  // INTERCEPTOR SETUP
  // ==========================================

  private setupDefaultInterceptors(): void {
    // Request interceptor: Add auth token
    const authRequestId = this.instance.interceptors.request.use(
      (config) => {
        const token = this.getAuthToken();
        if (token) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Add request ID for tracing
        config.headers = config.headers || {};
        config.headers['X-Request-ID'] = this.generateRequestId();

        // Log request in development
        if (this.enableLogging && import.meta.env.DEV) {
          console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
            headers: config.headers,
            data: config.data,
          });
        }

        return config;
      },
      (error) => {
        if (this.enableLogging && import.meta.env.DEV) {
          console.error('[API Request Error]', error);
        }
        return Promise.reject(this.normalizeError(error));
      }
    );
    this.requestInterceptorIds.push(authRequestId);

    // Response interceptor: Handle token refresh and errors
    const authResponseId = this.instance.interceptors.response.use(
      (response) => {
        // Log response in development
        if (this.enableLogging && import.meta.env.DEV) {
          console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
            status: response.status,
            data: response.data,
          });
        }
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean; _retryCount?: number };

        // Handle 401 - Token refresh
        if (error.response?.status === HTTP_STATUS.UNAUTHORIZED && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await this.refreshAuthToken();
            if (newToken && originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return this.instance(originalRequest);
            }
          } catch (refreshError) {
            this.handleAuthFailure();
            return Promise.reject(this.normalizeError(refreshError));
          }
        }

        // Handle retryable errors
        if (this.enableRetry && this.isRetryableError(error) && !originalRequest._retry) {
          const retryCount = originalRequest._retryCount || 0;

          if (retryCount < this.maxRetries) {
            originalRequest._retryCount = retryCount + 1;

            // Exponential backoff
            const delay = this.retryDelay * Math.pow(2, retryCount);
            await this.sleep(delay);

            if (this.enableLogging && import.meta.env.DEV) {
              console.log(`[API Retry] Attempt ${retryCount + 1}/${this.maxRetries} for ${originalRequest.url}`);
            }

            return this.instance(originalRequest);
          }
        }

        // Log error
        if (this.enableLogging) {
          console.error('[API Response Error]', {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            message: error.message,
            data: error.response?.data,
          });
        }

        return Promise.reject(this.normalizeError(error));
      }
    );
    this.responseInterceptorIds.push(authResponseId);
  }

  // ==========================================
  // INTERCEPTOR MANAGEMENT
  // ==========================================

  public addRequestInterceptor(interceptor: RequestInterceptor): number {
    const id = this.instance.interceptors.request.use(
      interceptor.onFulfilled,
      interceptor.onRejected
    );
    this.requestInterceptorIds.push(id);
    return id;
  }

  public addResponseInterceptor(interceptor: ResponseInterceptor): number {
    const id = this.instance.interceptors.response.use(
      interceptor.onFulfilled,
      interceptor.onRejected
    );
    this.responseInterceptorIds.push(id);
    return id;
  }

  public removeRequestInterceptor(id: number): void {
    this.instance.interceptors.request.eject(id);
    this.requestInterceptorIds = this.requestInterceptorIds.filter(i => i !== id);
  }

  public removeResponseInterceptor(id: number): void {
    this.instance.interceptors.response.eject(id);
    this.responseInterceptorIds = this.responseInterceptorIds.filter(i => i !== id);
  }

  // ==========================================
  // HTTP METHODS
  // ==========================================

  public async get<T = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.get<ApiResponse<T>>(url, config);
    return response.data;
  }

  public async post<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.post<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  public async put<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.put<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  public async patch<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.patch<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  public async delete<T = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.delete<ApiResponse<T>>(url, config);
    return response.data;
  }

  // ==========================================
  // UTILITY METHODS
  // ==========================================

  private getAuthToken(): string | null {
    // Try Zustand persist storage first
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      try {
        const parsed = JSON.parse(authStorage);
        return parsed.state?.token || null;
      } catch {
        // Ignore parse errors
      }
    }

    // Fallback to direct token
    return localStorage.getItem('auth_token');
  }

  private async refreshAuthToken(): Promise<string | null> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await axios.post<{ token: string }>(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.AUTH.REFRESH}`,
        { refreshToken }
      );

      const { token } = response.data;

      // Update token in storage
      const authStorage = localStorage.getItem('auth-storage');
      if (authStorage) {
        try {
          const parsed = JSON.parse(authStorage);
          parsed.state.token = token;
          localStorage.setItem('auth-storage', JSON.stringify(parsed));
        } catch {
          // Ignore parse errors
        }
      }
      localStorage.setItem('auth_token', token);

      return token;
    } catch (error) {
      this.handleAuthFailure();
      throw error;
    }
  }

  private handleAuthFailure(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('auth-storage');

    // Redirect to login if not already there
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }

  private isRetryableError(error: AxiosError): boolean {
    // Network errors
    if (!error.response) {
      return true;
    }

    // Server errors (5xx)
    const status = error.response.status;
    if (status >= 500 && status < 600) {
      return true;
    }

    // Rate limiting
    if (status === HTTP_STATUS.TOO_MANY_REQUESTS) {
      return true;
    }

    return false;
  }

  private normalizeError(error: unknown): ApiClientError {
    if (error instanceof ApiClientError) {
      return error;
    }

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ message?: string; code?: string; errors?: unknown }>;

      if (axiosError.response) {
        // Server responded with error
        return new ApiClientError({
          message: axiosError.response.data?.message || `Request failed with status ${axiosError.response.status}`,
          code: axiosError.response.data?.code,
          status: axiosError.response.status,
          details: axiosError.response.data?.errors,
        });
      } else if (axiosError.request) {
        // Network error
        return new ApiClientError({
          message: 'Network error - please check your connection',
          code: 'NETWORK_ERROR',
        });
      }
    }

    // Unknown error
    return new ApiClientError({
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR',
    });
  }

  private generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ==========================================
  // ACCESSOR METHODS
  // ==========================================

  public getAxiosInstance(): AxiosInstance {
    return this.instance;
  }

  public setLogging(enabled: boolean): void {
    this.enableLogging = enabled;
  }

  public setRetry(enabled: boolean): void {
    this.enableRetry = enabled;
  }
}

// ==========================================
// SINGLETON INSTANCE
// ==========================================

export const apiClient = new ApiClient({
  enableLogging: import.meta.env.DEV,
  enableRetry: true,
});
