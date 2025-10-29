/**
 * @fileoverview API Response Adapters
 * @module utils/adapters/apiAdapters
 * @category Utilities
 *
 * Type-safe adapter utilities for transforming API responses to expected hook formats.
 * Provides generic unwrapping functions and domain-specific transformations.
 *
 * Design Principles:
 * - Maintain type safety throughout transformations
 * - Handle both wrapped and unwrapped response formats
 * - Provide runtime safety with proper error handling
 * - Support backward compatibility with existing response shapes
 *
 * @example
 * ```typescript
 * // Unwrap API response data
 * const response = await apiClient.get<User>('/users/123');
 * const user = unwrapData(response); // Type: User
 *
 * // Extract data safely
 * const data = extractData(response, { id: '123', name: 'Default' });
 * ```
 */

import type {
  ApiResponse,
  PaginatedResponse,
  SuccessResponse,
  ErrorResponse,
} from '@/types/api/responses';

// ==========================================
// CORE UNWRAPPING UTILITIES
// ==========================================

/**
 * Unwrap data from ApiResponse
 *
 * Type-safe utility to extract data from an ApiResponse.
 * Works with ApiClient responses that have already unwrapped AxiosResponse.
 *
 * @template T - The type of data to extract
 * @param response - The API response (already unwrapped from Axios)
 * @returns Extracted data of type T
 * @throws Error if response indicates failure
 *
 * @example
 * ```typescript
 * const response: ApiResponse<User> = await client.get('/users/123');
 * const user = unwrapData(response); // user is of type User
 * ```
 */
export function unwrapData<T>(response: ApiResponse<T>): T {
  if (!response.success) {
    const errorMessage = response.message || 'API request failed';
    throw new Error(errorMessage);
  }
  return response.data;
}

/**
 * Safely extract data from ApiResponse with fallback
 *
 * Returns data if successful, otherwise returns the fallback value.
 * Never throws errors.
 *
 * @template T - The type of data to extract
 * @param response - The API response
 * @param fallback - Fallback value if extraction fails
 * @returns Extracted data or fallback
 *
 * @example
 * ```typescript
 * const user = extractData(response, { id: '', name: 'Unknown' });
 * // Returns user data on success, fallback on failure
 * ```
 */
export function extractData<T>(
  response: ApiResponse<T>,
  fallback: T
): T {
  try {
    return unwrapData(response);
  } catch {
    return fallback;
  }
}

/**
 * Extract data from ApiResponse or return null
 *
 * @template T - The type of data to extract
 * @param response - The API response
 * @returns Extracted data or null
 *
 * @example
 * ```typescript
 * const user = extractDataOptional(response);
 * if (user) {
 *   // user is of type T
 * }
 * ```
 */
export function extractDataOptional<T>(
  response: ApiResponse<T>
): T | null {
  try {
    return unwrapData(response);
  } catch {
    return null;
  }
}

/**
 * Unwrap data from PaginatedResponse
 *
 * Type-safe utility to extract data array from a paginated response.
 *
 * @template T - The type of items in the array
 * @param response - The paginated response
 * @returns Array of items
 * @throws Error if response indicates failure
 *
 * @example
 * ```typescript
 * const response: PaginatedResponse<Student> = await client.get('/students');
 * const students = unwrapPaginatedData(response);
 * // students is of type Student[]
 * ```
 */
export function unwrapPaginatedData<T>(
  response: PaginatedResponse<T>
): T[] {
  if (!response.success) {
    const errorMessage = response.message || 'API request failed';
    throw new Error(errorMessage);
  }
  return response.data;
}

// ==========================================
// RESPONSE TRANSFORMATION UTILITIES
// ==========================================

/**
 * Transform ApiResponse<T> to just T (for backward compatibility)
 *
 * Many API modules return ApiResponse<T> but hooks expect just T.
 * This adapter handles that transformation safely.
 *
 * @template T - The expected return type
 * @param response - The API response to transform
 * @returns The unwrapped data
 *
 * @example
 * ```typescript
 * // API returns ApiResponse<{ roles: Role[] }>
 * // Hook expects { roles: Role[] }
 * const rolesData = adaptResponse(await client.get('/roles'));
 * ```
 */
export function adaptResponse<T>(response: ApiResponse<T>): T {
  return unwrapData(response);
}

/**
 * Adapt ApiResponse to expected shape without unwrapping
 *
 * Some hooks expect the full ApiResponse wrapper.
 * This is a pass-through for those cases.
 *
 * @template T - The data type
 * @param response - The API response
 * @returns The same response (typed correctly)
 *
 * @example
 * ```typescript
 * const response = adaptResponseWrapper(await client.get('/data'));
 * ```
 */
export function adaptResponseWrapper<T>(
  response: ApiResponse<T>
): ApiResponse<T> {
  return response;
}

// ==========================================
// TYPE GUARDS
// ==========================================

/**
 * Type guard to check if response is successful
 *
 * @param response - The API response to check
 * @returns True if response is successful
 *
 * @example
 * ```typescript
 * if (isSuccessResponse(response)) {
 *   // response.data is available
 *   console.log(response.data);
 * }
 * ```
 */
export function isSuccessResponse<T>(
  response: ApiResponse<T>
): response is SuccessResponse<T> {
  return response.success === true && 'data' in response;
}

/**
 * Type guard to check if response is an error
 *
 * @param {ApiResponse<unknown> | ErrorResponse} response - The API response to check
 * @returns {boolean} True if response is an error
 *
 * @example
 * ```typescript
 * if (isErrorResponse(response)) {
 *   console.error(response.errors);
 * }
 * ```
 */
export function isErrorResponse(
  response: ApiResponse<unknown> | ErrorResponse
): response is ErrorResponse {
  return response.success === false && 'errors' in response;
}

/**
 * Type guard for paginated responses
 *
 * @param response - The response to check
 * @returns True if response is paginated
 *
 * @example
 * ```typescript
 * if (isPaginatedResponse(response)) {
 *   console.log(response.pagination);
 * }
 * ```
 */
export function isPaginatedResponse<T>(
  response: unknown
): response is PaginatedResponse<T> {
  return (
    typeof response === 'object' &&
    response !== null &&
    'data' in response &&
    'pagination' in response &&
    Array.isArray((response as PaginatedResponse<T>).data)
  );
}

// ==========================================
// DOMAIN-SPECIFIC ADAPTERS
// ==========================================

/**
 * Adapt medication API response
 *
 * Transform medication API responses to hook-expected format.
 *
 * @template T - The medication data type
 * @param response - The API response
 * @returns Medication data in hook-expected format
 *
 * @example
 * ```typescript
 * const medication = adaptMedicationResponse(
 *   await client.get('/medications/123')
 * );
 * ```
 */
export function adaptMedicationResponse<T>(
  response: ApiResponse<T>
): T {
  return unwrapData(response);
}

/**
 * Adapt student API response
 *
 * Transform student API responses to hook-expected format.
 *
 * @template T - The student data type
 * @param response - The API response
 * @returns Student data in hook-expected format
 *
 * @example
 * ```typescript
 * const student = adaptStudentResponse(
 *   await client.get('/students/123')
 * );
 * ```
 */
export function adaptStudentResponse<T>(
  response: ApiResponse<T>
): T {
  return unwrapData(response);
}

/**
 * Adapt health record API response
 *
 * Transform health record API responses to hook-expected format.
 *
 * @template T - The health record data type
 * @param response - The API response
 * @returns Health record data in hook-expected format
 *
 * @example
 * ```typescript
 * const record = adaptHealthRecordResponse(
 *   await client.get('/health-records/123')
 * );
 * ```
 */
export function adaptHealthRecordResponse<T>(
  response: ApiResponse<T>
): T {
  return unwrapData(response);
}

// ==========================================
// COMPATIBILITY UTILITIES
// ==========================================

/**
 * Legacy extractApiData replacement
 *
 * Drop-in replacement for the old extractApiData that expected AxiosResponse.
 * Now works with the ApiResponse directly since ApiClient already unwraps.
 *
 * @template T - The data type to extract
 * @param response - The API response (already unwrapped from Axios)
 * @returns The extracted data
 *
 * @example
 * ```typescript
 * // Old code: extractApiData(axiosResponse)
 * // New code: extractApiData(apiResponse)
 * const data = extractApiData(await client.get('/endpoint'));
 * ```
 */
export function extractApiData<T>(response: ApiResponse<T>): T {
  return unwrapData(response);
}

/**
 * Handle API errors consistently
 *
 * Transform any API error into a standard Error object with message.
 *
 * @param error - The error to handle
 * @returns Standardized Error object
 *
 * @example
 * ```typescript
 * try {
 *   await client.post('/endpoint', data);
 * } catch (err) {
 *   throw handleApiError(err);
 * }
 * ```
 */
export function handleApiError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }

  if (typeof error === 'object' && error !== null) {
    const apiError = error as Partial<ApiResponse<unknown>>;
    if (apiError.message) {
      return new Error(apiError.message);
    }
    if (apiError.errors && Array.isArray(apiError.errors)) {
      const errorMessages = apiError.errors
        .map((e: any) => e.message || JSON.stringify(e))
        .join(', ');
      return new Error(errorMessages);
    }
  }

  return new Error('An unexpected error occurred');
}
