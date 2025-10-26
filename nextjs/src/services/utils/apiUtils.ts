/**
 * WF-COMP-302 | apiUtils.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: axios, moment, debug
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants, interfaces, classes | Key Features: component
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

import { AxiosResponse, AxiosError } from 'axios';
import moment from 'moment';
import debug from 'debug';

const log = debug('whitecross:api-utils');

// Standard API response interface
export interface ApiResponse<T = any> {
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

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: any;
}

// Error handling utilities
export class ApiErrorHandler {
  static handle(error: AxiosError | any): ApiError {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      return {
        message: data?.message || `Request failed with status ${status}`,
        code: data?.code,
        status,
        details: data?.errors || data?.details,
      };
    } else if (error.request) {
      // Network error
      return {
        message: 'Network error - please check your connection',
        code: 'NETWORK_ERROR',
        details: error.request,
      };
    } else {
      // Other error
      return {
        message: error.message || 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR',
        details: error,
      };
    }
  }

  static isNetworkError(error: ApiError): boolean {
    return error.code === 'NETWORK_ERROR';
  }

  static isValidationError(error: ApiError): boolean {
    return error.status === 400 && error.details;
  }

  static isUnauthorizedError(error: ApiError): boolean {
    return error.status === 401;
  }

  static isForbiddenError(error: ApiError): boolean {
    return error.status === 403;
  }

  static isNotFoundError(error: ApiError): boolean {
    return error.status === 404;
  }

  static isServerError(error: ApiError): boolean {
    return (error.status ?? 0) >= 500;
  }
}

// Data extraction utilities
export const extractApiData = <T>(response: AxiosResponse<ApiResponse<T>>): T => {
  if (response.data.success && response.data.data !== undefined) {
    return response.data.data;
  }
  throw new Error('API request failed');
};

export const extractApiDataOptional = <T>(
  response: AxiosResponse<ApiResponse<T>>
): T | null => {
  try {
    return extractApiData(response);
  } catch {
    return null;
  }
};

// URL and query parameter utilities
export const buildUrlParams = (params: Record<string, any>): string => {
  const urlParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      urlParams.append(key, String(value));
    }
  });

  const paramsString = urlParams.toString();
  return paramsString ? `?${paramsString}` : '';
};

export const buildPaginationParams = (
  page: number = 1,
  limit: number = 10,
  sort?: string,
  order?: 'asc' | 'desc'
): string => {
  const params: Record<string, any> = {
    page,
    limit,
  };

  if (sort) params.sort = sort;
  if (order) params.order = order;

  return buildUrlParams(params);
};

// Date formatting utilities with moment integration
export const formatDateForApi = (date: Date | string | moment.Moment): string => {
  try {
    if (moment.isMoment(date)) {
      return date.toISOString();
    }

    if (typeof date === 'string') {
      // Validate if it's already a valid ISO string
      if (moment(date, moment.ISO_8601, true).isValid()) {
        return date;
      }
      return moment(date).toISOString();
    }

    if (date instanceof Date) {
      return moment(date).toISOString();
    }

    throw new Error('Invalid date format');
  } catch (error) {
    log('Error formatting date for API:', error);
    return moment().toISOString(); // Fallback to current time
  }
};

export const parseDateFromApi = (dateString: string): Date => {
  try {
    const momentDate = moment(dateString);
    if (momentDate.isValid()) {
      return momentDate.toDate();
    }
    throw new Error('Invalid date string');
  } catch (error) {
    log('Error parsing date from API:', error);
    return new Date(); // Fallback to current date
  }
};

// Enhanced date utilities
export const formatDateForDisplay = (date: Date | string | moment.Moment): string => {
  try {
    return moment(date).format('MMM DD, YYYY');
  } catch (error) {
    log('Error formatting date for display:', error);
    return 'Invalid Date';
  }
};

export const formatDateTimeForDisplay = (date: Date | string | moment.Moment): string => {
  try {
    return moment(date).format('MMM DD, YYYY HH:mm');
  } catch (error) {
    log('Error formatting datetime for display:', error);
    return 'Invalid Date';
  }
};

export const isDateExpired = (date: Date | string | moment.Moment): boolean => {
  try {
    return moment(date).isBefore(moment());
  } catch (error) {
    log('Error checking if date is expired:', error);
    return false;
  }
};

export const getTimeUntilExpiry = (date: Date | string | moment.Moment): string => {
  try {
    const expiry = moment(date);
    const now = moment();
    const diff = expiry.diff(now);

    if (diff <= 0) return 'Expired';

    const duration = moment.duration(diff);
    const days = Math.floor(duration.asDays());
    const hours = Math.floor(duration.asHours()) % 24;
    const minutes = Math.floor(duration.asMinutes()) % 60;

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  } catch (error) {
    log('Error calculating time until expiry:', error);
    return 'Unknown';
  }
};

// Retry utility
export const withRetry = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;

  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (i === maxRetries) {
        throw lastError;
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }

  throw lastError!;
};

// Form data utility
export const createFormData = (data: Record<string, any>): FormData => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          formData.append(`${key}[${index}]`, item);
        });
      } else {
        formData.append(key, String(value));
      }
    }
  });

  return formData;
};

// Type guards
export const isApiResponse = (obj: any): obj is ApiResponse => {
  return obj && typeof obj === 'object' && 'success' in obj && 'data' in obj;
};

export const isPaginatedResponse = <T>(obj: any): obj is PaginatedResponse<T> => {
  return obj && typeof obj === 'object' && 'data' in obj && 'pagination' in obj;
};

// Cache utilities (simple in-memory cache)
class ApiCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);

    if (!item) return null;

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Generate cache key from URL and params
  generateKey(url: string, params?: Record<string, any>): string {
    const paramsString = params ? JSON.stringify(params) : '';
    return `${url}:${paramsString}`;
  }
}

export const apiCache = new ApiCache();

// Higher-order function to add caching to API calls
export const withCache = <T extends any[], R>(
  fn: (...args: T) => Promise<R>
) => {
  return async (...args: T): Promise<R> => {
    // For now, just call the function without caching
    // In a real implementation, you'd want to generate a cache key from the args
    return fn(...args);
  };
};

// Debounce utility for search inputs
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Cancel token utility (deprecated in newer axios versions)
// export const createCancelTokenSource = () => {
//   return CancelToken.source();
// };

// Export error handler instance
export const handleApiError = ApiErrorHandler.handle;
