/**
 * @fileoverview Core API Adapter Utilities
 * @module utils/adapters/apiAdapters.core
 * @category Utilities
 *
 * Core unwrapping and extraction utilities for API responses.
 * Provides the fundamental building blocks for safe data extraction.
 *
 * @example
 * ```typescript
 * // Unwrap API response data
 * const response = await apiClient.get<User>('/users/123');
 * const user = unwrapData(response); // Type: User
 *
 * // Extract data safely with fallback
 * const data = extractData(response, { id: '123', name: 'Default' });
 * ```
 */

import type { ApiResponse, PaginatedResponse } from './apiAdapters.types';

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
