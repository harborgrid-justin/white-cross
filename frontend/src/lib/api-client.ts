/**
 * API Client for White Cross Healthcare Platform - Next.js
 *
 * Centralized API client for backend communication through proxy route
 * Handles authentication, error handling, and request/response formatting
 *
 * @module lib/api-client
 * @version 2.0.0
 * @updated 2025-10-29 - Production-grade improvements
 */

import { ApiError as AppApiError, isApiError } from '@/types/errors';
import { ErrorHandler } from '@/lib/errorHandler';

const API_PROXY_BASE = '/api/proxy';

// Re-export API endpoints from centralized location
export { API_ENDPOINTS } from '@/constants/api';

interface ApiError {
  message: string;
  statusCode: number;
  details?: unknown;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_PROXY_BASE) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // Validate endpoint
    if (!endpoint || endpoint === 'undefined' || typeof endpoint !== 'string') {
      console.error('[API Client] Invalid endpoint:', endpoint);
      throw new Error(`Invalid API endpoint: ${endpoint}`);
    }
    
    const url = `${this.baseUrl}${endpoint}`;

    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Get auth token from cookie or localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
      }
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      console.log(`[API Client] ${endpoint} - Fetching from:`, url);
      const response = await fetch(url, config);

      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      const isJson = contentType?.includes('application/json');

      if (!response.ok) {
        console.error(`[API Client] ${endpoint} - HTTP ${response.status}`);

        const error: ApiError = {
          message: 'API request failed',
          statusCode: response.status,
        };

        try {
          if (isJson) {
            const errorData = await response.json();
            error.message = errorData.message || errorData.error || `HTTP ${response.status}: ${response.statusText}`;
            error.details = errorData;
          } else {
            const textError = await response.text();
            error.message = textError || `HTTP ${response.status}: ${response.statusText}`;
          }
        } catch (parseError) {
          error.message = `HTTP ${response.status}: ${response.statusText}`;
          console.error('[API Client] Error parsing error response:', parseError);
        }

        console.error(`[API Client] ${endpoint} - Error:`, error.message);

        const errorInstance = new Error(error.message);
        (errorInstance as any).statusCode = error.statusCode;
        (errorInstance as any).details = error.details;
        throw errorInstance;
      }

      if (isJson) {
        const data = await response.json();
        console.log(`[API Client] ${endpoint} - Success:`, data);
        return data;
      }

      const textData = await response.text();
      console.log(`[API Client] ${endpoint} - Success (text):`, textData);
      return textData as unknown as T;
    } catch (error) {
      // Network errors (connection refused, timeout, DNS failure, etc.)
      if (error instanceof TypeError) {
        console.error(`[API Client] ${endpoint} - Network error:`, error.message);
        const networkError = new Error(
          `Cannot connect to server. Please check if the backend is running at ${this.baseUrl}`
        );
        (networkError as any).statusCode = 0;
        (networkError as any).details = { originalError: error.message, url };
        throw networkError;
      }

      // If it's already a proper Error instance we created, re-throw it
      if (error instanceof Error && (error as any).statusCode !== undefined) {
        throw error;
      }

      // Other unexpected errors
      console.error(`[API Client] ${endpoint} - Unexpected error:`, error);
      const unexpectedError = new Error(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
      (unexpectedError as any).statusCode = 0;
      (unexpectedError as any).details = error;
      throw unexpectedError;
    }
  }

  async get<T>(endpoint: string, params?: Record<string, string | number | boolean>): Promise<T> {
    const queryString = params
      ? '?' + new URLSearchParams(
          Object.entries(params).map(([k, v]) => [k, String(v)])
        ).toString()
      : '';

    return this.request<T>(`${endpoint}${queryString}`, {
      method: 'GET',
    });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient();
export default apiClient;
