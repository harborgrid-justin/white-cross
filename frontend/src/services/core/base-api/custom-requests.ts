/**
 * WF-REQ-266 | custom-requests.ts - BaseApiService Custom Request Methods
 *
 * @module services/core/base-api/custom-requests
 * @description
 * Protected custom HTTP request methods for extending BaseApiService.
 * Provides type-safe wrappers around ApiClient methods with response extraction.
 *
 * @purpose
 * - Enable custom GET requests with query parameters
 * - Provide custom POST/PUT/PATCH/DELETE methods
 * - Automatically extract data from API responses
 * - Support service-specific endpoint extensions
 *
 * @upstream ./types, ./utils, ../ApiClient
 * @dependencies FilterParams, ApiClient, extractData, buildQueryParams
 * @downstream BaseApiService (protected methods for subclasses)
 * @exports CustomRequestsMixin class
 *
 * @keyFeatures
 * - Type-safe custom request methods
 * - Automatic response data extraction
 * - Query parameter building for GET requests
 * - Flexible endpoint construction
 *
 * @lastUpdated 2025-11-04
 * @fileType TypeScript Request Module
 * @architecture Core custom request layer for service architecture
 */

import type { ApiClient } from '../ApiClient';
import type { FilterParams } from './types';
import { extractData, buildQueryParams, buildEndpoint } from './utils';

// ==========================================
// CUSTOM REQUESTS MIXIN
// ==========================================

/**
 * Custom request methods mixin for service extensions
 *
 * @description
 * Provides protected methods that subclasses can use to implement
 * custom API endpoints beyond standard CRUD operations.
 */
export class CustomRequestsMixin {
  constructor(
    protected client: ApiClient,
    protected baseEndpoint: string
  ) {}

  // ==========================================
  // ENDPOINT CONSTRUCTION
  // ==========================================

  /**
   * Build full endpoint URL
   *
   * @param {string} path - The path to append to base endpoint
   * @returns {string} The complete endpoint URL
   *
   * @example
   * ```typescript
   * const endpoint = this.buildEndpoint('/custom-action');
   * // Returns: "/api/students/custom-action"
   * ```
   */
  protected buildEndpointUrl(path: string): string {
    return buildEndpoint(this.baseEndpoint, path);
  }

  // ==========================================
  // CUSTOM GET REQUEST
  // ==========================================

  /**
   * Execute custom GET request
   *
   * @typeParam T - The expected response data type
   *
   * @param {string} endpoint - The endpoint URL
   * @param {FilterParams} [params] - Optional query parameters
   * @returns {Promise<T>} The response data
   * @throws {Error} When request fails or response indicates error
   *
   * @example
   * ```typescript
   * // Custom endpoint with query params
   * const stats = await this.get<StudentStats>(
   *   '/api/students/stats',
   *   { grade: 5 }
   * );
   * ```
   */
  protected async get<T>(endpoint: string, params?: FilterParams): Promise<T> {
    const queryString = buildQueryParams(params);
    const response = await this.client.get<T>(`${endpoint}${queryString}`);
    return extractData(response);
  }

  // ==========================================
  // CUSTOM POST REQUEST
  // ==========================================

  /**
   * Execute custom POST request
   *
   * @typeParam T - The expected response data type
   *
   * @param {string} endpoint - The endpoint URL
   * @param {unknown} [data] - The request body data
   * @returns {Promise<T>} The response data
   * @throws {Error} When request fails or response indicates error
   *
   * @example
   * ```typescript
   * // Custom action endpoint
   * const result = await this.post<PromotionResult>(
   *   '/api/students/promote',
   *   { studentIds: ['123', '456'], toGrade: 6 }
   * );
   * ```
   */
  protected async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await this.client.post<T>(endpoint, data);
    return extractData(response);
  }

  // ==========================================
  // CUSTOM PUT REQUEST
  // ==========================================

  /**
   * Execute custom PUT request
   *
   * @typeParam T - The expected response data type
   *
   * @param {string} endpoint - The endpoint URL
   * @param {unknown} [data] - The request body data
   * @returns {Promise<T>} The response data
   * @throws {Error} When request fails or response indicates error
   *
   * @example
   * ```typescript
   * // Custom full update endpoint
   * const updated = await this.put<Student>(
   *   '/api/students/123/complete-profile',
   *   { ...fullProfileData }
   * );
   * ```
   */
  protected async put<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await this.client.put<T>(endpoint, data);
    return extractData(response);
  }

  // ==========================================
  // CUSTOM PATCH REQUEST
  // ==========================================

  /**
   * Execute custom PATCH request
   *
   * @typeParam T - The expected response data type
   *
   * @param {string} endpoint - The endpoint URL
   * @param {unknown} [data] - The request body data
   * @returns {Promise<T>} The response data
   * @throws {Error} When request fails or response indicates error
   *
   * @example
   * ```typescript
   * // Custom partial update endpoint
   * const updated = await this.patchRequest<Student>(
   *   '/api/students/123/status',
   *   { active: false }
   * );
   * ```
   */
  protected async patchRequest<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await this.client.patch<T>(endpoint, data);
    return extractData(response);
  }

  // ==========================================
  // CUSTOM DELETE REQUEST
  // ==========================================

  /**
   * Execute custom DELETE request
   *
   * @typeParam T - The expected response data type
   *
   * @param {string} endpoint - The endpoint URL
   * @returns {Promise<T>} The response data
   * @throws {Error} When request fails or response indicates error
   *
   * @example
   * ```typescript
   * // Custom delete with response data
   * const deletionSummary = await this.deleteRequest<DeletionSummary>(
   *   '/api/students/123/archive'
   * );
   * ```
   */
  protected async deleteRequest<T>(endpoint: string): Promise<T> {
    const response = await this.client.delete<T>(endpoint);
    return extractData(response);
  }
}
