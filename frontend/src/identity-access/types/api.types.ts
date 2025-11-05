/**
 * Standard API Types
 *
 * Centralized type definitions for all API requests and responses.
 * Ensures consistency across the application.
 *
 * @module types/api.types
 * @since 2025-11-04
 */

/**
 * Standard API success response envelope
 * All successful API responses should use this format
 *
 * @template T - Type of the data payload
 */
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: ResponseMeta;
}

/**
 * Standard API error response envelope
 * All error responses should use this format
 */
export interface ApiErrorResponse {
  success: false;
  error: ApiError;
  meta?: ResponseMeta;
}

/**
 * Union type for all API responses
 *
 * @template T - Type of the data payload
 */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * API error structure
 * Provides detailed error information
 */
export interface ApiError {
  /** Machine-readable error code */
  code: string;

  /** Human-readable error message */
  message: string;

  /** Optional field name for validation errors */
  field?: string;

  /** Detailed field-level validation errors */
  details?: Record<string, string[]>;

  /** Stack trace (only in development) */
  stack?: string;
}

/**
 * Response metadata
 * Additional information about the response
 */
export interface ResponseMeta {
  /** ISO timestamp when response was generated */
  timestamp: string;

  /** Unique request ID for tracking */
  requestId: string;

  /** API version */
  version?: string;

  /** Deprecation warning if applicable */
  deprecated?: boolean;

  /** Link to migration guide if deprecated */
  deprecationMessage?: string;
}

/**
 * Paginated response structure
 * For endpoints that return lists of items
 *
 * @template T - Type of items in the list
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  /** Current page number (1-indexed) */
  page: number;

  /** Number of items per page */
  pageSize: number;

  /** Total number of items */
  total: number;

  /** Total number of pages */
  totalPages: number;

  /** Whether there are more pages */
  hasMore: boolean;

  /** Whether this is the first page */
  isFirst: boolean;

  /** Whether this is the last page */
  isLast: boolean;
}

/**
 * Standard pagination query parameters
 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Standard filter query parameters
 */
export interface FilterParams {
  search?: string;
  filters?: Record<string, any>;
}

/**
 * Combined query parameters for list endpoints
 */
export type ListQueryParams = PaginationParams & FilterParams;

/**
 * Authentication request/response types
 */
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  user: UserProfile;
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

/**
 * User profile types
 */
export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

/**
 * Generic request types
 */
export interface CreateRequest<T> {
  data: T;
}

export interface UpdateRequest<T> {
  data: Partial<T>;
}

export interface DeleteRequest {
  id: string;
  reason?: string;
}

export interface BulkOperationRequest<T> {
  ids: string[];
  operation: 'delete' | 'update' | 'archive';
  data?: Partial<T>;
}

export interface BulkOperationResponse {
  successful: string[];
  failed: Array<{
    id: string;
    error: string;
  }>;
  total: number;
  successCount: number;
  failCount: number;
}

/**
 * File upload types
 */
export interface FileUploadRequest {
  file: File | Blob;
  metadata?: Record<string, any>;
}

export interface FileUploadResponse {
  id: string;
  url: string;
  filename: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
}

/**
 * Search types
 */
export interface SearchRequest {
  query: string;
  filters?: Record<string, any>;
  pagination?: PaginationParams;
}

export interface SearchResponse<T> {
  results: T[];
  total: number;
  took: number; // Search time in ms
  filters: Record<string, any>;
}

/**
 * Validation error structure
 * Used when request validation fails
 */
export interface ValidationError {
  field: string;
  message: string;
  code: string;
  value?: any;
}

export interface ValidationErrorResponse extends ApiErrorResponse {
  error: ApiError & {
    validationErrors: ValidationError[];
  };
}

/**
 * Type guard to check if response is successful
 *
 * @param response - API response
 * @returns true if response is successful
 */
export function isSuccessResponse<T>(
  response: ApiResponse<T>
): response is ApiSuccessResponse<T> {
  return response.success === true;
}

/**
 * Type guard to check if response is an error
 *
 * @param response - API response
 * @returns true if response is an error
 */
export function isErrorResponse<T>(
  response: ApiResponse<T>
): response is ApiErrorResponse {
  return response.success === false;
}

/**
 * Extract data from successful response or throw error
 *
 * @param response - API response
 * @returns Data from response
 * @throws Error if response is not successful
 */
export function unwrapResponse<T>(response: ApiResponse<T>): T {
  if (isSuccessResponse(response)) {
    return response.data;
  }

  throw new Error(response.error.message);
}

/**
 * API request options
 */
export interface RequestOptions {
  /** Request timeout in milliseconds */
  timeout?: number;

  /** Whether to retry on failure */
  retry?: boolean;

  /** Maximum number of retries */
  maxRetries?: number;

  /** Custom headers */
  headers?: Record<string, string>;

  /** Cache configuration */
  cache?: RequestCacheOptions;

  /** AbortSignal for cancellation */
  signal?: AbortSignal;
}

/**
 * Request cache options
 */
export interface RequestCacheOptions {
  /** Whether to use cache */
  enabled: boolean;

  /** Cache time-to-live in seconds */
  ttl?: number;

  /** Cache key (defaults to URL) */
  key?: string;
}

/**
 * HTTP method types
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * Generic API client response
 * Used internally by API client implementations
 */
export interface ClientResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

/**
 * Error response status codes
 */
export enum ErrorCode {
  // Authentication errors (1000-1999)
  AUTH_INVALID_CREDENTIALS = 'AUTH_1001',
  AUTH_TOKEN_EXPIRED = 'AUTH_1002',
  AUTH_TOKEN_INVALID = 'AUTH_1003',
  AUTH_SESSION_NOT_FOUND = 'AUTH_1004',
  AUTH_PASSWORD_WEAK = 'AUTH_1005',
  AUTH_PASSWORD_MISMATCH = 'AUTH_1006',
  AUTH_EMAIL_ALREADY_EXISTS = 'AUTH_1007',
  AUTH_USER_NOT_FOUND = 'AUTH_1008',
  AUTH_ACCOUNT_LOCKED = 'AUTH_1009',
  AUTH_MFA_REQUIRED = 'AUTH_1010',

  // Validation errors (2000-2999)
  VALIDATION_REQUIRED_FIELD = 'VAL_2001',
  VALIDATION_INVALID_EMAIL = 'VAL_2002',
  VALIDATION_INVALID_FORMAT = 'VAL_2003',
  VALIDATION_OUT_OF_RANGE = 'VAL_2004',
  VALIDATION_TOO_LONG = 'VAL_2005',
  VALIDATION_TOO_SHORT = 'VAL_2006',

  // Authorization errors (3000-3999)
  AUTHZ_FORBIDDEN = 'AUTHZ_3001',
  AUTHZ_INSUFFICIENT_PERMISSIONS = 'AUTHZ_3002',
  AUTHZ_RESOURCE_FORBIDDEN = 'AUTHZ_3003',

  // Resource errors (4000-4999)
  RESOURCE_NOT_FOUND = 'RES_4001',
  RESOURCE_ALREADY_EXISTS = 'RES_4002',
  RESOURCE_CONFLICT = 'RES_4003',

  // General errors (9000-9999)
  INTERNAL_ERROR = 'ERR_9001',
  NETWORK_ERROR = 'ERR_9002',
  TIMEOUT_ERROR = 'ERR_9003',
  RATE_LIMIT_EXCEEDED = 'ERR_9004',
  SERVICE_UNAVAILABLE = 'ERR_9005',
}
