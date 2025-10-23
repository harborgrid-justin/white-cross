/**
 * @fileoverview Centralized API Response Type System
 * @module types/api/responses
 * @category Types
 *
 * Comprehensive type definitions for all API responses across the application.
 * Provides consistent structure for success, error, and paginated responses.
 *
 * Key Features:
 * - Generic `ApiResponse<T>` for standard responses
 * - `PaginatedResponse<T>` for list endpoints with pagination
 * - `ErrorResponse` for consistent error handling
 * - Response wrapper utilities for type-safe data extraction
 * - Type guards for runtime type checking
 *
 * Usage Patterns:
 * - All API methods should return `ApiResponse<T>` or `PaginatedResponse<T>`
 * - Use type guards to narrow response types in error handling
 * - Use wrapper utilities to safely extract data from responses
 *
 * Design Principles:
 * - Consistent structure across all endpoints
 * - Type safety for data extraction
 * - Clear error handling with detailed error information
 * - Support for pagination metadata
 * - Backward compatibility with existing response formats
 *
 * @example
 * ```typescript
 * // Standard API response
 * const response: ApiResponse<User> = await api.get('/users/123');
 * if (response.success) {
 *   console.log(response.data);
 * }
 *
 * // Paginated response
 * const listResponse: PaginatedResponse<Student> = await api.get('/students');
 * console.log(listResponse.data); // Student[]
 * console.log(listResponse.pagination); // { page, limit, total, totalPages }
 *
 * // Error handling
 * try {
 *   await api.post('/endpoint', data);
 * } catch (error) {
 *   if (isErrorResponse(error)) {
 *     console.error(error.errors);
 *   }
 * }
 * ```
 */

// ==========================================
// CORE RESPONSE INTERFACES
// ==========================================

/**
 * Standard API Response Wrapper
 *
 * Generic interface for all successful API responses. Wraps data with
 * metadata about success status and optional messages.
 *
 * Properties:
 * - data: The actual response payload (generic type T)
 * - success: Indicates if the request was successful
 * - message: Optional human-readable message
 * - status: HTTP status code (optional)
 * - timestamp: ISO timestamp of response generation (optional)
 *
 * @template T - The type of the response data
 *
 * @example
 * ```typescript
 * // Simple data response
 * const response: ApiResponse<User> = {
 *   success: true,
 *   data: { id: '123', name: 'John Doe' },
 *   message: 'User retrieved successfully'
 * };
 *
 * // Empty success response
 * const deleteResponse: ApiResponse<void> = {
 *   success: true,
 *   data: undefined,
 *   message: 'Resource deleted'
 * };
 * ```
 */
export interface ApiResponse<T = unknown> {
  /** Indicates if the request was successful */
  success: boolean;

  /** The actual response payload */
  data: T;

  /** Optional human-readable message about the operation */
  message?: string;

  /** HTTP status code */
  status?: number;

  /** ISO timestamp when response was generated */
  timestamp?: string;

  /** Optional error details (present when success is false) */
  errors?: ErrorDetail[];
}

/**
 * Success Response
 *
 * Type alias for successful API responses. Ensures success flag is true
 * and data is present.
 *
 * @template T - The type of the response data
 *
 * @example
 * ```typescript
 * const response: SuccessResponse<Student> = {
 *   success: true,
 *   data: { id: '123', firstName: 'Jane', lastName: 'Doe' },
 *   message: 'Student created successfully',
 *   status: 201
 * };
 * ```
 */
export interface SuccessResponse<T = unknown> extends ApiResponse<T> {
  success: true;
  data: T;
  errors?: never;
}

/**
 * Error Response
 *
 * Interface for API error responses. Provides structured error information
 * including field-level validation errors and error codes.
 *
 * Properties:
 * - success: Always false for error responses
 * - errors: Array of detailed error information
 * - status: HTTP status code
 * - message: General error message
 * - code: Machine-readable error code (optional)
 * - traceId: Request trace ID for debugging (optional)
 *
 * @example
 * ```typescript
 * const errorResponse: ErrorResponse = {
 *   success: false,
 *   errors: [
 *     { field: 'email', message: 'Email is required', code: 'REQUIRED' },
 *     { field: 'email', message: 'Email format is invalid', code: 'INVALID_FORMAT' }
 *   ],
 *   status: 400,
 *   message: 'Validation failed',
 *   code: 'VALIDATION_ERROR',
 *   traceId: 'req-123-456'
 * };
 * ```
 */
export interface ErrorResponse {
  /** Always false for error responses */
  success: false;

  /** Array of detailed error information */
  errors: ErrorDetail[];

  /** HTTP status code */
  status: number;

  /** General error message */
  message: string;

  /** Machine-readable error code */
  code?: string;

  /** Request trace ID for debugging */
  traceId?: string;

  /** ISO timestamp when error occurred */
  timestamp?: string;

  /** No data property in error responses */
  data?: never;
}

/**
 * Error Detail
 *
 * Detailed information about a specific error, including field-level
 * validation errors.
 *
 * @example
 * ```typescript
 * const validationError: ErrorDetail = {
 *   field: 'dateOfBirth',
 *   message: 'Date of birth must be in the past',
 *   code: 'INVALID_DATE'
 * };
 *
 * const generalError: ErrorDetail = {
 *   message: 'Database connection failed',
 *   code: 'DATABASE_ERROR'
 * };
 * ```
 */
export interface ErrorDetail {
  /** Field name for validation errors (optional) */
  field?: string;

  /** Human-readable error message */
  message: string;

  /** Machine-readable error code */
  code?: string;

  /** Additional context about the error */
  details?: unknown;
}

// ==========================================
// PAGINATED RESPONSE INTERFACES
// ==========================================

/**
 * Paginated Response
 *
 * Interface for paginated list responses. Includes data array and
 * comprehensive pagination metadata.
 *
 * Properties:
 * - data: Array of items for the current page
 * - pagination: Metadata about pagination state
 * - success: Indicates if request was successful
 * - message: Optional message about the operation
 *
 * @template T - The type of items in the data array
 *
 * @example
 * ```typescript
 * const response: PaginatedResponse<Student> = {
 *   success: true,
 *   data: [
 *     { id: '1', firstName: 'John', lastName: 'Doe' },
 *     { id: '2', firstName: 'Jane', lastName: 'Smith' }
 *   ],
 *   pagination: {
 *     page: 1,
 *     limit: 10,
 *     total: 156,
 *     totalPages: 16,
 *     hasNext: true,
 *     hasPrev: false
 *   }
 * };
 * ```
 */
export interface PaginatedResponse<T = unknown> {
  /** Array of items for the current page */
  data: T[];

  /** Pagination metadata */
  pagination: PaginationInfo;

  /** Indicates if request was successful */
  success: boolean;

  /** Optional message about the operation */
  message?: string;

  /** HTTP status code */
  status?: number;
}

/**
 * Pagination Information
 *
 * Metadata about pagination state, including current page, total counts,
 * and navigation flags.
 *
 * @example
 * ```typescript
 * const paginationInfo: PaginationInfo = {
 *   page: 3,
 *   limit: 20,
 *   total: 156,
 *   totalPages: 8,
 *   hasNext: true,
 *   hasPrev: true
 * };
 * ```
 */
export interface PaginationInfo {
  /** Current page number (1-indexed) */
  page: number;

  /** Number of items per page */
  limit: number;

  /** Total number of items across all pages */
  total: number;

  /** Total number of pages */
  totalPages: number;

  /** Whether there is a next page */
  hasNext: boolean;

  /** Whether there is a previous page */
  hasPrev: boolean;
}

// Legacy support - alias for backward compatibility
export interface PaginationResponse {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// ==========================================
// MUTATION RESPONSE TYPES
// ==========================================

/**
 * Mutation Response
 *
 * Generic response for create, update, delete operations.
 * Includes the affected resource and operation metadata.
 *
 * @template T - The type of the affected resource
 *
 * @example
 * ```typescript
 * // Create operation
 * const createResponse: MutationResponse<Student> = {
 *   success: true,
 *   data: { id: '123', firstName: 'John', lastName: 'Doe' },
 *   message: 'Student created successfully',
 *   operation: 'create'
 * };
 *
 * // Update operation
 * const updateResponse: MutationResponse<Student> = {
 *   success: true,
 *   data: { id: '123', firstName: 'Jane', lastName: 'Doe' },
 *   message: 'Student updated successfully',
 *   operation: 'update',
 *   affected: 1
 * };
 *
 * // Delete operation
 * const deleteResponse: MutationResponse<void> = {
 *   success: true,
 *   data: undefined,
 *   message: 'Student deleted successfully',
 *   operation: 'delete',
 *   affected: 1
 * };
 * ```
 */
export interface MutationResponse<T = unknown> extends ApiResponse<T> {
  /** Type of mutation operation */
  operation?: 'create' | 'update' | 'delete' | 'bulk';

  /** Number of affected records (for bulk operations) */
  affected?: number;
}

/**
 * Bulk Operation Response
 *
 * Response for bulk operations that affect multiple records.
 * Includes counts of successful and failed operations.
 *
 * @example
 * ```typescript
 * const bulkResponse: BulkOperationResponse = {
 *   success: true,
 *   data: {
 *     successful: 45,
 *     failed: 5,
 *     total: 50
 *   },
 *   message: 'Bulk update completed with 5 failures',
 *   errors: [
 *     { field: 'studentIds[3]', message: 'Student not found', code: 'NOT_FOUND' },
 *     { field: 'studentIds[7]', message: 'Permission denied', code: 'FORBIDDEN' }
 *   ]
 * };
 * ```
 */
export interface BulkOperationResponse extends ApiResponse<BulkOperationResult> {
  /** Detailed error information for failed operations */
  errors?: ErrorDetail[];
}

export interface BulkOperationResult {
  /** Number of successfully processed records */
  successful: number;

  /** Number of failed records */
  failed: number;

  /** Total number of records processed */
  total: number;

  /** IDs of successfully processed records */
  successfulIds?: string[];

  /** IDs of failed records */
  failedIds?: string[];
}

// ==========================================
// RESPONSE WRAPPER UTILITIES
// ==========================================

/**
 * Wrap data in standard API response format
 *
 * Utility function to create a consistent ApiResponse object.
 * Useful for mock data, testing, and response transformation.
 *
 * @template T - Type of data to wrap
 * @param data - The data to wrap
 * @param message - Optional success message
 * @returns ApiResponse with wrapped data
 *
 * @example
 * ```typescript
 * const student = { id: '123', firstName: 'John', lastName: 'Doe' };
 * const response = wrapSuccessResponse(student, 'Student retrieved');
 * // { success: true, data: student, message: 'Student retrieved' }
 * ```
 */
export function wrapSuccessResponse<T>(
  data: T,
  message?: string,
  status?: number
): SuccessResponse<T> {
  return {
    success: true,
    data,
    message,
    status: status || 200,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Create error response object
 *
 * Utility function to create a consistent ErrorResponse object.
 *
 * @param message - General error message
 * @param errors - Array of detailed errors
 * @param status - HTTP status code
 * @param code - Machine-readable error code
 * @returns ErrorResponse object
 *
 * @example
 * ```typescript
 * const errorResponse = createErrorResponse(
 *   'Validation failed',
 *   [{ field: 'email', message: 'Email is required', code: 'REQUIRED' }],
 *   400,
 *   'VALIDATION_ERROR'
 * );
 * ```
 */
export function createErrorResponse(
  message: string,
  errors: ErrorDetail[] = [],
  status: number = 500,
  code?: string,
  traceId?: string
): ErrorResponse {
  return {
    success: false,
    errors: errors.length > 0 ? errors : [{ message }],
    status,
    message,
    code,
    traceId,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Wrap array in paginated response format
 *
 * Utility function to create a PaginatedResponse from an array of data.
 * Useful for mock data and testing.
 *
 * @template T - Type of items in array
 * @param data - Array of items
 * @param page - Current page number
 * @param limit - Items per page
 * @param total - Total number of items
 * @returns PaginatedResponse with data and pagination info
 *
 * @example
 * ```typescript
 * const students = [{ id: '1', name: 'John' }, { id: '2', name: 'Jane' }];
 * const response = wrapPaginatedResponse(students, 1, 10, 156);
 * // { data: students, pagination: { page: 1, limit: 10, total: 156, ... } }
 * ```
 */
export function wrapPaginatedResponse<T>(
  data: T[],
  page: number = 1,
  limit: number = 10,
  total?: number
): PaginatedResponse<T> {
  const totalItems = total ?? data.length;
  const totalPages = Math.ceil(totalItems / limit);

  return {
    success: true,
    data,
    pagination: {
      page,
      limit,
      total: totalItems,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
    status: 200,
  };
}

/**
 * Extract data from ApiResponse safely
 *
 * Type-safe utility to extract data from an API response.
 * Throws error if response indicates failure.
 *
 * @template T - Type of data to extract
 * @param response - The API response
 * @returns Extracted data
 * @throws Error if response indicates failure
 *
 * @example
 * ```typescript
 * const response: ApiResponse<Student> = await api.get('/students/123');
 * const student = unwrapApiResponse(response);
 * // student is of type Student
 * ```
 */
export function unwrapApiResponse<T>(response: ApiResponse<T>): T {
  if (!response.success) {
    const errorMessage = response.message || 'API request failed';
    throw new Error(errorMessage);
  }
  return response.data;
}

/**
 * Extract data from PaginatedResponse safely
 *
 * Type-safe utility to extract data array from paginated response.
 *
 * @template T - Type of items in array
 * @param response - The paginated response
 * @returns Extracted data array
 * @throws Error if response indicates failure
 *
 * @example
 * ```typescript
 * const response: PaginatedResponse<Student> = await api.get('/students');
 * const students = unwrapPaginatedResponse(response);
 * // students is of type Student[]
 * ```
 */
export function unwrapPaginatedResponse<T>(response: PaginatedResponse<T>): T[] {
  if (!response.success) {
    const errorMessage = response.message || 'API request failed';
    throw new Error(errorMessage);
  }
  return response.data;
}

// ==========================================
// SPECIALIZED RESPONSE TYPES
// ==========================================

/**
 * File Upload Response
 *
 * Response format for file upload operations.
 *
 * @example
 * ```typescript
 * const uploadResponse: FileUploadResponse = {
 *   success: true,
 *   data: {
 *     url: 'https://cdn.example.com/files/abc123.pdf',
 *     filename: 'medical-record.pdf',
 *     size: 1024000,
 *     mimeType: 'application/pdf'
 *   },
 *   message: 'File uploaded successfully'
 * };
 * ```
 */
export interface FileUploadResponse extends ApiResponse<FileUploadData> {}

export interface FileUploadData {
  /** URL where the file can be accessed */
  url: string;

  /** Original filename */
  filename: string;

  /** File size in bytes */
  size: number;

  /** MIME type of the file */
  mimeType: string;

  /** Storage key or ID for the file */
  key?: string;
}

/**
 * Export Data Response
 *
 * Response format for data export operations.
 *
 * @example
 * ```typescript
 * const exportResponse: ExportDataResponse = {
 *   success: true,
 *   data: {
 *     url: 'https://api.example.com/exports/abc123.csv',
 *     format: 'csv',
 *     expiresAt: '2025-10-24T12:00:00Z',
 *     recordCount: 156
 *   },
 *   message: 'Export ready for download'
 * };
 * ```
 */
export interface ExportDataResponse extends ApiResponse<ExportDataInfo> {}

export interface ExportDataInfo {
  /** URL to download the export */
  url: string;

  /** Export format (csv, xlsx, pdf, etc.) */
  format: string;

  /** ISO timestamp when export expires */
  expiresAt: string;

  /** Number of records in export */
  recordCount: number;

  /** File size in bytes */
  fileSize?: number;
}

/**
 * Health Check Response
 *
 * Response format for health check and status endpoints.
 *
 * @example
 * ```typescript
 * const healthResponse: HealthCheckResponse = {
 *   success: true,
 *   data: {
 *     status: 'healthy',
 *     version: '1.2.3',
 *     uptime: 3600,
 *     dependencies: {
 *       database: 'healthy',
 *       cache: 'healthy',
 *       storage: 'degraded'
 *     }
 *   }
 * };
 * ```
 */
export interface HealthCheckResponse extends ApiResponse<HealthCheckData> {}

export interface HealthCheckData {
  /** Overall system status */
  status: 'healthy' | 'degraded' | 'unhealthy';

  /** Application version */
  version: string;

  /** System uptime in seconds */
  uptime: number;

  /** Status of individual dependencies */
  dependencies?: Record<string, string>;

  /** ISO timestamp of the health check */
  timestamp?: string;
}
