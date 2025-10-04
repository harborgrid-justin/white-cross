import { AxiosError, AxiosResponse } from 'axios';
import { ApiResponse, PaginationParams } from '../types';

// Error handling utilities
export class ApiError extends Error {
  public readonly status: number;
  public readonly code?: string;
  public readonly details?: any;

  constructor(message: string, status: number = 500, code?: string, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export const handleApiError = (error: AxiosError): never => {
  const response = error.response;
  const responseData = response?.data as any;
  const message = responseData?.error?.message || error.message || 'An unexpected error occurred';
  const status = response?.status || 500;
  const code = responseData?.error?.code;
  const details = responseData?.error?.details;

  throw new ApiError(message, status, code, details);
};

// Response data extraction utilities
export const extractApiData = <T>(response: AxiosResponse<ApiResponse<T>>): T => {
  if (!response.data.success) {
    throw new ApiError(
      response.data.error?.message || 'API request failed',
      response.status,
      response.data.error?.code,
      response.data.error?.details
    );
  }

  if (response.data.data === undefined) {
    throw new ApiError('No data returned from API', response.status);
  }

  return response.data.data;
};

export const extractApiDataOptional = <T>(response: AxiosResponse<ApiResponse<T>>): T | null => {
  if (!response.data.success) {
    throw new ApiError(
      response.data.error?.message || 'API request failed',
      response.status,
      response.data.error?.code,
      response.data.error?.details
    );
  }

  return response.data.data || null;
};

// URL parameter utilities
export const buildUrlParams = (params: Record<string, any>): URLSearchParams => {
  const urlParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(item => urlParams.append(key, String(item)));
      } else {
        urlParams.append(key, String(value));
      }
    }
  });
  
  return urlParams;
};

export const buildPaginationParams = (pagination?: PaginationParams): URLSearchParams => {
  const params = new URLSearchParams();
  
  if (pagination?.page) {
    params.append('page', pagination.page.toString());
  }
  
  if (pagination?.limit) {
    params.append('limit', pagination.limit.toString());
  }
  
  return params;
};

// Date utilities for API
export const formatDateForApi = (date: Date | string): string => {
  if (typeof date === 'string') {
    return date;
  }
  return date.toISOString();
};

export const parseDateFromApi = (dateString: string): Date => {
  return new Date(dateString);
};

// Retry utilities
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const withRetry = async <T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (i === retries) {
        break;
      }
      
      // Don't retry on client errors (4xx)
      if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
        break;
      }
      
      await sleep(delay * Math.pow(2, i)); // Exponential backoff
    }
  }
  
  throw lastError!;
};

// File upload utilities
export const createFormData = (data: Record<string, any>): FormData => {
  const formData = new FormData();
  
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (item instanceof File) {
            formData.append(`${key}[${index}]`, item);
          } else {
            formData.append(`${key}[${index}]`, String(item));
          }
        });
      } else if (typeof value === 'object') {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    }
  });
  
  return formData;
};

// Response type guards
export const isApiResponse = <T>(response: any): response is ApiResponse<T> => {
  return (
    typeof response === 'object' &&
    response !== null &&
    typeof response.success === 'boolean'
  );
};

export const isPaginatedResponse = <T>(response: any): response is { data: T[]; pagination: any } => {
  return (
    typeof response === 'object' &&
    response !== null &&
    Array.isArray(response.data) &&
    typeof response.pagination === 'object'
  );
};

// Cache utilities (simple in-memory cache)
class SimpleCache {
  private cache = new Map<string, { data: any; expiry: number }>();

  set(key: string, data: any, ttlMs: number = 5 * 60 * 1000): void {
    const expiry = Date.now() + ttlMs;
    this.cache.set(key, { data, expiry });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }
    
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data as T;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return false;
    }
    
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }
}

export const apiCache = new SimpleCache();

// Cached API call wrapper
export const withCache = async <T>(
  key: string,
  fn: () => Promise<T>,
  ttlMs: number = 5 * 60 * 1000
): Promise<T> => {
  // Check cache first
  const cached = apiCache.get<T>(key);
  if (cached !== null) {
    return cached;
  }
  
  // Execute function and cache result
  const result = await fn();
  apiCache.set(key, result, ttlMs);
  
  return result;
};

// Debounce utility for search/filter operations
export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  waitMs: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), waitMs);
  };
};

// Request cancellation utilities
export const createCancelTokenSource = () => {
  if (typeof AbortController !== 'undefined') {
    return new AbortController();
  }
  
  // Fallback for older environments
  return {
    signal: null,
    abort: () => {},
  };
};
