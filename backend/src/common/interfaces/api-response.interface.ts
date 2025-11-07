/**
 * Standard API Response Interfaces
 *
 * @description Defines consistent response envelope structures for all API endpoints
 * to ensure uniform developer experience and predictable response formats.
 */

/**
 * Standard success response envelope
 *
 * @template T The type of data being returned
 */
export interface ApiSuccessResponse<T = any> {
  /**
   * Indicates whether the request was successful
   */
  success: true;

  /**
   * The response data payload
   */
  data: T;

  /**
   * Optional human-readable message
   */
  message?: string;

  /**
   * Pagination metadata (only for paginated endpoints)
   */
  pagination?: PaginationMetadata;

  /**
   * ISO 8601 timestamp of the response
   */
  timestamp: string;
}

/**
 * Pagination metadata for list endpoints
 */
export interface PaginationMetadata {
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
}

/**
 * Standard error response envelope
 */
export interface ApiErrorResponse {
  /**
   * Indicates whether the request was successful (always false for errors)
   */
  success: false;

  /**
   * HTTP status code
   */
  statusCode: number;

  /**
   * Human-readable error message
   */
  message: string;

  /**
   * Machine-readable error code
   */
  error: string;

  /**
   * Detailed validation errors or additional error information
   */
  details?: string[] | Record<string, any>;

  /**
   * Request path that caused the error
   */
  path: string;

  /**
   * ISO 8601 timestamp of the error
   */
  timestamp: string;

  /**
   * Request correlation ID for tracing (if available)
   */
  correlationId?: string;
}

/**
 * Type guard to check if a response is an error response
 */
export function isApiErrorResponse(
  response: any,
): response is ApiErrorResponse {
  return response && response.success === false && 'statusCode' in response;
}

/**
 * Type guard to check if a response is a success response
 */
export function isApiSuccessResponse<T>(
  response: any,
): response is ApiSuccessResponse<T> {
  return response && response.success === true && 'data' in response;
}
