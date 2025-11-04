/**
 * @fileoverview API Response Transformation Utilities
 * @module utils/adapters/apiAdapters.transform
 * @category Utilities
 *
 * Response transformation utilities and domain-specific adapters.
 * Provides backward compatibility and domain-specific response handling.
 *
 * @example
 * ```typescript
 * // Transform response to expected format
 * const data = adaptResponse(await client.get('/endpoint'));
 *
 * // Domain-specific adapter
 * const medication = adaptMedicationResponse(
 *   await client.get('/medications/123')
 * );
 * ```
 */

import type { ApiResponse } from './apiAdapters.types';
import { unwrapData } from './apiAdapters.core';

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
