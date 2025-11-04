/**
 * WF-UTIL-262 | utils.ts - BaseApiService Utility Functions
 *
 * @module services/core/base-api/utils
 * @description
 * Utility functions for BaseApiService including response extraction,
 * query parameter building, and endpoint URL construction.
 *
 * @purpose
 * - Extract data from API responses with error handling
 * - Build URL query strings from filter parameters
 * - Construct endpoint URLs with proper path handling
 * - Provide reusable helper functions across services
 *
 * @upstream ./types, ../ApiClient
 * @dependencies FilterParams type, ApiResponse type
 * @downstream BaseApiService, CRUD operations
 * @exports extractData, buildQueryParams, buildEndpoint
 *
 * @keyFeatures
 * - Type-safe response data extraction
 * - Automatic query string encoding
 * - Array parameter support (multiple values)
 * - Null/undefined filtering for clean URLs
 *
 * @lastUpdated 2025-11-04
 * @fileType TypeScript Utility Module
 * @architecture Core utility layer for service architecture
 */

import type { FilterParams } from './types';
import type { ApiResponse } from '../ApiClient';

// ==========================================
// RESPONSE EXTRACTION
// ==========================================

/**
 * Extract data from API response
 *
 * @description
 * Safely extracts data from API response wrapper. Validates that the
 * response indicates success and contains data before returning.
 * Throws descriptive errors for failed or empty responses.
 *
 * @typeParam T - The type of data contained in the response
 *
 * @param {ApiResponse<T>} response - The API response wrapper
 * @returns {T} The extracted data
 * @throws {Error} When response indicates failure or data is missing
 *
 * @example
 * ```typescript
 * const response: ApiResponse<User> = {
 *   success: true,
 *   data: { id: '123', name: 'John' },
 *   message: 'Success'
 * };
 *
 * const user = extractData(response);
 * // Returns: { id: '123', name: 'John' }
 *
 * const errorResponse: ApiResponse<User> = {
 *   success: false,
 *   message: 'Not found'
 * };
 *
 * extractData(errorResponse);
 * // Throws: Error('Not found')
 * ```
 */
export function extractData<T>(response: ApiResponse<T>): T {
  if (response.success && response.data !== undefined) {
    return response.data;
  }
  throw new Error(response.message || 'API request failed');
}

// ==========================================
// QUERY PARAMETER BUILDING
// ==========================================

/**
 * Build query parameters string from filter object
 *
 * @description
 * Converts a FilterParams object into a URL query string.
 * Handles special cases:
 * - Filters out null, undefined, and empty string values
 * - Supports array values (appends multiple params with same key)
 * - Returns empty string if no valid parameters
 * - Returns prefixed with '?' if parameters exist
 *
 * @param {FilterParams} [params] - Optional filter parameters
 * @returns {string} Query string with '?' prefix or empty string
 *
 * @example
 * ```typescript
 * // Simple parameters
 * buildQueryParams({ page: 1, limit: 20 })
 * // Returns: "?page=1&limit=20"
 *
 * // With sorting
 * buildQueryParams({ page: 1, limit: 10, sort: 'name', order: 'asc' })
 * // Returns: "?page=1&limit=10&sort=name&order=asc"
 *
 * // With custom filters
 * buildQueryParams({ grade: 5, active: true })
 * // Returns: "?grade=5&active=true"
 *
 * // With array values
 * buildQueryParams({ tags: ['math', 'science'] })
 * // Returns: "?tags=math&tags=science"
 *
 * // Filters out null/undefined/empty
 * buildQueryParams({ page: 1, filter: null, search: '' })
 * // Returns: "?page=1"
 *
 * // No parameters
 * buildQueryParams({})
 * // Returns: ""
 * ```
 */
export function buildQueryParams(params?: FilterParams): string {
  if (!params || Object.keys(params).length === 0) {
    return '';
  }

  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(v => searchParams.append(key, String(v)));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

// ==========================================
// ENDPOINT URL CONSTRUCTION
// ==========================================

/**
 * Build full endpoint URL by combining base and path
 *
 * @description
 * Safely combines a base endpoint URL with a path segment.
 * Ensures proper slash handling to avoid double slashes or missing slashes.
 *
 * @param {string} baseEndpoint - The base endpoint URL
 * @param {string} path - The path to append
 * @returns {string} The combined endpoint URL
 *
 * @example
 * ```typescript
 * buildEndpoint('/api/students', '/123')
 * // Returns: "/api/students/123"
 *
 * buildEndpoint('/api/students', '123')
 * // Returns: "/api/students/123"
 *
 * buildEndpoint('/api/students/', '/123')
 * // Returns: "/api/students/123"
 * ```
 */
export function buildEndpoint(baseEndpoint: string, path: string): string {
  return `${baseEndpoint}${path}`;
}
