/**
 * @fileoverview Audit Logging Operations
 * @module services/modules/audit/logging
 * @category Services - Audit Logging
 *
 * Core audit log operations including retrieval, filtering, and creation.
 * Handles standard audit trail management for system-wide activity tracking.
 */

import type { ApiClient } from '../../core/ApiClient';
import { ApiResponse, PaginatedResponse } from '../../utils/apiUtils';
import type { AuditLog, AuditFilters } from './types';

/**
 * Audit logging operations
 * Manages audit log retrieval, filtering, and creation
 */
export class AuditLoggingService {
  constructor(private readonly client: ApiClient) {}

  /**
   * Get audit logs with optional filters
   * Supports pagination and filtering by user, action, resource, status, and date range
   *
   * @param filters - Optional filters for audit logs
   * @returns Paginated audit logs
   */
  async getLogs(filters?: AuditFilters): Promise<PaginatedResponse<AuditLog>> {
    const paginationParams = {
      page: filters?.page ?? 1,
      limit: filters?.limit ?? 10,
    };
    const allParams = filters ? { ...paginationParams, ...filters } : paginationParams;
    const response = await this.client.get<PaginatedResponse<AuditLog>>(
      '/audit/logs',
      { params: allParams }
    );
    return response.data;
  }

  /**
   * Get specific audit log by ID
   * Retrieves detailed information for a single audit log entry
   *
   * @param logId - Unique identifier of the audit log
   * @returns Audit log details
   */
  async getLogById(logId: string): Promise<AuditLog> {
    const response = await this.client.get<ApiResponse<AuditLog>>(
      `/audit/logs/${logId}`
    );
    return response.data.data!;
  }

  /**
   * Create audit log
   * Note: Typically done automatically by backend, but available for manual logging
   *
   * @param logData - Partial audit log data to create
   * @returns Created audit log
   */
  async createLog(logData: Partial<AuditLog>): Promise<AuditLog> {
    const response = await this.client.post<ApiResponse<AuditLog>>(
      '/audit/logs',
      logData
    );
    return response.data.data!;
  }
}
