/**
 * @fileoverview Route Type Definitions
 *
 * Common TypeScript interfaces and types used across all route handlers.
 * Provides type safety for requests, responses, queries, and authentication.
 *
 * @module routes/shared/types/route.types
 * @requires @hapi/hapi
 * @since 1.0.0
 */

import { ReqRefDefaults, Request } from '@hapi/hapi';

/**
 * User credentials extra properties for JWT authentication.
 *
 * These properties are merged with Hapi's AuthCredentials
 * populated by the JWT authentication strategy.
 */
export interface JWTCredentialsExtra extends Record<string, unknown> {
  id: string;
  email: string;
  role: string;
  permissions?: string[];
}

/**
 * Request references for authenticated JWT requests.
 *
 * Extends Hapi's default request references to include JWT credential types.
 */
export interface AuthReqRefs extends ReqRefDefaults {
  AuthCredentialsExtra: JWTCredentialsExtra;
}

/**
 * Authenticated request interface with user credentials.
 *
 * Uses Hapi's generic Request type with custom JWT credential references
 * populated by the JWT authentication strategy.
 *
 * @interface AuthenticatedRequest
 * @extends {Request<AuthReqRefs>}
 *
 * @property {Object} auth - Authentication information
 * @property {boolean} auth.isAuthenticated - Authentication status
 * @property {Object} auth.credentials - User credential details
 * @property {string} auth.credentials.id - User UUID
 * @property {string} auth.credentials.email - User email address
 * @property {string} auth.credentials.role - User role (ADMIN, NURSE, etc.)
 * @property {string[]} [auth.credentials.permissions] - Optional permission array
 *
 * @example
 * ```typescript
 * async function getUserProfile(request: AuthenticatedRequest, h: ResponseToolkit) {
 *   const userId = request.auth.credentials.id;
 *   const user = await User.findByPk(userId);
 *   return successResponse(h, user);
 * }
 * ```
 */
export type AuthenticatedRequest = Request<AuthReqRefs>;

/**
 * Pagination query parameters interface.
 *
 * Standard query parameters for paginated list endpoints with sorting support.
 *
 * @interface PaginationQuery
 *
 * @property {number} [page] - Page number (1-indexed)
 * @property {number} [limit] - Items per page (max: 100)
 * @property {string} [sortBy] - Field name to sort by
 * @property {'ASC' | 'DESC'} [sortOrder] - Sort direction
 *
 * @example
 * ```typescript
 * const query: PaginationQuery = {
 *   page: 1,
 *   limit: 20,
 *   sortBy: 'createdAt',
 *   sortOrder: 'DESC'
 * };
 * ```
 */
export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

/**
 * Filter query parameters interface.
 *
 * Flexible filtering interface for list endpoints supporting search and status filters.
 * Extensible with additional domain-specific filter parameters.
 *
 * @interface FilterQuery
 *
 * @property {string} [search] - Full-text search query
 * @property {string} [status] - Resource status filter
 * @property {any} [key: string] - Additional domain-specific filters
 *
 * @example
 * ```typescript
 * const filters: FilterQuery = {
 *   search: 'john doe',
 *   status: 'active',
 *   gradeLevel: '9'
 * };
 * ```
 */
export interface FilterQuery {
  search?: string;
  status?: string;
  [key: string]: any;
}

/**
 * Standard API response format.
 *
 * Generic response structure for all API endpoints ensuring consistency
 * across success and error responses.
 *
 * @interface ApiResponse
 * @template T - Type of the response data payload
 *
 * @property {boolean} success - Indicates if request was successful
 * @property {string} [message] - Optional human-readable message
 * @property {T} [data] - Response payload (present on success)
 * @property {Object} [error] - Error details (present on failure)
 * @property {string} error.message - Error description
 * @property {string} error.code - Machine-readable error code
 * @property {any} [error.errors] - Additional error details
 *
 * @example
 * ```typescript
 * // Success response
 * const response: ApiResponse<User> = {
 *   success: true,
 *   message: 'User retrieved successfully',
 *   data: userObject
 * };
 *
 * // Error response
 * const errorResponse: ApiResponse = {
 *   success: false,
 *   error: {
 *     message: 'User not found',
 *     code: 'NOT_FOUND'
 *   }
 * };
 * ```
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
 * Paginated API response format.
 *
 * Extends ApiResponse with pagination metadata for list endpoints.
 *
 * @interface PaginatedResponse
 * @template T - Type of the response data payload (typically an array)
 * @extends {ApiResponse<T>}
 *
 * @property {Object} [pagination] - Pagination metadata
 * @property {number} pagination.page - Current page number (1-indexed)
 * @property {number} pagination.limit - Items per page
 * @property {number} pagination.total - Total number of items across all pages
 * @property {number} pagination.totalPages - Total number of pages
 *
 * @example
 * ```typescript
 * const response: PaginatedResponse<Student[]> = {
 *   success: true,
 *   data: [student1, student2, ...],
 *   pagination: {
 *     page: 1,
 *     limit: 20,
 *     total: 150,
 *     totalPages: 8
 *   }
 * };
 * ```
 */
export interface PaginatedResponse<T = any> extends ApiResponse<T> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
