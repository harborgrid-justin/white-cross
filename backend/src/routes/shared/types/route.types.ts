/**
 * Route Type Definitions
 * Common types used across route handlers
 */

import { Request } from '@hapi/hapi';

/**
 * Authenticated request with user credentials
 */
export interface AuthenticatedRequest extends Request {
  auth: {
    isAuthenticated: boolean;
    credentials: {
      id: string;
      email: string;
      role: string;
      permissions?: string[];
    };
  };
}

/**
 * Pagination query parameters
 */
export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

/**
 * Filter query parameters
 */
export interface FilterQuery {
  search?: string;
  status?: string;
  [key: string]: any;
}

/**
 * Common response format
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    message: string;
    code: string;
    errors?: any;
  };
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T = any> extends ApiResponse<T> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
