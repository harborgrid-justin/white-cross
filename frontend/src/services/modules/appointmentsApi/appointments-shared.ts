/**
 * Appointments API - Shared Types and Utilities
 *
 * @deprecated This module is deprecated. Use server actions instead:
 * - Server: `@/lib/actions/appointments.actions`
 *
 * Will be removed in v2.0.0 (Q2 2025)
 *
 * Contains shared types, interfaces, and base helper functions used across
 * all appointment service modules.
 *
 * @module services/modules/appointmentsApi/appointments-shared
 */

import type { ApiClient } from '../../core/ApiClient';
import type { AppointmentStatus } from './types';

/**
 * Appointment Status Update Data
 */
export interface StatusUpdateData {
  status: AppointmentStatus;
  reason?: string;
  outcomes?: string;
}

/**
 * Bulk Operation Result
 */
export interface BulkOperationResult {
  successful: string[];
  failed: Array<{
    id: string;
    error: string;
  }>;
  summary: {
    total: number;
    successful: number;
    failed: number;
  };
}

/**
 * Standardized API Error with code and metadata
 */
export interface ApiError extends Error {
  code: string;
  metadata?: unknown;
}

/**
 * Base helper class for appointment services
 * Provides common error handling, logging, and API client access
 */
export class AppointmentServiceBase {
  protected readonly endpoint = '/api/appointments';

  constructor(protected readonly client: ApiClient) {}

  /**
   * Create standardized API error
   */
  protected createError(message: string, code?: string, metadata?: unknown): ApiError {
    const error = new Error(message) as ApiError;
    error.code = code || 'API_ERROR';
    error.metadata = metadata;
    return error;
  }

  /**
   * Handle API errors with sanitization
   */
  protected handleError(error: unknown, defaultMessage: string): void {
    console.error(defaultMessage, error);
    // Error handling would be expanded based on actual requirements
  }

  /**
   * Log activity for audit purposes
   */
  protected logActivity(action: string, metadata: Record<string, unknown>): void {
    console.log(`Activity: ${action}`, metadata);
    // Activity logging would be expanded based on actual requirements
  }
}
