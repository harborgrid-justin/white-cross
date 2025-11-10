/**
 * API Response Type Definitions
 *
 * Standardized type definitions for API responses across all endpoints.
 * Ensures consistency in data shapes and error handling.
 *
 * @module types/api/responses
 */

/**
 * Standard success response wrapper
 */
export interface SuccessResponse<T = unknown> {
  /**
   * Success indicator
   */
  success: true;

  /**
   * Response data
   */
  data: T;

  /**
   * Optional metadata
   */
  meta?: ResponseMetadata;
}

/**
 * Standard error response wrapper
 */
export interface ErrorResponse {
  /**
   * Success indicator (always false)
   */
  success: false;

  /**
   * Error information
   */
  error: ErrorDetails;

  /**
   * Optional metadata
   */
  meta?: ResponseMetadata;
}

/**
 * Response metadata
 */
export interface ResponseMetadata {
  /**
   * Request ID for tracing
   */
  requestId?: string;

  /**
   * Response timestamp (ISO string)
   */
  timestamp?: string;

  /**
   * API version
   */
  version?: string;

  /**
   * Additional metadata fields
   */
  [key: string]: unknown;
}

/**
 * Error details structure
 */
export interface ErrorDetails {
  /**
   * Machine-readable error code
   */
  code: string;

  /**
   * Human-readable error message
   */
  message: string;

  /**
   * Detailed error information
   */
  details?: ValidationError[] | Record<string, unknown>;

  /**
   * Stack trace (only in development)
   */
  stack?: string;
}

/**
 * Validation error detail
 */
export interface ValidationError {
  /**
   * Field name that failed validation
   */
  field: string;

  /**
   * Validation error message
   */
  message: string;

  /**
   * Validation rule that failed
   */
  rule?: string;

  /**
   * Invalid value provided
   */
  value?: unknown;
}

/**
 * List response with pagination
 */
export interface ListResponse<T> extends SuccessResponse<T[]> {
  /**
   * Pagination information
   */
  pagination: PaginationInfo;
}

/**
 * Pagination information
 */
export interface PaginationInfo {
  /**
   * Current page number (1-indexed)
   */
  page: number;

  /**
   * Number of items per page
   */
  limit: number;

  /**
   * Total number of items across all pages
   */
  total: number;

  /**
   * Total number of pages
   */
  totalPages: number;

  /**
   * Whether there is a next page
   */
  hasNextPage: boolean;

  /**
   * Whether there is a previous page
   */
  hasPreviousPage: boolean;

  /**
   * Starting index of current page (0-indexed)
   */
  startIndex: number;

  /**
   * Ending index of current page (0-indexed)
   */
  endIndex: number;
}

/**
 * Cursor-based pagination response
 */
export interface CursorResponse<T> extends SuccessResponse<T[]> {
  /**
   * Cursor pagination information
   */
  pageInfo: CursorPageInfo;
}

/**
 * Cursor pagination information
 */
export interface CursorPageInfo {
  /**
   * Whether there is a next page
   */
  hasNextPage: boolean;

  /**
   * Whether there is a previous page
   */
  hasPreviousPage: boolean;

  /**
   * Cursor for the next page
   */
  endCursor: string | null;

  /**
   * Cursor for the previous page
   */
  startCursor: string | null;

  /**
   * Total count (optional, may be expensive to compute)
   */
  totalCount?: number;
}

/**
 * Batch operation response
 */
export interface BatchResponse<T = unknown> extends SuccessResponse {
  /**
   * Successfully processed items
   */
  successful: T[];

  /**
   * Failed items with errors
   */
  failed: Array<{
    item: T;
    error: ErrorDetails;
  }>;

  /**
   * Batch operation summary
   */
  summary: {
    total: number;
    successful: number;
    failed: number;
  };
}

/**
 * File upload response
 */
export interface UploadResponse extends SuccessResponse<UploadedFile> {}

/**
 * Uploaded file information
 */
export interface UploadedFile {
  /**
   * File ID
   */
  id: string;

  /**
   * Original filename
   */
  originalName: string;

  /**
   * Stored filename
   */
  filename: string;

  /**
   * File MIME type
   */
  mimeType: string;

  /**
   * File size in bytes
   */
  size: number;

  /**
   * File URL for access
   */
  url: string;

  /**
   * Thumbnail URL (for images)
   */
  thumbnailUrl?: string;

  /**
   * Upload timestamp
   */
  uploadedAt: string;
}

/**
 * Health check response
 */
export interface HealthCheckResponse {
  /**
   * Overall system status
   */
  status: 'healthy' | 'degraded' | 'unhealthy';

  /**
   * Check timestamp
   */
  timestamp: string;

  /**
   * System uptime in milliseconds
   */
  uptime: number;

  /**
   * Service-specific health checks
   */
  services: Record<string, ServiceHealth>;

  /**
   * System version
   */
  version?: string;
}

/**
 * Individual service health status
 */
export interface ServiceHealth {
  /**
   * Service status
   */
  status: 'up' | 'down' | 'degraded';

  /**
   * Response time in milliseconds
   */
  responseTime?: number;

  /**
   * Additional service-specific information
   */
  details?: Record<string, unknown>;
}

/**
 * Generic API response (success or error)
 */
export type ApiResponseType<T = unknown> = SuccessResponse<T> | ErrorResponse;

/**
 * Type guard to check if response is successful
 */
export function isSuccessResponse<T>(
  response: ApiResponseType<T>,
): response is SuccessResponse<T> {
  return response.success === true;
}

/**
 * Type guard to check if response is an error
 */
export function isErrorResponse(
  response: ApiResponseType,
): response is ErrorResponse {
  return response.success === false;
}
