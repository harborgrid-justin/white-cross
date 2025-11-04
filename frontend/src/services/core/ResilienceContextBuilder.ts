/**
 * @fileoverview Builder for resilience middleware context
 * @module services/core/ResilienceContextBuilder
 * @category Services
 *
 * Responsible for constructing the execution context for resilient requests.
 * Determines priority, timeout, idempotency, and other resilience parameters
 * based on the healthcare operation type.
 *
 * This module extracts context building logic from ResilientApiClient
 * to maintain single responsibility and improve testability.
 */

import type { AxiosRequestConfig } from 'axios';
import type {
  ResilienceMiddlewareContext,
  HealthcareOperationType
} from '../resilience';
import {
  getOperationCategory,
  getBulkheadPriority,
  isCriticalForPatientSafety,
  OperationPriority,
  HealthcareOperationType as OperationType
} from '../resilience';

/**
 * Resilience Context Builder
 *
 * Builds execution context for resilient API requests, determining:
 * - Operation priority for bulkhead isolation
 * - Request timeout based on operation type
 * - Idempotency characteristics
 * - Patient safety criticality
 * - Operation category metadata
 *
 * @example
 * ```typescript
 * const builder = new ResilienceContextBuilder();
 *
 * const context = builder.build(
 *   'POST',
 *   '/api/medications/administer',
 *   HealthcareOperationType.ADMINISTER_MEDICATION,
 *   { params: { studentId: '123' } }
 * );
 *
 * // context.priority === OperationPriority.CRITICAL
 * // context.metadata.criticalForSafety === true
 * ```
 */
export class ResilienceContextBuilder {
  /**
   * Build resilience context from request metadata
   *
   * @param method - HTTP method (GET, POST, etc.)
   * @param url - Request URL
   * @param operationType - Healthcare operation type for priority/resilience configuration
   * @param config - Axios request configuration with query params
   * @returns Complete resilience context for request execution
   */
  public build(
    method: string,
    url: string,
    operationType?: HealthcareOperationType,
    config?: AxiosRequestConfig
  ): ResilienceMiddlewareContext {
    // Determine operation priority for bulkhead
    const priority = operationType
      ? getBulkheadPriority(operationType)
      : OperationPriority.NORMAL;

    // Get operation category for timeout and retry configuration
    const category = operationType
      ? getOperationCategory(operationType)
      : getOperationCategory(OperationType.STUDENT_LOOKUP);

    // Determine if operation is critical for patient safety
    const criticalForSafety = operationType
      ? isCriticalForPatientSafety(operationType)
      : false;

    return {
      method,
      url,
      params: config?.params,
      timeout: category.timeout,
      priority,
      isIdempotent: category.isIdempotent,
      metadata: {
        operationType,
        criticalForSafety,
        category: category.name
      }
    };
  }

  /**
   * Build context with explicit priority override
   *
   * @param method - HTTP method
   * @param url - Request URL
   * @param priority - Explicit operation priority
   * @param timeout - Explicit timeout in milliseconds
   * @param isIdempotent - Whether operation is idempotent
   * @param config - Axios request configuration
   * @returns Resilience context with explicit parameters
   */
  public buildWithExplicitPriority(
    method: string,
    url: string,
    priority: OperationPriority,
    timeout: number,
    isIdempotent: boolean,
    config?: AxiosRequestConfig
  ): ResilienceMiddlewareContext {
    return {
      method,
      url,
      params: config?.params,
      timeout,
      priority,
      isIdempotent,
      metadata: {
        criticalForSafety: priority === OperationPriority.CRITICAL,
        category: 'custom'
      }
    };
  }

  /**
   * Build lightweight context for non-healthcare operations
   *
   * @param method - HTTP method
   * @param url - Request URL
   * @param config - Axios request configuration
   * @returns Basic resilience context with default parameters
   */
  public buildDefault(
    method: string,
    url: string,
    config?: AxiosRequestConfig
  ): ResilienceMiddlewareContext {
    return this.build(method, url, undefined, config);
  }
}

/**
 * Singleton instance for convenience
 */
export const resilienceContextBuilder = new ResilienceContextBuilder();
